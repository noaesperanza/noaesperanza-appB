import { Link } from 'react-router-dom'
import { clinics } from '../data/clinics'

const ClinicsPage = () => {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-white">Consultórios integrados</h1>
        <p className="text-sm text-slate-300">
          Escolha uma clínica para visualizar serviços, equipe, diferenciais e canais de contato. As
          informações são sincronizadas com o Supabase e alimentam a base clínica utilizada pelas
          equipes.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {clinics.map(clinic => (
          <article key={clinic.slug} className="premium-card flex h-full flex-col">
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-emerald-200/80">
                  {clinic.doctor}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{clinic.name}</h2>
                <p className="mt-2 text-sm text-slate-300">{clinic.summary}</p>
              </div>
              <div className="grid gap-4 text-sm text-slate-200">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
                    Especialidades
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {clinic.specialties.map(specialty => (
                      <li
                        key={specialty}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
                      >
                        {specialty}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
                    Diferenciais
                  </p>
                  <ul className="mt-2 space-y-2">
                    {clinic.highlights.map(highlight => (
                      <li key={highlight.label} className="flex gap-2 text-sm">
                        <span className="mt-1 text-emerald-300">
                          <i className="fas fa-check" />
                        </span>
                        <div>
                          <p className="font-medium text-white">{highlight.label}</p>
                          <p className="text-xs text-slate-300">{highlight.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <Link
                to={`/clinics/${clinic.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-slate-200 transition hover:bg-white/10"
              >
                Ver detalhes completos
                <i className="fas fa-arrow-right text-xs" />
              </Link>
              <a
                href={`https://wa.me/${clinic.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-emerald-200 hover:bg-emerald-500/20"
              >
                Falar no WhatsApp
                <i className="fab fa-whatsapp text-xs" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default ClinicsPage
