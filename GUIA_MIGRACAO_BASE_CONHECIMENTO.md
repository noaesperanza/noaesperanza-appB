# 📚 GUIA DE MIGRAÇÃO DA BASE DE CONHECIMENTO

## 🎯 Objetivo

Dr. Ricardo, este guia explica como migrar os documentos do ChatGPT Builder antigo para a nova plataforma Nôa Esperanza.

---

## 🔍 Problema Identificado

Você tinha documentos no ChatGPT Builder do OpenAI:

- ✅ Noa_Esperanza_Concept_Brief_2025_Abril_Bilíngue.pdf
- ✅ PLATAFORMA NÔA ESPERANZA perfil e roteiro de usuários abril 2025.docx
- ✅ Curso_Arte_da_Entrevista_Clinica_Atualizado_2024_Completo.docx
- ✅ O que se diz do que se vê.pdf
- ✅ Projeto de Doutorado Aplicação de Deep Learning.docx
- ✅ DOCUMENTO MESTRE INSTITUCIONAL – NÔA ESPERANZA 30 julho 2025.docx
- ✅ E outros...

Esses documentos **não foram transferidos automaticamente** para a plataforma customizada.

---

## ✅ SOLUÇÕES DISPONÍVEIS

### **Opção 1: Migração Automática (RECOMENDADO)** 🤖

1. Acesse: `/app/migrar-base`
2. Clique em **"Verificar Base"** para ver quantos documentos já existem
3. Clique em **"Iniciar Migração Automática"**
4. O sistema irá adicionar automaticamente os documentos principais:
   - 📘 Documento Mestre Institucional
   - 🎭 Arte da Entrevista Clínica - Metodologia
   - 📚 Curso Arte da Entrevista Clínica
   - 🔬 Projeto de Doutorado
   - 📋 Instruções para Avaliação Clínica Inicial

### **Opção 2: SQL Direto no Supabase** 💾

1. Abra o Supabase Dashboard
2. Vá em **SQL Editor**
3. Cole o conteúdo do arquivo `migrar_base_conhecimento.sql`
4. Execute o script
5. Verifique os resultados na aba **Table Editor** → `documentos_mestres`

### **Opção 3: Upload Manual pelo Admin** 📤

1. Acesse: `/app/admin`
2. Clique na aba **"Base de Conhecimento"**
3. Clique em **"Novo Documento"**
4. Copie e cole o conteúdo de cada documento
5. Configure:
   - **Título**: Nome do documento
   - **Tipo**: personality, knowledge, instructions, examples
   - **Categoria**: institutional-master, clinical-methodology, education, research, etc.
6. Salve

### **Opção 4: Upload de Arquivos** 📁

1. Acesse: `/app/migrar-base` ou `/app/admin`
2. Clique em **"Upload Arquivos"**
3. Selecione seus arquivos .txt (suporte para .docx e .pdf em desenvolvimento)
4. O sistema processará automaticamente

---

## 📊 Como Verificar se Funcionou

### **Pelo Admin Dashboard:**

1. Acesse `/app/admin`
2. Vá na aba **"Base de Conhecimento"**
3. Clique em **"Verificar Base"**
4. Deve aparecer um alert com o número de documentos encontrados

### **Pelo GPT Builder:**

1. Acesse `/app/admin`
2. No chat, pergunte: "Consulte a base de conhecimento"
3. A Nôa deve acessar e listar os documentos disponíveis

### **Pelo Supabase:**

```sql
SELECT
  title,
  type,
  category,
  LENGTH(content) as tamanho,
  created_at
FROM documentos_mestres
WHERE is_active = true
ORDER BY created_at DESC;
```

---

## 🔧 Estrutura dos Documentos

Cada documento na base tem:

```typescript
{
  id: UUID,
  title: string,                    // "📘 Documento Mestre..."
  content: string,                  // Texto completo
  type: string,                     // 'personality', 'knowledge', 'instructions', 'examples'
  category: string,                 // 'institutional-master', 'clinical-methodology', etc.
  is_active: boolean,               // true/false
  created_at: timestamp,
  updated_at: timestamp,
  created_by: UUID                  // Referência ao usuário
}
```

### **Tipos Disponíveis:**

- 📋 **personality**: Define a personalidade da Nôa
- 📚 **knowledge**: Base de conhecimento geral
- 📝 **instructions**: Instruções específicas (como avaliação clínica)
- 💡 **examples**: Exemplos de uso
- 🏗️ **development-milestone**: Marcos de desenvolvimento
- 📁 **uploaded-document**: Documentos enviados por upload

### **Categorias Sugeridas:**

- `institutional-master`: Documento mestre da instituição
- `clinical-methodology`: Metodologia clínica
- `education`: Educação e cursos
- `research`: Pesquisa e doutorado
- `clinical-assessment`: Avaliação clínica
- `access-control`: Controle de acesso
- `platform-concept`: Conceito da plataforma

---

## 🚨 Problemas Comuns

### **1. "Erro ao acessar base de conhecimento"**

**Causa**: Tabela não existe ou sem permissões RLS
**Solução**: Execute o script SQL completo no Supabase

### **2. "0 documentos encontrados"**

**Causa**: Documentos não foram adicionados ainda
**Solução**: Use a Opção 1 (Migração Automática)

### **3. "Erro de permissão (403)"**

**Causa**: RLS (Row Level Security) bloqueando acesso
**Solução**: Configure as policies no Supabase:

```sql
-- Permitir leitura pública dos documentos
CREATE POLICY "Permitir leitura de documentos" ON documentos_mestres
FOR SELECT USING (is_active = true);

-- Permitir escrita apenas para admins
CREATE POLICY "Permitir criação para admins" ON documentos_mestres
FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM auth.users WHERE email = 'seuemailadmin@example.com')
);
```

### **4. "Base vazia no chat"**

**Causa**: Chat não está buscando da base corretamente
**Solução**:

1. Verifique se os documentos existem (Opção "Verificar Base")
2. Recarregue a página do Admin
3. Teste novamente

---

## 📝 Checklist de Migração

- [ ] Acessar `/app/migrar-base`
- [ ] Verificar status atual da base
- [ ] Executar migração automática
- [ ] Verificar que documentos foram adicionados
- [ ] Testar acesso via Admin Dashboard
- [ ] Testar consulta no chat
- [ ] Adicionar documentos customizados (se necessário)

---

## 🎯 Próximos Passos

Depois de migrar a base:

1. **Testar a Nôa**: Converse com ela e veja se ela acessa os documentos
2. **Adicionar Mais Documentos**: Conforme necessário, adicione novos documentos
3. **Organizar por Categoria**: Mantenha uma estrutura organizada
4. **Backup Regular**: Exporte os documentos periodicamente

---

## 💡 Dicas

- ✅ Mantenha os títulos descritivos e com emojis para facilitar identificação
- ✅ Use categorias consistentes
- ✅ Documentos longos são OK - o sistema lida bem com eles
- ✅ Atualize documentos existentes ao invés de criar duplicatas
- ✅ Marque documentos antigos como `is_active = false` ao invés de deletar

---

## 🆘 Suporte

Se tiver problemas:

1. Verifique o console do navegador (F12)
2. Verifique os logs do Supabase
3. Teste as queries SQL diretamente no Supabase
4. Entre em contato com a equipe de desenvolvimento

---

**Última atualização**: 07 de Outubro de 2025
