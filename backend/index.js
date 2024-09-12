const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require('path')
JWT_SECRET = "thisisatodosapp";
usersFilename = "users.json";
todosFilename = "todos.json";

let users = [];
let todos = [];

const app = express();
app.use(express.json());
app.use(express.static('../frontend'))

// Log all requests 
function logger(req, res, next) {
  console.log(`Url called: ${req.url}`);
  console.log(`Method called: ${req.method}`);
  console.log(`Request body: ${JSON.stringify(req.body)}`);
  next();
}

// Logger middleware for all subsequent endpoints defined
app.use(logger);

// Serve frontend
app.get("/", (req, res) => {
    res.sendFile(path.resolve(`${__dirname}/../frontend/index.html`))    
})

// Fetch data from the given filename
async function getDataFromFile(filename) {
  let fileData = [];
  fs.readFile(filename, "utf-8", (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        console.log("File not found. Creating a new one.");
        fileData = [];
        saveFiles(filename, fileData);
      } else if (err instanceof SyntaxError) {
        console.log("Error parsing JSON. Initializing with empty array.");
        fileData = [];
      } else {
        console.log("Error reading file:", err.message);
        throw err;
      }
    } else {
      if (data.length === 0) {
        fileData = [];
      } else {
        fileData = JSON.parse(data);
      }
    }
  });
  return fileData;
}

// Save given data to the filename specified
async function saveFiles(filename, data) {
  await fs.writeFile(filename, JSON.stringify(data), (err) => {
    if (err) {
      console.log(`error in writing file: ${err}`);
    } else {
      console.log("file write successful");
    }
  });
}

// Get all the existing todos
todos = getDataFromFile(todosFilename);
// Get all the existing users
users = getDataFromFile(usersFilename);
const maxUserId = users.length
const maxTodoId = todos.length

// Signup user
app.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (users.find((u) => u.username === username)) {
    res.status(401).json({ error: "User already exists!" });
    return;
  }

  maxUserId++
  users.push({
    id: maxUserId,
    username: username,
    password: password,
  });

  saveFiles(usersFilename, users);

  res.status(200);
});

// Signin user and return the jwt token
app.post("/signin", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const existingUser = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!existingUser) {
    res.status(401).json({ error: "User not found!" });
    return;
  }

  const token = jwt.sign({ username: username }, JWT_SECRET);

  res.status(200).json({
    token: token,
  });
});

function verifyToken(req, res, next) {
  const token = req.headers.token;

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(400).json({
        name: err.name,
        message: err.message,
      });
      return;
    }
    req.headers.decoded = decoded;
    next();
  });
}

// Verify the jwt token and use it as a middleware for all the requests hence forth
app.use(verifyToken)

app.listen(3000, ()=> {
    console.log('Listining on port 3000')
})

