import React from 'react'

const DashboardAluno = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="w-full max-w-xl bg-black/60 rounded-2xl shadow-xl p-8 flex flex-col items-center mt-10">
        <span className="block text-2xl font-bold text-white text-center mb-6">
          Dashboard Aluno
        </span>
        <div className="w-full bg-slate-900/80 rounded-xl p-4 text-emerald-300 text-base mb-4">
          Bem-vindo ao painel do aluno. Aqui você acompanha pesquisas, KPIs e interage com a equipe.
        </div>
      </div>
    </div>
  )
}

export default DashboardAluno
