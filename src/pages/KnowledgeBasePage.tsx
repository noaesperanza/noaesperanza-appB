import { useState } from 'react'
import { knowledgeBase, type KnowledgeAudience } from '../data/knowledgeBase'

const filters: Array<{ id: KnowledgeAudience | 'all'; label: string }> = [
  { id: 'all', label: 'Todas' },
  { id: 'shared', label: 'Compartilhada' },
  { id: 'ricardo', label: 'Dr. Ricardo Valença' },
  { id: 'eduardo', label: 'Dr. Eduardo Favaret' },
]

const KnowledgeBasePage = () => {
  const [activeFilter, setActiveFilter] = useState<KnowledgeAudience | 'all'>('all')

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold text-white">Base clínica integrada</h1>
        <p className="text-sm text-slate-300">
          Documentos, protocolos e materiais operacionais utilizados pelos consultórios do Dr.
          Ricardo Valença e do Dr. Eduardo Favaret. As atualizações são versionadas no Supabase e
          aplicadas nos fluxos de IA residente.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          {filters.map(filter => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={`rounded-full border px-4 py-2 transition ${
                activeFilter === filter.id
                  ? 'border-emerald-400/60 bg-emerald-500/20 text-emerald-100'
                  : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </header>

      <div className="space-y-8">
        {knowledgeBase.map(category => {
          const articles = category.articles.filter(article =>
            activeFilter === 'all' ? true : article.audience === activeFilter
          )

          if (articles.length === 0) {
            return null
          }

          return (
            <section key={category.id} className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
                  {category.title}
                </p>
                <h2 className="text-xl font-semibold text-white">{category.description}</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {articles.map(article => (
                  <article
                    key={article.id}
                    className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-sm text-slate-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-base font-semibold text-white">{article.title}</h3>
                        <p className="mt-2 text-sm text-slate-300">{article.summary}</p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                        {article.audience === 'shared'
                          ? 'Compartilhada'
                          : article.audience === 'ricardo'
                            ? 'Dr. Ricardo'
                            : 'Dr. Eduardo'}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      {article.tags.map(tag => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/5 bg-white/5 px-3 py-1"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 text-xs text-slate-400">
                      Atualizado em {new Date(article.lastUpdate).toLocaleDateString('pt-BR')}
                    </p>
                    {article.link ? (
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-xs text-emerald-300 hover:text-emerald-200"
                      >
                        Abrir documento
                        <i className="fas fa-arrow-up-right-from-square" />
                      </a>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

export default KnowledgeBasePage
