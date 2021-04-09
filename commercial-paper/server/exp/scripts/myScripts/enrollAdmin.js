
"use strict";

const { Gateway, X509WalletMixin, InMemoryWallet } = require('fabric-network');
const { authentication, enrollment } = require('./utils/auth')
// const issue = require('./issue')

module.exports = async function enrollAdmin(mspid, ca, connectionProfile, admin='admin', adminPass='adminpw') {
   
  try {
    // Enroll admin
    console.log(admin);// 'ca, mspid, user,  pass'
    const identity = await enrollment(ca, mspid, admin, adminPass, "admin",)
    // console.log('======)
    // auth admin
    const gateway = await authentication(identity.certificate, identity.privateKey, mspid, connectionProfile, identity.label);
    
    // console.log(gateway)
    return gateway;
    
  } catch (error) {
    console.error(`Failed to enroll client ${admin}: ${error}`);
    process.exit(1);
  }
}

