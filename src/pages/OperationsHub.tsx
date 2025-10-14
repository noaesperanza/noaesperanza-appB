import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { clinics } from '../data/clinics'
import { getAdminMetrics, type AdminMetrics } from '../services/supabaseService'

const DEFAULT_METRICS: AdminMetrics = {
  totalUsers: 0,
  activeSubscriptions: 0,
  monthlyRevenue: 0,
  systemUptime: 99.9,
  totalDoctors: 0,
  totalPatients: 0,
  totalInteractions: 0,
  aiLearningCount: 0,
  totalAvaliacoes: 0,
  avaliacoesCompletas: 0,
  avaliacoesEmAndamento: 0,
}

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

const OperationsHub = () => {
  const [metrics, setMetrics] = useState<AdminMetrics>(DEFAULT_METRICS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchParams] = useSearchParams()
  const highlightedService = searchParams.get('service')

  useEffect(() => {
    let isMounted = true

    const loadMetrics = async () => {
      try {
        const data = await getAdminMetrics()
        if (isMounted) {
          setMetrics(data)
          setError(null)
        }
      } catch (err) {
        console.error(err)
        if (isMounted) {
          setError('Não foi possível atualizar métricas em tempo real. Mostrando dados simulados.')
          setMetrics(DEFAULT_METRICS)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadMetrics()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <p className="text-sm uppercase tracking-widest text-emerald-300/80">
          Governança operacional
        </p>
        <h1 className="text-4xl font-bold text-white">
          Integrações clínicas, IA e pagamentos em produção
        </h1>
        <p className="max-w-3xl text-base text-slate-200">
          Monitoramos Supabase, Mercado Pago e fluxos de IA para garantir operações contínuas.
          Acompanhe indicadores e acesse rapidamente dashboards, chat clínico e módulos financeiros.
        </p>
        {highlightedService && (
          <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-4 text-sm text-emerald-100">
            Serviço em destaque: <span className="font-semibold">{highlightedService}</span>
          </div>
        )}
      </header>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
          <p className="text-xs uppercase tracking-wide text-slate-400">Pacientes ativos</p>
          <p className="mt-3 text-3xl font-semibold text-white">{metrics.totalPatients}</p>
          <p className="text-xs text-slate-400">Dados vindos do Supabase</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
          <p className="text-xs uppercase tracking-wide text-slate-400">Interações com a IA</p>
          <p className="mt-3 text-3xl font-semibold text-white">{metrics.totalInteractions}</p>
          <p className="text-xs text-slate-400">Uso total da Nôa Esperanza</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
          <p className="text-xs uppercase tracking-wide text-slate-400">Receita estimada</p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {formatCurrency(metrics.monthlyRevenue)}
          </p>
          <p className="text-xs text-slate-400">Mercado Pago + assinaturas</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
          <p className="text-xs uppercase tracking-wide text-slate-400">Aprendizado da IA</p>
          <p className="mt-3 text-3xl font-semibold text-white">{metrics.aiLearningCount}</p>
          <p className="text-xs text-slate-400">Palavras-chave acompanhadas</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/60 p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-semibold text-white">Núcleo operacional</h2>
            <div className="flex flex-wrap gap-3 text-sm">
              <Link
                to="/chat"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 font-semibold text-emerald-950 transition hover:bg-emerald-400"
              >
                Abrir chat clínico
                <i className="fas fa-robot text-xs" />
              </Link>
              <Link
                to="/app/checkout"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-500/50 px-4 py-2 text-emerald-100 transition hover:bg-emerald-500/10"
              >
                Painel de pagamentos
                <i className="fas fa-credit-card text-xs" />
              </Link>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-5">
              <h3 className="text-lg font-semibold text-white">Dashboard administrativo</h3>
              <p className="mt-2 text-sm text-slate-300">
                Métricas de usuários, assinaturas, faturamento e aderência clínica com dados vindos
                do Supabase em tempo real.
              </p>
              <Link
                to="/app/admin"
                className="mt-4 inline-flex items-center gap-2 text-sm text-emerald-200 hover:text-emerald-100"
              >
                Acessar painel
                <i className="fas fa-arrow-right text-xs" />
              </Link>
            </div>
            <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-5">
              <h3 className="text-lg font-semibold text-white">Relatórios inteligentes</h3>
              <p className="mt-2 text-sm text-slate-300">
                Utilize o módulo de relatório narrativo e dashboards do paciente para acelerar
                devolutivas clínicas.
              </p>
              <Link
                to="/app/relatorio"
                className="mt-4 inline-flex items-center gap-2 text-sm text-emerald-200 hover:text-emerald-100"
              >
                Abrir relatório
                <i className="fas fa-file-medical-alt text-xs" />
              </Link>
            </div>
          </div>
        </div>
        <aside className="space-y-5 rounded-3xl border border-white/10 bg-slate-900/60 p-6">
          <div className="space-y-3 text-sm text-slate-200">
            <div className="flex items-start gap-3">
              <span className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                <i className="fas fa-bolt" />
              </span>
              <div>
                <p className="font-semibold text-white">Status operacional</p>
                <p>
                  Sistema {loading ? 'checando' : 'estável'} • Uptime {metrics.systemUptime}%
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/20 text-amber-300">
                <i className="fas fa-lock" />
              </span>
              <div>
                <p className="font-semibold text-white">Segurança</p>
                <p>RLS Supabase ativo • Consentimento digital em produção</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/20 text-sky-300">
                <i className="fas fa-graduation-cap" />
              </span>
              <div>
                <p className="font-semibold text-white">Treinamento</p>
                <p>Playbooks integrados à base clínica e ao chat inteligente</p>
              </div>
            </div>
          </div>
          {error && (
            <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-100">
              {error}
            </div>
          )}
          <div className="space-y-3 text-sm text-slate-200">
            <p className="font-semibold text-white">Consultórios conectados</p>
            <ul className="space-y-2">
              {clinics.map(clinic => (
                <li key={clinic.slug} className="flex items-center justify-between">
                  <span>{clinic.name}</span>
                  <Link
                    to={`/clinics/${clinic.slug}`}
                    className="text-xs text-emerald-200 hover:text-emerald-100"
                  >
                    Ver detalhes
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-8">
        <h2 className="text-2xl font-semibold text-white">Próximos passos recomendados</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-wide text-emerald-300/80">
              Integração Supabase
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Revisar triggers de aprendizado e tabelas de pacientes para garantir sincronização
              entre consultórios.
            </p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-wide text-emerald-300/80">
              Fluxos financeiros
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Validar planos no Mercado Pago e conciliação de recebíveis no dashboard financeiro do
              paciente.
            </p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-wide text-emerald-300/80">
              Treinamento contínuo
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Atualizar a base de conhecimento com novos casos clínicos e playbooks compartilhados
              entre as equipes.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default OperationsHub
