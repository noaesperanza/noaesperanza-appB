import React, { useState } from 'react'

// Componente de chat simples para IA Residente (Nôa Esperanza)
const IAResidente: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ sender: string; text: string }>>([])
  const [input, setInput] = useState('')

  const sendMessage = () => {
    if (!input.trim()) return
    setMessages([...messages, { sender: 'Você', text: input }])
    // Simulação de resposta da IA
    setTimeout(() => {
      setMessages(msgs => [
        ...msgs,
        { sender: 'Nôa Esperanza', text: 'Estou aqui para te ajudar! (resposta simulada)' },
      ])
    }, 800)
    setInput('')
  }

  return (
    <div
      style={{
        maxWidth: 400,
        margin: '0 auto',
        background: '#18181b',
        borderRadius: 12,
        padding: 16,
        color: '#fff',
      }}
    >
      <h2 style={{ marginBottom: 12 }}>Chat com Nôa Esperanza</h2>
      <div style={{ minHeight: 120, marginBottom: 12 }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{ marginBottom: 8, textAlign: msg.sender === 'Você' ? 'right' : 'left' }}
          >
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 6,
            border: '1px solid #333',
            background: '#222',
            color: '#fff',
          }}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          onKeyDown={e => {
            if (e.key === 'Enter') sendMessage()
          }}
        />
        <button
          style={{
            padding: '8px 16px',
            borderRadius: 6,
            background: '#10b981',
            color: '#fff',
            border: 'none',
          }}
          onClick={sendMessage}
        >
          Enviar
        </button>
      </div>
    </div>
  )
}

export default IAResidente
