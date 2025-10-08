import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../integrations/supabase/client'
import JSZip from 'jszip'

interface MigracaoChatGPTProps {
  addNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void
}

interface EstatisticasMigracao {
  total_conversas: number
  inseridas: number
  duplicadas: number
  erros: number
  hash_coletivo: string | null
}

const MigracaoChatGPT = ({ addNotification }: MigracaoChatGPTProps) => {
  const [loading, setLoading] = useState(false)
  const [progresso, setProgresso] = useState('')
  const [estatisticas, setEstatisticas] = useState<EstatisticasMigracao | null>(null)
  const [hashColetivo, setHashColetivo] = useState<string | null>(null)

  const gerarHash = async (content: string): Promise<string> => {
    const encoder = new TextEncoder()
    const data = encoder.encode(content)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  const processarExportChatGPT = async (file: File) => {
    try {
      setLoading(true)
      setProgresso('Lendo arquivo...')

      let conversas: any[] = []

      // Verificar se é ZIP ou JSON
      if (file.name.endsWith('.zip')) {
        // Processar ZIP
        const arrayBuffer = await file.arrayBuffer()
        const zip = await JSZip.loadAsync(arrayBuffer)

        // Procurar conversations.json
        const conversationsFile =
          zip.file('conversations.json') || zip.file('data/conversations.json')

        if (!conversationsFile) {
          throw new Error('Arquivo conversations.json não encontrado no ZIP')
        }

        const content = await conversationsFile.async('string')
        conversas = JSON.parse(content)
      } else if (file.name.endsWith('.json')) {
        // Processar JSON direto
        const content = await file.text()
        conversas = JSON.parse(content)
      } else {
        throw new Error('Formato de arquivo não suportado. Use .zip ou .json')
      }

      setProgresso(`${conversas.length} conversas encontradas`)
      addNotification(`📊 ${conversas.length} conversas encontradas no export`, 'info')

      // Migrar conversas
      let inseridas = 0
      let duplicadas = 0
      let erros = 0
      const hashes: string[] = []

      for (let i = 0; i < conversas.length; i++) {
        setProgresso(`Processando conversa ${i + 1}/${conversas.length}...`)

        try {
          const conv = conversas[i]

          // Parsear conversa
          const convId = conv.id || crypto.randomUUID()
          const title = conv.title || 'Sem título'
          const createTime = conv.create_time

          // Converter timestamp
          let data: Date
          if (typeof createTime === 'number') {
            data = new Date(createTime * 1000)
          } else if (typeof createTime === 'string') {
            data = new Date(createTime)
          } else {
            data = new Date()
          }

          // Extrair mensagens
          const mapping = conv.mapping || {}
          const mensagens: any[] = []

          Object.values(mapping).forEach((msgData: any) => {
            const message = msgData.message
            if (message && message.content) {
              const role = message.author?.role || 'unknown'
              const contentParts = message.content.parts || []
              const content = contentParts.filter((p: any) => p).join('\n')

              if (content.trim()) {
                mensagens.push({
                  role,
                  content,
                  timestamp: message.create_time,
                })
              }
            }
          })

          // Construir objeto completo
          const conteudo = {
            id: convId,
            title,
            create_time: createTime,
            update_time: conv.update_time,
            mensagens,
            original: conv,
          }

          const conteudoStr = JSON.stringify(conteudo)
          const hash = await gerarHash(conteudoStr)
          hashes.push(hash)

          // Inserir no Supabase
          const { error } = await supabase.from('interacoes_noa').insert({
            usuario: 'iaianoaesperanza@gmail.com',
            data: data.toISOString(),
            conteudo,
            eixo: 'sistemico-tecnico',
            origem: 'ChatGPT – Nôa Esperanza 5.0',
            hash_integridade: hash,
            metadata: {
              title,
              total_mensagens: mensagens.length,
              conversation_id: convId,
            },
          })

          if (error) {
            if (error.code === '23505') {
              // Unique violation (duplicata)
              duplicadas++
            } else {
              console.error('Erro ao inserir conversa:', error)
              erros++
            }
          } else {
            inseridas++
          }
        } catch (err) {
          console.error('Erro ao processar conversa:', err)
          erros++
        }

        // Commit a cada 10 conversas
        if ((i + 1) % 10 === 0) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }

      // Gerar hash coletivo
      setProgresso('Gerando hash coletivo para NFT...')
      const hashColetivoStr = hashes.sort().join('')
      const hashColetivo = await gerarHash(hashColetivoStr)

      // Salvar auditoria
      await supabase.from('auditoria_simbolica').insert({
        descricao: `Hash coletivo da migração ChatGPT – ${new Date().toISOString()}`,
        hash_coletivo: hashColetivo,
        metadata: {
          total_conversas: conversas.length,
          inseridas,
          duplicadas,
          erros,
          arquivo: file.name,
        },
      })

      // Salvar estatísticas
      const stats: EstatisticasMigracao = {
        total_conversas: conversas.length,
        inseridas,
        duplicadas,
        erros,
        hash_coletivo: hashColetivo,
      }

      setEstatisticas(stats)
      setHashColetivo(hashColetivo)
      setProgresso('Migração concluída!')

      addNotification(`✅ ${inseridas} conversas migradas com sucesso!`, 'success')
    } catch (error) {
      console.error('Erro na migração:', error)
      addNotification(
        `❌ Erro na migração: ${error instanceof Error ? error.message : String(error)}`,
        'error'
      )
      setProgresso(`Erro: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processarExportChatGPT(file)
    }
  }

  const copiarHash = () => {
    if (hashColetivo) {
      navigator.clipboard.writeText(hashColetivo)
      addNotification('Hash copiado para área de transferência', 'success')
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/app/admin" className="inline-block text-blue-400 hover:text-blue-300 mb-6">
          <i className="fas fa-arrow-left mr-2"></i> Voltar para Admin
        </Link>

        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            <i className="fas fa-cloud-upload-alt mr-2 text-green-400"></i>
            Migração de Conversas do ChatGPT
          </h1>
          <p className="text-gray-400 mb-8">
            Importe suas conversas do ChatGPT para a base de dados da Nôa Esperanza
          </p>

          {/* Instruções */}
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-300 mb-3">
              <i className="fas fa-info-circle mr-2"></i>
              Como fazer o export do ChatGPT
            </h3>
            <ol className="text-gray-300 space-y-2 list-decimal list-inside">
              <li>
                Acesse <strong>ChatGPT</strong> no navegador
              </li>
              <li>
                Clique no seu perfil → <strong>Settings</strong>
              </li>
              <li>
                Vá em <strong>Data Controls</strong>
              </li>
              <li>
                Clique em <strong>Export Data</strong>
              </li>
              <li>Aguarde o email com o link de download</li>
              <li>
                Baixe o arquivo <strong>.zip</strong>
              </li>
              <li>Faça upload aqui abaixo</li>
            </ol>
          </div>

          {/* Upload */}
          <div className="bg-slate-700 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              <i className="fas fa-file-upload mr-2 text-yellow-400"></i>
              Upload do Export
            </h3>

            <label className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer inline-flex items-center">
              <i className="fas fa-upload mr-2"></i>
              Selecionar Arquivo (.zip ou .json)
              <input
                type="file"
                accept=".zip,.json"
                onChange={handleFileUpload}
                className="hidden"
                disabled={loading}
              />
            </label>

            {loading && (
              <div className="mt-4 p-4 bg-slate-800 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <i className="fas fa-spinner fa-spin text-blue-400"></i>
                  <span className="text-gray-300">Processando...</span>
                </div>
                <div className="text-sm text-gray-400">{progresso}</div>
              </div>
            )}
          </div>

          {/* Estatísticas */}
          {estatisticas && (
            <div className="bg-slate-700 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                <i className="fas fa-chart-bar mr-2 text-green-400"></i>
                Resultado da Migração
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-slate-800 p-4 rounded-lg">
                  <div className="text-sm text-gray-400">Total</div>
                  <div className="text-2xl font-bold text-white">
                    {estatisticas.total_conversas}
                  </div>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                  <div className="text-sm text-gray-400">Inseridas</div>
                  <div className="text-2xl font-bold text-green-400">{estatisticas.inseridas}</div>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                  <div className="text-sm text-gray-400">Duplicadas</div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {estatisticas.duplicadas}
                  </div>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                  <div className="text-sm text-gray-400">Erros</div>
                  <div className="text-2xl font-bold text-red-400">{estatisticas.erros}</div>
                </div>
              </div>

              {hashColetivo && (
                <div className="bg-slate-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-300">
                      <i className="fas fa-fingerprint mr-2 text-purple-400"></i>
                      Hash Coletivo (para NFT)
                    </h4>
                    <button
                      onClick={copiarHash}
                      className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded transition-colors"
                    >
                      <i className="fas fa-copy mr-1"></i>
                      Copiar
                    </button>
                  </div>
                  <div className="font-mono text-xs text-gray-400 break-all bg-slate-900 p-3 rounded">
                    {hashColetivo}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Próximos Passos */}
          {estatisticas && (
            <div className="bg-green-900/30 border border-green-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-300 mb-3">
                <i className="fas fa-check-circle mr-2"></i>
                Próximos Passos
              </h3>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li>Conversas disponíveis no banco de dados</li>
                <li>Hash coletivo gerado para auditoria</li>
                <li>Use o hash para criar NFT no blockchain (opcional)</li>
                <li>Acesse as conversas via Admin Dashboard</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MigracaoChatGPT
