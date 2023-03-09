const express = require('express');
const cors = require('cors');
const Web3 = require('web3');
const contract = require('truffle-contract');
const passwordManagerArtifact = require('./build/contracts/PasswordManager.json');

const app = express();
app.use(cors());
app.use(express.json());

const provider = new Web3.providers.HttpProvider('http://localhost:8545');
const web3 = new Web3(provider);

const PasswordManager = contract(passwordManagerArtifact);
PasswordManager.setProvider(provider);

app.post('/api/addPassword', async (req, res) => {
    const { account, password } = req.body;
    const passwordManagerInstance = await PasswordManager.deployed();
    const encryptedPassword = web3.utils.fromAscii(password.encryptedPassword);
    const iv = web3.utils.fromAscii(password.iv);
    const salt = web3.utils.fromAscii(password.salt);
    await passwordManagerInstance.addPassword(encryptedPassword, iv, salt, { from: account });
    res.json({ success: true });
});

app.get('/api/getPasswords', async (req, res) => {
    const { account } = req.query;
    const passwordManagerInstance = await PasswordManager.deployed();
    const result = await passwordManagerInstance.getPasswords({ from: account });
    const passwords = result[0].map((encryptedPassword, index) => ({
        encryptedPassword: web3.utils.toAscii(encryptedPassword).replace(/\0/g, ''),
        iv: web3.utils.toAscii(result[1][index]).replace(/\0/g, ''),
        salt: web3.utils.toAscii(result[2][index]).replace(/\0/g, ''),
   
}));
res.json({ passwords });
app.delete('/api/deletePassword', async (req, res) => {
const { account, index } = req.query;
const passwordManagerInstance = await PasswordManager.deployed();
await passwordManagerInstance.deletePassword(index, { from: account });
res.json({ success: true });
});

app.listen(3001, () => {
console.log('Server listening on port 3001');
});
