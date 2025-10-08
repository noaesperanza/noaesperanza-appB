#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🔗 GERAÇÃO DE HASH COLETIVO PARA NFT
Gera hash coletivo de todas as interações para registro em blockchain
Dr. Ricardo Valença - Outubro 2025
"""

import hashlib
import datetime
import json
import psycopg2

# ========================================
# CONFIGURAÇÕES
# ========================================

SUPABASE_CONFIG = {
    "host": "YOUR_SUPABASE_HOST",
    "port": 5432,
    "dbname": "postgres",
    "user": "postgres",
    "password": "YOUR_PASSWORD"
}

USUARIO = "iaianoaesperanza@gmail.com"

# ========================================
# FUNÇÕES
# ========================================

def conectar_banco():
    """Conecta ao Supabase"""
    try:
        conn = psycopg2.connect(**SUPABASE_CONFIG)
        print("✅ Conectado ao Supabase")
        return conn
    except Exception as e:
        print(f"❌ Erro ao conectar: {e}")
        raise

def gerar_hash_coletivo(conn, usuario: str = None):
    """Gera hash coletivo de todas as interações"""
    cur = conn.cursor()
    
    # Query para buscar todas as interações
    if usuario:
        query = """
            SELECT hash_integridade, data, conteudo::text
            FROM interacoes_noa 
            WHERE usuario = %s
            ORDER BY data ASC;
        """
        cur.execute(query, (usuario,))
    else:
        query = """
            SELECT hash_integridade, data, conteudo::text
            FROM interacoes_noa 
            ORDER BY data ASC;
        """
        cur.execute(query)
    
    rows = cur.fetchall()
    
    if not rows:
        print("⚠️ Nenhuma interação encontrada")
        return None
    
    print(f"📊 {len(rows)} interações encontradas")
    
    # Concatenar todos os hashes em ordem cronológica
    hashes_concatenados = ''.join([row[0] for row in rows])
    
    # Gerar hash coletivo
    hash_coletivo = hashlib.sha256(hashes_concatenados.encode('utf-8')).hexdigest()
    
    # Metadata adicional
    primeira_data = rows[0][1]
    ultima_data = rows[-1][1]
    
    metadata = {
        'total_interacoes': len(rows),
        'primeira_interacao': primeira_data.isoformat() if primeira_data else None,
        'ultima_interacao': ultima_data.isoformat() if ultima_data else None,
        'usuario': usuario,
        'gerado_em': datetime.datetime.utcnow().isoformat()
    }
    
    # Salvar auditoria
    timestamp = datetime.datetime.utcnow().isoformat()
    descricao = f"Hash coletivo {'do usuário ' + usuario if usuario else 'de todas as interações'} – {timestamp}"
    
    cur.execute("""
        INSERT INTO auditoria_simbolica (descricao, hash_coletivo, metadata)
        VALUES (%s, %s, %s)
        RETURNING id;
    """, (descricao, hash_coletivo, json.dumps(metadata)))
    
    auditoria_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    
    return {
        'hash_coletivo': hash_coletivo,
        'metadata': metadata,
        'auditoria_id': auditoria_id
    }

def exibir_resultado(resultado: dict):
    """Exibe resultado formatado"""
    print("\n" + "="*70)
    print("🔗 HASH COLETIVO GERADO")
    print("="*70)
    print(f"\n📊 Total de interações: {resultado['metadata']['total_interacoes']}")
    print(f"📅 Primeira interação: {resultado['metadata']['primeira_interacao']}")
    print(f"📅 Última interação: {resultado['metadata']['ultima_interacao']}")
    print(f"👤 Usuário: {resultado['metadata']['usuario'] or 'Todos'}")
    print(f"\n🔗 Hash Coletivo:")
    print(f"   {resultado['hash_coletivo']}")
    print(f"\n💾 ID da Auditoria: {resultado['auditoria_id']}")
    print("\n" + "="*70)
    print("\n📝 Próximos passos:")
    print("   1. Use este hash para criar NFT no blockchain")
    print("   2. Registre o token_id de volta na tabela auditoria_simbolica")
    print("   3. Atualize o campo nft_contract_address com o endereço do contrato")
    print("\n" + "="*70 + "\n")

# ========================================
# FUNÇÃO PRINCIPAL
# ========================================

def main():
    """Executa geração de hash coletivo"""
    print("\n🔗 GERAÇÃO DE HASH COLETIVO PARA NFT\n")
    
    try:
        conn = conectar_banco()
    except:
        print("\n📝 Configure suas credenciais Supabase no script")
        return
    
    # Gerar hash coletivo
    resultado = gerar_hash_coletivo(conn, USUARIO)
    
    if resultado:
        exibir_resultado(resultado)
        
        # Salvar em arquivo para referência
        with open('hash_coletivo_nft.json', 'w', encoding='utf-8') as f:
            json.dump(resultado, f, indent=2, ensure_ascii=False)
        print("💾 Resultado também salvo em: hash_coletivo_nft.json\n")
    
    conn.close()

if __name__ == "__main__":
    main()

