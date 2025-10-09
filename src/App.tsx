import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect, useCallback, lazy, Suspense } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import Header from './components/Header'
// Sidebar removido - chat limpo sem sidebar
import HomeFooter from './components/HomeFooter'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

// Lazy load components for better code splitting
const HomeNew = lazy(() => import('./pages/HomeNew'))
const DashboardMedico = lazy(() => import('./pages/DashboardMedico'))
const DashboardPaciente = lazy(() => import('./pages/DashboardPaciente'))
const DashboardProfissional = lazy(() => import('./pages/DashboardProfissional'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const IntegratedIDE = lazy(() => import('./components/IntegratedIDE'))
const RelatorioNarrativo = lazy(() => import('./pages/RelatorioNarrativo'))
const Configuracoes = lazy(() => import('./pages/Configuracoes'))
const Perfil = lazy(() => import('./pages/Perfil'))
const PaymentPage = lazy(() => import('./pages/PaymentPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const NotFound = lazy(() => import('./pages/NotFound'))
const MeusExames = lazy(() => import('./pages/MeusExames'))
const Prescricoes = lazy(() => import('./pages/Prescricoes'))
const Prontuario = lazy(() => import('./pages/Prontuario'))
const PagamentosPaciente = lazy(() => import('./pages/PagamentosPaciente'))
const Ensino = lazy(() => import('./pages/Ensino'))
const Pesquisa = lazy(() => import('./pages/Pesquisa'))
const MedCannLab = lazy(() => import('./pages/MedCannLab'))
const AvaliacaoClinicaInicial = lazy(() => import('./pages/AvaliacaoClinicaInicial'))
const TriagemClinica = lazy(() => import('./pages/triagem'))

export type Specialty = 'rim' | 'neuro' | 'cannabis'

// Componente para rotas protegidas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div
        className="h-screen flex items-center justify-center"
        style={{
          background:
            'linear-gradient(135deg, #000000 0%, #011d15 25%, #022f43 50%, #022f43 70%, #450a0a 85%, #78350f 100%)',
        }}
      >
        <div className="text-white text-xl">Carregando...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/landing" replace />
  }

  return <>{children}</>
}

// Loading fallback component
const LoadingFallback = () => (
  <div className="h-screen flex items-center justify-center">
    <div className="text-white text-xl">Carregando...</div>
  </div>
)

function App() {
  const [currentSpecialty, setCurrentSpecialty] = useState<Specialty>('rim')
  const [isVoiceListening, setIsVoiceListening] = useState(false)
  const [notifications, setNotifications] = useState<
    Array<{
      id: string
      message: string
      type: 'info' | 'success' | 'warning' | 'error'
      timestamp: Date
    }>
  >([])

  // Adiciona notificação (memoizada para evitar re-renders desnecessários)
  const addNotification = useCallback(
    (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
      const newNotification = {
        id: Date.now().toString(),
        message,
        type,
        timestamp: new Date(),
      }
      setNotifications(prev => [newNotification, ...prev.slice(0, 2)]) // Máximo 3 notificações

      // Auto-remove notificação após 4 segundos (exceto erros)
      if (type !== 'error') {
        setTimeout(() => {
          removeNotification(newNotification.id)
        }, 4000)
      }
    },
    []
  )

  // Remove notificação
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  // Removido: Notificações automáticas que poluíam a tela
  // Agora apenas notificações importantes são mostradas

  // Contexto global da aplicação
  const appContext = {
    currentSpecialty,
    setCurrentSpecialty,
    isVoiceListening,
    setIsVoiceListening,
    notifications,
    addNotification,
    removeNotification,
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          {/* Rota inicial - LandingPage */}
          <Route path="/" element={<LandingPage />} />

          {/* Rotas de autenticação - SEM header/footer */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/landing" element={<LandingPage />} />

          {/* Home New - Layout completo estilo ChatGPT - PROTEGIDA */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <HomeNew />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* Rotas do app - COM header/footer - PROTEGIDAS */}
          <Route
            path="/app/*"
            element={
              <ProtectedRoute>
                <div
                  className="h-screen overflow-hidden"
                  style={{
                    background:
                      'linear-gradient(135deg, #000000 0%, #011d15 25%, #022f43 50%, #022f43 70%, #450a0a 85%, #78350f 100%)',
                  }}
                >
                  {/* Header */}
                  <Header
                    currentSpecialty={currentSpecialty}
                    setCurrentSpecialty={setCurrentSpecialty}
                  />

                  {/* Container Principal */}
                  <div className="pt-16 pb-20 h-full overflow-hidden">
                    <Suspense fallback={<LoadingFallback />}>
                      <Routes>
                        {/* Página inicial do app - REDIRECT para /app/paciente */}
                        <Route path="/" element={<Navigate to="/app/paciente" replace />} />

                        {/* Páginas específicas */}

                        <Route
                          path="/medico"
                          element={
                            <DashboardMedico
                              currentSpecialty={currentSpecialty}
                              addNotification={addNotification}
                            />
                          }
                        />

                        <Route
                          path="/paciente"
                          element={
                            <DashboardPaciente
                              currentSpecialty={currentSpecialty}
                              addNotification={addNotification}
                            />
                          }
                        />

                        <Route
                          path="/profissional"
                          element={
                            <DashboardProfissional
                              currentSpecialty={currentSpecialty}
                              addNotification={addNotification}
                            />
                          }
                        />

                        <Route
                          path="/admin"
                          element={<AdminDashboard addNotification={addNotification} />}
                        />
                        <Route path="/ide" element={<IntegratedIDE />} />
                        <Route
                          path="/patient-dashboard"
                          element={<Navigate to="/app/paciente" replace />}
                        />
                        <Route path="/patient" element={<Navigate to="/app/paciente" replace />} />

                        <Route path="/payment" element={<PaymentPage />} />

                        <Route
                          path="/checkout"
                          element={<CheckoutPage addNotification={addNotification} />}
                        />

                        <Route
                          path="/relatorio"
                          element={
                            <RelatorioNarrativo
                              currentSpecialty={currentSpecialty}
                              addNotification={addNotification}
                            />
                          }
                        />

                        <Route
                          path="/config"
                          element={<Configuracoes addNotification={addNotification} />}
                        />

                        <Route
                          path="/perfil"
                          element={<Perfil addNotification={addNotification} />}
                        />

                        {/* Páginas do Paciente */}
                        <Route path="/exames" element={<MeusExames />} />
                        <Route path="/prescricoes" element={<Prescricoes />} />
                        <Route path="/prontuario" element={<Prontuario />} />
                        <Route path="/pagamentos-paciente" element={<PagamentosPaciente />} />
                        <Route path="/avaliacao-inicial" element={<AvaliacaoClinicaInicial />} />
                        <Route path="/triagem" element={<TriagemClinica />} />

                        {/* Páginas de Ensino e Pesquisa */}
                        <Route path="/ensino" element={<Ensino />} />
                        <Route path="/pesquisa" element={<Pesquisa />} />
                        <Route path="/medcann-lab" element={<MedCannLab />} />

                        {/* 404 */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </div>

                  {/* Footer Compacto para Home - Fixo na parte inferior */}
                  <div className="fixed bottom-0 left-0 right-0 z-30">
                    <HomeFooter />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* Notificações Toast - Mais discretas */}
        <div className="fixed top-20 right-4 z-50 space-y-2">
          {notifications.slice(0, 3).map(notification => (
            <div
              key={notification.id}
              className={`premium-glass p-3 rounded-lg border-l-4 transform transition-all duration-500 opacity-90 hover:opacity-100 ${
                notification.type === 'error'
                  ? 'border-red-500 bg-red-500/10'
                  : notification.type === 'warning'
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : notification.type === 'success'
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-blue-500 bg-blue-500/10'
              }`}
              onClick={() => removeNotification(notification.id)}
            >
              <div className="flex items-center gap-2">
                <i
                  className={`fas fa-${
                    notification.type === 'error'
                      ? 'times-circle text-red-400'
                      : notification.type === 'warning'
                        ? 'exclamation-triangle text-yellow-400'
                        : notification.type === 'success'
                          ? 'check-circle text-green-400'
                          : 'info-circle text-blue-400'
                  } text-xs`}
                ></i>
                <span className="text-xs font-medium">{notification.message}</span>
              </div>
            </div>
          ))}
        </div>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
