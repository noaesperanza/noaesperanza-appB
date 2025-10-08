// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title EscuteseNFT
 * @dev Smart Contract para registro de hashes coletivos como NFTs
 * @author Dr. Ricardo Valença - Nôa Esperanza
 * 
 * Este contrato permite criar NFTs representando hashes coletivos
 * das conversas migradas, garantindo auditabilidade e imutabilidade.
 */

contract EscuteseNFT {
    // Nome do projeto
    string public name = "Escute-se 2.0 - Nôa Esperanza";
    
    // Símbolo do token
    string public symbol = "ESC";
    
    // Contador de tokens
    uint256 public tokenCount = 0;
    
    // Mapping de tokenId para URI (metadata)
    mapping(uint256 => string) public tokenURIs;
    
    // Mapping de tokenId para hash coletivo
    mapping(uint256 => string) public hashes;
    
    // Mapping de tokenId para proprietário
    mapping(uint256 => address) public owners;
    
    // Mapping de hash para tokenId (evitar duplicatas)
    mapping(string => uint256) public hashToToken;
    
    // Mapping de tokenId para metadata adicional
    mapping(uint256 => TokenMetadata) public tokenMetadata;
    
    // Struct para metadata do token
    struct TokenMetadata {
        string hash;
        string description;
        uint256 totalConversas;
        uint256 timestamp;
        address creator;
    }
    
    // Eventos
    event NFTMinted(
        uint256 indexed tokenId, 
        string hash, 
        string uri, 
        address indexed creator,
        uint256 timestamp
    );
    
    event MetadataUpdated(
        uint256 indexed tokenId,
        string newUri
    );
    
    /**
     * @dev Cria um novo NFT com o hash coletivo
     * @param hash Hash coletivo SHA-256 das conversas
     * @param uri URI para os metadados (pode ser IPFS)
     * @param description Descrição do registro
     * @param totalConversas Número total de conversas no hash
     * @return tokenId ID do token criado
     */
    function mint(
        string memory hash,
        string memory uri,
        string memory description,
        uint256 totalConversas
    ) public returns (uint256) {
        // Verificar se hash já foi usado
        require(hashToToken[hash] == 0, "Hash ja registrado");
        require(bytes(hash).length == 64, "Hash invalido (deve ser SHA-256)");
        
        // Incrementar contador
        tokenCount++;
        uint256 newTokenId = tokenCount;
        
        // Registrar dados
        tokenURIs[newTokenId] = uri;
        hashes[newTokenId] = hash;
        owners[newTokenId] = msg.sender;
        hashToToken[hash] = newTokenId;
        
        // Registrar metadata
        tokenMetadata[newTokenId] = TokenMetadata({
            hash: hash,
            description: description,
            totalConversas: totalConversas,
            timestamp: block.timestamp,
            creator: msg.sender
        });
        
        // Emitir evento
        emit NFTMinted(newTokenId, hash, uri, msg.sender, block.timestamp);
        
        return newTokenId;
    }
    
    /**
     * @dev Retorna informações de um NFT
     * @param tokenId ID do token
     * @return hash Hash coletivo
     * @return uri URI dos metadados
     * @return owner Proprietário do token
     */
    function getNFT(uint256 tokenId) public view returns (
        string memory hash,
        string memory uri,
        address owner
    ) {
        require(tokenId > 0 && tokenId <= tokenCount, "Token nao existe");
        return (hashes[tokenId], tokenURIs[tokenId], owners[tokenId]);
    }
    
    /**
     * @dev Retorna metadata completa de um token
     * @param tokenId ID do token
     * @return metadata Struct com todos os dados
     */
    function getTokenMetadata(uint256 tokenId) public view returns (TokenMetadata memory) {
        require(tokenId > 0 && tokenId <= tokenCount, "Token nao existe");
        return tokenMetadata[tokenId];
    }
    
    /**
     * @dev Verifica se um hash já foi registrado
     * @param hash Hash para verificar
     * @return exists True se já existe
     * @return tokenId ID do token (0 se não existe)
     */
    function hashExists(string memory hash) public view returns (
        bool exists,
        uint256 tokenId
    ) {
        tokenId = hashToToken[hash];
        exists = tokenId > 0;
        return (exists, tokenId);
    }
    
    /**
     * @dev Atualiza URI de um token (apenas criador)
     * @param tokenId ID do token
     * @param newUri Nova URI
     */
    function updateTokenURI(uint256 tokenId, string memory newUri) public {
        require(tokenId > 0 && tokenId <= tokenCount, "Token nao existe");
        require(owners[tokenId] == msg.sender, "Apenas o criador pode atualizar");
        
        tokenURIs[tokenId] = newUri;
        emit MetadataUpdated(tokenId, newUri);
    }
    
    /**
     * @dev Retorna total de NFTs criados
     * @return total Número total de tokens
     */
    function totalSupply() public view returns (uint256) {
        return tokenCount;
    }
    
    /**
     * @dev Retorna proprietário de um token
     * @param tokenId ID do token
     * @return owner Endereço do proprietário
     */
    function ownerOf(uint256 tokenId) public view returns (address) {
        require(tokenId > 0 && tokenId <= tokenCount, "Token nao existe");
        return owners[tokenId];
    }
}

