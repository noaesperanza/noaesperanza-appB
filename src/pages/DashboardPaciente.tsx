import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Specialty } from '../App'
import GPTPBuilder from '../components/GPTPBuilder'
import ClinicalAssessmentChat from '../components/ClinicalAssessmentChat'
import { useAuth } from '../contexts/AuthContext'
import { ClinicalAssessment } from '../components/ClinicalAssessment'

type NotificationType = 'info' | 'success' | 'warning' | 'error'

interface DashboardPacienteProps {
  currentSpecialty: Specialty
  addNotification: (message: string, type?: NotificationType) => void
}

const specialtyCopy: Record<Specialty, { title: string; description: string; accent: string }> = {
  rim: {
    title: 'Programa de Cuidado Renal',
    description:
      'A Nôa acompanha a jornada nefrológica com monitoramento de exames, medicações e educação contínua.',
    accent: 'from-emerald-400 to-green-600',
  },
  neuro: {
    title: 'Programa de Neurologia Integrada',
    description:
      'Assistência inteligente para acompanhamento de sintomas neurológicos, planos terapêuticos e suporte familiar.',
    accent: 'from-sky-400 to-blue-600',
  },
  cannabis: {
    title: 'Programa de Cannabis Medicinal',
    description:
      'Orientações personalizadas sobre titulação, adesão terapêutica e telemonitoramento com equipe especializada.',
    accent: 'from-lime-400 to-emerald-500',
  },
}

