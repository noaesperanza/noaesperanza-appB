import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Specialty } from '../App'
import GPTPBuilder from '../components/GPTPBuilder'
import { useAuth } from '../contexts/AuthContext'

type NotificationType = 'info' | 'success' | 'warning' | 'error'

interface DashboardPacienteProps {
  currentSpecialty: Specialty
  addNotification: (message: string, type?: NotificationType) => void
}

const specialtyCopy: Record<Specialty, { title: string; description: string; accent: string }> = {
  rim: {
    title: 'Programa de Cuidado Renal',
    description: 'A Nôa acompanha a jornada nefrológica com monitoramento de exames, medicações e educação contínua.',
    accent: 'from-emerald-400 to-green-600'
  },
  neuro: {
    title: 'Programa de Neurologia Integrada',
    description: 'Assistência inteligente para acompanhamento de sintomas neurológicos, planos terapêuticos e suporte familiar.',
    accent: 'from-sky-400 to-blue-600'
  },
  cannabis: {
    title: 'Programa de Cannabis Medicinal',
    description: 'Orientações personalizadas sobre titulação, adesão terapêutica e telemonitoramento com equipe especializada.',
    accent: 'from-lime-400 to-emerald-500'
  }
}

const DashboardPaciente = ({ currentSpecialty, addNotification }: DashboardPacienteProps) => {
  const { user, userProfile } = useAuth()
  const profile = useMemo(() => specialtyCopy[currentSpecialty], [currentSpecialty])

  const builderUserId = user?.id || 'noa-paciente-guest'
  const builderUserName = userProfile?.name || user?.email || 'Paciente Nôa'

  useEffect(() => {
    addNotification('Espaço do paciente conectado à Nôa Esperanza.', 'success')
  }, [addNotification])

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-emerald-300 hover:text-emerald-200 transition-colors">
              <i className="fas fa-arrow-left mr-2" />Voltar ao início
            </Link>
            <span className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-emerald-200">
              <i className="fas fa-user-md" /> Paciente
            </span>
          </div>
          <div className={`rounded-2xl border border-white/10 bg-gradient-to-r ${profile.accent} px-4 py-3 shadow-lg`}> 
            <h1 className="text-lg font-semibold uppercase tracking-widest">{profile.title}</h1>
            <p className="text-sm text-white/80">{profile.description}</p>
          </div>
        </header>

        <main className="mt-6">
          <section className="rounded-3xl border border-white/10 bg-black/40 shadow-xl backdrop-blur">
            <GPTPBuilder userId={builderUserId} userName={builderUserName} userType="paciente" />
          </section>
        </main>
      </div>
    </div>
  )
}

export default DashboardPaciente
