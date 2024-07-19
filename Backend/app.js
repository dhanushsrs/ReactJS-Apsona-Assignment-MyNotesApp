const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();
const port = 8000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Static files (for serving HTML, CSS, JS files)
app.use(express.static("public"));

// In-memory store for simplicity
const users = [{ username: "Testuser", password: "adminPassword" }];

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the login page");
});

/*app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});*/

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Simulate user authentication
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    req.session.user = user; // Store user information in session
    res.redirect("/dashboard");
  } else {
    res.send("Invalid username or password");
  }
});

app.get("/dashboard", (req, res) => {
  if (req.session.user) {
    res.send(`Welcome ${req.session.user.username} to the dashboard`);
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect("/");
  });
});

// Start server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
