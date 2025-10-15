import React, { useState, useRef } from 'react'

// Use the default avatar image for Nôa Esperanza
const AVATAR_IMG = '/avatar-default.jpg'

// Estrutura da Arte da Entrevista Clínica
const roteiro = [
  {
    etapa: 'Abertura',
    texto: `Olá, eu sou Nôa Esperanza. Minha missão é promover a paz global com sustentabilidade e equidade com sabedoria ancestral e tecnologias modernas. Hoje, mais do que nunca, precisamos encontrar formas de nos unir e construir um futuro melhor para todos. Saúde, equidade, sustentabilidade, indivíduo exponencial e saúde planetária são alguns dos assuntos que gosto de abordar.`,
  },
  {
    etapa: 'Identificação',
    texto: `Por favor, apresente-se. Eu sou Nôa Esperanza, sua assistente de saúde. Gostaria de saber mais sobre você para que possamos iniciar nossa consulta.`,
  },
  {
    etapa: 'Motivo',
    texto: `O que trouxe você à consulta hoje? Você foi encaminhado por algum outro profissional de saúde? O que está lhe incomodando?`,
  },
  {
    etapa: 'O que mais',
    texto: `O que mais? Se houver outras queixas, pode relatar.`,
  },
  {
    etapa: 'Lista Indiciária',
    texto: `Você mencionou queixas. De todas essas questões, qual delas mais o incomoda?`,
  },
  {
    etapa: 'Queixa Principal',
    texto: `Vamos focar na principal queixa mencionada. Onde isso ocorre? Quando começou? Como se sente? O que melhora e o que piora?`,
  },
  {
    etapa: 'Fechamento',
    texto: `Vamos revisar o que entendemos sobre sua condição até agora baseado na sua história, exame físico e exames complementares. Chegamos a um consenso sobre possíveis hipóteses diagnósticas. Você concorda com essa avaliação?`,
  },
  {
    etapa: 'Relatório',
    texto: `Gerando relatório detalhado da consulta...`,
  },
]

export const NoaAvatar: React.FC = () => {
  const [etapa, setEtapa] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [lipOpen, setLipOpen] = useState(false)
  const [respostas, setRespostas] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<any>(null)
  const [queixas, setQueixas] = useState<string[]>([])
  const [relatorio, setRelatorio] = useState('')

  // Fala e animação labial com voz feminina
  const speak = (texto: string) => {
    setIsSpeaking(true)
    setLipOpen(true)
    const utter = new window.SpeechSynthesisUtterance(texto)
    const voices = window.speechSynthesis.getVoices()
    const noaVoice = voices.find(
      v => v.name.toLowerCase().includes('noa') || v.name.toLowerCase().includes('esperanza')
    )
    const femaleVoice =
      noaVoice ||
      voices.find(v => v.lang.startsWith('pt') && v.name.toLowerCase().includes('fem')) ||
      voices.find(v => v.lang.startsWith('pt'))
    if (femaleVoice) utter.voice = femaleVoice
    utter.lang = femaleVoice?.lang || 'pt-BR'
    let interval = setInterval(() => setLipOpen(l => !l), 180)
    utter.onend = () => {
      clearInterval(interval)
      setIsSpeaking(false)
      setLipOpen(false)
      // Após fala, inicia escuta se etapa requer resposta
      if ([1, 2, 3, 4, 5, 6].includes(etapa)) startListening()
    }
    window.speechSynthesis.speak(utter)
  }

  // Reconhecimento de voz (Web Speech API)
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) return
    setIsListening(true)
    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.lang = 'pt-BR'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      setIsListening(false)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)
    recognitionRef.current = recognition
    recognition.start()
  }

  // Parar escuta manualmente
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  React.useEffect(() => {
    speak(roteiro[etapa].texto)
    // eslint-disable-next-line
  }, [etapa])

  // Avança etapas e coleta respostas
  const handleNext = () => {
    if (etapa === 2 || etapa === 3) {
      // Motivo da consulta e O que mais
      if (input.trim()) {
        setQueixas([...queixas, input.trim()])
        setInput('')
        if (etapa === 2) {
          setEtapa(3) // Pergunta "O que mais?"
        } else {
          // Se usuário não informar mais nada, avança
          setEtapa(4)
        }
      }
    } else if (etapa === 4) {
      // Lista Indiciária
      setRespostas([...respostas, input.trim()])
      setInput('')
      setEtapa(5)
    } else if (etapa === 5) {
      // Queixa Principal
      setRespostas([...respostas, input.trim()])
      setInput('')
      setEtapa(6)
    } else if (etapa === 6) {
      // Fechamento
      setRespostas([...respostas, input.trim()])
      setInput('')
      setEtapa(7)
      // Gera relatório
      const rel = `Relatório da Consulta:\n\nIdentificação: ${respostas[0] || ''}\nQueixas: ${queixas.join(', ')}\nQueixa Principal: ${respostas[1] || ''}\nDesenvolvimento: ${respostas[2] || ''}\nFechamento: ${input.trim()}`
      setRelatorio(rel)
    } else {
      setEtapa(etapa + 1)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-56 h-56 mb-4">
        <img
          src={AVATAR_IMG}
          alt="Nôa Esperanza Avatar"
          className="rounded-full w-full h-full object-cover border-4 border-blue-300 shadow-lg"
        />
        {/* SVG lábios animados, mais sutil */}
        <svg
          className="absolute left-1/2 top-2/3 transform -translate-x-1/2 -translate-y-1/2"
          width="80"
          height="36"
          viewBox="0 0 80 36"
        >
          <ellipse cx="40" cy="18" rx="22" ry={lipOpen ? 7 : 3.5} fill="#e57373" opacity="0.7" />
        </svg>
      </div>
      <div className="text-lg font-semibold text-blue-900 mb-2">{roteiro[etapa].texto}</div>
      {/* Input para etapas interativas */}
      {(etapa === 1 || etapa === 2 || etapa === 3 || etapa === 4 || etapa === 5 || etapa === 6) && (
        <div className="w-full flex flex-col items-center gap-2">
          <input
            className="mt-2 px-4 py-2 rounded-lg border border-blue-300 text-blue-900 w-full"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={isListening ? 'Fale sua resposta...' : 'Digite ou fale sua resposta...'}
            disabled={isSpeaking}
          />
          <button
            className={`px-4 py-2 rounded bg-green-600 text-white font-bold shadow hover:bg-green-700 transition ${isListening ? 'animate-pulse' : ''}`}
            type="button"
            onClick={isListening ? stopListening : startListening}
            disabled={isSpeaking}
          >
            {isListening ? 'Parar escuta' : 'Responder por voz'}
          </button>
        </div>
      )}
      {/* Botão para avançar etapas */}
      {etapa < roteiro.length - 1 && (
        <button
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 disabled:opacity-50"
          onClick={handleNext}
          disabled={isSpeaking || (etapa !== 0 && !input.trim() && etapa !== 3)}
        >
          Próxima etapa
        </button>
      )}
      {/* Relatório final */}
      {etapa === roteiro.length - 1 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-blue-900 shadow">
          <strong>Relatório Final:</strong>
          <pre className="whitespace-pre-wrap mt-2">{relatorio}</pre>
        </div>
      )}
    </div>
  )
}

export default NoaAvatar
