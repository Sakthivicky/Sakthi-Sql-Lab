const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Login Page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>SQLi Lab</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: linear-gradient(135deg, #667eea, #764ba2);
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0;
        }

        .container {
          background: white;
          padding: 30px;
          border-radius: 10px;
          width: 300px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          text-align: center;
        }

        h2 {
          margin-bottom: 20px;
        }

        input {
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          border-radius: 5px;
          border: 1px solid #ccc;
        }

        button {
          width: 100%;
          padding: 10px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
        }

        button:hover {
          background: #5a67d8;
        }

        .hint {
          margin-top: 15px;
          font-size: 12px;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>🔐Sakthi's SQLi Lab Login</h2>
        <form method="POST" action="/login">
          <input name="username" placeholder="Username" required />
          <input name="password" type="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
        <div class="hint">
          💡 Hint: Try SQL Injection
        </div>
      </div>
    </body>
    </html>
  `);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = `
    SELECT * FROM users 
    WHERE username = '${username}' 
    AND password = '${password}'
  `;

  console.log("Query:", query);

  db.all(query, (err, rows) => {
    if (rows && rows.length > 0) {

      // ✅ Success UI
      return res.send(`
        <html>
        <body style="
          font-family: Arial;
          background: linear-gradient(135deg, #28a745, #218838);
          height:100vh;
          display:flex;
          justify-content:center;
          align-items:center;
          margin:0;
        ">
          <div style="
            background:white;
            padding:30px;
            border-radius:10px;
            text-align:center;
            box-shadow:0 10px 25px rgba(0,0,0,0.2);
          ">
            <h2 style="color:green;">✅ Login Successful</h2>
            <p>Welcome, ${username}</p>
            <a href="/" style="
              display:inline-block;
              margin-top:15px;
              padding:10px 20px;
              background:#28a745;
              color:white;
              text-decoration:none;
              border-radius:5px;
            ">Go Back</a>
          </div>
        </body>
        </html>
      `);

    } else {

      // ❌ Error UI
      return res.send(`
        <html>
        <body style="
          font-family: Arial;
          background: linear-gradient(135deg, #dc3545, #c82333);
          height:100vh;
          display:flex;
          justify-content:center;
          align-items:center;
          margin:0;
        ">
          <div style="
            background:white;
            padding:30px;
            border-radius:10px;
            text-align:center;
            box-shadow:0 10px 25px rgba(0,0,0,0.2);
          ">
            <h2 style="color:red;">❌ Invalid Credentials</h2>
            <p>Try again or test SQL Injection 😏</p>
            <a href="/" style="
              display:inline-block;
              margin-top:15px;
              padding:10px 20px;
              background:#dc3545;
              color:white;
              text-decoration:none;
              border-radius:5px;
            ">Try Again</a>
          </div>
        </body>
        </html>
      `);

    }
  });
});

// 🚨 Vulnerable Endpoint solution
// app.post('/login', (req, res) => {
//   const { username, password } = req.body;

//   db.all(
//     "SELECT * FROM users WHERE username = ? AND password = ?",
//     [username, password],
//     (err, rows) => {
//       if (rows && rows.length > 0) {
//         res.send("✅ Login Successful");
//       } else {
//         res.send("❌ Invalid Credentials");
//       }
//     }
//   );
// });

app.listen(3000, '0.0.0.0', () => {
  console.log("App running on http://0.0.0.0:3000");
});