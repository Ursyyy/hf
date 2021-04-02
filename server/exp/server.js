const express = require("express");
const bodyParser = require("body-parser");
var cors = require('cors')


const enrollAdmin = require("./scripts/enrollAdmin");
const issue = require("./scripts/issue.js");
const buy = require("./scripts/buy.js");
const queryApp = require("./scripts/queryapp.js");
const redeem = require("./scripts/redeem.js");

// const history = require("./cpListener.js");


const registerUser = require("./scripts/registerUser");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors())
app.use(bodyParser());

app.post("/api/enrolladmin", (req, res) => {

    const { company } = req.body;
    console.log(company)
    enrollAdmin(company).then((data) => {
      console.log(data);
      res.json(data);
    });

});

app.post("/api/registeruser", (req, res) => {
    const { name, company } = req.body;
    console.log(name, company );
    registerUser( name, company ).then((data) => {
      console.log(data);
      res.json(data);
    });
  });

  app.post("/api/issue", (req, res) => {
  
  const { name, x509Identity, paperNumber, company, releaseDate, redeemDate, cost } = req.body;
  console.log(req.body);
  issue(name, x509Identity, paperNumber, company, releaseDate, redeemDate, cost)
  .then(data => {
      console.log('test+++++++++', data)
      res.send(data)
  });
});

app.post("/api/buy", (req, res) => {
  
  const { name, company, x509Identity } = req.body;
  console.log(req.body);
  buy( name, company, x509Identity )
  .then(data => {
      console.log('test+++++++++', data)
      res.send(data)
  });
});

app.post("/api/redeem", (req, res) => {
  
  const { name, company, x509Identity } = req.body;
  console.log(req.body);
  redeem( name, company, x509Identity )
  .then(data => {
      console.log('test+++++++++', data)
      res.send(data)
  });
});

app.post("/api/history", (req, res) => {
  
  const { name, company, x509Identity } = req.body;
  console.log(x509Identity.credentials);
  queryApp( name, company, x509Identity )
  .then(data => {
      console.log('test+++++++++', data)
      res.send(data)
  });
});


app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
