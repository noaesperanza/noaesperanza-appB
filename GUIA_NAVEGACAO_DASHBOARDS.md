# 🧭 GUIA DE NAVEGAÇÃO - Dashboards Nôa Esperanza

## 🎯 Onde Estão os Dashboards?

Dr. Ricardo, os dashboards **não sumiram**! Eles só mudaram de lugar. Agora estão no **Header (barra superior)** da aplicação.

---

## 📍 VISUAL DO HEADER

Quando você acessar qualquer página (exceto landing), verá no topo:

```
╔══════════════════════════════════════════════════════════╗
║  🏥 MedCanLab @ Nôa Esperanza                            ║
║                                                           ║
║  [Chat Nôa] [Paciente] [Avaliação] [Médico]             ║
║  [Estudante] [ADM/CONFIG]                                ║
║                                   [Dr. Ricardo ▼] [Sair] ║
╚══════════════════════════════════════════════════════════╝
```

---

## 🔗 ACESSO DIRETO (URLs)

### **Opção 1: Clique no Header**

Olhe no topo da tela e clique no botão correspondente.

### **Opção 2: Digite a URL Diretamente**

| Dashboard        | URL                      | Tecla Rápida                        |
| ---------------- | ------------------------ | ----------------------------------- |
| **Chat Nôa**     | `/chat`                  | `Ctrl+L` → `/chat`                  |
| **Admin**        | `/app/admin`             | `Ctrl+L` → `/app/admin`             |
| **Paciente**     | `/app/paciente`          | `Ctrl+L` → `/app/paciente`          |
| **Médico**       | `/app/medico`            | `Ctrl+L` → `/app/medico`            |
| **Profissional** | `/app/profissional`      | `Ctrl+L` → `/app/profissional`      |
| **Estudante**    | `/app/estudante`         | `Ctrl+L` → `/app/estudante`         |
| **Avaliação**    | `/app/avaliacao-inicial` | `Ctrl+L` → `/app/avaliacao-inicial` |

---

## 🎨 DESCRIÇÃO DOS DASHBOARDS

### 🟢 **Chat Nôa** (`/chat`)

- Chat principal estilo ChatGPT
- Interface conversacional
- Histórico de conversas
- Sidebar com conversas antigas

### 👤 **Paciente** (`/app/paciente`)

- Perfil do paciente
- Avaliação clínica inicial
- Relatórios e exames
- Histórico médico
- NFT de registros

### 👨‍⚕️ **Médico** (`/app/medico`)

- Dashboard médico
- Visualização de pacientes
- Ferramentas clínicas
- Análises e relatórios

### 👔 **Profissional** (`/app/profissional`)

- Dashboard para profissionais de saúde
- Gestão de casos
- Ferramentas de análise

### 🎓 **Estudante** (`/app/estudante`)

- Dashboard educacional
- Materiais de estudo
- Progresso de aprendizado

### ⚙️ **ADM/CONFIG** (`/app/admin`)

- GPT Builder
- Base de conhecimento
- Migração de dados
- Configurações avançadas
- KPIs e estatísticas

### 📋 **Avaliação** (`/app/avaliacao-inicial`)

- Avaliação clínica inicial
- Metodologia Arte da Entrevista Clínica
- Geração de relatórios

---

## ⚠️ ERROS NOS LOGS (NORMAIS)

### **1. `401 api.openai.com/v1/models`**

**O que é:** Sistema tenta verificar modelos OpenAI mas não tem API key.

**É problema?** ❌ NÃO! Sistema funciona perfeitamente sem isso.

**Como resolver (opcional):**

1. Obter API key em: https://platform.openai.com/api-keys
2. Criar arquivo `.env.local`
3. Adicionar: `VITE_OPENAI_API_KEY=sk-proj-sua-key`
4. Reiniciar: `npm run dev`

**Obs:** Não é necessário. Nôa funciona sem OpenAI.

### **2. `Timeout profile` / `⚠️ Perfil não encontrado`**

**O que é:** Pequeno delay ao carregar perfil do Supabase.

**É problema?** ❌ NÃO! Logo depois aparece: `✅ Perfil carregado de noa_users`

**Como resolver:** Já está resolvido automaticamente pelo sistema.

---

## 🚀 TESTE AGORA

### **Passo 1: Verificar Header**

```bash
# Terminal
npm run dev

# Navegador
http://localhost:5173/chat
```

**Olhe no TOPO da tela** → Deve ver os botões de navegação.

### **Passo 2: Testar Cada Dashboard**

Clique em cada botão do header e verifique se abre:

- [x] Chat Nôa → Abre chat conversacional
- [x] Paciente → Abre dashboard do paciente
- [x] Avaliação → Abre avaliação clínica
- [x] Médico → Abre dashboard médico
- [x] Estudante → Abre dashboard estudante
- [x] ADM/CONFIG → Abre admin com GPT Builder

---

## 🔍 TROUBLESHOOTING

### **"Não vejo os botões no header"**

**Possíveis causas:**

1. Está na landing page (`/landing`) → Navegue para `/chat`
2. Resolução muito pequena → Abrir menu hambúrguer (☰)
3. Cache do navegador → `Ctrl + Shift + R`

**Solução:**

```bash
# Limpar cache e recarregar
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)

# Ou acessar URL direta
http://localhost:5173/chat
```

### **"Página em branco ao clicar"**

**Solução:**

```bash
# Verificar console (F12)
# Recarregar aplicação
npm run dev
```

### **"ADM/CONFIG não aparece"**

**Motivo:** Apenas para emails autorizados:

- `iaianoaesperanza@gmail.com`
- `eduardoscfaveret@gmail.com`
- `eduardo.faveret@noaesperanza.app`
- `phpg69@gmail.com`

**Solução:** Fazer login com um desses emails.

---

## 📱 VERSÃO MOBILE

No mobile, os botões ficam em um menu hambúrguer (☰):

```
╔═══════════════════════════════╗
║  ☰  MedCanLab @ Nôa          ║
╚═══════════════════════════════╝
     ↑
  Clique aqui
```

---

## 🎯 RESUMO

### **Dashboards NÃO sumiram!**

Estão no **Header (topo da página)**.

### **Como acessar:**

1. **Via botões:** Clique no topo
2. **Via URL:** Digite `/app/admin`, `/app/paciente`, etc.
3. **Via teclado:** `Ctrl+L` → digite URL → `Enter`

### **Erros nos logs:**

- ✅ 401 OpenAI → **Normal, não afeta**
- ✅ Timeout profile → **Normal, resolve sozinho**

---

## 📞 ATALHOS ÚTEIS

| Ação                          | Atalho             |
| ----------------------------- | ------------------ |
| **Focar barra de endereço**   | `Ctrl + L`         |
| **Recarregar (limpar cache)** | `Ctrl + Shift + R` |
| **Abrir console**             | `F12`              |
| **Voltar**                    | `Alt + ←`          |
| **Avançar**                   | `Alt + →`          |

---

## ✅ CHECKLIST

- [ ] Iniciar aplicação: `npm run dev`
- [ ] Acessar: `http://localhost:5173/chat`
- [ ] Verificar Header no topo
- [ ] Clicar em "Paciente" → Deve abrir dashboard
- [ ] Clicar em "Admin" → Deve abrir GPT Builder
- [ ] Testar outros dashboards
- [ ] ✅ Tudo funcionando!

---

**Última atualização:** 07 de Outubro de 2025  
**Status:** ✅ Dashboards Ativos e Acessíveis
