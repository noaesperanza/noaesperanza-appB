import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import GPTPBuilder from '../components/GPTPBuilder'

interface AdminDashboardProps {
  addNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void
}

const AdminDashboard = ({ addNotification }: AdminDashboardProps) => {
  useEffect(() => {
    addNotification('GPT Builder carregado - Sistema administrativo ativo', 'success')
  }, [addNotification])

  return (
    <div className="h-full overflow-hidden bg-slate-900">
            {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-block text-blue-400 hover:text-blue-300">
                  <i className="fas fa-arrow-left text-sm"></i> Voltar
                </Link>
          <div className="text-center">
            <h1 className="text-xl font-bold text-white">Dashboard Administrativo</h1>
            <p className="text-gray-400 text-sm">GPT Builder - Sistema Nôa Esperanza</p>
          </div>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
        <div className="mt-3 flex gap-2 justify-center">
          <Link to="/app/paciente" className="text-xs text-green-400 hover:text-green-300">
            <i className="fas fa-clipboard-list mr-1"></i>
            Avaliação Clínica Inicial (Paciente)
          </Link>
        </div>
      </div>

      {/* GPT Builder Full Screen */}
      <div className="h-full">
        <GPTPBuilder />
        </div>
    </div>
  )
}

export default AdminDashboard