const DashboardPaciente = ({ currentSpecialty, addNotification }: DashboardPacienteProps) => {
  const { user, userProfile } = useAuth()
  const [activeTab, setActiveTab] = useState<'profile' | 'assessment' | 'chat' | 'reports'>(
    'profile'
  )
  const [clinicalReport, setClinicalReport] = useState<any>(null)
  const [nftHash, setNftHash] = useState<string>('')

  const profile = useMemo(() => specialtyCopy[currentSpecialty], [currentSpecialty])

  const builderUserId = user?.id || 'noa-paciente-guest'
  const builderUserName = userProfile?.name || user?.email || 'Paciente Nôa'

  useEffect(() => {
    addNotification('Espaço do paciente conectado à Nôa Esperanza.', 'success')

    // Carregar último relatório salvo
    try {
      const lastReport = localStorage.getItem('last_clinical_report')
      if (lastReport) {
        const parsedReport = JSON.parse(lastReport)
        setClinicalReport(parsedReport)
        setNftHash(parsedReport.nftHash || '')
      }
    } catch (error) {
      console.warn('Erro ao carregar relatório:', error)
    }
  }, [addNotification])

  const handleAssessmentComplete = (report: any, nftHash: string) => {
    setClinicalReport(report)
    setNftHash(nftHash)
    addNotification('Avaliação Clínica concluída e relatório gerado!', 'success')

    // Salvar localmente
    try {
      const reportData = { ...report, nftHash, timestamp: new Date().toISOString() }
      localStorage.setItem('last_clinical_report', JSON.stringify(reportData))
    } catch (error) {
      console.warn('Erro ao salvar relatório:', error)
    }
  }

  const handleUpdateKPIs = (stats: any) => {
    console.log('KPIs de avaliação atualizados:', stats)
  }

  const downloadReport = () => {
    if (!clinicalReport) return

    const reportText = clinicalReport.summary || 'Relatório não disponível'
    const blob = new Blob([reportText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio_clinico_${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    addNotification('Relatório baixado com sucesso!', 'success')
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-emerald-300 hover:text-emerald-200 transition-colors">
              <i className="fas fa-arrow-left mr-2" />
              Voltar ao início
            </Link>
            <span className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-emerald-200">
              <i className="fas fa-user-md" /> Paciente
            </span>
          </div>
          <div
            className={`rounded-2xl border border-white/10 bg-gradient-to-r ${profile.accent} px-4 py-3 shadow-lg`}
          >
            <h1 className="text-lg font-semibold uppercase tracking-widest">{profile.title}</h1>
            <p className="text-sm text-white/80">{profile.description}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-3">
            <div className="bg-black/40 rounded-3xl border border-white/10 shadow-xl backdrop-blur overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-white/10">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'profile'
                      ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-400/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <i className="fas fa-user mr-2"></i>
                  Meu Perfil
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'chat'
                      ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-400/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <i className="fas fa-comments mr-2"></i>
                  Chat com Nôa
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'reports'
                      ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-400/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <i className="fas fa-file-alt mr-2"></i>
                  Relatórios
                </button>
              </div>

              {/* Conteúdo das Tabs */}
              <div className="p-6">
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-r from-emerald-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <i className="fas fa-user text-white text-2xl"></i>
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-2">{builderUserName}</h2>
                      <p className="text-gray-400">{profile.title}</p>
                    </div>

                    {clinicalReport && (
                      <div className="bg-slate-800/50 rounded-xl p-6 border border-emerald-400/20">
                        <h3 className="text-lg font-semibold text-emerald-400 mb-4">
                          <i className="fas fa-file-medical mr-2"></i>
                          Último Relatório Clínico
                        </h3>
                        <div className="prose prose-invert max-w-none">
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {clinicalReport.summary?.substring(0, 300)}...
                          </p>
                        </div>
                        {nftHash && (
                          <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
                            <p className="text-xs text-gray-400">NFT Hash:</p>
                            <p className="text-emerald-400 font-mono text-xs break-all">
                              {nftHash}
                            </p>
                          </div>
                        )}
                        <button
                          onClick={downloadReport}
                          className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          <i className="fas fa-download mr-2"></i>
                          Baixar Relatório
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-3">
                          <i className="fas fa-chart-line mr-2 text-blue-400"></i>
                          Progresso
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Avaliações Realizadas</span>
                            <span className="text-white">{clinicalReport ? '1' : '0'}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Última Atualização</span>
                            <span className="text-white">
                              {clinicalReport ? new Date().toLocaleDateString('pt-BR') : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-3">
                          <i className="fas fa-calendar mr-2 text-green-400"></i>
                          Próximos Passos
                        </h3>
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-400">• Agendar consulta com Dr. Ricardo</p>
                          <p className="text-gray-400">• Revisar relatório clínico</p>
                          <p className="text-gray-400">• Preparar exames necessários</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'assessment' && (
                  <div className="h-[600px]">
                    <ClinicalAssessmentChat userRole="patient" />
                  </div>
                )}

                {activeTab === 'chat' && (
                  <div className="h-[600px]">
                    <GPTPBuilder
                      embedded
                      userId={builderUserId}
                      userName={builderUserName}
                      userType="paciente"
                    />
                  </div>
                )}

                {activeTab === 'reports' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">Relatórios Clínicos</h2>

                    {clinicalReport ? (
                      <div className="bg-slate-800/50 rounded-xl p-6 border border-emerald-400/20">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-emerald-400">
                            <i className="fas fa-file-medical mr-2"></i>
                            Relatório de Avaliação Clínica
                          </h3>
                          <span className="text-xs text-gray-400">
                            {new Date().toLocaleDateString('pt-BR')}
                          </span>
                        </div>

                        <div className="prose prose-invert max-w-none mb-6">
                          <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed">
                            {clinicalReport.summary}
                          </pre>
                        </div>

                        {nftHash && (
                          <div className="mb-4 p-3 bg-slate-700/50 rounded-lg">
                            <p className="text-xs text-gray-400 mb-1">NFT Hash (Certificação):</p>
                            <p className="text-emerald-400 font-mono text-xs break-all">
                              {nftHash}
                            </p>
                          </div>
                        )}

                        <button
                          onClick={downloadReport}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                          <i className="fas fa-download mr-2"></i>
                          Baixar Relatório Completo
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <i className="fas fa-file-medical text-6xl text-gray-600 mb-4"></i>
                        <h3 className="text-xl font-semibold text-gray-400 mb-2">
                          Nenhum relatório disponível
                        </h3>
                        <p className="text-gray-500 mb-6">
                          Complete uma avaliação clínica para gerar seu primeiro relatório.
                        </p>
                        <button
                          onClick={() => setActiveTab('assessment')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                          <i className="fas fa-clipboard-list mr-2"></i>
                          Iniciar Avaliação
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Direita */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Ações Rápidas */}
              <div className="bg-black/40 rounded-2xl border border-white/10 p-6 backdrop-blur">
                <h3 className="text-lg font-semibold text-white mb-4">
                  <i className="fas fa-bolt mr-2 text-yellow-400"></i>
                  Ações Rápidas
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('assessment')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left"
                  >
                    <i className="fas fa-clipboard-list mr-2"></i>
                    Nova Avaliação
                  </button>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left"
                  >
                    <i className="fas fa-comments mr-2"></i>
                    Chat com Nôa
                  </button>
                  <button
                    onClick={() => setActiveTab('reports')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left"
                  >
                    <i className="fas fa-file-alt mr-2"></i>
                    Ver Relatórios
                  </button>
                </div>
              </div>

              {/* Informações do Programa */}
              <div className="bg-black/40 rounded-2xl border border-white/10 p-6 backdrop-blur">
                <h3 className="text-lg font-semibold text-white mb-4">
                  <i className="fas fa-info-circle mr-2 text-blue-400"></i>
                  Programa
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-400">Especialidade:</p>
                    <p className="text-white font-medium">{profile.title}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Status:</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400">
                      <i className="fas fa-check-circle mr-1"></i>
                      Ativo
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-400">Próxima Consulta:</p>
                    <p className="text-white">Agendar com Dr. Ricardo</p>
                  </div>
                </div>
              </div>

              {/* Contato */}
              <div className="bg-black/40 rounded-2xl border border-white/10 p-6 backdrop-blur">
                <h3 className="text-lg font-semibold text-white mb-4">
                  <i className="fas fa-phone mr-2 text-green-400"></i>
                  Contato
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-300">
                    <i className="fas fa-envelope mr-2 text-emerald-400"></i>
                    <span>contato@noaesperanza.app</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <i className="fas fa-calendar mr-2 text-emerald-400"></i>
                    <span>Agendar Consulta</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPaciente
