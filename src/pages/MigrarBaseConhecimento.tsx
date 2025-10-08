import { useState } from 'react'
import { Link } from 'react-router-dom'
import { gptBuilderService } from '../services/gptBuilderService'
import { supabase } from '../integrations/supabase/client'

interface MigrarBaseConhecimentoProps {
  addNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void
}

const MigrarBaseConhecimento = ({ addNotification }: MigrarBaseConhecimentoProps) => {
  const [loading, setLoading] = useState(false)
  const [documentCount, setDocumentCount] = useState<number | null>(null)
  const [uploadProgress, setUploadProgress] = useState<string>('')

  // Verificar quantos documentos existem
  const verificarBase = async () => {
    try {
      setLoading(true)
      const docs = await gptBuilderService.getDocuments()
      setDocumentCount(docs.length)

      addNotification(`📚 ${docs.length} documentos encontrados na base`, 'info')

      // Mostrar detalhes
      const byType = docs.reduce(
        (acc, doc) => {
          acc[doc.type] = (acc[doc.type] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      )

      console.log('📊 Documentos por tipo:', byType)
    } catch (error) {
      console.error('Erro ao verificar base:', error)
      addNotification('❌ Erro ao verificar base de conhecimento', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Migrar documentos do ChatGPT Builder (manual)
  const migrarDocumentos = async () => {
    try {
      setLoading(true)
      setUploadProgress('Iniciando migração...')

      const documentosParaMigrar = [
        {
          title: '📘 DOCUMENTO MESTRE INSTITUCIONAL – NÔA ESPERANZA',
          content: `Você é Nôa Esperanza, agente inteligente da plataforma de saúde, educação e equidade desenvolvida pelo Dr. Ricardo Valença.

MISSÃO:
Acolher e orientar estudantes, profissionais de saúde, colaboradores e pacientes com base nos princípios da Arte da Entrevista Clínica e da semiologia médica.

PERSONALIDADE:
- Respeitosa, clara e profundamente clínica
- Escuta ativa e empática
- Exemplos guiados pela ética
- Linguagem acessível
- Conexão com a prática real

ROTEIROS INDIVIDUALIZADOS:
São ativados pela frase: "Olá, Nôa. [nome do usuário], aqui."

QUEBRA-GELOS:
1. Ensino - Apresenta o curso Arte da Entrevista Clínica e o projeto Consultório Escola
2. Pesquisa - Apresenta o projeto de doutorado e possíveis conexões

MODELO: GPT-4.0
TOM: Acolhedor, detalhado e com ritmo pausado
OBJETIVO: Aprimorar a experiência clínica e o engajamento do usuário`,
          type: 'personality' as const,
          category: 'institutional-master',
          is_active: true,
        },
        {
          title: '🎭 ARTE DA ENTREVISTA CLÍNICA - Metodologia',
          content: `A Arte da Entrevista Clínica é a metodologia desenvolvida pelo Dr. Ricardo Valença que fundamenta toda a plataforma Nôa Esperanza.

PRINCÍPIOS FUNDAMENTAIS:
1. Abertura Exponencial - Começar com perguntas abertas e progressivamente aprofundar
2. Lista Indiciária - Coletar todos os sintomas e queixas antes de focar
3. Escuta Ativa - Permitir que o paciente se expresse completamente
4. Pausas Apropriadas - Respeitar o tempo de resposta do paciente
5. Fechamento Consensual - Validar o entendimento com o paciente

ESTRUTURA DA AVALIAÇÃO INICIAL:
1. Apresentação e abertura
2. Formação da lista indiciária ("O que mais?")
3. Identificação da queixa principal
4. Desenvolvimento indiciário detalhado
5. História patológica pregressa
6. História familiar
7. Hábitos de vida
8. Perguntas objetivas finais
9. Revisão consensual
10. Hipóteses sindrômicas

Esta metodologia prioriza a humanização do atendimento e a compreensão integral do paciente.`,
          type: 'knowledge' as const,
          category: 'clinical-methodology',
          is_active: true,
        },
        {
          title: '📚 CURSO - Arte da Entrevista Clínica',
          content: `CURSO ARTE DA ENTREVISTA CLÍNICA
Desenvolvido por: Dr. Ricardo Valença

OBJETIVO:
Ensinar profissionais de saúde e estudantes a realizarem entrevistas clínicas de alta qualidade, baseadas em escuta ativa, empatia e método estruturado.

MÓDULOS DO CURSO:
1. Fundamentos da Escuta Ativa
2. Construção da Lista Indiciária
3. Desenvolvimento do Raciocínio Clínico
4. Técnicas de Questionamento
5. História Patológica Pregressa
6. História Familiar e Social
7. Hábitos de Vida
8. Fechamento Consensual
9. Formulação de Hipóteses Sindrômicas

DIFERENCIAIS:
- Metodologia validada clinicamente
- Casos reais do consultório
- Prática supervisionada
- Certificação reconhecida

LOCAL:
- Online via plataforma Nôa Esperanza
- Presencial no Consultório Escola do Dr. Ricardo Valença`,
          type: 'knowledge' as const,
          category: 'education',
          is_active: true,
        },
        {
          title: '🔬 PROJETO DE DOUTORADO - Deep Learning em Entrevistas Médicas',
          content: `PROJETO DE DOUTORADO
Título: Aplicação de Deep Learning na Análise de Entrevistas Médicas
Pesquisador: Dr. Ricardo Valença

OBJETIVO GERAL:
Desenvolver modelos de inteligência artificial capazes de analisar entrevistas médicas e auxiliar na formulação de hipóteses diagnósticas baseadas na metodologia da Arte da Entrevista Clínica.

OBJETIVOS ESPECÍFICOS:
1. Criar base de dados de entrevistas clínicas estruturadas
2. Desenvolver algoritmos de processamento de linguagem natural
3. Treinar modelos de deep learning para reconhecimento de padrões
4. Validar a acurácia das hipóteses geradas pela IA
5. Implementar sistema híbrido médico-IA

METODOLOGIA:
- Coleta de dados de entrevistas reais (anonimizadas)
- Análise de attention semântica
- Modelos transformer adaptados para contexto médico
- Validação clínica com especialistas

IMPACTO ESPERADO:
Melhorar a qualidade do raciocínio clínico, reduzir erros diagnósticos e democratizar o acesso a ferramentas de análise clínica avançadas.`,
          type: 'knowledge' as const,
          category: 'research',
          is_active: true,
        },
        {
          title: '📋 INSTRUÇÕES - Avaliação Clínica Inicial',
          content: `INSTRUÇÕES PARA REALIZAÇÃO DE AVALIAÇÃO INICIAL

ATENÇÃO: Seguir estritamente estas instruções

1. ABERTURA EXPONENCIAL
Pergunta: "Olá! Eu sou Nôa Esperanza. Por favor, apresente-se também e vamos iniciar a sua avaliação inicial para consultas com Dr. Ricardo Valença."
[Pausa para Resposta]

2. FORMAÇÃO DA LISTA INDICIÁRIA
Pergunta: "O que trouxe você à nossa avaliação hoje?"
[Pausa para Resposta]
Pergunta: "O que mais?"
[Repetir "O que mais?" até que o usuário responda que não há mais nada]

3. IDENTIFICAÇÃO DA QUEIXA PRINCIPAL
Pergunta: "De todas essas questões, qual mais o(a) incomoda?"
[Pausa para Resposta]

4. DESENVOLVIMENTO INDICIÁRIO
- "Onde você sente (queixa)?"
- "Quando essa (queixa) começou?"
- "Como é a (queixa)?"
- "O que mais você sente quando está com a (queixa)?"
- "O que parece melhorar a (queixa)?"
- "O que parece piorar a (queixa)?"

5. HISTÓRIA PATOLÓGICA PREGRESSA
"E agora, sobre o restante sua vida até aqui, desde seu nascimento, quais as questões de saúde que você já viveu?"
[Repetir "O que mais?" até completude]

6. HISTÓRIA FAMILIAR
"E na sua família? Começando pela parte de sua mãe, quais as questões de saúde dela e desse lado da família?"
[Repetir para lado paterno]

7. HÁBITOS DE VIDA
"Além dos hábitos de vida que já verificamos em nossa conversa, que outros hábitos você acha importante mencionar?"

8. PERGUNTAS FINAIS
- Alergias
- Medicações regulares
- Medicações esporádicas

9. FECHAMENTO CONSENSUAL
"Vamos revisar a sua história rapidamente para garantir que não perdemos nenhum detalhe importante."
[Apresentar entendimento organizado]
"O que posso melhorar no meu entendimento?"
"Você concorda com o meu entendimento?"

10. HIPÓTESES SINDRÔMICAS
[Formular hipóteses organizadas a partir dos indícios]`,
          type: 'instructions' as const,
          category: 'clinical-assessment',
          is_active: true,
        },
      ]

      let count = 0
      for (const doc of documentosParaMigrar) {
        setUploadProgress(`Migrando ${count + 1}/${documentosParaMigrar.length}: ${doc.title}`)

        // Verificar se já existe
        const existing = await gptBuilderService.searchDocuments(doc.title)
        if (existing && existing.length > 0) {
          console.log(`⏭️ Documento já existe: ${doc.title}`)
          continue
        }

        await gptBuilderService.createDocument(doc)
        count++

        // Delay para evitar sobrecarga
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      setUploadProgress('Migração concluída!')
      addNotification(`✅ ${count} documentos migrados com sucesso!`, 'success')

      // Atualizar contagem
      await verificarBase()
    } catch (error) {
      console.error('Erro na migração:', error)
      addNotification('❌ Erro ao migrar documentos', 'error')
      setUploadProgress(`Erro: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  // Upload de arquivo DOCX/PDF
  const uploadArquivo = async (file: File) => {
    try {
      setLoading(true)
      setUploadProgress(`Processando ${file.name}...`)

      const reader = new FileReader()

      reader.onload = async e => {
        try {
          const content = e.target?.result as string

          // Para arquivos de texto simples
          if (file.type.includes('text')) {
            await gptBuilderService.createDocument({
              title: file.name,
              content: content,
              type: 'knowledge',
              category: 'uploaded-document',
              is_active: true,
            })

            addNotification(`✅ Arquivo ${file.name} carregado com sucesso!`, 'success')
            await verificarBase()
          } else {
            // Para PDF/DOCX, precisaríamos de uma biblioteca específica
            addNotification(
              `⚠️ Tipo de arquivo ${file.type} não suportado ainda. Use .txt ou cole o conteúdo manualmente.`,
              'warning'
            )
          }
        } catch (error) {
          console.error('Erro ao processar arquivo:', error)
          addNotification('❌ Erro ao processar arquivo', 'error')
        }
      }

      reader.readAsText(file)
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      addNotification('❌ Erro ao fazer upload do arquivo', 'error')
    } finally {
      setLoading(false)
      setUploadProgress('')
    }
  }

  return (
    <div className="h-full overflow-hidden flex items-center justify-center bg-slate-900">
      <div className="max-w-4xl mx-auto px-6 w-full">
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
          <Link to="/app/admin" className="inline-block text-blue-400 hover:text-blue-300 mb-6">
            <i className="fas fa-arrow-left text-xl"></i> Voltar para Admin
          </Link>

          <h1 className="text-3xl font-bold text-white mb-4">
            <i className="fas fa-database mr-2 text-blue-400"></i>
            Migração da Base de Conhecimento
          </h1>

          <p className="text-gray-400 mb-8">
            Ferramenta para migrar documentos do ChatGPT Builder antigo para a nova plataforma Nôa
            Esperanza
          </p>

          {/* Status Atual */}
          <div className="bg-slate-700 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              <i className="fas fa-chart-bar mr-2 text-green-400"></i>
              Status Atual da Base
            </h2>

            <div className="flex items-center justify-between">
              <div>
                {documentCount !== null ? (
                  <div className="text-4xl font-bold text-green-400">{documentCount}</div>
                ) : (
                  <div className="text-2xl text-gray-400">--</div>
                )}
                <div className="text-sm text-gray-400">documentos na base</div>
              </div>

              <button
                onClick={verificarBase}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>Verificando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sync mr-2"></i>Verificar Base
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Ações de Migração */}
          <div className="space-y-4">
            {/* Migração Automática */}
            <div className="bg-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                <i className="fas fa-robot mr-2 text-purple-400"></i>
                Migração Automática
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Adiciona automaticamente os documentos principais da base de conhecimento
              </p>

              <button
                onClick={migrarDocumentos}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>Migrando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-magic mr-2"></i>Iniciar Migração Automática
                  </>
                )}
              </button>

              {uploadProgress && (
                <div className="mt-4 p-3 bg-slate-800 rounded text-sm text-gray-300">
                  {uploadProgress}
                </div>
              )}
            </div>

            {/* Upload Manual */}
            <div className="bg-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                <i className="fas fa-upload mr-2 text-yellow-400"></i>
                Upload Manual de Arquivos
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Carregue arquivos .txt diretamente (suporte para .docx e .pdf em desenvolvimento)
              </p>

              <label className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer inline-flex items-center">
                <i className="fas fa-file-upload mr-2"></i>
                Selecionar Arquivos
                <input
                  type="file"
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={e => {
                    const files = e.target.files
                    if (files && files.length > 0) {
                      uploadArquivo(files[0])
                    }
                  }}
                  className="hidden"
                  disabled={loading}
                />
              </label>
            </div>

            {/* Instruções */}
            <div className="bg-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                <i className="fas fa-info-circle mr-2 text-blue-400"></i>
                Como Migrar Manualmente
              </h3>
              <ol className="text-sm text-gray-400 space-y-2 list-decimal list-inside">
                <li>Copie o conteúdo dos seus documentos do ChatGPT Builder antigo</li>
                <li>Vá para o Admin Dashboard → Base de Conhecimento</li>
                <li>Clique em "Novo Documento"</li>
                <li>Cole o conteúdo e configure o tipo/categoria</li>
                <li>Salve o documento</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MigrarBaseConhecimento
