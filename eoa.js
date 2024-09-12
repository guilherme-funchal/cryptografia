const express = require('express');
const { toBuffer, bufferToHex, publicToAddress, ecrecover, keccak256 } = require('ethereumjs-util');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Função para obter a chave pública a partir do endereço e assinatura
function addressToPublicKey(address, signature, message) {
  const addressBuffer = toBuffer(address);

  // Hash da mensagem
  const messageHash = keccak256(message);

  // Recupera a chave pública a partir da assinatura e hash da mensagem
  const pubKey = ecrecover(messageHash, signature.v, signature.r, signature.s);

  // Gera o endereço a partir da chave pública
  const recoveredAddress = publicToAddress(pubKey);

  // Verifica se o endereço recuperado corresponde ao endereço fornecido
  if (Buffer.compare(addressBuffer, recoveredAddress) === 0) {
    return bufferToHex(pubKey);
  } else {
    throw new Error('Address does not match');
  }
}

app.post('/generate-keys', (req, res) => {
  const { privateKey } = req.body;
  const publicKey = privateToPublic(toBuffer(privateKey));
  const address = pubToAddress(publicKey);
  
  res.json({
    publicKey: bufferToHex(publicKey),
    address: bufferToHex(address),
    privateKey: privateKey
  });
});

app.post('/encrypt', (req, res) => {
  const { message, recipientPublicKey } = req.body;
  if (!message || !recipientPublicKey) {
    return res.status(400).send('Missing message or recipientPublicKey');
  }

  try {
    const bufferMessage = Buffer.from(message, 'utf8');
    const encryptedMessage = publicEncrypt(
      {
        key: recipientPublicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      bufferMessage
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
    const bufferMessage = Buffer.from(encryptedMessage, 'hex');
    const decryptedMessage = privateDecrypt(
      {
        key: recipientPrivateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      bufferMessage
    );

    res.json({
      decryptedMessage: decryptedMessage.toString('utf8')
    });
  } catch (err) {
    res.status(500).send('Decryption failed');
  }
});

app.post('/address-to-public-key', (req, res) => {
  const { address, signature, message } = req.body;
  if (!address || !signature || !message) {
    return res.status(400).send('Missing address, signature, or message');
  }

  try {
    const publicKey = addressToPublicKey(address, signature, message);
    res.json({
      publicKey
    });
  } catch (err) {
    res.status(400).send('Address does not match or conversion failed');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
