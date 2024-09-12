const express = require('express');
const bodyParser = require('body-parser');
const { ethers } = require('ethers');

const app = express();
const port = 3000;

// Middleware para analisar o corpo das requisições como JSON
app.use(bodyParser.json());

/**
 * Função para recuperar a chave pública a partir do endereço, mensagem e assinatura
 * @param {string} address - Endereço Ethereum da wallet EOA
 * @param {string} message - Mensagem que foi assinada
 * @param {string} signature - Assinatura da mensagem
 * @returns {string} Chave pública
 */
function getPublicKeyFromAddress(address, message, signature) {
    try {
        // Recuperar o endereço a partir da assinatura e da mensagem
        const recoveredAddress = ethers.utils.verifyMessage(message, signature);
        
        if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
            throw new Error('Endereço não corresponde à assinatura fornecida');
        }

        // Neste ponto, não é possível obter a chave pública diretamente do endereço.
        // A chave pública deve ser conhecida ou derivada de outras formas.
        return 'Chave pública não pode ser derivada apenas com o endereço.';
    } catch (error) {
        throw new Error('Erro ao recuperar a chave pública: ' + error.message);
    }
}

// Rota POST para obter a chave pública
app.post('/get-public-key', (req, res) => {
    const { address, message, signature } = req.body;

    if (!address || !message || !signature) {
        return res.status(400).json({ error: 'Todos os parâmetros são obrigatórios.' });
    }

    try {
        const publicKey = getPublicKeyFromAddress(address, message, signature);
        res.json({ publicKey });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor API rodando em http://localhost:${port}`);
});
