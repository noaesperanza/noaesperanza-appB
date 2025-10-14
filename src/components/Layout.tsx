import { Link, NavLink, Outlet } from 'react-router-dom'
import { clinics } from '../data/clinics'

const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL ?? 'contato@noaesperanza.com'
const contactPhone = import.meta.env.VITE_CONTACT_PHONE ?? '+55 (81) 4002-8922'

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between">
          <Link to="/" className="flex items-center gap-3 text-left">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/40 bg-emerald-500/10">
              <i className="fas fa-clinic-medical text-lg text-emerald-300" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-widest text-emerald-200/70">Nôa Esperanza</p>
              <p className="text-base font-semibold text-white">Plataforma clínica integrada</p>
            </div>
          </Link>
          <nav className="flex flex-wrap items-center gap-2 text-sm">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-item ${isActive ? 'active' : 'inactive'}`}
            >
              Início
            </NavLink>
            <NavLink
              to="/clinics"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : 'inactive'}`}
            >
              Clínicas
            </NavLink>
            <NavLink
              to="/knowledge-base"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : 'inactive'}`}
            >
              Base clínica
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : 'inactive'}`}
            >
              Sobre
            </NavLink>
            <div className="hidden h-6 w-px bg-white/10 sm:block" aria-hidden />
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-slate-200 transition hover:bg-white/10"
            >
              Login
            </Link>
            <Link to="/chat" className="premium-button">
              Abrir chat
              <i className="fas fa-robot text-xs" />
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-6 py-10">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-white/10 bg-slate-950/90 py-8">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 md:grid-cols-4">
          <div className="space-y-3 text-sm text-slate-300">
            <p className="text-xs uppercase tracking-widest text-emerald-200/70">
              Operação integrada
            </p>
            <p>
              Clínicas do Dr. Ricardo Valença e do Dr. Eduardo Favaret com a mesma base de IA, dados
              e pagamentos.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Consultórios</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {clinics.map(clinic => (
                <li key={clinic.slug}>
                  <Link to={`/clinics/${clinic.slug}`} className="hover:text-emerald-200">
                    {clinic.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Contato</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>
                <a href={`tel:${contactPhone}`} className="hover:text-emerald-200">
                  {contactPhone}
                </a>
              </li>
              <li>
                <a href={`mailto:${supportEmail}`} className="hover:text-emerald-200">
                  {supportEmail}
                </a>
              </li>
              <li>
                <Link to="/knowledge-base" className="hover:text-emerald-200">
                  Base clínica
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3 text-sm text-slate-300">
            <p className="text-sm font-semibold text-white">Acesso rápido</p>
            <ul className="space-y-2">
              <li>
                <Link to="/chat" className="hover:text-emerald-200">
                  Chat clínico protegido
                </Link>
              </li>
              <li>
                <Link to="/app/paciente" className="hover:text-emerald-200">
                  Dashboard de pacientes
                </Link>
              </li>
              <li>
                <Link to="/app/checkout" className="hover:text-emerald-200">
                  Pagamentos Mercado Pago
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Nôa Esperanza. Operação conectada para Dr. Ricardo Valença e
          Dr. Eduardo Favaret.
        </div>
      </footer>
    </div>
  )
}

export default Layout
