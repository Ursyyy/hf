const { Gateway, InMemoryWallet } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { X509 } = require("jsrsasign");
var rsu = require("jsrsasign-util");

module.exports.getConnectedProfile = function getConnectedProfile(company) {
  try {
    let mspId = {
      org2: "Org2MSP",
      org1: "Org1MSP",
    };

    let ccpPath;
    let connectionProfile;
    let caInfo;
    let caTLSCACerts;
    let mspid = mspId[company];
    let ca;

    switch (mspid) {
      case "Org1MSP":
        // load the network configuration
        ccpPath = path.resolve("../exp/gateway/connection-org1.yaml");

        connectionProfile = yaml.safeLoad(fs.readFileSync(ccpPath, "utf8"));
        caInfo = connectionProfile.certificateAuthorities["ca.org1.example.com"];
        caTLSCACerts = caInfo.tlsCACerts.pem;
        ca = new FabricCAServices(caInfo.url);
        return { connectionProfile, ca, caTLSCACerts, mspid };
        break;

      case "Org2MSP":
        // load the network configuration
        ccpPath = path.resolve("../exp/gateway/connection-org2.yaml");
        connectionProfile = yaml.safeLoad(fs.readFileSync(ccpPath, "utf8"));
        caInfo = connectionProfile.certificateAuthorities["ca.org2.example.com"];
        caTLSCACerts = caInfo.tlsCACerts.pem;
        ca = new FabricCAServices(caInfo.url);
        return { connectionProfile, ca, caTLSCACerts, mspid };
        break;

      default:
        return { error: "Invalid company mspid." };
    }
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

module.exports.pemParse = function pemParse(pemStr) {
  let c = new X509();
  c.readCertPEM(pemStr);

  let data = c.getSubjectString();

  // var sIssuer    = c.getIssuerString();    // '/C=US/O=z2'
  // var sSubject   = c.getSubjectString();   // '/C=US/O=z2'
  // var sNotBefore = c.getNotBefore();       // '100513235959Z'
  // var sNotAfter  = c.getNotAfter();        // '200513235959Z'

  console.log(data)
  
  let org = data.slice(data.indexOf("org"), data.indexOf("org") + 4);
  let name = data.split(/[=|+|\n]/).reverse()[0];
  let company;

  switch (org) {
    case "org1":
      company = "digibank";
      break;

    case "org2":
      company = "magnetocorp";
      break;

    default:
      return { error: "Invalid company mspid." };
  }
  console.log(org, name, company)
  return { org, name, company };
};
