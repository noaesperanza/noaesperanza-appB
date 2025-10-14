# 🏥 Nôa Esperanza – Clínicas Integradas (App B)

Plataforma front-end integrada para os consultórios do **Dr. Ricardo Valença** (neurologia + cannabis medicinal) e do **Dr. Eduardo Favaret** (nefrologia). Esta versão replica o fluxo objetivo do App C, mantendo os módulos de IA residente, pagamentos e Supabase já consolidados no App B.

## 🚀 Visão geral

- **Frontend:** React 18, TypeScript, Vite e Tailwind CSS.
- **Integrações:** Supabase (dados, autenticação), OpenAI (chat clínico e relatórios), Mercado Pago (assinaturas e cobranças avulsas).
- **Deploys oficiais:**
  - Web: [noaesperanza.vercel.app](https://noaesperanza.vercel.app)
  - GitHub: [OrbitrumConnect/noaesperanza](https://github.com/OrbitrumConnect/noaesperanza.git)

## 🧭 Rotas principais

| Caminho                | Tipo      | Descrição                                                               |
| ---------------------- | --------- | ----------------------------------------------------------------------- |
| `/`                    | Pública   | Home com visão geral das clínicas, destaques e integrações              |
| `/clinics`             | Pública   | Lista dos consultórios com serviços, diferenciais e contatos            |
| `/clinics/:clinicSlug` | Pública   | Detalhamento de cada clínica (Dr. Ricardo / Dr. Eduardo)                |
| `/knowledge-base`      | Pública   | Base clínica compartilhada com protocolos e materiais operacionais      |
| `/about`               | Pública   | Contexto da plataforma e orientações de operação integrada              |
| `/login`, `/register`  | Pública   | Fluxo de autenticação legado                                            |
| `/chat`                | Protegida | Chat clínico com IA residente                                           |
| `/app/*`               | Protegida | Dashboards médicos, pacientes, pagamentos, relatórios e módulos legados |

## 🗂️ Estrutura clínica compartilhada

| Arquivo                           | Responsabilidade                                                                      |
| --------------------------------- | ------------------------------------------------------------------------------------- |
| `src/data/clinics.ts`             | Dados oficiais das clínicas (serviços, equipe, diferenciais, contatos e integrações)  |
| `src/data/knowledgeBase.ts`       | Trilhas de aprendizado, protocolos e materiais compartilhados entre os consultórios   |
| `src/components/Layout.tsx`       | Layout público com navegação, ações de contato e links rápidos para chat/autenticação |
| `src/pages/HomePage.tsx`          | Landing integrada inspirada no App C                                                  |
| `src/pages/ClinicsPage.tsx`       | Catálogo clínico com cards detalhados                                                 |
| `src/pages/ClinicDetailPage.tsx`  | Página individual de cada consultório, incluindo CTA de contato direto                |
| `src/pages/KnowledgeBasePage.tsx` | Visualização categorizada da base clínica compartilhada                               |
| `src/pages/AboutPage.tsx`         | Visão institucional sobre a operação conjunta                                         |
| `src/services/supabaseClient.ts`  | Cliente único do Supabase utilizado pelo restante da aplicação                        |

> As demais páginas protegidas (dashboards, pagamentos, GPT Builder etc.) permanecem inalteradas e utilizam o mesmo roteamento legado.

## ⚙️ Configuração

### 1. Variáveis de ambiente

Copie `env.example` para `.env` e ajuste os valores reais:

```bash
cp env.example .env
```

Variáveis disponíveis:

```env
# OpenAI
VITE_OPENAI_API_KEY=sk-...

# ElevenLabs (opcional)
VITE_ELEVEN_API_KEY=...

# Supabase
VITE_SUPABASE_URL=https://<sua-instancia>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon-key>

# Mercado Pago
VITE_MERCADO_PAGO_KEY=<access-token>

# Contatos e contexto institucional
VITE_SUPPORT_EMAIL=contato@noaesperanza.com
VITE_CONTACT_PHONE=+55 (81) 4002-8922
VITE_CLINIC_RICARDO_WHATSAPP=+55 (81) 99999-0000
VITE_CLINIC_EDUARDO_WHATSAPP=+55 (81) 98888-1111
VITE_SITE_BASE_URL=https://noaesperanza.vercel.app
VITE_APP_ENVIRONMENT=production
VITE_APP_VERSION=3.0.0
```

### 2. Supabase

1. Configure o projeto conforme `CONFIGURACAO_SUPABASE.md`.
2. Execute os scripts SQL essenciais localizados em `supabase/` (tabelas básicas, histórico de conversas, aprendizado da IA e funções de segurança).
3. Ative RLS nas tabelas sensíveis (`users`, `noa_conversations`, `avaliacoes_iniciais`, `ai_learning_data`).

### 3. Dependências e execução local

```bash
npm install
npm run dev
```

- O servidor Vite inicia em `http://localhost:5173`.
- Para testar rotas protegidas utilize uma conta válida no Supabase ou registre-se via `/register`.

### 4. Scripts úteis

```bash
npm run build   # Gera build de produção
npm run lint    # Verifica o código com ESLint (quando configurado)
```

## 🧠 Funcionalidades em destaque

- Chat clínico com IA residente e suporte a geração de relatórios.
- Painéis separados para médicos, pacientes, equipe de operação e administradores.
- Gestão financeira integrada com Mercado Pago.
- Base de conhecimento compartilhada e atualizada para ambos os consultórios.
- Layout público responsivo e otimizado para o agendamento rápido.

## 🔒 Boas práticas de segurança

- Variáveis sensíveis mantidas apenas em `.env` e nunca commitadas.
- Supabase com RLS e validações nas camadas de serviço.
- Tratamento de erros centralizado em `ErrorBoundary`.
- Sanitização de entradas e limites de uso nas APIs legadas.

## 🤝 Suporte

- E-mail: `contato@noaesperanza.com`
- Documentação adicional: consulte os arquivos na raiz (`DOCUMENTACAO_NOA_ESPERANZA.md`, `CONFIGURACAO_SUPABASE.md`).
- Para reportar incidentes, abra uma issue no repositório GitHub oficial.
