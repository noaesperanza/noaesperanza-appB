import React, { useState } from 'react'

const LoginPage = () => {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = () => {
    setLoading(true)
    setTimeout(() => {
      setResponse(
        input ? `Nôa Esperanza escutou: "${input}"` : 'Por favor, escreva algo para começar.'
      )
      setLoading(false)
    }, 900)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 animate-fadein">
      <div className="flex flex-col items-center gap-6 mb-8">
        <img
          src="/logo-medcannlab.png"
          alt="Logo MedCaNNLab"
          className="w-44 h-44 mb-2 rounded-2xl shadow-2xl animate-float"
        />
        <img
          src="/logo-noa-esperanza.png"
          alt="Logo Nôa Esperanza"
          className="w-44 h-44 mb-2 rounded-2xl shadow-2xl animate-float"
        />
        <img
          src="/logo-noa-triangulo.gif"
          alt="Triângulo animado"
          className="w-32 h-32 mb-2 animate-spin-slow"
        />
      </div>
      <div className="w-full max-w-md flex flex-col items-center mb-6">
        <span className="block text-3xl font-extrabold text-emerald-400 text-center drop-shadow-lg tracking-tight animate-fadein">
          O que trouxe você aqui hoje?
        </span>
      </div>
      <div className="w-full max-w-md bg-black/70 rounded-2xl shadow-2xl p-8 flex flex-col items-center border border-emerald-700/30 animate-fadein">
        <textarea
          className="w-full h-24 px-4 py-3 bg-slate-800 border border-emerald-700 rounded-xl text-white placeholder-emerald-300 focus:outline-none focus:border-emerald-400 resize-none mb-4 text-lg transition-all duration-200"
          placeholder="Digite sua mensagem..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button
          className="w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white px-4 py-3 rounded-xl font-bold transition-all duration-200 text-lg mb-4 shadow-lg"
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? <span className="animate-pulse">Enviando...</span> : <span>Enviar</span>}
        </button>
        {response && (
          <div className="w-full bg-slate-900/80 rounded-xl p-5 text-emerald-300 text-lg mt-2 text-center shadow-md animate-fadein">
            {response}
          </div>
        )}
        <div className="w-full text-center mt-6">
          <span className="text-xs text-gray-400">
            Seus dados são protegidos e usados apenas para sua jornada clínica.{' '}
            <span className="text-emerald-400 font-semibold">Segurança garantida.</span>
          </span>
        </div>
      </div>
      <style>{`
        .animate-fadein { animation: fadein 1s ease; }
        @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
        .animate-float { animation: float 3s ease-in-out infinite alternate; }
        @keyframes float { from { transform: translateY(0); } to { transform: translateY(-12px); } }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

export default LoginPage
