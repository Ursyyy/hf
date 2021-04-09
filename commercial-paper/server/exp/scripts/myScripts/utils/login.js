const { authentication } = require("./auth");
const { getConnectedProfile, pemParse } = require("./index.js");

module.exports.login = async function login(certificate, privateKey) {
  try {
    const {name, org, company} = pemParse(certificate);
    const { connectionProfile, mspid } = getConnectedProfile(org);

    let gateway = await authentication(
      certificate,
      privateKey,
      mspid,
      connectionProfile,
      name
    );
    const network = await gateway.getNetwork('mychannel');
    return { network, gateway, org, company, name };

  } catch (error) {
    console.log(`Error processing transaction. ${error}`);
    console.log(error.stack);
  } finally {
  }
};
