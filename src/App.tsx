import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useState, useCallback, Suspense } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import Header from './components/Header'
import HomeFooter from './components/HomeFooter'
import DashboardMedico from './pages/DashboardMedico'
import DashboardPaciente from './pages/DashboardPaciente'
import DashboardProfissional from './pages/DashboardProfissional'
import AdminDashboard from './pages/AdminDashboard'
import RelatorioNarrativo from './pages/RelatorioNarrativo'
import Configuracoes from './pages/Configuracoes'
import Perfil from './pages/Perfil'
import PaymentPage from './pages/PaymentPage'
import CheckoutPage from './pages/CheckoutPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import LandingPage from './pages/LandingPage'
import NotFound from './pages/NotFound'
import MeusExames from './pages/MeusExames'
import Prescricoes from './pages/Prescricoes'
import Prontuario from './pages/Prontuario'
import PagamentosPaciente from './pages/PagamentosPaciente'
import Ensino from './pages/Ensino'
import Pesquisa from './pages/Pesquisa'
import MedCannLab from './pages/MedCannLab'
import GPTBuilder from './pages/GPTBuilder'
import LoadingFallback from './components/LoadingFallback'
import HomeNew from './pages/HomeNew'
import AvaliacaoClinicaInicial from './pages/AvaliacaoClinicaInicial'
import TriagemClinica from './pages/TriagemClinica'
import Layout from './components/Layout'
import ClinicsPage from './pages/ClinicsPage'
import ClinicDetailPage from './pages/ClinicDetailPage'
import KnowledgeBasePage from './pages/KnowledgeBasePage'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'

export type Specialty = 'rim' | 'neuro' | 'cannabis'

const ProtectedOutlet = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div
        className="flex h-screen items-center justify-center"
        style={{
          background:
            'linear-gradient(135deg, #000000 0%, #011d15 25%, #022f43 50%, #022f43 70%, #450a0a 85%, #78350f 100%)',
        }}
      >
        <div className="text-xl text-white">Carregando...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/landing" replace />
  }

  return <Outlet />
}

interface ApplicationLayoutProps {
  currentSpecialty: Specialty
  setCurrentSpecialty: (specialty: Specialty) => void
}

const ApplicationLayout = ({ currentSpecialty, setCurrentSpecialty }: ApplicationLayoutProps) => {
  return (
    <div
      className="h-screen overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #000000 0%, #011d15 25%, #022f43 50%, #022f43 70%, #450a0a 85%, #78350f 100%)',
      }}
    >
      <Header currentSpecialty={currentSpecialty} setCurrentSpecialty={setCurrentSpecialty} />
      <div className="h-full overflow-hidden pb-20 pt-16">
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <HomeFooter />
      </div>
    </div>
  )
}

function App() {
  const [currentSpecialty, setCurrentSpecialty] = useState<Specialty>('rim')
  const [notifications, setNotifications] = useState<
    Array<{
      id: string
      message: string
      type: 'info' | 'success' | 'warning' | 'error'
      timestamp: Date
    }>
  >([])

  const addNotification = useCallback(
    (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
      const newNotification = {
        id: Date.now().toString(),
        message,
        type,
        timestamp: new Date(),
      }
      setNotifications(prev => [newNotification, ...prev.slice(0, 2)])

      if (type !== 'error') {
        setTimeout(() => {
          removeNotification(newNotification.id)
        }, 4000)
      }
    },
    []
  )

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="clinics" element={<ClinicsPage />} />
            <Route path="clinics/:clinicSlug" element={<ClinicDetailPage />} />
            <Route path="knowledge-base" element={<KnowledgeBasePage />} />
            <Route path="about" element={<AboutPage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/landing" element={<LandingPage />} />

          <Route element={<ProtectedOutlet />}>
            <Route
              path="/chat"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <HomeNew />
                </Suspense>
              }
            />

            <Route
              path="/app"
              element={
                <ApplicationLayout
                  currentSpecialty={currentSpecialty}
                  setCurrentSpecialty={setCurrentSpecialty}
                />
              }
            >
              <Route index element={<Navigate to="paciente" replace />} />
              <Route
                path="medico"
                element={
                  <DashboardMedico
                    currentSpecialty={currentSpecialty}
                    addNotification={addNotification}
                  />
                }
              />
              <Route
                path="paciente"
                element={
                  <DashboardPaciente
                    currentSpecialty={currentSpecialty}
                    addNotification={addNotification}
                  />
                }
              />
              <Route
                path="profissional"
                element={
                  <DashboardProfissional
                    currentSpecialty={currentSpecialty}
                    addNotification={addNotification}
                  />
                }
              />
              <Route path="admin" element={<AdminDashboard addNotification={addNotification} />} />
              <Route path="admin/chat" element={<GPTBuilder userType="admin" />} />
              <Route path="payment" element={<PaymentPage />} />
              <Route path="checkout" element={<CheckoutPage addNotification={addNotification} />} />
              <Route
                path="relatorio"
                element={
                  <RelatorioNarrativo
                    currentSpecialty={currentSpecialty}
                    addNotification={addNotification}
                  />
                }
              />
              <Route path="config" element={<Configuracoes addNotification={addNotification} />} />
              <Route path="perfil" element={<Perfil addNotification={addNotification} />} />
              <Route path="exames" element={<MeusExames />} />
              <Route path="prescricoes" element={<Prescricoes />} />
              <Route path="prontuario" element={<Prontuario />} />
              <Route path="pagamentos-paciente" element={<PagamentosPaciente />} />
              <Route path="avaliacao-inicial" element={<AvaliacaoClinicaInicial />} />
              <Route path="triagem" element={<TriagemClinica />} />
              <Route path="ensino" element={<Ensino />} />
              <Route path="pesquisa" element={<Pesquisa />} />
              <Route path="medcann-lab" element={<MedCannLab />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>

        <div className="fixed right-4 top-20 z-50 space-y-2">
          {notifications.slice(0, 3).map(notification => (
            <div
              key={notification.id}
              className={`premium-glass rounded-lg border-l-4 p-3 opacity-90 transition-all duration-500 hover:opacity-100 ${
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
