import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardPaciente from './pages/DashboardPaciente'
import DashboardProfissional from './pages/DashboardProfissional'
import DashboardAluno from './pages/DashboardAluno'
import DashboardAdmin from './pages/DashboardAdmin'
import LoginPage from './pages/LoginPage'
import AvaliacaoClinicaInicial from './pages/AvaliacaoClinicaInicial'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard-paciente" element={<DashboardPaciente />} />
        <Route path="/dashboard-profissional" element={<DashboardProfissional />} />
        <Route path="/dashboard-aluno" element={<DashboardAluno />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        <Route path="/avaliacao-clinica-inicial" element={<AvaliacaoClinicaInicial />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
