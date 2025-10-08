# 🚀 SOLUÇÃO RÁPIDA - Base de Conhecimento

Dr. Ricardo, aqui está a solução para o problema dos documentos que não aparecem!

---

## 🎯 O QUE FAZER AGORA (3 Passos Simples)

### **PASSO 1: Iniciar a Aplicação**

```bash
npm run dev
```

### **PASSO 2: Acessar a Ferramenta de Migração**

```
http://localhost:5173/app/migrar-base
```

OU

```
Admin Dashboard → Link "Migrar Base de Conhecimento"
```

### **PASSO 3: Migrar os Documentos**

1. Clique em **"Verificar Base"** (ver quantos documentos já existem)
2. Clique em **"Iniciar Migração Automática"**
3. Aguarde 10-15 segundos
4. ✅ Pronto! 5 documentos adicionados

---

## 📚 O QUE FOI MIGRADO

Automaticamente serão adicionados:

1. 📘 **Documento Mestre Institucional**
2. 🎭 **Arte da Entrevista Clínica**
3. 📚 **Curso Arte da Entrevista Clínica**
4. 🔬 **Projeto de Doutorado**
5. 📋 **Instruções de Avaliação Clínica**

---

## ✅ COMO VERIFICAR SE FUNCIONOU

### **Opção 1: Pelo Admin**

```
1. Ir para /app/admin
2. Clicar em aba "Base de Conhecimento"
3. Deve aparecer lista com 5+ documentos
```

### **Opção 2: Pelo Botão "Verificar Base"**

```
1. Na página de migração
2. Clicar em "Verificar Base"
3. Deve aparecer: "📚 Base de Conhecimento: 5 documentos encontrados"
```

### **Opção 3: Conversando com a Nôa**

```
1. Ir para /app/admin
2. No chat, digitar: "Consulte a base de conhecimento"
3. A Nôa deve listar os documentos
```

---

## 📁 ADICIONAR SEUS DOCUMENTOS MANUALMENTE

Se quiser adicionar os PDFs e DOCXs do ChatGPT antigo:

### **Método 1: Copiar e Colar**

```
1. Abrir o arquivo .docx/.pdf
2. Copiar o conteúdo
3. Ir para /app/admin → Base de Conhecimento
4. Clicar em "Novo Documento"
5. Colar o conteúdo
6. Configurar tipo e categoria
7. Salvar
```

### **Método 2: SQL Direto (Mais Rápido)**

```
1. Abrir Supabase Dashboard
2. SQL Editor
3. Colar o script "migrar_base_conhecimento.sql"
4. Executar
5. ✅ Documentos adicionados instantaneamente
```

---

## 🆘 SE DER ERRO

### **Erro: "Tabela não existe"**

→ Execute o script SQL no Supabase primeiro

### **Erro: "0 documentos encontrados"**

→ Use a migração automática

### **Erro: "Permissão negada (403)"**

→ Configure RLS no Supabase (veja guia completo)

---

## 📞 LINKS ÚTEIS

- **Ferramenta Web**: `/app/migrar-base`
- **Admin Dashboard**: `/app/admin`
- **Base de Conhecimento**: `/app/admin` → aba "Base de Conhecimento"
- **Guia Completo**: `GUIA_MIGRACAO_BASE_CONHECIMENTO.md`
- **Script SQL**: `migrar_base_conhecimento.sql`

---

## ⏱️ TEMPO ESTIMADO

- ✅ Migração Automática: **15 segundos**
- ✅ SQL Direto: **5 segundos**
- ✅ Manual (por documento): **2-3 minutos**

---

**🎉 É só isso! Simples e rápido.**

Se preferir, pode usar o SQL direto no Supabase que é mais rápido ainda (5 segundos).

---

**Última atualização**: 07 de Outubro de 2025
