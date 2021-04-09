const CommercialPaper = require("../../contract/lib/paper.js");
const { login } = require("./utils/login.js");

// const enrollAdmin = require('./enrollAdmin')
// const { getConnectedProfile } = require('./utils')
// 'issue', 'MagnetoCorp', '00001', '2020-05-31', '2020-11-30', '5000000'

module.exports = async function issue(
  certificate,
  privateKey,
  paperNumber,
  releaseDate,
  redeemDate,
  cost
) {
  const { network, company, gateway, org, name } = await login(certificate, privateKey);
  try {
    

    // const network = await gateway.getNetwork("mychannel");

    const contract = await network.getContract("papercontract");

    // issue commercial paper
    console.log("Submit commercial paper issue transaction.");

    const issueResponse = await contract.submitTransaction(
      "issue",
      company,
      paperNumber,
      releaseDate,
      redeemDate,
      cost
    );

    // process response
    console.log("Process issue transaction response." + issueResponse);

    let paper = CommercialPaper.fromBuffer(issueResponse);

    console.log(
      `${paper.issuer} commercial paper : ${paper.paperNumber} successfully issued for value ${paper.faceValue}`
    );
    console.log("Transaction complete.");
    gateway.disconnect();
    return paper;
    
  } catch (error) {
    console.log(`Error processing transaction. ${error}`);
    console.log(error.stack);
  } finally {
    // Disconnect from the gateway
    console.log("Disconnect from Fabric gateway.");
    
  }
};

