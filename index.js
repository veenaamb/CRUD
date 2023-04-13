const express = require("express");
const app = express();
const port = 3001;

const USERS = [];
app.use(express.json()); //middleware to pass incoming req bodies as json, content-type app/json in header

const jwt = require("jsonwebtoken");
const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
  {
    title: "Two ssums",
    description: "Given an array sndkja ay?",
    testCases: [
      {
        input: "[1,2,5]",
        output: "8",
      },
    ],
  },
];

const SUBMISSION = [];

app.get("/users", (req, res) => {
  console.log(USERS);
  res.json(USERS);
});

app.post("/signup", (req, res) => {
  const { name, email, pwd } = req.body;

  if (!name || !email || !pwd) {
    return res
      .status(400)
      .json({ error: "Please provide name, email, and password" });
  }

  const isFound = USERS.find((user) => user.email === email);
  if (isFound) {
    console.log("given email already exists", USERS);
    res.status(409).json({ error: "given email already exists" });
  } else {
    const newUser = { name, email, pwd };
    USERS.push(newUser);
    console.log(USERS);
    res.status(201).send(`${name} has been added`);
  }
});

app.post("/login", (req, res) => {
  const { name, email, pwd } = req.body;
  if (!name || !email || !pwd) {
    return res
      .status(400)
      .json({ error: "Please provide name, email, and password" });
  }

  const userExists = USERS.find((user) => user.email === email);
  if (!userExists) {
    console.log("user does not exist");
    res.status(401).send("user does not exist");
  } else if (USERS.find((user) => user.pwd === pwd)) {
    const jwtToken = jwt.sign({ name }, "secret_key");
    console.log("logged in");
    const response = {
      success: true,
      jwt: jwtToken,
    };
    res.status(201).json(response);
    res.send("Hello World from route 2!"); //unreachable code
  } else {
    console.log("incorrect password ");
    res.status(401).send("incorrect password");
  }
});

app.get("/submissions", (req, res) => {
  res.json(SUBMISSION);
});

app.post("/submissions", (req, res) => {
  const { userid, questionid, solution } = req.body;
  if (!userid || !questionid || !solution) {
    console.log("Please sumbit a proper response");
    return res.status(401).send("Invalid submission");
  }
  SUBMISSION.push({
    userid: userid,
    questionid: questionid,
    solution: solution,
  });
  var random_boolean = Math.random() < 0.5;
  if (random_boolean) {
    res.json({ success: true });
  } else {
    res.json({ sucess: false });
  }
});

const checkAdmin = (req, res, next) => {
  const { user, title, description, testCases } = req.body;
  const { name, userRole } = user;
  console.log(user, userRole, user.name, user.role);

  if (user.role === "admin") {
    next(); // If next() is not called, the request will hang and the client will eventually time out waiting for a response.
  } else {
    res.status(401).send("user rights denied");
  }
};

app.post("/admin/questions", checkAdmin, (req, res) => {
  const { user, title, description, testCases } = req.body;
  if (!title || !description || !testCases) {
    console.warn(xhr.responseText);
    res.status(401).text("Cannot be blank");
  }
  QUESTIONS.push({
    title: title,
    description: description,
    testCases: testCases,
  });
  res.json(200).json({ sucess: "added question" });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
