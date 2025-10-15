import React, { useState } from 'react'

type Step = {
  key: string
  prompt: string | ((answers: any) => string)
  repeat?: boolean
  dependsOn?: string
}

const steps: Step[] = [
  {
    key: 'abertura',
    prompt:
      'Olá! Eu sou Nôa Esperanza. Por favor, apresente-se também e vamos iniciar a sua avaliação inicial para consultas com Dr. Ricardo Valença.',
  },
  { key: 'lista_indiciaria', prompt: 'O que trouxe você à nossa avaliação hoje?', repeat: true },
  { key: 'queixa_principal', prompt: a => `De todas essas questões, qual mais o(a) incomoda?` },
  {
    key: 'desenvolvimento_indiciario_1',
    prompt: a =>
      `Vamos explorar suas queixas mais detalhadamente. Onde você sente ${a.queixa_principal || ''}?`,
  },
  {
    key: 'desenvolvimento_indiciario_2',
    prompt: a => `Quando essa ${a.queixa_principal || ''} começou?`,
  },
  { key: 'desenvolvimento_indiciario_3', prompt: a => `Como é a ${a.queixa_principal || ''}?` },
  {
    key: 'desenvolvimento_indiciario_4',
    prompt: a => `O que mais você sente quando está com a ${a.queixa_principal || ''}?`,
  },
  {
    key: 'desenvolvimento_indiciario_5',
    prompt: a => `O que parece melhorar a ${a.queixa_principal || ''}?`,
  },
  {
    key: 'desenvolvimento_indiciario_6',
    prompt: a => `O que parece piorar a ${a.queixa_principal || ''}?`,
  },
  {
    key: 'historia_patologica',
    prompt:
      'E agora, sobre o restante da sua vida até aqui, desde seu nascimento, quais as questões de saúde que você já viveu?',
    repeat: true,
  },
  {
    key: 'historia_familiar_mae',
    prompt: 'Começando pela parte da sua mãe, quais as questões de saúde dessa parte da família?',
    repeat: true,
  },
  { key: 'historia_familiar_pai', prompt: 'E por parte de seu pai?', repeat: true },
  {
    key: 'habitos_vida',
    prompt: 'Que outros hábitos você acha importante mencionar?',
    repeat: true,
  },
  { key: 'alergias', prompt: 'Você tem alguma alergia (mudança de tempo, medicação, poeira...)?' },
  { key: 'medicacoes_regulares', prompt: 'Quais as medicações que você utiliza regularmente?' },
  { key: 'medicacoes_esporadicas', prompt: 'Quais utiliza esporadicamente e por quê?' },
  {
    key: 'fechamento',
    prompt:
      'Vamos revisar a sua história rapidamente para garantir que não perdemos nenhum detalhe importante.',
  },
  {
    key: 'validacao',
    prompt: 'Você concorda com o meu entendimento? Há mais alguma coisa que gostaria de adicionar?',
  },
]

