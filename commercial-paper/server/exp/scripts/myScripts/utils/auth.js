"use strict";
// const { getConnectedProfile, pemParse } = require("./index.js");
const { Gateway, X509WalletMixin, InMemoryWallet } = require("fabric-network");


module.exports.authentication = async function authentication(
  certificate,
  privateKey,
  mspid,
  connectionProfile,
  label
) {
  const mixin = X509WalletMixin.createIdentity(mspid, certificate, privateKey);

  const wallet = new InMemoryWallet();

  await wallet.import(label, mixin);

  const connectionOptions = {
    identity: label,
    wallet,
    discovery: { enabled: true, asLocalhost: true },
  };

  const gateway = new Gateway();
  
  await gateway.connect(connectionProfile, connectionOptions);
  
  return gateway;
};

module.exports.enrollment = async function enrollment(ca, mspid, user,  pass, label, csr) {

  const enrollment = await ca.enroll({
    enrollmentID: user,
    enrollmentSecret: pass,
    csr
  });

  const identity = {
    label,
    certificate: enrollment.certificate,
    privateKey: enrollment.key.toBytes(),
    mspId: mspid,
  };

  console.log('after enrollment----->', identity.certificate, identity.privateKey)
  return identity;
};

