const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Gerar par de chaves RSA
app.post('/generate-keys', (req, res) => {
  try {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048, // Tamanho da chave em bits
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });

    res.json({
      privateKey,
      publicKey
    });
  } catch (error) {
    console.error('Error generating keys:', error); // Logar o erro
    res.status(500).send('Error generating keys');
  }
});

// Criptografar dados com chave pública
app.post('/encrypt', (req, res) => {
  const { publicKey, data } = req.body;

  try {
    // Criptografar os dados com a chave pública
    const bufferPublicKey = Buffer.from(publicKey);
    const encryptedData = crypto.publicEncrypt(
      {
        key: bufferPublicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
      },
      Buffer.from(data)
    );

    res.json({
      encryptedData: encryptedData.toString('base64')
    });
  } catch (error) {
    console.error('Encryption error:', error); // Logar o erro
    res.status(500).send('Error encrypting data');
  }
});

// Descriptografar dados com chave privada
app.post('/decrypt', (req, res) => {
  const { privateKey, encryptedData } = req.body;

  try {
    const bufferPrivateKey = Buffer.from(privateKey);

    // Descriptografar os dados com a chave privada
    const decryptedData = crypto.privateDecrypt(
      {
        key: bufferPrivateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
      },
      Buffer.from(encryptedData, 'base64')
    );

    res.json({
      decryptedData: decryptedData.toString('utf8')
    });
  } catch (error) {
    console.error('Decryption error:', error); // Logar o erro
    res.status(500).send('Error decrypting data');
  }
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});




