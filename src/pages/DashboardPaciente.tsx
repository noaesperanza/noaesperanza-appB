import React, { useState } from 'react'

const DashboardPaciente = () => {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<string[]>([])

  const handleSend = () => {
    if (!input.trim()) return
    setMessages([...messages, `Paciente: ${input}`])
    // Simulação de resposta IMRE
    setTimeout(() => {
      setMessages(msgs => [
        ...msgs,
        `Nôa Esperanza: Sua solicitação foi registrada. Para acessar ou preencher a avaliação clínica inicial, clique no botão abaixo.`,
      ])
    }, 900)
    setInput('')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="w-full max-w-xl bg-black/60 rounded-2xl shadow-xl p-8 flex flex-col items-center mt-10">
        <span className="block text-2xl font-bold text-white text-center mb-6">
          Chat IMRE com Nôa Esperanza
        </span>
        <div className="w-full mb-4 min-h-[120px] bg-slate-900/80 rounded-xl p-4 text-emerald-300 text-base">
          {messages.map((msg, idx) => (
            <div key={idx}>{msg}</div>
          ))}
        </div>
        <textarea
          className="w-full h-20 px-4 py-2 bg-slate-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none mb-3 text-base"
          placeholder="Digite ou fale sua dúvida, envie documentos médicos, ou peça uma avaliação clínica inicial..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-lg mb-2"
          onClick={handleSend}
        >
          Enviar
        </button>
        <div className="mt-8 w-full">
          <a
            href="/avaliacao-clinica-inicial"
            className="block w-full text-center text-emerald-400 underline hover:text-emerald-300 text-lg"
          >
            Acessar Avaliação Clínica Inicial
          </a>
        </div>
      </div>
    </div>
  )
}

export default DashboardPaciente
