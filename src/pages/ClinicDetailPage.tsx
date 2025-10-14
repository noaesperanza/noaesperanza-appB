import { Link, useParams } from 'react-router-dom'
import { clinics } from '../data/clinics'

const ClinicDetailPage = () => {
  const { clinicSlug } = useParams<{ clinicSlug: string }>()
  const clinic = clinics.find(item => item.slug === clinicSlug)

  if (!clinic) {
    return (
      <div className="premium-card space-y-4 text-center">
        <h1 className="text-2xl font-semibold text-white">Clínica não encontrada</h1>
        <p className="text-sm text-slate-300">
          Não localizamos a clínica solicitada. Verifique o endereço ou volte para a lista geral.
        </p>
        <Link
          to="/clinics"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
        >
          Voltar para clínicas
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <Link
          to="/clinics"
          className="inline-flex items-center gap-2 text-sm text-emerald-300 hover:text-emerald-200"
        >
          <i className="fas fa-arrow-left text-xs" /> Voltar para clínicas
        </Link>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">{clinic.doctor}</p>
          <h1 className="text-3xl font-semibold text-white">{clinic.name}</h1>
          <p className="text-sm text-slate-300">{clinic.introduction}</p>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <article className="premium-card space-y-4">
            <h2 className="text-xl font-semibold text-white">
              Serviços assistidos pela plataforma
            </h2>
            {clinic.services.map(service => (
              <div
                key={service.title}
                className="rounded-xl border border-white/10 bg-slate-900/60 p-4"
              >
                <p className="text-sm font-semibold text-white">{service.title}</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {service.items.map(item => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1 text-emerald-300">
                        <i className="fas fa-circle text-[0.5rem]" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </article>

          <article className="premium-card space-y-4">
            <h2 className="text-xl font-semibold text-white">Equipe clínica</h2>
            <ul className="space-y-3 text-sm text-slate-200">
              {clinic.team.map(member => (
                <li
                  key={member.name}
                  className="rounded-xl border border-white/10 bg-slate-900/60 p-4"
                >
                  <p className="text-sm font-semibold text-white">{member.name}</p>
                  <p className="text-xs text-slate-300">{member.role}</p>
                  <p className="mt-2 text-xs text-slate-400">{member.focus}</p>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <aside className="space-y-6">
          <article className="premium-card space-y-4">
            <h2 className="text-xl font-semibold text-white">Diferenciais e integrações</h2>
            <ul className="space-y-2 text-sm text-slate-300">
              {clinic.highlights.map(highlight => (
                <li key={highlight.label} className="flex gap-3">
                  <span className="mt-1 text-emerald-300">
                    <i className="fas fa-star" />
                  </span>
                  <div>
                    <p className="font-medium text-white">{highlight.label}</p>
                    <p className="text-xs text-slate-300">{highlight.description}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-200">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">Integrações</p>
              <ul className="mt-3 space-y-2">
                {clinic.integrations.map(integration => (
                  <li key={integration.name}>
                    <p className="font-medium text-white">{integration.name}</p>
                    <p className="text-xs text-slate-300">{integration.details}</p>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <article className="premium-card space-y-4 text-sm text-slate-200">
            <h2 className="text-xl font-semibold text-white">Contato</h2>
            <div className="space-y-3">
              <p className="flex items-center gap-3">
                <i className="fas fa-phone text-emerald-300" />
                {clinic.contact.phone}
              </p>
              <p className="flex items-center gap-3">
                <i className="fab fa-whatsapp text-emerald-300" />
                {clinic.contact.whatsapp}
              </p>
              <p className="flex items-center gap-3">
                <i className="fas fa-envelope text-emerald-300" />
                {clinic.contact.email}
              </p>
              <p className="flex items-start gap-3">
                <i className="fas fa-location-dot mt-1 text-emerald-300" />
                <span>{clinic.contact.address}</span>
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">Horários</p>
              <ul className="mt-2 space-y-1">
                {clinic.contact.schedule.map(schedule => (
                  <li key={schedule} className="text-xs text-slate-300">
                    {schedule}
                  </li>
                ))}
              </ul>
            </div>
            <a
              href={`https://wa.me/${clinic.contact.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200 hover:bg-emerald-500/20"
            >
              Agendar atendimento
              <i className="fas fa-arrow-up-right-from-square text-xs" />
            </a>
          </article>
        </aside>
      </section>
    </div>
  )
}

export default ClinicDetailPage
