import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import GPTPBuilder from '../components/GPTPBuilder'
import { useState, useEffect } from 'react'
import { supabase } from '../integrations/supabase/client'

interface AdminDashboardProps {
  addNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void
}

const AdminDashboard = ({ addNotification }: AdminDashboardProps) => {
  const [totalAssessments, setTotalAssessments] = useState<number>(0)

  const loadAssessmentsKPI = async () => {
    try {
      // Tenta via Supabase
      const { count, error } = await supabase
        .from('avaliacoes_iniciais')
        .select('*', { count: 'exact', head: true })
      if (!error && typeof count === 'number') {
        setTotalAssessments(count)
        return
      }
    } catch {}
    // Fallback local
    const localTotal = Number(localStorage.getItem('kpi_total_assessments') || '0')
    setTotalAssessments(localTotal)
  }

  useEffect(() => {
    addNotification('GPT Builder carregado - Sistema administrativo ativo', 'success')
    loadAssessmentsKPI()
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
        {/* KPIs Rápidos */}
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-700 rounded-lg p-3 border border-slate-600">
            <div className="text-xs text-gray-300">Avaliações Clínicas Iniciais</div>
            <div className="text-2xl font-bold text-white">{totalAssessments}</div>
            <div className="text-[10px] text-gray-400">Total acumulado</div>
          </div>
        </div>
        <div className="mt-3 flex gap-2 justify-center">
          <Link to="/app/paciente" className="text-xs text-green-400 hover:text-green-300">
            <i className="fas fa-clipboard-list mr-1"></i>
            Avaliação Clínica Inicial (Paciente)
          </Link>
          <Link to="/app/avaliacao-inicial" className="text-xs text-blue-400 hover:text-blue-300">
            <i className="fas fa-stethoscope mr-1"></i>
            Acessar Avaliação (rota direta)
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