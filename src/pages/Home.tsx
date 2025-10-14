import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { Specialty } from '../App'
import { noaVoiceService } from '../services/noaVoiceService'
import { openAIService, type ChatMessage } from '../services/openaiService'

interface HomeProps {
  currentSpecialty: Specialty | string
  isVoiceListening: boolean
  setIsVoiceListening: (listening: boolean) => void
  addNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void
}

type MessageSender = 'user' | 'noa'

interface Message {
  id: string
  sender: MessageSender
  content: string
  timestamp: Date
}

const generateMessageId = () => {
  if (typeof globalThis.crypto !== 'undefined' && 'randomUUID' in globalThis.crypto) {
    return globalThis.crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const createMessage = (content: string, sender: MessageSender): Message => ({
  id: generateMessageId(),
  sender,
  content,
  timestamp: new Date(),
})

const Home = ({
  currentSpecialty,
  isVoiceListening,
  setIsVoiceListening,
  addNotification,
}: HomeProps) => {
  const isMountedRef = useRef(true)
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const initialNoaMessage = useMemo(() => {
    const specialtyName = typeof currentSpecialty === 'string' ? currentSpecialty : 'paciente'
    return `Olá! Eu sou Nôa Esperanza e estou aqui para ajudar você${
      specialtyName ? ` com sua jornada em ${specialtyName}` : ''
    }. Como posso te acompanhar hoje?`
  }, [currentSpecialty])

  const [messages, setMessages] = useState<Message[]>(() => [
    createMessage(initialNoaMessage, 'noa'),
  ])

  useEffect(() => {
    return () => {
      isMountedRef.current = false
      noaVoiceService.stopListening()
    }
  }, [])

  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 0 || prev[0].sender !== 'noa') {
        return [createMessage(initialNoaMessage, 'noa'), ...prev]
      }

      const [, ...rest] = prev
      return [createMessage(initialNoaMessage, 'noa'), ...rest]
    })
  }, [initialNoaMessage])

  const handleVoiceResult = useCallback(
    (result: { transcript: string; isFinal: boolean }) => {
      if (!result) return

      if (result.transcript) {
        setInputMessage(result.transcript)
      }

      if (result.isFinal) {
        noaVoiceService.stopListening()
        setIsVoiceListening(false)
      }
    },
    [setIsVoiceListening]
  )

  const handleVoiceError = useCallback(
    (error: string) => {
      addNotification(error || 'Não foi possível iniciar o reconhecimento de voz.', 'error')
      setIsVoiceListening(false)
    },
    [addNotification, setIsVoiceListening]
  )

  const handleVoiceClick = useCallback(() => {
    try {
      if (isVoiceListening) {
        noaVoiceService.stopListening()
        setIsVoiceListening(false)
        return
      }

      const started = noaVoiceService.startListening(handleVoiceResult, handleVoiceError)
      if (started) {
        setIsVoiceListening(true)
      } else {
        addNotification('Não foi possível iniciar o reconhecimento de voz.', 'error')
      }
    } catch (error) {
      console.error(error)
      addNotification('Ocorreu um erro ao iniciar o reconhecimento de voz.', 'error')
    }
  }, [addNotification, handleVoiceError, handleVoiceResult, isVoiceListening, setIsVoiceListening])

  const handleSendMessage = useCallback(async () => {
    const trimmedMessage = inputMessage.trim()
    if (!trimmedMessage) {
      return
    }

    const userMessage = createMessage(trimmedMessage, 'user')
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    const chatHistory: ChatMessage[] = [
      { role: 'system', content: 'Você é Nôa Esperanza, assistente médica empática e acolhedora.' },
      { role: 'user', content: trimmedMessage },
    ]

    try {
      const response = await openAIService.sendMessage(chatHistory)
      if (isMountedRef.current && response) {
        setMessages(prev => [...prev, createMessage(response, 'noa')])
      }
    } catch (error) {
      console.error(error)
      addNotification('Não foi possível obter uma resposta da Nôa no momento.', 'error')
    } finally {
      if (isMountedRef.current) {
        setIsTyping(false)
      }
    }
  }, [addNotification, inputMessage])

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      await handleSendMessage()
    },
    [handleSendMessage]
  )

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex-1 overflow-y-auto rounded-lg border border-white/10 bg-black/40 p-4 text-white">
        {messages.map(message => (
          <div
            key={message.id}
            data-testid={message.sender === 'noa' ? 'ai-message' : 'user-message'}
            className={`mb-3 flex ${message.sender === 'noa' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                message.sender === 'noa'
                  ? 'bg-emerald-500/20 text-emerald-100'
                  : 'bg-white/10 text-white'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="text-xs italic text-emerald-200" data-testid="typing-indicator">
            Nôa está digitando...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleVoiceClick}
            data-testid="voice-button"
            className={`rounded-full border px-4 py-2 text-sm transition ${
              isVoiceListening
                ? 'border-emerald-400 text-emerald-300'
                : 'border-white/20 text-white'
            }`}
          >
            {isVoiceListening ? 'Parar Voz' : 'Falar com a Nôa'}
          </button>
          <input
            value={inputMessage}
            onChange={event => setInputMessage(event.target.value)}
            data-testid="chat-input"
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-white/40 focus:border-emerald-400 focus:outline-none"
            placeholder="Digite sua mensagem"
          />
          <button
            type="submit"
            data-testid="send-button"
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-400"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  )
}

export default Home
