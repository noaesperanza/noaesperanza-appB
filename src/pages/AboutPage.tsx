import { Link } from 'react-router-dom'

const AboutPage = () => {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-white">Sobre a operação clínica integrada</h1>
        <p className="text-sm text-slate-300">
          O App B replica a arquitetura do App C para oferecer uma experiência pública objetiva,
          apresentando as clínicas do Dr. Ricardo Valença e do Dr. Eduardo Favaret com dados
          compartilhados, base de conhecimento unificada e rotas protegidas já utilizadas pelo
          ecossistema Nôa Esperanza.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="premium-card space-y-3">
          <h2 className="text-xl font-semibold text-white">Pilares operacionais</h2>
          <ul className="space-y-3 text-sm text-slate-200">
            <li className="flex gap-3">
              <span className="mt-1 text-emerald-300">
                <i className="fas fa-database" />
              </span>
              <div>
                <p className="font-medium text-white">Supabase centralizado</p>
                <p className="text-xs text-slate-300">
                  Autenticação, dados clínicos, histórico de IA e dashboards operacionais residem na
                  mesma instância configurada no ecossistema Nôa.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 text-emerald-300">
                <i className="fas fa-robot" />
              </span>
              <div>
                <p className="font-medium text-white">IA residente</p>
                <p className="text-xs text-slate-300">
                  Fluxos de chat, geração de relatórios e triagem clínica aproveitam o histórico dos
                  consultórios e a base de conhecimento compartilhada.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 text-emerald-300">
                <i className="fas fa-credit-card" />
              </span>
              <div>
                <p className="font-medium text-white">Mercado Pago</p>
                <p className="text-xs text-slate-300">
                  Pagamentos recorrentes e cobranças avulsas conectados diretamente aos módulos
                  `/app/payment` e `/app/checkout`.
                </p>
              </div>
            </li>
          </ul>
        </article>

        <article className="premium-card space-y-3 text-sm text-slate-200">
          <h2 className="text-xl font-semibold text-white">Rotas protegidas preservadas</h2>
          <p>
            A estrutura de autenticação e autorização é mantida: após login, os usuários acessam
            dashboards específicos, GPT Builder, relatórios e fluxos financeiros sem alterações nos
            componentes já adotados pela equipe clínica.
          </p>
          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">Acesso rápido</p>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <span className="font-semibold text-white">/chat</span> – chat clínico inteligente
              </li>
              <li>
                <span className="font-semibold text-white">/app/paciente</span> – dashboard de
                pacientes
              </li>
              <li>
                <span className="font-semibold text-white">/app/medico</span> – visão médica com
                indicadores assistidos pela IA
              </li>
              <li>
                <span className="font-semibold text-white">/app/checkout</span> – módulos de
                cobrança Mercado Pago
              </li>
            </ul>
          </div>
          <Link
            to="/clinics"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
          >
            Ver clínicas integradas
            <i className="fas fa-arrow-right text-xs" />
          </Link>
        </article>
      </section>

      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-sm text-slate-200">
        <h2 className="text-xl font-semibold text-white">
          Boas práticas para novos desenvolvimentos
        </h2>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Mantenha a compatibilidade:</strong> qualquer novo módulo deve preservar os
            contratos com `supabaseClient` e com os serviços de IA já existentes em `src/services`.
          </li>
          <li>
            <strong>Respeite as rotas:</strong> utilize `src/App.tsx` como fonte única de roteamento
            público e protegido.
          </li>
          <li>
            <strong>Atualize a base clínica:</strong> adicione protocolos em
            `src/data/knowledgeBase.ts` para que a IA residente aprenda com o conteúdo mais recente.
          </li>
        </ul>
      </section>
    </div>
  )
}

export default AboutPage
