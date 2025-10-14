import { Link } from 'react-router-dom'
import { clinics } from '../data/clinics'
import { knowledgeBase } from '../data/knowledgeBase'

const HomePage = () => {
  const siteBaseUrl = import.meta.env.VITE_SITE_BASE_URL ?? 'https://noaesperanza.vercel.app'

  return (
    <div className="space-y-16">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
            Plataforma clínica integrada
          </span>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">
            Cuidado contínuo para neurologia, cannabis medicinal e nefrologia em um único fluxo
            digital.
          </h1>
          <p className="text-lg text-slate-300">
            As clínicas do Dr. Ricardo Valença e do Dr. Eduardo Favaret compartilham dados,
            protocolos e integrações com IA residente, Supabase e Mercado Pago para garantir
            atendimento seguro e personalizado.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/clinics" className="premium-button">
              Conhecer clínicas
              <i className="fas fa-arrow-right text-xs" />
            </Link>
            <Link
              to="/knowledge-base"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm text-slate-200 transition hover:bg-white/10"
            >
              Base clínica integrada
            </Link>
          </div>
          <div className="gradient-divider" />
          <div className="grid gap-4 sm:grid-cols-2">
            {clinics.map(clinic => (
              <div
                key={clinic.slug}
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-5"
              >
                <p className="text-xs uppercase tracking-widest text-emerald-200/80">
                  {clinic.doctor}
                </p>
                <h2 className="mt-2 text-xl font-semibold text-white">{clinic.name}</h2>
                <p className="mt-3 text-sm text-slate-300">{clinic.summary}</p>
                <Link
                  to={`/clinics/${clinic.slug}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-emerald-300 hover:text-emerald-200"
                >
                  Ver detalhes
                  <i className="fas fa-arrow-right text-xs" />
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="premium-card h-full">
          <div className="flex h-full flex-col justify-between gap-6">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-200/70">
                IA residente
              </p>
              <h2 className="text-2xl font-semibold text-white">
                Chat clínico ativo e aprendizado contínuo
              </h2>
              <p className="text-sm leading-relaxed text-slate-300">
                A IA acompanha as interações médicas, gera relatórios narrativos, monitora metas
                clínicas e envia alertas de risco para as equipes. Todo o conhecimento fica
                versionado no Supabase e auditado pelas equipes médicas.
              </p>
            </div>
            <div className="space-y-3 rounded-xl border border-white/10 bg-slate-900/60 p-5 text-sm text-slate-200">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-200">
                  <i className="fas fa-comments" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">Chat clínico protegido</p>
                  <p className="text-xs text-slate-300">
                    Acesse em{' '}
                    <Link to="/chat" className="text-emerald-300 hover:text-emerald-200">
                      /chat
                    </Link>{' '}
                    (rotas protegidas)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-200">
                  <i className="fas fa-chart-line" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">Dashboards operacionais</p>
                  <p className="text-xs text-slate-300">
                    Gestão integrada de métricas clínicas, aprendizado da IA e finanças.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-200">
                  <i className="fas fa-credit-card" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">Pagamentos com Mercado Pago</p>
                  <p className="text-xs text-slate-300">
                    Planos, assinaturas e cobranças únicas conectadas ao Supabase.
                  </p>
                </div>
              </div>
            </div>
            <a
              href={siteBaseUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:bg-white/10"
            >
              Abrir portal completo
              <i className="fas fa-arrow-up-right-from-square text-xs" />
            </a>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Conhecimento clínico sempre atualizado
            </h2>
            <p className="text-sm text-slate-300">
              Protocolos, checklists e materiais operacionais aplicados nos dois consultórios.
            </p>
          </div>
          <Link
            to="/knowledge-base"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
          >
            Ver base completa
            <i className="fas fa-book-medical text-xs" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {knowledgeBase.map(category => (
            <article
              key={category.id}
              className="rounded-2xl border border-white/10 bg-slate-900/60 p-6"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
                {category.title}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-white">{category.description}</h3>
              <ul className="mt-5 space-y-3 text-sm text-slate-300">
                {category.articles.slice(0, 2).map(article => (
                  <li
                    key={article.id}
                    className="rounded-lg border border-white/5 bg-slate-900/60 p-3"
                  >
                    <p className="font-medium text-white">{article.title}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Atualizado em {new Date(article.lastUpdate).toLocaleDateString('pt-BR')}
                    </p>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Como acessar os módulos protegidos</h2>
          <p className="text-sm text-slate-200">
            As rotas `/chat` e `/app/*` exigem autenticação Supabase. Utilize um usuário já
            cadastrado ou registre-se na página de acesso público.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link to="/login" className="premium-button">
              Fazer login
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm text-white transition hover:bg-white/10"
            >
              Criar conta clínica
            </Link>
          </div>
        </div>
        <div className="space-y-3 text-sm text-slate-200">
          <p>
            <strong>Integrações automatizadas:</strong> Supabase para dados, OpenAI para IA
            residente e Mercado Pago para pagamentos. Todos os logs são auditáveis e visíveis nos
            dashboards operacionais.
          </p>
          <p>
            <strong>Suporte:</strong> envie e-mail para{' '}
            <a
              href={`mailto:${import.meta.env.VITE_SUPPORT_EMAIL ?? 'contato@noaesperanza.com'}`}
              className="text-emerald-300 hover:text-emerald-200"
            >
              {import.meta.env.VITE_SUPPORT_EMAIL ?? 'contato@noaesperanza.com'}
            </a>{' '}
            ou fale pelo WhatsApp das clínicas.
          </p>
        </div>
      </section>
    </div>
  )
}

export default HomePage
