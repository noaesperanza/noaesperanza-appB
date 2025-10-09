import { useState, useRef, useEffect } from 'react'
import { codexService, type CodexMessage } from '../services/codexService'
import { elevenLabsService } from '../services/elevenLabsService'
import { aiLearningService } from '../services/aiLearningService'
import { cleanTextForAudio } from '../utils/textUtils'

interface Message {
  id: string
  message: string
  sender: 'user' | 'noa'
  timestamp: Date
  options?: string[]
}

interface UseNoaChatProps {
  userMemory: any
  addNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void
}

export const useNoaChat = ({ userMemory, addNotification }: UseNoaChatProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)

  // Resposta real da NOA usando Codex
  const getNoaResponse = async (userMessage: string) => {
    setIsTyping(true)

    try {
      // Obter contexto de aprendizado da IA
      const learningContext = await aiLearningService.getLearningContext(userMessage)

      const conversationHistory: CodexMessage[] = messages
        .filter(msg => msg.sender === 'user' || msg.sender === 'noa')
        .map(msg => ({
          role: msg.sender === 'user' ? ('user' as const) : ('assistant' as const),
          content: msg.message,
        }))
        .slice(-8)

      const response = await codexService.getNoaResponse(userMessage, conversationHistory, {
        route: 'chat',
        userContext: {
          name: userMemory.name,
          role: userMemory.role,
          specialty: userMemory.specialty,
          sessionId: userMemory.sessionId,
          userId: userMemory.id,
        },
        metadata: {
          learningContext,
          lastVisit: userMemory.lastVisit || null,
        },
      })

      // Opções padrão para conversas gerais
      const defaultOptions = [
        'Avaliação inicial',
        'Fazer uma pergunta sobre saúde',
        'Como você está?',
      ]

      const noaMessage: Message = {
        id: crypto.randomUUID(),
        message: response,
        sender: 'noa',
        timestamp: new Date(),
        options: defaultOptions,
      }

      setMessages(prev => [...prev, noaMessage])

      // 🧠 APRENDIZADO AUTOMÁTICO - IA aprende com a conversa
      aiLearningService.saveInteraction(userMessage, response, 'general')

      // ElevenLabs gera áudio
      await playNoaAudioWithText(response)
    } catch (error) {
      console.error('Erro ao obter resposta da NOA:', error)
    } finally {
      setIsTyping(false)
    }
  }

  // Função para tocar áudio da NOA com texto sincronizado
  const playNoaAudioWithText = async (text: string) => {
    try {
      // Se já está tocando áudio, não toca outro
      if (audioPlaying) {
        return
      }

      // Para o áudio atual se estiver tocando
      if (currentAudioRef.current) {
        currentAudioRef.current.pause()
        currentAudioRef.current = null
      }

      // Remove markdown e formatação para o áudio, preservando acentos
      const cleanText = cleanTextForAudio(text)

      const audioResponse = await elevenLabsService.textToSpeech(cleanText)

      // Cria e toca o áudio
      const audioBlob = new Blob([audioResponse.audio], { type: 'audio/mpeg' })
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)

      // Armazena referência do áudio atual
      currentAudioRef.current = audio
      setAudioPlaying(true)

      audio
        .play()
        .then(() => {
          console.log('🎵 Áudio tocando com sucesso!')
        })
        .catch(error => {
          console.log('❌ Erro ao tocar áudio:', error)
          setAudioPlaying(false)
        })

      // Limpa a URL e referência após tocar
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl)
        currentAudioRef.current = null
        setAudioPlaying(false)
      }

      // Limpa referência se houver erro
      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl)
        currentAudioRef.current = null
        setAudioPlaying(false)
      }
    } catch (error) {
      console.log('❌ Erro ao gerar áudio da NOA:', error)
      setAudioPlaying(false)
    }
  }

  const handleSendMessage = (messageText: string) => {
    if (!messageText.trim()) return

    // Adiciona mensagem do usuário
    const userMessage: Message = {
      id: crypto.randomUUID(),
      message: messageText,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])

    // Obtém resposta real da NOA
    getNoaResponse(messageText)
  }

  return {
    messages,
    isTyping,
    audioPlaying,
    currentAudioRef,
    handleSendMessage,
    playNoaAudioWithText,
  }
}
