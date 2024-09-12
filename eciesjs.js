const express = require('express');
const elliptic = require('elliptic');
const ecies = require('eciesjs');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const EC = elliptic.ec;
const ec = new EC('secp256k1');

// Gerar chaves para o destinatário
const recipientKey = ec.genKeyPair();
const recipientPublicKey = recipientKey.getPublic('hex');
const recipientPrivateKey = recipientKey.getPrivate('hex');

app.use(bodyParser.json());

app.post('/generate-keys', (req, res) => {
  const senderKey = ec.genKeyPair();
  res.json({
    publicKey: senderKey.getPublic('hex'),
    privateKey: senderKey.getPrivate('hex')
  });
});

app.post('/encrypt', (req, res) => {
  const { message, recipientPublicKey } = req.body;
  if (!message || !recipientPublicKey) {
    return res.status(400).send('Missing message or recipientPublicKey');
  }

  try {
    const encryptedMessage = ecies.encrypt(
      Buffer.from(recipientPublicKey, 'hex'),
      Buffer.from(message, 'utf8')
    );
    res.json({
      encryptedMessage: encryptedMessage.toString('hex')
    });
  } catch (err) {
    res.status(500).send('Encryption failed');
  }
});

app.post('/decrypt', (req, res) => {
  const { encryptedMessage, recipientPrivateKey } = req.body;
  if (!encryptedMessage || !recipientPrivateKey) {
    return res.status(400).send('Missing encryptedMessage or recipientPrivateKey');
  }

  try {
    const decryptedMessage = ecies.decrypt(
      Buffer.from(recipientPrivateKey, 'hex'),
      Buffer.from(encryptedMessage, 'hex')
    );
    res.json({
      decryptedMessage: decryptedMessage.toString('utf8')
    });
  } catch (err) {
    res.status(500).send('Decryption failed');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});




