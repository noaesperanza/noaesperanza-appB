import { useEffect, useRef, useState } from 'react'
import type { Specialty } from '../App'
import { noaSystemService } from '../services/noaSystemService'
import { noaVoiceService } from '../services/noaVoiceService'
import { conversationModeService } from '../services/conversationModeService'
import { aiLearningService } from '../services/aiLearningService'

interface HomeProps {
  currentSpecialty: Specialty
  isVoiceListening: boolean
  setIsVoiceListening: (listening: boolean) => void
  addNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void
}

interface Message {
  id: string
  sender: 'user' | 'noa'
  content: string
}

const Home = ({
  currentSpecialty,
  isVoiceListening,
  setIsVoiceListening,
  addNotification,
}: HomeProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bootstrapConversation = async () => {
      try {
        await noaSystemService.initializeUserSession('paciente')
        const imreBlock = await noaSystemService.getImreBlock(1)
        if (imreBlock?.block_prompt) {
          setMessages([
            {
              id: crypto.randomUUID(),
              sender: 'noa',
              content: imreBlock.block_prompt,
            },
          ])
        }
      } catch (error) {
        console.error(error)
        addNotification('Não foi possível iniciar a conversa com a Nôa.', 'error')
      }
    }

    bootstrapConversation()
  }, [addNotification])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    const trimmed = inputValue.trim()
    if (!trimmed) {
      return
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      content: trimmed,
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      const result = await conversationModeService.processarMensagem(
        trimmed,
        'public-session',
        'public-user'
      )

      const response = result?.response || 'Estou analisando o seu caso e retornarei em instantes.'

      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: 'noa',
          content: response,
        },
      ])

      await aiLearningService.saveInteraction(trimmed, response, currentSpecialty)
    } catch (error) {
      console.error(error)
      addNotification('Erro ao processar a mensagem. Tente novamente.', 'error')
    } finally {
      setIsTyping(false)
    }
  }

  const handleVoiceToggle = () => {
    if (!isVoiceListening) {
      noaVoiceService.startListening(() => {})
      setIsVoiceListening(true)
    } else {
      noaVoiceService.stopListening()
      setIsVoiceListening(false)
    }
  }

  return (
    <div className="flex h-full flex-col bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-900/60 p-4">
        <h1 className="text-lg font-semibold">Assistente clínica da Nôa Esperanza</h1>
        <p className="text-xs text-slate-400">Especialidade atual: {currentSpecialty}</p>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              data-testid={message.sender === 'noa' ? 'ai-message' : 'user-message'}
              className={`w-full rounded-2xl border border-white/5 bg-slate-900/70 p-4 text-sm leading-relaxed ${
                message.sender === 'noa' ? 'text-emerald-100' : 'text-slate-200'
              }`}
            >
              {message.content}
            </div>
          ))}
          {isTyping && (
            <div
              data-testid="typing-indicator"
              className="w-full rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100"
            >
              Nôa está analisando sua mensagem...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="border-t border-white/10 bg-slate-900/60 p-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            data-testid="voice-button"
            onClick={handleVoiceToggle}
            className={`rounded-full border border-emerald-500/40 px-4 py-2 text-sm transition ${
              isVoiceListening
                ? 'bg-emerald-500 text-emerald-950'
                : 'text-emerald-200 hover:bg-emerald-500/10'
            }`}
          >
            {isVoiceListening ? 'Parar escuta' : 'Ativar voz'}
          </button>
          <input
            data-testid="chat-input"
            type="text"
            value={inputValue}
            onChange={event => setInputValue(event.target.value)}
            className="flex-1 rounded-full border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
            placeholder="Digite sua mensagem para a Nôa"
          />
          <button
            type="button"
            data-testid="send-button"
            onClick={handleSendMessage}
            className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
          >
            Enviar
          </button>
        </div>
      </footer>
    </div>
  )
}

export default Home
