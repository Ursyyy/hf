const { authentication } = require("./auth");
const { getConnectedProfile, pemParse } = require("./index.js");

module.exports.login = async function login(certificate, privateKey) {
  try {
    const {name, org, company} = pemParse(certificate);
    console.log('after pemParse________>', org)
    const { connectionProfile, mspid } = getConnectedProfile(org);

    let gateway = await authentication(
      certificate,
      privateKey,
      mspid,
      connectionProfile,
      name
    );
    console.log('<------------------------------------------>');  
    const network = await gateway.getNetwork('mychannel');
    console.log('<------------------------------------------>');
    return { network, gateway, org, company, name };

  } catch (error) {
    console.log(`Error processing transaction. ${error}`);
    console.log(error.stack);
  } finally {
    console.log("Disconnect from Fabric gateway.");
  }
};
