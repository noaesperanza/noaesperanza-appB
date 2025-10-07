// 🧪 TESTE DE COMPONENTES - HOME NÔA ESPERANZA
// Testa componentes React com Testing Library

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, beforeAll } from 'vitest'
import Home from '../Home'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    userProfile: { name: 'Paciente Teste' },
  }),
}))

// Mock dos serviços
vi.mock('../../services/noaSystemService', () => ({
  noaSystemService: {
    registerNoaConversation: vi.fn().mockResolvedValue(true),
    setUserType: vi.fn().mockResolvedValue(true),
    initializeUserSession: vi.fn().mockResolvedValue(true),
    saveAILearning: vi.fn().mockResolvedValue(true),
    getImreBlock: vi.fn().mockResolvedValue({
      id: 1,
      block_order: 1,
      block_name: 'Abertura Exponencial',
      block_prompt: 'Olá! Eu sou Nôa Esperanza. Por favor, apresente-se também.',
      block_type: 'presentation',
      is_active: true
    }),
    completeClinicalEvaluation: vi.fn().mockResolvedValue({
      id: 'test-nft-id',
      nft_hash: 'abc123def456',
      status: 'generated'
    })
  }
}))

vi.mock('../../services/noaVoiceService', () => ({
  noaVoiceService: {
    speak: vi.fn(),
    startListening: vi.fn().mockReturnValue(true),
    stopListening: vi.fn(),
    stopSpeaking: vi.fn(),
    isSpeechRecognitionAvailable: vi.fn().mockReturnValue(true),
    isCurrentlySpeaking: vi.fn().mockReturnValue(false),
    isSupported: vi.fn().mockReturnValue(true)
  }
}))

vi.mock('../../services/aiLearningService', () => ({
  aiLearningService: {
    saveInteraction: vi.fn(),
    getLearningContext: vi.fn().mockResolvedValue(null)
  }
}))

vi.mock('../../services/adminCommandService', () => ({
  adminCommandService: {
    activateAdminMode: vi.fn().mockResolvedValue(false),
    detectAdminCommand: vi.fn().mockReturnValue(null),
    executeCommand: vi.fn().mockResolvedValue({ success: false })
  }
}))

vi.mock('../../services/identityRecognitionService', () => ({
  identityRecognitionService: {
    detectIdentity: vi.fn().mockResolvedValue({ identified: false }),
    detectDirectCommand: vi.fn().mockResolvedValue(null)
  }
}))

vi.mock('../../services/directCommandProcessor', () => ({
  directCommandProcessor: {
    executeDirectCommand: vi.fn().mockResolvedValue({ success: false })
  }
}))

vi.mock('../../services/avaliacaoClinicaService', () => ({
  avaliacaoClinicaService: {
    iniciarAvaliacao: vi.fn().mockResolvedValue({
      sessionId: 'test-session',
      status: 'in_progress',
      etapa_atual: 'abertura',
      dados: {
        lista_indiciaria: [],
        historia_patologica: [],
        historia_familiar: { mae: [], pai: [] },
        habitos_vida: []
      }
    }),
    registrarApresentacao: vi.fn(),
    registrarRespostas: vi.fn(),
    confirmarAvaliacao: vi.fn(),
    registrarPergunta: vi.fn(),
    gerarNFTIncentivo: vi.fn().mockResolvedValue({ id: 'nft-test' })
  }
}))

vi.mock('../../services/aiSmartLearningService', () => ({
  aiSmartLearningService: {
    buscarAprendizadosSimilares: vi.fn().mockResolvedValue([]),
    gerarRespostaContextualizada: vi.fn().mockResolvedValue(''),
    buscarHistoricoUsuario: vi.fn().mockResolvedValue([]),
    buscarPadroes: vi.fn().mockResolvedValue([])
  }
}))

vi.mock('../../services/conversationModeService', () => ({
  conversationModeService: {
    processarMensagem: vi.fn(async () => ({
      response: 'Mensagem simulada',
      shouldChangeMode: false,
      context: {
        sessionId: 'test-session',
        userId: 'test-uuid-123',
        currentMode: 'explicativo',
        modeStartTime: new Date(),
        contextData: {},
        conversationHistory: [],
        isFirstInteraction: false
      },
      confidence: 1
    })),
    inicializarContexto: vi.fn()
  },
  ConversationMode: {} as any
}))

vi.mock('../../gpt/noaGPT', () => ({
  NoaGPT: vi.fn().mockImplementation(() => ({
    processCommand: vi.fn(async () => 'Olá! Eu sou Nôa Esperanza, assistente médica do MedCanLab.'),
    processCommandWithFineTuned: vi.fn(async () => 'Resposta processada'),
    saveResponse: vi.fn(),
    findSimilarResponse: vi.fn().mockResolvedValue(null)
  }))
}))

vi.mock('../../gpt/clinicalAgent', () => ({
  clinicalAgent: {
    processClinicalConversation: vi.fn().mockResolvedValue({
      response: 'Processo clínico simulado',
      etapa: 'abertura'
    })
  }
}))

vi.mock('../../services/openaiService', () => ({
  openAIService: {
    sendMessage: vi.fn().mockResolvedValue('Resposta OpenAI simulada'),
    streamChatCompletion: vi.fn().mockResolvedValue({ content: 'Resposta OpenAI simulada' })
  }
}))

vi.mock('../../utils/userIntentDetection', () => ({
  default: {
    detectIntent: vi.fn().mockReturnValue({ type: 'general' }),
    extractContext: vi.fn().mockReturnValue({})
  }
}))

vi.mock('../../utils/supabaseTest', () => ({
  testSupabaseConnection: vi.fn()
}))

vi.mock('../../integrations/supabase/client', () => {
  const createResponse = (data: any = null) => Promise.resolve({ data, error: null, status: 200 })
  const builder: any = {
    insert: () => builder,
    upsert: () => builder,
    update: () => builder,
    select: () => builder,
    eq: () => builder,
    ilike: () => builder,
    order: () => builder,
    limit: () => builder,
    maybeSingle: () => createResponse(),
    single: () => createResponse(),
    returns: () => builder,
    in: () => builder,
    range: () => builder
  }

  return {
    supabase: {
      from: () => builder,
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'test-uuid-123', email: 'paciente@test.com', user_metadata: { full_name: 'Paciente Teste' } } },
          error: null
        }),
        getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
        signOut: vi.fn().mockResolvedValue({ error: null }),
        signInWithPassword: vi.fn().mockResolvedValue({ data: { user: { id: 'test-uuid-123' } }, error: null }),
        signUp: vi.fn().mockResolvedValue({ data: { user: { id: 'test-uuid-123' } }, error: null }),
        onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } })
      }
    }
  }
})

vi.mock('../../services/supabaseService', () => ({
  dataService: {
    createClinicalEvaluation: vi.fn().mockResolvedValue({ id: 'test-id' }),
    updateClinicalEvaluation: vi.fn().mockResolvedValue({ id: 'test-id' })
  }
}))

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock do crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: vi.fn(() => 'test-uuid-123')
  }
})

// Mock do SpeechSynthesis
Object.defineProperty(window, 'speechSynthesis', {
  value: {
    speak: vi.fn(),
    cancel: vi.fn(),
    getVoices: vi.fn(() => [])
  }
})

// Mock do SpeechRecognition
Object.defineProperty(window, 'SpeechRecognition', {
  value: vi.fn()
})

Object.defineProperty(window, 'webkitSpeechRecognition', {
  value: vi.fn()
})

beforeAll(() => {
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: vi.fn(),
  })
})

describe('Home Component', () => {
  const mockProps = {
    currentSpecialty: 'neurologia' as any,
    isVoiceListening: false,
    setIsVoiceListening: vi.fn(),
    addNotification: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('Deve renderizar componente inicial', () => {
    render(<Home {...mockProps} />)
    
    // Verifica se elementos principais estão presentes
    expect(screen.getByText('O que trouxe você aqui?')).toBeInTheDocument()
  })

  it('Deve permitir envio de mensagem', async () => {
    render(<Home {...mockProps} />)
    
    const input = screen.getByTestId('chat-input')
    const sendButton = screen.getByTestId('send-button')
    
    // Digita mensagem
    fireEvent.change(input, { target: { value: 'Olá, sou paciente' } })
    
    // Envia mensagem
    fireEvent.click(sendButton)
    
    // Verifica se mensagem foi enviada
    await waitFor(() => {
      expect(screen.getByText('Olá, sou paciente')).toBeInTheDocument()
    })
  })

  it('Deve mostrar apresentação da Nôa após primeira resposta', async () => {
    render(<Home {...mockProps} />)
    
    const input = screen.getByTestId('chat-input')
    const sendButton = screen.getByTestId('send-button')
    
    // Envia primeira mensagem
    fireEvent.change(input, { target: { value: 'Olá, sou paciente' } })
    fireEvent.click(sendButton)
    
    // Aguarda apresentação da Nôa
    await waitFor(() => {
      expect(screen.getByText(/Nôa Esperanza/)).toBeInTheDocument()
    })
  })

  it('Deve mostrar menu de tipos de usuário', async () => {
    render(<Home {...mockProps} />)
    
    const input = screen.getByTestId('chat-input')
    const sendButton = screen.getByTestId('send-button')
    
    // Envia primeira mensagem
    fireEvent.change(input, { target: { value: 'Olá, sou paciente' } })
    fireEvent.click(sendButton)
    
    // Aguarda menu de tipos
    await waitFor(() => {
      expect(screen.getByText(/ALUNO, PROFISSIONAL ou PACIENTE/)).toBeInTheDocument()
    })
  })

  it('Deve processar seleção de tipo de usuário', async () => {
    render(<Home {...mockProps} />)
    
    const input = screen.getByTestId('chat-input')
    const sendButton = screen.getByTestId('send-button')
    
    // Envia primeira mensagem
    fireEvent.change(input, { target: { value: 'Olá, sou paciente' } })
    fireEvent.click(sendButton)
    
    // Aguarda menu
    await waitFor(() => {
      expect(screen.getByText(/ALUNO, PROFISSIONAL ou PACIENTE/)).toBeInTheDocument()
    })
    
    // Seleciona tipo de usuário
    fireEvent.change(input, { target: { value: 'paciente' } })
    fireEvent.click(sendButton)
    
    // Aguarda menu específico
    await waitFor(() => {
      expect(screen.getByText(/MENU PACIENTE/)).toBeInTheDocument()
    })
  })

  it('Deve iniciar avaliação clínica', async () => {
    render(<Home {...mockProps} />)
    
    const input = screen.getByTestId('chat-input')
    const sendButton = screen.getByTestId('send-button')
    
    // Navega até avaliação
    fireEvent.change(input, { target: { value: 'Olá, sou paciente' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText(/ALUNO, PROFISSIONAL ou PACIENTE/)).toBeInTheDocument()
    })
    
    fireEvent.change(input, { target: { value: 'paciente' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText(/MENU PACIENTE/)).toBeInTheDocument()
    })
    
    // Inicia avaliação
    fireEvent.change(input, { target: { value: 'fazer avaliação clínica inicial' } })
    fireEvent.click(sendButton)
    
    // Aguarda explicação do NFT
    await waitFor(() => {
      expect(screen.getByText(/NFT INCENTIVADOR/)).toBeInTheDocument()
    })
  })

  it('Deve processar confirmação de avaliação', async () => {
    render(<Home {...mockProps} />)
    
    const input = screen.getByTestId('chat-input')
    const sendButton = screen.getByTestId('send-button')
    
    // Navega até confirmação
    fireEvent.change(input, { target: { value: 'Olá, sou paciente' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText(/ALUNO, PROFISSIONAL ou PACIENTE/)).toBeInTheDocument()
    })
    
    fireEvent.change(input, { target: { value: 'paciente' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText(/MENU PACIENTE/)).toBeInTheDocument()
    })
    
    fireEvent.change(input, { target: { value: 'fazer avaliação clínica inicial' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText(/NFT INCENTIVADOR/)).toBeInTheDocument()
    })
    
    // Confirma avaliação
    fireEvent.change(input, { target: { value: 'sim' } })
    fireEvent.click(sendButton)
    
    // Aguarda primeira pergunta da avaliação
    await waitFor(() => {
      expect(screen.getByText(/apresente-se/)).toBeInTheDocument()
    })
  })

  it('Deve processar respostas da avaliação IMRE', async () => {
    render(<Home {...mockProps} />)
    
    const input = screen.getByTestId('chat-input')
    const sendButton = screen.getByTestId('send-button')
    
    // Navega até avaliação
    fireEvent.change(input, { target: { value: 'Olá, sou paciente' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText(/ALUNO, PROFISSIONAL ou PACIENTE/)).toBeInTheDocument()
    })
    
    fireEvent.change(input, { target: { value: 'paciente' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText(/MENU PACIENTE/)).toBeInTheDocument()
    })
    
    fireEvent.change(input, { target: { value: 'fazer avaliação clínica inicial' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText(/NFT INCENTIVADOR/)).toBeInTheDocument()
    })
    
    fireEvent.change(input, { target: { value: 'sim' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText(/apresente-se/)).toBeInTheDocument()
    })
    
    // Responde primeira pergunta
    fireEvent.change(input, { target: { value: 'Meu nome é João, tenho 35 anos' } })
    fireEvent.click(sendButton)
    
    // Aguarda próxima pergunta
    await waitFor(() => {
      expect(screen.getByText(/canabis medicinal/)).toBeInTheDocument()
    })
  })

  it('Deve mostrar botão de voz', () => {
    render(<Home {...mockProps} />)
    
    const voiceButton = screen.getByTestId('voice-button')
    expect(voiceButton).toBeInTheDocument()
  })

  it('Deve processar clique no botão de voz', () => {
    render(<Home {...mockProps} />)
    
    const voiceButton = screen.getByTestId('voice-button')
    fireEvent.click(voiceButton)
    
    // Verifica se função de voz foi chamada
    expect(require('../../services/noaVoiceService').noaVoiceService.startListening).toHaveBeenCalled()
  })

  it('Deve mostrar indicador de digitação', async () => {
    render(<Home {...mockProps} />)
    
    const input = screen.getByTestId('chat-input')
    const sendButton = screen.getByTestId('send-button')
    
    // Envia mensagem
    fireEvent.change(input, { target: { value: 'teste' } })
    fireEvent.click(sendButton)
    
    // Verifica se indicador de digitação aparece
    await waitFor(() => {
      expect(screen.getByText(/NOA está pensando/)).toBeInTheDocument()
    })
  })

  it('Deve limpar input após envio', async () => {
    render(<Home {...mockProps} />)
    
    const input = screen.getByTestId('chat-input')
    const sendButton = screen.getByTestId('send-button')
    
    // Envia mensagem
    fireEvent.change(input, { target: { value: 'teste' } })
    fireEvent.click(sendButton)
    
    // Verifica se input foi limpo
    await waitFor(() => {
      expect(input).toHaveValue('')
    })
  })

  it('Deve mostrar mensagens de erro', async () => {
    // Mock de erro
    vi.spyOn(console, 'error').mockImplementation(() => {})
    
    render(<Home {...mockProps} />)
    
    const input = screen.getByTestId('chat-input')
    const sendButton = screen.getByTestId('send-button')
    
    // Simula erro
    fireEvent.change(input, { target: { value: 'erro' } })
    fireEvent.click(sendButton)
    
    // Verifica se sistema continua funcionando
    await waitFor(() => {
      expect(screen.getByText('erro')).toBeInTheDocument()
    })
  })
})
