import React, { useState } from 'react'
import NoaAvatar from './components/NoaAvatar'

const sections = [
  { key: 'login', label: 'Login' },
  { key: 'chat', label: 'Chat IMRE' },
  { key: 'upload', label: 'Upload Documento' },
  { key: 'knowledge', label: 'Base de Conhecimento' },
  { key: 'dashboard', label: 'Dashboard' },
]

const SinglePageApp = () => {
  const [section, setSection] = useState('login')
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [knowledge, setKnowledge] = useState<string[]>([
    'Documento Mestre Institucional',
    'Base de Conhecimento',
    'Histórico de Desenvolvimento',
  ])

  // Simula navegação inteligente
  const handleLogin = () => {
    setSection('chat')
  }

  const handleSendChat = () => {
    setResponse(
      input ? `Nôa Esperanza escutou: "${input}"` : 'Por favor, escreva algo para começar.'
    )
    setInput('')
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0])
      setKnowledge([...knowledge, e.target.files[0].name])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col items-center justify-center p-4">
      <nav className="flex gap-4 mb-8">
        {sections.map(s => (
          <button
            key={s.key}
            className={`px-4 py-2 rounded-lg font-bold transition-colors ${section === s.key ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-emerald-300 hover:bg-emerald-700'}`}
            onClick={() => setSection(s.key)}
          >
            {s.label}
          </button>
        ))}
      </nav>
      {section === 'login' && (
        <div className="w-full max-w-md bg-black/70 rounded-2xl shadow-2xl p-8 flex flex-col items-center border border-emerald-700/30 animate-fadein">
          <span className="block text-2xl font-bold text-emerald-400 mb-4">
            O que trouxe você aqui hoje?
          </span>
          <input
            className="w-full px-4 py-2 mb-4 rounded-lg bg-slate-800 border border-emerald-700 text-white"
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold"
            onClick={handleLogin}
          >
            Entrar
          </button>
        </div>
      )}
      {section === 'chat' && (
        <div className="w-full max-w-md bg-black/70 rounded-2xl shadow-2xl p-8 flex flex-col items-center border border-emerald-700/30 animate-fadein">
          <span className="block text-xl font-bold text-emerald-400 mb-4">Chat IMRE</span>
          <textarea
            className="w-full h-20 px-4 py-2 mb-4 rounded-lg bg-slate-800 border border-emerald-700 text-white"
            placeholder="Digite sua dúvida ou relato..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold mb-2"
            onClick={handleSendChat}
          >
            Enviar
          </button>
          {response && (
            <div className="w-full bg-slate-900/80 rounded-xl p-4 text-emerald-300 text-base mt-2 text-center">
              {response}
            </div>
          )}
        </div>
      )}
      {section === 'upload' && (
        <div className="w-full max-w-md bg-black/70 rounded-2xl shadow-2xl p-8 flex flex-col items-center border border-emerald-700/30 animate-fadein">
          <span className="block text-xl font-bold text-emerald-400 mb-4">Upload Documento</span>
          <input type="file" className="mb-4" onChange={handleUpload} />
          {uploadedFile && (
            <div className="text-emerald-300">Arquivo enviado: {uploadedFile.name}</div>
          )}
        </div>
      )}
      {section === 'knowledge' && (
        <div className="w-full max-w-md bg-black/70 rounded-2xl shadow-2xl p-8 flex flex-col items-center border border-emerald-700/30 animate-fadein">
          <span className="block text-xl font-bold text-emerald-400 mb-4">
            Base de Conhecimento
          </span>
          <ul className="w-full text-left text-emerald-300">
            {knowledge.map((doc, idx) => (
              <li key={idx} className="mb-2">
                {doc}
              </li>
            ))}
          </ul>
        </div>
      )}
      {section === 'dashboard' && (
        <div className="w-full max-w-md bg-black/70 rounded-2xl shadow-2xl p-8 flex flex-col items-center border border-emerald-700/30 animate-fadein">
          <span className="block text-2xl font-bold text-emerald-400 mb-4">
            Avaliação Inicial com Nôa Esperanza
          </span>
          <NoaAvatar />
          <div className="mb-4 w-full mt-6">
            <input
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-emerald-700 text-white mb-2"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Digite sua resposta..."
            />
            <button
              className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700"
              onClick={handleSendChat}
            >
              Enviar
            </button>
          </div>
          <div className="w-full text-emerald-300 text-lg min-h-[32px]">{response}</div>
        </div>
      )}
    </div>
  )
}

export default SinglePageApp
