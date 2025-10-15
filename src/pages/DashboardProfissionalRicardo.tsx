import React from 'react'

const DashboardProfissionalRicardo = () => {
  // Simulação de dados recebidos
  const relatorios = [
    {
      paciente: 'Paciente Z',
      descricao: 'Relatório da avaliação clínica inicial',
      nft: 'NFT hash: 0xB7C8D9...',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="w-full max-w-2xl bg-black/60 rounded-2xl shadow-xl p-8 flex flex-col items-center mt-10">
        <span className="block text-2xl font-bold text-white text-center mb-6">
          Consultório Dr. Ricardo Valença
        </span>
        <div className="w-full bg-slate-900/80 rounded-xl p-4 text-emerald-300 text-base mb-4">
          <div className="mb-2 font-semibold text-lg text-emerald-400">
            Relatórios recebidos dos pacientes:
          </div>
          {relatorios.map((r, idx) => (
            <div key={idx} className="bg-slate-800 rounded-lg p-3 mb-2">
              <div className="font-bold">{r.paciente}</div>
              <div>{r.descricao}</div>
              <div className="text-xs text-emerald-400">{r.nft}</div>
            </div>
          ))}
        </div>
        <div className="w-full bg-slate-900/80 rounded-xl p-4 text-blue-300 text-base mb-4">
          <div className="mb-2 font-semibold text-lg text-blue-400">KPIs Interativos</div>
          <div className="flex gap-4">
            <div className="bg-blue-800 rounded-lg p-3 flex-1">Pacientes ativos: 8</div>
            <div className="bg-blue-800 rounded-lg p-3 flex-1">Pesquisas em andamento: 2</div>
            <div className="bg-blue-800 rounded-lg p-3 flex-1">Relatórios recebidos: 4</div>
          </div>
        </div>
        <div className="w-full bg-green-900/80 rounded-xl p-4 text-green-300 text-base">
          <div className="mb-2 font-semibold text-lg text-green-400">
            Med CannLab - Centro de Pesquisa
          </div>
          <div>
            Interaja com o Dr. Eduardo Faveret e equipe por aqui, com segurança e IA residente.
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardProfissionalRicardo
