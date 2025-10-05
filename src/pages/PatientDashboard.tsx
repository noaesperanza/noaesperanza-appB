import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clinicalAgentService, PatientProfile, ClinicalSession } from '../services/clinicalAgentService'
import { ClinicalAssessment } from '../components/ClinicalAssessment'

interface PatientDashboardProps {
  addNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  action?: string
  data?: any
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ addNotification }) => {
  const [currentPatient, setCurrentPatient] = useState<PatientProfile | null>(null)
  const [currentSession, setCurrentSession] = useState<ClinicalSession | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'assessment' | 'profile' | 'security'>('chat')
  const [sessionInitialized, setSessionInitialized] = useState(false)
  const [lgpdConsent, setLgpdConsent] = useState(false)

  useEffect(() => {
    // Simular inicialização do paciente (em produção, viria da autenticação)
    initializePatient()
  }, [])

  const initializePatient = async () => {
    try {
      // Simular ID do paciente (em produção, viria do sistema de auth)
      const patientId = 'patient_123'
      
      // Verificar se já tem consentimento LGPD
      const hasConsent = localStorage.getItem('lgpd_consent_patient')
      if (hasConsent) {
        setLgpdConsent(true)
        await startClinicalSession(patientId)
      }
    } catch (error) {
      console.error('Erro ao inicializar paciente:', error)
      addNotification('Erro ao carregar dados do paciente', 'error')
    }
  }

  const startClinicalSession = async (patientId: string) => {
    try {
      const result = await clinicalAgentService.initializePatientSession(patientId, 'avaliacao_inicial')
      
      if (result.success && result.patient && result.session) {
        setCurrentPatient(result.patient)
        setCurrentSession(result.session)
        setSessionInitialized(true)
        
        // Mensagem inicial da Nôa Esperanza
        const welcomeMessage: ChatMessage = {
          id: 'welcome',
          role: 'assistant',
          content: `Olá, ${result.patient.name}! 👋

Sou a Nôa Esperanza, sua assistente médica especializada. Estou aqui para conduzir sua avaliação inicial e esclarecer suas dúvidas.

🔒 **Sua sessão é completamente segura** e está protegida pelas normas de LGPD.

Como posso ajudá-lo hoje?`,
          timestamp: new Date()
        }
        
        setChatMessages([welcomeMessage])
        addNotification('Sessão clínica iniciada com sucesso', 'success')
      } else {
        addNotification(result.error || 'Erro ao iniciar sessão', 'error')
      }
    } catch (error) {
      console.error('Erro ao iniciar sessão clínica:', error)
      addNotification('Erro ao iniciar sessão clínica', 'error')
    }
  }

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !sessionInitialized) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, userMessage])
    const messageToProcess = currentMessage
    setCurrentMessage('')
    setIsTyping(true)

    try {
      const result = await clinicalAgentService.processPatientMessage(messageToProcess)
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.response,
        timestamp: new Date(),
        action: result.action,
        data: result.data
      }

      setChatMessages(prev => [...prev, assistantMessage])

      if (result.securityViolation) {
        addNotification('Operação não permitida em sua sessão', 'warning')
      }

    } catch (error) {
      console.error('Erro ao processar mensagem:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro. Por favor, tente novamente.',
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleLgpdConsent = async () => {
    if (!lgpdConsent) {
      localStorage.setItem('lgpd_consent_patient', 'true')
      localStorage.setItem('lgpd_consent_date', new Date().toISOString())
      setLgpdConsent(true)
      
      // Inicializar sessão após consentimento
      await startClinicalSession('patient_123')
    }
  }

  const handleStartAssessment = () => {
    setActiveTab('assessment')
  }

  const getSessionStatusColor = () => {
    if (!currentSession) return 'bg-gray-500'
    switch (currentSession.status) {
      case 'iniciada': return 'bg-blue-500'
      case 'em_andamento': return 'bg-yellow-500'
      case 'concluida': return 'bg-green-500'
      case 'suspensa': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  if (!lgpdConsent) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800 rounded-xl p-8 max-w-2xl w-full border border-slate-700"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-shield-alt text-white text-2xl"></i>
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-4">
              Consentimento LGPD
            </h1>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Para acessar os serviços médicos da Nôa Esperanza, precisamos do seu consentimento 
              para o processamento de dados pessoais de acordo com a Lei Geral de Proteção de Dados (LGPD).
            </p>

            <div className="bg-slate-700 rounded-lg p-6 mb-6 text-left">
              <h3 className="text-lg font-semibold text-white mb-4">📋 Termos de Consentimento:</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Seus dados serão utilizados exclusivamente para fins médicos</li>
                <li>• Todas as informações são criptografadas e seguras</li>
                <li>• Você pode solicitar exclusão dos dados a qualquer momento</li>
                <li>• Seus dados não serão compartilhados com terceiros</li>
                <li>• Cada avaliação gera um NFT único para rastreabilidade</li>
                <li>• Retenção de dados por 1 ano (renovável)</li>
              </ul>
            </div>

            <button
              onClick={handleLgpdConsent}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              <i className="fas fa-check mr-2"></i>
              Concordo com os Termos LGPD
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <i className="fas fa-user-md text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Dashboard do Paciente</h1>
              <p className="text-sm text-gray-400">
                {currentPatient?.name} • Sessão Segura
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Status da Sessão */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getSessionStatusColor()}`}></div>
              <span className="text-sm text-gray-300">
                {currentSession?.status || 'Iniciando...'}
              </span>
            </div>

            {/* ID da Sessão */}
            <div className="text-xs text-gray-500 bg-slate-700 px-2 py-1 rounded">
              ID: {currentSession?.id.substring(0, 8) || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex border-b border-gray-600 mb-6">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'chat'
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <i className="fas fa-comments mr-2"></i>
            Chat com Nôa
          </button>
          <button
            onClick={() => setActiveTab('assessment')}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'assessment'
                ? 'text-white border-b-2 border-green-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <i className="fas fa-stethoscope mr-2"></i>
            Avaliação Clínica
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'text-white border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <i className="fas fa-user mr-2"></i>
            Meu Perfil
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'security'
                ? 'text-white border-b-2 border-red-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <i className="fas fa-shield-alt mr-2"></i>
            Segurança
          </button>
        </div>

        {/* Conteúdo das Tabs */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 min-h-[600px]">
          {activeTab === 'chat' && (
            <div className="flex flex-col h-[600px]">
              {/* Chat Messages */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                <AnimatePresence>
                  {chatMessages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700 text-white'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        <div className="text-xs opacity-70 mt-2">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-slate-700 text-white p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-gray-400">Nôa está digitando...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-6 border-t border-slate-700">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    placeholder="Digite sua mensagem para a Nôa Esperanza..."
                    className="flex-1 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    disabled={!sessionInitialized}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim() || !sessionInitialized}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'assessment' && (
            <div className="p-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Avaliação Clínica Inicial
                </h2>
                <p className="text-gray-400 mb-6">
                  Sistema baseado no método desenvolvido pelo Dr. Ricardo Valença
                </p>
                <button
                  onClick={handleStartAssessment}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors"
                >
                  <i className="fas fa-rocket mr-2"></i>
                  Iniciar Avaliação
                </button>
              </div>

              {activeTab === 'assessment' && (
                <div className="mt-8">
                  <ClinicalAssessment
                    onComplete={(report, nftHash) => {
                      console.log('Avaliação concluída:', report, nftHash)
                      addNotification('Avaliação clínica concluída com sucesso!', 'success')
                    }}
                    onUpdateKPIs={(stats) => {
                      console.log('KPIs atualizados:', stats)
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Meu Perfil</h2>
              {currentPatient && (
                <div className="space-y-4">
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <h3 className="font-semibold text-white mb-2">Informações Pessoais</h3>
                    <p className="text-gray-300">Nome: {currentPatient.name}</p>
                    <p className="text-gray-300">Email: {currentPatient.email}</p>
                    <p className="text-gray-300">NFT ID: {currentPatient.nftHash}</p>
                  </div>
                  
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <h3 className="font-semibold text-white mb-2">Consentimento LGPD</h3>
                    <p className="text-gray-300">
                      Status: <span className="text-green-400">✓ Ativo</span>
                    </p>
                    <p className="text-gray-300">
                      Data: {new Date(currentPatient.consentDate).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-gray-300">
                      Expira em: {currentPatient.dataRetentionPeriod} dias
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Segurança e Privacidade</h2>
              <div className="space-y-4">
                <div className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">🔒 Sessão Atual</h3>
                  <p className="text-gray-300">ID da Sessão: {currentSession?.id}</p>
                  <p className="text-gray-300">Status: {currentSession?.status}</p>
                  <p className="text-gray-300">Iniciada: {currentSession?.startTime.toLocaleString('pt-BR')}</p>
                </div>
                
                <div className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">🛡️ Proteções Ativas</h3>
                  <ul className="space-y-1 text-gray-300">
                    <li>• Criptografia end-to-end</li>
                    <li>• Verificação de consentimento LGPD</li>
                    <li>• Rastreabilidade via NFT</li>
                    <li>• Logs de segurança</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard
