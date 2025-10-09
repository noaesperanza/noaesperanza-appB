# 🏥 NOA Esperanza - Assistente Médica Inteligente

Plataforma médica inteligente com IA especializada em neurologia, cannabis medicinal e nefrologia.

## 🚀 Deploy

- **Web:** [noaesperanza.vercel.app](https://noaesperanza.vercel.app)
- **GitHub:** [OrbitrumConnect/noaesperanza](https://github.com/OrbitrumConnect/noaesperanza.git)

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Copie o arquivo `env.example` para `.env` e configure:

```bash
cp env.example .env
```

Preencha as variáveis no arquivo `.env`:

```env
# Codex API
VITE_CODEX_API_URL=https://codex.local/api

# ElevenLabs Configuration (OPCIONAL - Sistema usa voz residente por padrão)
# VITE_ELEVEN_API_KEY=your_elevenlabs_api_key_here

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key_here

# Mercado Pago Configuration
VITE_MERCADO_PAGO_KEY=your_mercado_pago_access_token_here
```

### 2. Banco de Dados

Execute os scripts SQL no Supabase:

1. `supabase_setup.sql` - Configuração básica
2. `ai_learning_setup.sql` - Sistema de aprendizado da IA
3. `fix_ai_learning_rls.sql` - Correções de segurança

### 3. Instalação

```bash
npm install
npm run dev
```

## 🏗️ Arquitetura

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + CSS Custom
- **Backend:** Supabase (PostgreSQL + Auth)
- **IA:** Codex Core (Prompt V3.1) + Voz Residente (Web Speech API)
- **Pagamentos:** Mercado Pago

## 🧠 IA Nôa Esperanza 100% via Codex

- Prompt mestre centralizado em `src/config/noaSystemPrompt.ts` (versão **V3.1**).
- Carregamento dinâmico de perfis e modos em `src/services/noaPromptLoader.ts`.
- Serviço único de inferência: `src/services/codexService.ts` (substitui OpenAI/Assistants).
- Logs automáticos: reconhecimento de perfil, tamanho do prompt e ID da inferência.
- Contexto entregue ao Codex inclui Supabase, cache semântico e status da sessão.

## 👥 Perfis e Frases-Código

| Perfil              | Frase-Código                          | Foco                                 |
| ------------------- | ------------------------------------- | ------------------------------------ |
| Dr. Ricardo Valença | "Olá, Nôa. Ricardo Valença, aqui"     | Criador, desenvolvimento total       |
| Dr. Eduardo Faveret | "Olá, Nôa. Eduardo Faveret, aqui"     | Administração e supervisão           |
| Rosa                | "Olá, Nôa. Rosa aqui"                 | Estímulo neuropsicológico lúdico     |
| Dr. Fernando        | "Olá, Nôa. Dr. Fernando aqui"         | Ensino clínico e feedback humanizado |
| Dr. Alexandre       | "Olá, Nôa. Dr. Alexandre aqui"        | Laudo clínico narrativo              |
| Yalorixá            | "Olá, Nôa. Yalorixá aqui"             | Escuta ancestral afrodescendente     |
| Gabriela            | "Olá, Nôa. Gabriela aqui"             | Planejamento de estudos médicos      |
| Prof. Priscilla     | "Olá, Nôa. Professora Priscilla aqui" | Supervisão educacional               |

## 🧭 Modos Operacionais

- `/chat`: modo narrativo colaborativo (Harmony Format e Reasoning Layer).
- `/triagem`: roteiro clínico triaxial com reconhecimento de códigos e etapas sequenciais.
- `/avaliacao-inicial`: geração de JSON + narrativa clínica com consentimento LGPD.
- Modos adicionais (`pedagógico`, `comunitário`, `jurídico`) carregados via `noaPromptLoader` conforme perfil ou rota.

## 🗂️ Prompts Versionados

- `NOA_SYSTEM_PROMPT` V3.1 — identidade, conduta e logs do Codex.
- `loadNoaPrompt` — monta prompt final considerando perfil ativo, módulo e metadados da sessão.
- `codexService.generateClinicalReport` — gera relatório clínico estruturado (JSON + narrativa).

## 📡 Monitoramento

- Logs em console indicando perfil reconhecido, modo ativo e ID de inferência (`codex-<rota>-<timestamp>`).
- Metadados enviados ao Codex incluem contexto Supabase, cache semântico e status da sessão.
- Triagem e Avaliação usam fallback local apenas quando Codex está indisponível (marcado como "modo offline").

## ✅ Testes Recomendados

- `npm run lint` — validação de estilo e regras de qualidade.
- `npm run type-check` — garantia de consistência de tipos no TypeScript.
- Testes manuais de ativação de perfis por frase-código, mudança de linguagem por perfil, formatação Harmony e fluxo completo de triagem.

## 🔧 Funcionalidades

- ✅ Chat inteligente com NOA
- ✅ Avaliação clínica triaxial
- ✅ Reconhecimento de voz
- ✅ Síntese de voz
- ✅ Sistema de aprendizado da IA
- ✅ Dashboards especializados
- ✅ Integração de pagamentos
- ✅ Validação de entrada
- ✅ Error boundaries
- ✅ Hooks customizados

## 🛡️ Segurança

- ✅ Variáveis de ambiente configuradas
- ✅ Validação de entrada implementada
- ✅ Sanitização de dados
- ✅ Error boundaries ativos
- ✅ RLS (Row Level Security) no Supabase

## 📱 Responsividade

O projeto mantém a mesma aparência visual em:

- ✅ Desktop
- ✅ Mobile
- ✅ Tablet
- ✅ Qualquer instância

## 🚨 Importante

- **NÃO** altere a estrutura visual atual
- **NÃO** quebre o layout existente
- **SEMPRE** teste antes de fazer mudanças
- **MANTENHA** a compatibilidade com Vercel

## 📞 Suporte

Para dúvidas ou problemas, verifique:

1. Variáveis de ambiente configuradas
2. Scripts SQL executados
3. APIs funcionando
4. Console do navegador para erros

## 📄 Relatórios de Implementação

- [RELATORIO_IMPLEMENTACAO_DASHBOARD_PACIENTE_2025-10-05.md](./RELATORIO_IMPLEMENTACAO_DASHBOARD_PACIENTE_2025-10-05.md)
