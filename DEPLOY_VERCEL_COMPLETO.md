# 🚀 DEPLOY VERCEL - Nôa Esperanza 2.0

## ✅ CHECKLIST PRÉ-DEPLOY

### **PASSO 1: Executar SQLs no Supabase** (OBRIGATÓRIO)

Você precisa executar **2 scripts SQL** no Supabase para criar todas as tabelas necessárias:

---

## 📝 **SQL 1: Base de Conhecimento**

### **Onde executar:**

```
1. Acessar: https://supabase.com/dashboard
2. Selecionar projeto: Nôa Esperanza
3. Menu lateral → SQL Editor
4. New Query
5. Copiar e colar o SQL abaixo
6. Run (canto inferior direito)
```

### **SQL para copiar:**

```sql
-- ========================================
-- BASE DE CONHECIMENTO - Nôa Esperanza
-- ========================================

-- Habilitar extensões
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela: documentos_mestres
CREATE TABLE IF NOT EXISTS documentos_mestres (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('personality', 'knowledge', 'instructions', 'examples', 'development-milestone', 'uploaded-document')),
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_documentos_type ON documentos_mestres(type);
CREATE INDEX IF NOT EXISTS idx_documentos_category ON documentos_mestres(category);
CREATE INDEX IF NOT EXISTS idx_documentos_active ON documentos_mestres(is_active);

-- Tabela: noa_config
CREATE TABLE IF NOT EXISTS noa_config (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'main',
    config JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: user_recognition
CREATE TABLE IF NOT EXISTS user_recognition (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    specialization VARCHAR(255),
    greeting_template TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: master_prompts
CREATE TABLE IF NOT EXISTS master_prompts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    prompt TEXT NOT NULL,
    category VARCHAR(100),
    priority INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE documentos_mestres ENABLE ROW LEVEL SECURITY;
ALTER TABLE noa_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_recognition ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_prompts ENABLE ROW LEVEL SECURITY;

-- Política: Leitura pública
CREATE POLICY "Permitir leitura de documentos" ON documentos_mestres
FOR SELECT USING (is_active = true);

CREATE POLICY "Permitir leitura config" ON noa_config
FOR SELECT USING (true);

-- Política: Escrita apenas autenticados
CREATE POLICY "Permitir inserção documentos" ON documentos_mestres
FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Permitir atualização documentos" ON documentos_mestres
FOR UPDATE USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

SELECT '✅ Base de Conhecimento criada com sucesso!' as status;
```

---

## 📝 **SQL 2: Migração ChatGPT**

### **No mesmo SQL Editor, executar:**

```sql
-- ========================================
-- MIGRAÇÃO CHATGPT - Nôa Esperanza
-- ========================================

-- Tabela: interacoes_noa (conversas migradas)
CREATE TABLE IF NOT EXISTS interacoes_noa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario TEXT NOT NULL,
  data TIMESTAMP NOT NULL,
  conteudo JSONB NOT NULL,
  eixo TEXT,
  origem TEXT,
  hash_integridade TEXT UNIQUE,
  metadata JSONB DEFAULT '{}',
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_interacoes_usuario ON interacoes_noa(usuario);
CREATE INDEX IF NOT EXISTS idx_interacoes_data ON interacoes_noa(data DESC);
CREATE INDEX IF NOT EXISTS idx_interacoes_origem ON interacoes_noa(origem);
CREATE INDEX IF NOT EXISTS idx_interacoes_hash ON interacoes_noa(hash_integridade);

-- Tabela: mensagens_noa (mensagens individuais)
CREATE TABLE IF NOT EXISTS mensagens_noa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interacao_id UUID REFERENCES interacoes_noa(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  ordem INTEGER NOT NULL,
  timestamp TIMESTAMP,
  metadata JSONB DEFAULT '{}',
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_mensagens_interacao ON mensagens_noa(interacao_id);
CREATE INDEX IF NOT EXISTS idx_mensagens_role ON mensagens_noa(role);

-- Tabela: auditoria_simbolica (hashes e NFTs)
CREATE TABLE IF NOT EXISTS auditoria_simbolica (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  descricao TEXT,
  hash_coletivo TEXT NOT NULL,
  nft_token_id INTEGER,
  nft_contract_address TEXT,
  blockchain_network TEXT DEFAULT 'polygon',
  metadata JSONB DEFAULT '{}',
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_auditoria_hash ON auditoria_simbolica(hash_coletivo);

-- Tabela: estatisticas_migracao
CREATE TABLE IF NOT EXISTS estatisticas_migracao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_conversas INTEGER DEFAULT 0,
  total_mensagens INTEGER DEFAULT 0,
  total_duplicatas INTEGER DEFAULT 0,
  data_inicio TIMESTAMP,
  data_fim TIMESTAMP,
  hash_coletivo TEXT,
  arquivo_origem TEXT,
  status TEXT DEFAULT 'em_progresso',
  metadata JSONB DEFAULT '{}',
  criado_em TIMESTAMP DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE interacoes_noa ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensagens_noa ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditoria_simbolica ENABLE ROW LEVEL SECURITY;
ALTER TABLE estatisticas_migracao ENABLE ROW LEVEL SECURITY;

-- Políticas de leitura pública
CREATE POLICY "Permitir leitura interacoes" ON interacoes_noa FOR SELECT USING (true);
CREATE POLICY "Permitir leitura mensagens" ON mensagens_noa FOR SELECT USING (true);
CREATE POLICY "Permitir leitura auditoria" ON auditoria_simbolica FOR SELECT USING (true);
CREATE POLICY "Permitir leitura estatisticas" ON estatisticas_migracao FOR SELECT USING (true);

-- Políticas de escrita (apenas autenticados)
CREATE POLICY "Permitir inserção interacoes" ON interacoes_noa
FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Permitir inserção mensagens" ON mensagens_noa
FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Permitir inserção auditoria" ON auditoria_simbolica
FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Permitir inserção estatisticas" ON estatisticas_migracao
FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

SELECT '✅ Tabelas de Migração ChatGPT criadas com sucesso!' as status;
```

