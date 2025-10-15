import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-[200] h-16 bg-gray-900 shadow-lg border-b border-white/20">
      <div className="flex items-center justify-between h-full px-6 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 rounded-lg flex items-center justify-center overflow-hidden">
            <img
              src="/logo-noa-triangulo.gif"
              alt="MedCanLab"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-lg font-bold text-white drop-shadow-md">MedCanLab</div>
            <div className="text-xs text-yellow-100 drop-shadow-sm">Plataforma Clínica</div>
          </div>
        </div>
        {/* Rotas principais da plataforma */}
        <nav className="flex gap-2">
          <Link to="/app/paciente" className="nav-item text-xs px-3 py-2">
            Paciente
          </Link>
          <Link to="/app/profissional" className="nav-item text-xs px-3 py-2">
            Profissional
          </Link>
          <Link to="/app/aluno" className="nav-item text-xs px-3 py-2">
            Aluno
          </Link>
          <Link to="/app/avaliacao-inicial" className="nav-item text-xs px-3 py-2">
            Avaliação
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