const AvaliacaoClinicaInicial: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<any>({})
  const [chat, setChat] = useState<Array<{ from: 'noa' | 'user'; text: string }>>([
    {
      from: 'noa',
      text: typeof steps[0].prompt === 'string' ? steps[0].prompt : steps[0].prompt({}),
    },
  ])
  const [input, setInput] = useState('')
  const [repeatCount, setRepeatCount] = useState(0)
  const [reviewed, setReviewed] = useState(false)
  const [finalReport, setFinalReport] = useState('')

  // Avança para próxima etapa
  const nextStep = (answer: string) => {
    const step = steps[currentStep]
    let nextIdx = currentStep + 1
    let newAnswers = { ...answers }

    // Salva resposta
    if (step.repeat) {
      if (!newAnswers[step.key]) newAnswers[step.key] = []
      newAnswers[step.key].push(answer)
      // Repetir até usuário digitar "só", "somente isso", "não", "acabou", "só isso"
      if (!/só|somente|não|acabou|só isso/i.test(answer.trim())) {
        setRepeatCount(repeatCount + 1)
        setChat([
          ...chat,
          { from: 'user', text: answer },
          {
            from: 'noa',
            text: typeof step.prompt === 'function' ? step.prompt(newAnswers) : step.prompt,
          },
        ])
        setAnswers(newAnswers)
        setInput('')
        return
      }
    } else {
      newAnswers[step.key] = answer
    }

    setAnswers(newAnswers)
    setChat([...chat, { from: 'user', text: answer }])
    setRepeatCount(0)

    // Fechamento consensual: apresentar resumo
    if (steps[nextIdx]?.key === 'fechamento') {
      const resumo = gerarResumo(newAnswers)
      setFinalReport(resumo)
      let fechamentoPrompt: string = ''
      const fechamentoRaw = steps[nextIdx].prompt
      if (typeof fechamentoRaw === 'function') {
        fechamentoPrompt = fechamentoRaw(newAnswers)
      } else if (typeof fechamentoRaw === 'string') {
        fechamentoPrompt = fechamentoRaw
      } else {
        fechamentoPrompt = ''
      }
      setChat([
        ...chat,
        { from: 'user', text: answer },
        { from: 'noa', text: fechamentoPrompt },
        { from: 'noa', text: resumo },
      ])
      setCurrentStep(nextIdx)
      setInput('')
      return
    }

    // Validação do entendimento
    if (steps[nextIdx]?.key === 'validacao') {
      let validacaoPrompt: string = ''
      const validacaoRaw = steps[nextIdx].prompt
      if (typeof validacaoRaw === 'function') {
        validacaoPrompt = validacaoRaw(newAnswers)
      } else if (typeof validacaoRaw === 'string') {
        validacaoPrompt = validacaoRaw
      } else {
        validacaoPrompt = ''
      }
      setChat([...chat, { from: 'user', text: answer }, { from: 'noa', text: validacaoPrompt }])
      setCurrentStep(nextIdx)
      setInput('')
      return
    }

    // Finalização
    if (nextIdx >= steps.length) {
      setChat([
        ...chat,
        { from: 'user', text: answer },
        {
          from: 'noa',
          text: 'Essa é uma avaliação inicial de acordo com o método desenvolvido pelo Dr. Ricardo Valença com o objetivo de aperfeiçoar o seu atendimento. Ao final, recomendo a marcação de uma consulta com o Dr. Ricardo Valença pelo site.',
        },
      ])
      setReviewed(true)
      setInput('')
      return
    }

    // Próxima pergunta
    let nextPrompt: string = ''
    const nextRaw = steps[nextIdx]?.prompt
    if (typeof nextRaw === 'function') {
      nextPrompt = nextRaw(newAnswers)
    } else if (typeof nextRaw === 'string') {
      nextPrompt = nextRaw
    } else {
      nextPrompt = ''
    }
    setChat([...chat, { from: 'user', text: answer }, { from: 'noa', text: nextPrompt }])
    setCurrentStep(nextIdx)
    setInput('')
  }

  // Gera resumo organizado
  function gerarResumo(a: any) {
    let resumo = ''
    resumo += `• Apresentação: ${a.abertura || ''}\n`
    resumo += `• Lista Indiciária: ${(a.lista_indiciaria || []).join('; ')}\n`
    resumo += `• Queixa Principal: ${a.queixa_principal || ''}\n`
    resumo += `• Desenvolvimento: Onde: ${a.desenvolvimento_indiciario_1 || ''}; Quando: ${a.desenvolvimento_indiciario_2 || ''}; Como: ${a.desenvolvimento_indiciario_3 || ''}; O que mais: ${a.desenvolvimento_indiciario_4 || ''}; Melhorar: ${a.desenvolvimento_indiciario_5 || ''}; Piorar: ${a.desenvolvimento_indiciario_6 || ''}\n`
    resumo += `• História Patológica: ${(a.historia_patologica || []).join('; ')}\n`
    resumo += `• História Familiar (Mãe): ${(a.historia_familiar_mae || []).join('; ')}\n`
    resumo += `• História Familiar (Pai): ${(a.historia_familiar_pai || []).join('; ')}\n`
    resumo += `• Hábitos de Vida: ${(a.habitos_vida || []).join('; ')}\n`
    resumo += `• Alergias: ${a.alergias || ''}\n`
    resumo += `• Medicações Regulares: ${a.medicacoes_regulares || ''}\n`
    resumo += `• Medicações Esporádicas: ${a.medicacoes_esporadicas || ''}\n`
    return resumo
  }

  // Ajuste do entendimento
  const handleValidacao = (answer: string) => {
    if (/não|nao|discordo|errado|falta|adicionar|corrigir/i.test(answer.trim())) {
      setChat([
        ...chat,
        { from: 'user', text: answer },
        {
          from: 'noa',
          text: 'Por favor, me diga o ajuste necessário e apresentarei o resumo novamente.',
        },
      ])
      setFinalReport('')
      setInput('')
      setReviewed(false)
      return
    }
    setChat([
      ...chat,
      { from: 'user', text: answer },
      {
        from: 'noa',
        text: 'Relatório da Avaliação Inicial gerado. Você pode compartilhar com equipes clínicas, se necessário.',
      },
      {
        from: 'noa',
        text: 'Essa é uma avaliação inicial de acordo com o método desenvolvido pelo Dr. Ricardo Valença com o objetivo de aperfeiçoar o seu atendimento. Ao final, recomendo a marcação de uma consulta com o Dr. Ricardo Valença pelo site.',
      },
    ])
    setReviewed(true)
    setInput('')
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-slate-900 rounded-lg shadow-lg p-6 min-h-[500px] flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4">
          {chat.map((msg, idx) => (
            <div
              key={idx}
              className={`flex mb-2 ${msg.from === 'noa' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`rounded-lg px-4 py-2 text-sm max-w-[80%] ${msg.from === 'noa' ? 'bg-blue-800 text-white' : 'bg-green-700 text-white'}`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        {!reviewed && (
          <form
            onSubmit={e => {
              e.preventDefault()
              if (!input.trim()) return
              if (steps[currentStep]?.key === 'validacao') {
                handleValidacao(input)
              } else {
                nextStep(input)
              }
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              className="flex-1 rounded-lg border border-slate-700 bg-slate-800 text-white px-4 py-2 focus:outline-none"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Digite sua resposta..."
              autoFocus
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Enviar
            </button>
          </form>
        )}
        {reviewed && (
          <div className="mt-4 text-green-400 text-sm font-semibold">
            Avaliação finalizada. Relatório disponível para consulta clínica.
          </div>
        )}
      </div>
    </div>
  )
}

export default AvaliacaoClinicaInicial
