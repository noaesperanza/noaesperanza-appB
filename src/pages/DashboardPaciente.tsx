import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Specialty } from '../App'
import GPTPBuilder from '../components/GPTPBuilder'
import { ClinicalAssessment } from '../components/ClinicalAssessment'
import { useAuth } from '../contexts/AuthContext'
import {
  clinicalAgentService,
  ClinicalSession,
  PatientContext,
} from '../services/clinicalAgentService'
import { logger } from '../utils/logger'

type NotificationType = 'info' | 'success' | 'warning' | 'error'

interface DashboardPacienteProps {
  currentSpecialty: Specialty
  addNotification: (message: string, type?: NotificationType) => void
}

interface ReportEntry {
  id: string
  title: string
  summary: string
  createdAt: string
  stage?: string
  details?: any
  nftHash?: string | null
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

const storage = typeof window !== 'undefined' ? window.localStorage : null

const DashboardPaciente = ({ currentSpecialty, addNotification }: DashboardPacienteProps) => {
  const { user, userProfile } = useAuth()

  const [activeTab, setActiveTab] = useState<'profile' | 'assessment' | 'chat' | 'reports'>(
    'profile'
  )
  const [patientName, setPatientName] = useState('')
  const [consentGiven, setConsentGiven] = useState(() => {
    if (!storage) return false
    return storage.getItem('noa_patient_consent') === 'true'
  })
  const [patientContext, setPatientContext] = useState<PatientContext | null>(null)
  const [currentSession, setCurrentSession] = useState<ClinicalSession | null>(null)
  const [activeSessions, setActiveSessions] = useState<ClinicalSession[]>([])
  const [assessmentStats, setAssessmentStats] = useState<any>(null)
  const [loadingSession, setLoadingSession] = useState(false)
  const [nftHash, setNftHash] = useState<string | null>(() => {
    if (!storage) return null
    return storage.getItem('noa_patient_last_nft')
  })
  const [lastAssessmentReport, setLastAssessmentReport] = useState<string | null>(() => {
    if (!storage) return null
    const saved = storage.getItem('noa_patient_last_report')
    if (!saved) return null

    try {
      const parsed = JSON.parse(saved)
      return typeof parsed?.summary === 'string' ? parsed.summary : saved
    } catch (error) {
      logger.warn('⚠️ Não foi possível analisar relatório salvo, usando texto cru.', error)
      return saved
    }
  })
  const [reportHistory, setReportHistory] = useState<ReportEntry[]>(() => {
    if (!storage) return []
    const saved = storage.getItem('noa_patient_reports')
    if (!saved) return []

    try {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) {
        return parsed
      }
    } catch (error) {
      logger.warn('⚠️ Não foi possível analisar histórico de relatórios salvo.', error)
    }

    return []
  })
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)
  const [sessionId] = useState(
    () => `patient_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
  )

  const profile = useMemo(() => specialtyCopy[currentSpecialty], [currentSpecialty])

  const builderUserId = user?.id || 'noa-paciente-guest'
  const builderUserName = useMemo(() => {
    if (patientName.trim()) return patientName
    if (userProfile?.name) return userProfile.name
    if (user?.email) return user.email
    return 'Paciente Nôa'
  }, [patientName, userProfile, user])

  const selectedReport = useMemo(
    () => reportHistory.find(report => report.id === selectedReportId) || null,
    [reportHistory, selectedReportId]
  )

  useEffect(() => {
    if (!selectedReportId && reportHistory.length > 0) {
      setSelectedReportId(reportHistory[0].id)
    }
  }, [reportHistory, selectedReportId])

  useEffect(() => {
    if (!storage) return
    storage.setItem('noa_patient_consent', consentGiven ? 'true' : 'false')
  }, [consentGiven])

  useEffect(() => {
    if (!storage) return
    storage.setItem('noa_patient_reports', JSON.stringify(reportHistory))
  }, [reportHistory])

  useEffect(() => {
    if (!userProfile?.name && !user?.email) return
    setPatientName(prev => {
      if (prev && prev.trim().length > 0) {
        return prev
      }
      if (userProfile?.name) return userProfile.name
      if (user?.email) return user.email?.split('@')[0] || 'Paciente'
      return 'Paciente'
    })
  }, [userProfile, user])

  useEffect(() => {
    addNotification('Dashboard do paciente carregado com sucesso.', 'success')
  }, [addNotification])

  const refreshActiveSessions = useCallback(async (patientId: string) => {
    try {
      const sessions = await clinicalAgentService.getPatientActiveSessions(patientId)
      setActiveSessions(sessions)
    } catch (error) {
      logger.warn('⚠️ Não foi possível carregar sessões ativas do paciente.', error)
    }
  }, [])

  const initializePatientWorkspace = useCallback(async () => {
    if (!user) return

    const context: PatientContext = {
      userId: user.id,
      userEmail: user.email || 'paciente@noa.esperanza',
      patientName: patientName || userProfile?.name || 'Paciente',
      consentGiven,
      nftHash,
      sessionId,
      permissions: {
        canAccessClinicalData: consentGiven,
        canGenerateReports: consentGiven,
        canCreateNFT: consentGiven,
        lgpdCompliant: consentGiven,
      },
    }

    setPatientContext(context)

    if (!consentGiven) {
      setCurrentSession(null)
      return
    }

    setLoadingSession(true)

    try {
      const session = await clinicalAgentService.initializePatientSession(context)
      setCurrentSession(session)
      await refreshActiveSessions(context.userId)
    } catch (error) {
      logger.warn(
        '⚠️ Falha ao inicializar sessão clínica via Supabase, usando fallback local.',
        error
      )
      const fallbackSession: ClinicalSession = {
        id: context.sessionId,
        patientId: context.userId,
        sessionType: 'assessment',
        status: 'active',
        startedAt: new Date(),
        lgpdCompliance: {
          consentGiven: context.consentGiven,
          dataRetention: 365,
          purpose: 'Avaliação clínica inicial',
          lawfulBasis: 'Consentimento explícito do paciente',
        },
      }
      setCurrentSession(fallbackSession)
    } finally {
      setLoadingSession(false)
    }
  }, [user, patientName, userProfile, consentGiven, nftHash, sessionId, refreshActiveSessions])

  useEffect(() => {
    initializePatientWorkspace()
  }, [initializePatientWorkspace])

  const handleAssessmentComplete = useCallback(
    async (report: any, generatedNftHash: string) => {
      setNftHash(generatedNftHash)
      const createdAt = new Date().toISOString()
      const summary = report?.summary || 'Relatório gerado com sucesso.'

      const entry: ReportEntry = {
        id: `${Date.now()}`,
        title: 'Avaliação Clínica Inicial',
        summary,
        createdAt,
        stage: report?.stage || 'Avaliação inicial',
        details: report,
        nftHash: generatedNftHash,
      }

      setReportHistory(prev => [entry, ...prev])
      setLastAssessmentReport(summary)
      setSelectedReportId(entry.id)

      if (storage) {
        storage.setItem('noa_patient_last_report', JSON.stringify({ summary }))
        storage.setItem('noa_patient_last_nft', generatedNftHash)
      }

      if (currentSession) {
        try {
          await clinicalAgentService.completeClinicalSession(
            currentSession.id,
            report,
            generatedNftHash
          )
          await refreshActiveSessions(currentSession.patientId)
        } catch (error) {
          logger.warn('⚠️ Não foi possível sincronizar conclusão da sessão clínica.', error)
        }
      }

      addNotification('Avaliação clínica registrada com sucesso!', 'success')
      setActiveTab('reports')
    },
    [addNotification, currentSession, refreshActiveSessions]
  )

  const handleUpdateKPIs = useCallback((stats: any) => {
    setAssessmentStats(stats)
  }, [])

  const handleDownloadReport = useCallback((report: ReportEntry) => {
    if (typeof window === 'undefined') return

    const content =
      typeof report.details === 'string'
        ? report.details
        : report.details
          ? JSON.stringify(report.details, null, 2)
          : report.summary

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${report.title.replace(/\s+/g, '_').toLowerCase()}_${report.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  const quickActions = [
    {
      icon: 'fa-clipboard-list',
      label: 'Iniciar Avaliação Clínica',
      description: 'Acesse a avaliação inicial completa',
      action: () => setActiveTab('assessment'),
    },
    {
      icon: 'fa-robot',
      label: 'Abrir Chat com Nôa',
      description: 'Converse com a assistente especializada',
      action: () => setActiveTab('chat'),
    },
    {
      icon: 'fa-file-medical',
      label: 'Visualizar Relatórios',
      description: 'Baixe seus relatórios clínicos',
      action: () => setActiveTab('reports'),
    },
  ]

  const complianceStatus = patientContext
    ? clinicalAgentService.validateLGPDCompliance(patientContext)
    : { compliant: false, issues: [], recommendations: [] }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-6"
          >
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Meu Perfil Clínico</h2>
                  <p className="text-white/70">
                    Acompanhe seu progresso no programa {profile.title.toLowerCase()}.
                  </p>
                </div>
                <div className="flex flex-col rounded-2xl bg-emerald-500/10 px-6 py-4 text-emerald-200">
                  <span className="text-xs uppercase tracking-widest text-emerald-300">
                    Próximo passo
                  </span>
                  <span className="text-base font-semibold">
                    Agendar consulta com Dr. Ricardo Valença
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  <span className="text-xs uppercase text-white/60">Paciente</span>
                  <p className="mt-2 text-lg font-medium text-white">
                    {patientName || 'Paciente Nôa'}
                  </p>
                  <p className="text-sm text-white/50">{user?.email || 'sem email cadastrado'}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  <span className="text-xs uppercase text-white/60">Status da Avaliação</span>
                  <p className="mt-2 text-lg font-medium text-white">
                    {reportHistory.length > 0 ? 'Concluída' : 'Pendente'}
                  </p>
                  <p className="text-sm text-white/50">
                    {reportHistory.length > 0
                      ? 'Relatório disponível para download'
                      : 'Inicie a avaliação clínica inicial'}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  <span className="text-xs uppercase text-white/60">Sessões Ativas</span>
                  <p className="mt-2 text-lg font-medium text-white">
                    {activeSessions.length || 1}
                  </p>
                  <p className="text-sm text-white/50">
                    Sessão atual: {currentSession ? 'Ativa' : 'Pendente'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Progresso no Programa</h3>
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-200">
                    {assessmentStats?.completedAssessments || reportHistory.length} concluído(s)
                  </span>
                </div>
                <div className="mt-4 space-y-3 text-sm text-white/70">
                  <div className="flex items-center gap-3">
                    <i className="fas fa-check-circle text-emerald-300" />
                    <span>
                      Etapa atual:{' '}
                      <strong>
                        {assessmentStats?.currentStage || 'Avaliação Clínica Inicial'}
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <i className="fas fa-file-medical text-sky-300" />
                    <span>
                      Último relatório:{' '}
                      <strong>
                        {lastAssessmentReport
                          ? 'Disponível para download'
                          : 'Nenhum relatório salvo'}
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <i className="fas fa-robot text-purple-300" />
                    <span>Interaja com a Nôa para orientações personalizadas.</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h3 className="text-lg font-semibold text-white">Próximos Passos</h3>
                <ul className="mt-4 space-y-3 text-sm text-white/70">
                  <li className="flex items-start gap-3">
                    <i className="fas fa-calendar-check mt-1 text-emerald-300" />
                    <span>
                      Agende seu retorno com a equipe clínica para revisar os resultados da
                      avaliação inicial.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="fas fa-file-download mt-1 text-sky-300" />
                    <span>
                      Baixe o relatório clínico completo para levar à consulta presencial.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="fas fa-headset mt-1 text-purple-300" />
                    <span>
                      Mantenha contato com a equipe de suporte para esclarecimento de dúvidas.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        )
      case 'assessment':
        return (
          <motion.div
            key="assessment"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-6"
          >
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Avaliação Clínica Inicial</h2>
                  <p className="text-white/70">
                    Complete a jornada guiada pela Nôa para preparar sua consulta com o Dr. Ricardo
                    Valença.
                  </p>
                </div>
                {nftHash && (
                  <div className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-xs text-emerald-200">
                    <p className="font-semibold">Último NFT registrado</p>
                    <p className="font-mono text-[11px] text-emerald-300">{nftHash}</p>
                  </div>
                )}
              </div>
              {loadingSession && (
                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-white/70">
                  <i className="fas fa-circle-notch animate-spin text-emerald-300" />
                  <span>Preparando sessão clínica segura...</span>
                </div>
              )}

              <div className="mt-6">
                <ClinicalAssessment
                  onComplete={handleAssessmentComplete}
                  onUpdateKPIs={handleUpdateKPIs}
                />
              </div>
            </div>
          </motion.div>
        )
      case 'chat':
        return (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-6"
          >
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Chat com Nôa</h2>
                  <p className="text-white/70">
                    Converse com a assistente médica especializada, agora com a experiência completa
                    do GPT Builder integrada.
                  </p>
                </div>
                <div className="rounded-2xl bg-purple-500/10 px-4 py-3 text-xs text-purple-200">
                  <p className="font-semibold">Experiência integrada</p>
                  <p>GPT Builder + funcionalidades originais preservadas.</p>
                </div>
              </div>

              <div className="mt-6 h-[720px] rounded-2xl border border-white/10 bg-slate-950/40">
                <GPTPBuilder
                  embedded
                  userId={builderUserId}
                  userName={builderUserName}
                  userType="paciente"
                />
              </div>
            </div>
          </motion.div>
        )
      case 'reports':
        return (
          <motion.div
            key="reports"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-6"
          >
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Relatórios Clínicos</h2>
                  <p className="text-white/70">
                    Visualize e faça download dos seus relatórios clínicos certificados.
                  </p>
                </div>
                <div className="rounded-2xl bg-sky-500/10 px-4 py-3 text-xs text-sky-200">
                  <p className="font-semibold">Relatórios disponíveis</p>
                  <p>{reportHistory.length || 0} documento(s)</p>
                </div>
              </div>

              {reportHistory.length === 0 ? (
                <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-slate-950/40 p-12 text-center text-white/60">
                  <i className="fas fa-file-medical text-4xl text-white/40" />
                  <p className="mt-4 text-lg font-medium">Nenhum relatório disponível ainda.</p>
                  <p className="text-sm">
                    Finalize a avaliação clínica inicial para gerar seu primeiro relatório.
                  </p>
                  <button
                    onClick={() => setActiveTab('assessment')}
                    className="mt-6 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
                  >
                    Iniciar Avaliação
                  </button>
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
                  <div className="space-y-4">
                    {reportHistory.map(report => (
                      <button
                        key={report.id}
                        onClick={() => setSelectedReportId(report.id)}
                        className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                          selectedReportId === report.id
                            ? 'border-emerald-400 bg-emerald-500/10 text-white'
                            : 'border-white/10 bg-slate-950/40 text-white/70 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold">{report.title}</span>
                          <i className="fas fa-chevron-right text-xs" />
                        </div>
                        <p className="mt-2 text-xs text-white/60">
                          {new Date(report.createdAt).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </button>
                    ))}
                  </div>

                  {selectedReport && (
                    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6">
                      <div className="flex flex-col gap-2 border-b border-white/10 pb-4">
                        <h3 className="text-xl font-semibold text-white">{selectedReport.title}</h3>
                        <span className="text-xs uppercase tracking-widest text-white/50">
                          {selectedReport.stage || 'Avaliação Inicial'}
                        </span>
                        <span className="text-xs text-white/50">
                          Gerado em{' '}
                          {new Date(selectedReport.createdAt).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {selectedReport.nftHash && (
                          <span className="font-mono text-[11px] text-emerald-300">
                            NFT: {selectedReport.nftHash}
                          </span>
                        )}
                      </div>

                      <div className="mt-4 rounded-2xl bg-black/30 p-4 text-sm text-white/70">
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-white/80">
                          {selectedReport.summary}
                        </pre>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => handleDownloadReport(selectedReport)}
                          className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
                        >
                          <i className="fas fa-download mr-2" /> Baixar Relatório
                        </button>
                        {selectedReport.nftHash && (
                          <span className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                            Certificado NFT
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-emerald-300 transition-colors hover:text-emerald-200">
              <i className="fas fa-arrow-left mr-2" />
              Voltar ao início
            </Link>
            <span className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-emerald-200">
              <i className="fas fa-user-md" /> Paciente
            </span>
          </div>
          <div
            className={`rounded-2xl border border-white/10 bg-gradient-to-r ${profile.accent} px-6 py-4 shadow-lg`}
          >
            <h1 className="text-lg font-semibold uppercase tracking-widest">{profile.title}</h1>
            <p className="text-sm text-white/80">{profile.description}</p>
          </div>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <main className="space-y-6">
            <nav className="flex flex-wrap gap-2 rounded-3xl border border-white/10 bg-white/5 p-2 backdrop-blur">
              {[
                { id: 'profile', label: 'Meu Perfil', icon: 'fa-user' },
                { id: 'assessment', label: 'Avaliação Clínica', icon: 'fa-clipboard-list' },
                { id: 'chat', label: 'Chat com Nôa', icon: 'fa-comments' },
                { id: 'reports', label: 'Relatórios', icon: 'fa-file-medical' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition ${
                    activeTab === tab.id
                      ? 'bg-emerald-500 text-emerald-950 shadow-lg'
                      : 'bg-transparent text-white/70 hover:bg-white/10'
                  }`}
                >
                  <i className={`fas ${tab.icon}`} />
                  {tab.label}
                </button>
              ))}
            </nav>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <AnimatePresence mode="wait">{renderTabContent()}</AnimatePresence>
            </section>
          </main>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h3 className="text-lg font-semibold text-white">Ações Rápidas</h3>
              <div className="mt-4 space-y-4">
                {quickActions.map(action => (
                  <button
                    key={action.label}
                    onClick={action.action}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-left text-sm text-white/70 transition hover:border-emerald-400/40 hover:bg-emerald-500/10 hover:text-white"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <i className={`fas ${action.icon} text-emerald-300`} />
                        <span className="font-semibold text-white">{action.label}</span>
                      </div>
                      <i className="fas fa-arrow-right text-xs text-white/40" />
                    </div>
                    <p className="mt-2 text-xs">{action.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h3 className="text-lg font-semibold text-white">Informações do Programa</h3>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                <li className="flex items-start gap-3">
                  <i className="fas fa-stethoscope mt-1 text-emerald-300" />
                  <span>Equipe especializada acompanhando seu caso de forma contínua.</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-heartbeat mt-1 text-sky-300" />
                  <span>Monitoramento de exames, medicações e hábitos de vida.</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-graduation-cap mt-1 text-purple-300" />
                  <span>Educação personalizada para empoderar suas decisões de saúde.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h3 className="text-lg font-semibold text-white">Contato & Suporte</h3>
              <div className="mt-4 space-y-3 text-sm text-white/70">
                <div className="flex items-center gap-3">
                  <i className="fas fa-user-md text-emerald-300" />
                  <div>
                    <p className="font-semibold text-white">Dr. Ricardo Valença</p>
                    <p>Coordenador clínico da Nôa Esperanza</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-envelope text-sky-300" />
                  <span>suporte@noaesperanza.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-phone text-purple-300" />
                  <span>(81) 4002-8922</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h3 className="text-lg font-semibold text-white">Segurança & LGPD</h3>
              <div className="mt-4 space-y-4 text-sm text-white/70">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 p-3">
                  <span>Consentimento do paciente</span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      consentGiven
                        ? 'bg-emerald-500/20 text-emerald-200'
                        : 'bg-amber-500/20 text-amber-200'
                    }`}
                  >
                    {consentGiven ? 'Ativo' : 'Pendente'}
                  </span>
                </div>
                {complianceStatus.issues.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-widest text-amber-200">
                      Ajustes recomendados
                    </p>
                    <ul className="space-y-2 text-xs">
                      {complianceStatus.recommendations.map(recommendation => (
                        <li key={recommendation} className="flex items-start gap-2">
                          <i className="fas fa-exclamation-circle mt-0.5 text-amber-300" />
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-100">
                    <i className="fas fa-shield-alt" />
                    <span>Todos os requisitos de segurança e privacidade atendidos.</span>
                  </div>
                )}
                <button
                  onClick={() => setConsentGiven(prev => !prev)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-2 text-sm font-medium text-white transition hover:border-emerald-400/40 hover:bg-emerald-500/10"
                >
                  {consentGiven ? 'Revogar consentimento' : 'Fornecer consentimento'}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default DashboardPaciente
