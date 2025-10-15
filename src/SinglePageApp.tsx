import React from 'react'
import { useState } from 'react'
import PremiumFrame from './components/PremiumFrame'
import NoaAvatar from './components/NoaAvatar'

const MENU = [
  { key: 'clinica', label: 'Clínica' },
  { key: 'cursos', label: 'Cursos' },
  { key: 'pesquisa', label: 'Pesquisa' },
]
const SinglePageApp = () => {
  const [section, setSection] = useState('login')
  const [ambiente, setAmbiente] = useState('clinica')

  // Menu superior
  const renderMenu = () => (
    <nav className="w-full flex justify-center items-center py-4 gap-8 bg-gradient-to-r from-gray-900 via-purple-900 to-amber-600 shadow-lg">
      {MENU.map(item => (
        <button
          key={item.key}
          className={`px-6 py-2 rounded-2xl font-bold text-lg transition shadow-md ${ambiente === item.key ? 'bg-green-700 text-white' : 'bg-gray-800 text-yellow-200 hover:bg-green-800'}`}
          onClick={() => setAmbiente(item.key)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )

  // Login decide ambiente
  if (section === 'login') {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-0"
        style={{
          background: 'linear-gradient(120deg, #0f172a 0%, #0e7490 40%, #9333ea 80%, #f59e0b 100%)',
        }}
      >
        {renderMenu()}
        <div className="w-full flex flex-col items-center justify-center min-h-[60vh]">
          <img
            src="/logo-noa-triangulo.gif"
            alt="Logo Nôa Esperanza"
            className="w-44 h-44 mb-8 rounded-full shadow-[0_0_40px_10px_rgba(245,158,11,0.3)] border-4 border-yellow-400"
          />
          <span className="block text-5xl font-extrabold text-green-400 mb-4 tracking-tight drop-shadow-lg">
            MEDCANLAB
          </span>
          <span className="block text-lg font-semibold text-white mb-6">
            MedCanLab @ Power By Nôa Esperanza
            <br />A revolução da medicina digital com inteligência artificial especializada
          </span>
          <div className="flex gap-6 mb-8">
            <button
              className="px-6 py-4 rounded-2xl bg-blue-700 text-white font-bold text-xl shadow-lg hover:scale-105 transition"
              onClick={() => setSection(ambiente)}
            >
              Entrar
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Dashboard do paciente (Clínica)
  if (section === 'clinica') {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-0"
        style={{
          background: 'linear-gradient(120deg, #0f172a 0%, #0e7490 40%, #9333ea 80%, #f59e0b 100%)',
        }}
      >
        {renderMenu()}
        <PremiumFrame>
          <div className="w-full flex flex-col items-center justify-center mt-6">
            <span className="block text-2xl font-bold text-green-400 mb-4">
              Avaliação Clínica Inicial
            </span>
            {/* NoaAvatar aqui, integrando roteiro TriagemClinica */}
            <NoaAvatar />
          </div>
        </PremiumFrame>
      </div>
    )
  }

  // Dashboard Cursos
  if (section === 'cursos') {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-0"
        style={{
          background: 'linear-gradient(120deg, #0f172a 0%, #0e7490 40%, #9333ea 80%, #f59e0b 100%)',
        }}
      >
        {renderMenu()}
        <PremiumFrame>
          <div className="w-full flex flex-col items-center justify-center mt-6">
            <span className="block text-2xl font-bold text-yellow-400 mb-4">
              Ambiente de Cursos
            </span>
            <div className="text-white text-lg">
              Em breve: cursos, lições e progresso educacional.
            </div>
          </div>
        </PremiumFrame>
      </div>
    )
  }

  // Dashboard Pesquisa
  if (section === 'pesquisa') {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-0"
        style={{
          background: 'linear-gradient(120deg, #0f172a 0%, #0e7490 40%, #9333ea 80%, #f59e0b 100%)',
        }}
      >
        {renderMenu()}
        <PremiumFrame>
          <div className="w-full flex flex-col items-center justify-center mt-6">
            <span className="block text-2xl font-bold text-purple-400 mb-4">
              Ambiente de Pesquisa
            </span>
            <div className="text-white text-lg">
              Em breve: projetos, relatórios e ferramentas de pesquisa.
            </div>
          </div>
        </PremiumFrame>
      </div>
    )
  }
  return null
}

export default SinglePageApp
