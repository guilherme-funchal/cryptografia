# Instalação pacotes
```
npm install
```

## Para teste de criptografia com RSA
Teste de Crypto RSA
```
node rsa.js
```
## Para teste de criptografia com RSA
Teste de Crypto carteiras nativas com criptografia assimetria
```
node eciejs.js teste de Crypto carteiras nativas com criptografia assimetria
```

## Pra teste : 

### Encriptar
Post http://localhost:3000/encrypt
Json : 
{
  "recipientPublicKey": "chave publica",
  "message": "Esta é uma mensagem secreta"
}

### Decriptar
Post http://localhost:3000/decrypt
{
  "encryptedMessage": "texto criptografado",
	 "recipientPrivateKey": "Chave privada"
}
