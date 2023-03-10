const express = require('express');
const app = express();
const port = 8080;

app.use(express.static('assets'));

app.get('/login', function (req, res) {
    const fileName = 'login.html';
    const filePath = __dirname + '/' + fileName;
    res.sendFile(filePath, function (err) {
        if (err) {
            console.log('Error sending file:', err);
        } else {
            console.log('File sent successfully');
        }
    });
});

app.post('/login', (req, res) => {
    const { id, password } = req.body;
  
    // perform login validation
    // ...
  
    res.send('Login successful!');
  });

app.listen(port, function () {
    console.log('Server started on port' + port);
});