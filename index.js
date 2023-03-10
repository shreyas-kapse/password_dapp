const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const port = 8080;
const uri =
  "mongodb+srv://adminritz:9NUFiq51bQzUDzWy@cluster0.louh2fc.mongodb.net/?retryWrites=true&w=majority";

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connect() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
}

const collection = client.db("creds").collection("cred_coll");

async function insertDocument(document) {
  try {
    const result = await collection.insertOne(document);
    console.log(`Inserted document with _id: ${result.insertedId}`);
  } catch (err) {
    console.error(err);
  }
}


app.use(express.static("assets"));

app.get("/login", function (req, res) {
  const fileName = "login.html";
  const filePath = __dirname + "/" + fileName;
  res.sendFile(filePath, function (err) {
    if (err) {
      console.log("Error sending file:", err);
    } else {
      console.log("File sent successfully");
    }
  });
});
app.get("/signup", function (req, res) {
  const fileName = "signup.html";
  const filePath = __dirname + "/" + fileName;
  res.sendFile(filePath, function (err) {
    if (err) {
      console.log("Error sending file:", err);
    } else {
      console.log("File sent successfully");
    }
  });
});

app.post("/submit-form", async (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  await insertDocument({ username, email, password });
  res.send("Form submitted!");
});

app.post("/login-check", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const result = await collection.findOne({ username, password });
    if (result) {
      res.send("Login successful!");
    }
    else{
      const user = await collection.findOne({ username });
      if(user){
        res.send("Wrong password!");
      }
      else{
        res.send("User not found!");
      }
    }
  } catch (err) {
    console.error(err);
  }
});

// app.post('/login', (req, res) => {
//     const { id, password } = req.body;

//     // perform login validation
//     // ...

//     res.send('Login successful!');
//   });

// app.listen(port, function () {
//     console.log('Server started on port' + port);
// });

connect()
  .then(() => {
    app.listen(port, () => {
      console.log("Server started on port " + port);
    });
  })
  .catch(console.error);