---

## 🚀 **PASSO 2: Deploy no Vercel**

### **Opção A: Via Interface Web (RECOMENDADO)**

```
1. Acessar: https://vercel.com
2. Login com GitHub
3. New Project
4. Import Git Repository
5. Conectar ao repositório do GitHub
6. Configure:
   - Framework Preset: Vite
   - Build Command: npm run build
   - Output Directory: dist
   - Install Command: npm install
7. Environment Variables (adicionar):
   (ver próxima seção)
8. Deploy
```

### **Opção B: Via CLI**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy para produção
vercel --prod
```

---

## 🔐 **PASSO 3: Variáveis de Ambiente no Vercel**

### **No painel do Vercel:**

```
Settings → Environment Variables → Add New
```

### **Variáveis necessárias:**

| Nome                     | Valor                                      | Onde encontrar               |
| ------------------------ | ------------------------------------------ | ---------------------------- |
| `VITE_SUPABASE_URL`      | `https://lhclqebtkyfftkevumix.supabase.co` | Já configurado               |
| `VITE_SUPABASE_ANON_KEY` | `sua-key-anon`                             | Supabase → Settings → API    |
| `VITE_OPENAI_API_KEY`    | `sk-proj-...` (opcional)                   | OpenAI Dashboard (se quiser) |

**Importante:**

- Não precisa recriar as keys do Supabase
- Elas já estão em `src/integrations/supabase/client.ts`
- Vercel vai usar essas mesmas configurações

---

## 📋 **PASSO 4: Verificar vercel.json**

Arquivo já existe no projeto. Verificar se está correto:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

---

## ✅ **CHECKLIST COMPLETO**

### **No Supabase:**

- [ ] Executar SQL 1: Base de Conhecimento
- [ ] Executar SQL 2: Migração ChatGPT
- [ ] Verificar tabelas criadas (Table Editor)
- [ ] Testar queries simples

### **No Vercel:**

- [ ] Criar conta/Login
- [ ] Conectar repositório GitHub
- [ ] Configurar build settings
- [ ] Adicionar environment variables
- [ ] Deploy

### **Pós-Deploy:**

- [ ] Testar URL do Vercel
- [ ] Verificar todas as rotas
- [ ] Testar login/autenticação
- [ ] Testar dashboards
- [ ] Testar migração ChatGPT
- [ ] Testar base de conhecimento

---

## 🔍 **VERIFICAR SE DEU CERTO**

### **No Supabase:**

```sql
-- Ver tabelas criadas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'documentos_mestres',
  'noa_config',
  'interacoes_noa',
  'mensagens_noa',
  'auditoria_simbolica',
  'estatisticas_migracao'
)
ORDER BY table_name;

-- Deve retornar 6 tabelas
```

### **No Vercel:**

```
1. Após deploy, acessar URL fornecida
   Exemplo: https://noaesperanza-app.vercel.app

2. Verificar:
   ✅ Página carrega
   ✅ Login funciona
   ✅ Dashboards acessíveis
   ✅ Chat funciona
```

---

## ⚠️ **PROBLEMAS COMUNS**

### **"Tabela já existe"**

```
✅ Normal! Significa que já foi criada antes
❌ Não é erro
```

### **"Permissão negada"**

```
Solução: Verificar RLS policies no Supabase
Settings → Database → Policies
```

### **"Build falhou no Vercel"**

```
Verificar:
1. package.json tem "build": "vite build"
2. Todas as dependências instaladas
3. TypeScript sem erros
```

### **"404 em rotas do React"**

```
Verificar vercel.json tem:
"routes": [{ "src": "/(.*)", "dest": "/index.html" }]
```

---

## 🎯 **RESUMO EXECUTIVO**

### **O que fazer AGORA:**

```
1. ✅ Supabase SQL Editor
   → Copiar e executar SQL 1 (Base Conhecimento)
   → Copiar e executar SQL 2 (Migração ChatGPT)
   → Verificar: 6 tabelas criadas

2. ✅ Vercel
   → New Project
   → Import repositório GitHub
   → Configurar build
   → Deploy

3. ✅ Testar
   → Acessar URL do Vercel
   → Login → Dashboards → Chat
```

### **Tempo estimado:**

- ⏱️ SQL no Supabase: 5 minutos
- ⏱️ Deploy Vercel: 10 minutos
- ⏱️ Testes: 5 minutos
- **Total: ~20 minutos**

---

## 📞 **LINKS ÚTEIS**

| Recurso                 | URL                            |
| ----------------------- | ------------------------------ |
| **Supabase Dashboard**  | https://supabase.com/dashboard |
| **Vercel Dashboard**    | https://vercel.com/dashboard   |
| **Documentação Vercel** | https://vercel.com/docs        |
| **Status Vercel**       | https://www.vercel-status.com  |

---

## 💡 **DICA FINAL**

**Execute os SQLs ANTES do deploy!**

As tabelas precisam existir para que a aplicação funcione corretamente no Vercel.

---

**Pronto para começar?** Execute os SQLs agora no Supabase! 🚀
