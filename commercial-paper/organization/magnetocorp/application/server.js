const express = require("express");
const bodyParser = require("body-parser");
const enrollAdmin = require("./enrollAdmin.js");
const enrollUser = require("./enrollUser.js");
const issue = require("./issue.js");
const history = require("./cpListener.js");
const registerUser = require("./registerUser.js");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(bodyParser());

app.post("/api/enrolladmin", (req, res) => {

    const {pem} = req.body;
    console.log(pem)
    enrollAdmin(pem).then((data) => {
      console.log(data);
      res.json(data);
    });

});

app.post("/api/registeruser", (req, res) => {
    const { name, adminPem } = req.body;
    console.log(name);
    registerUser(name, adminPem).then((data) => {
      console.log(data, name);
      res.json(data);
    });
  });


app.get("/api/enrolluser", (req, res) => {
  const { name, admin, adminPass } = req.body;
  enrollUser(name, admin, adminPass).then((data) => {
    console.log(data);
    res.json(data);
  });
});


app.post("/api/issue", (req, res) => {
  
  const { name, certificate, paperNumber, org, releaseDate, redeemDate, cost } = req.body;
  console.log(req.body);
  issue(name, certificate, paperNumber, org, releaseDate, redeemDate, cost)
  .then(data => {
      console.log('test+++++++++', data)
      res.send(data)
  });
});

app.post("/api/history", (req, res) => {
  let data = req.body;
  console.log(data);
  history();
  // .then(data => {
  //     res.json(data);
  // });
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
