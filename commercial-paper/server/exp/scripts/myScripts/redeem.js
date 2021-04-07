/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

/*
 * This application has 6 basic steps:
 * 1. Select an identity from a wallet
 * 2. Connect to network gateway
 * 3. Access PaperNet network
 * 4. Construct request to issue commercial paper
 * 5. Submit transaction
 * 6. Process response
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class

const CommercialPaper = require('../../contract/lib/paper.js');
const { login } = require("./utils/login.js");


// Main program function
module.exports = async function redeem(certificate, privateKey) {

 try{

  const { gateway, company, name } = await login(certificate, privateKey);

    // Access PaperNet network
    console.log('Use network channel: mychannel.');

    const network = await gateway.getNetwork('mychannel');

    // Get addressability to commercial paper contract
    console.log('Use org.papernet.commercialpaper smart contract.');

    const contract = await network.getContract('papercontract', 'org.papernet.commercialpaper');

    // redeem commercial paper
    console.log('Submit commercial paper redeem transaction.');

    const redeemResponse = await contract.submitTransaction('redeem', 'magnetocorp', '00002', 'digibank', 'Org2MSP', '2020-11-30');

    // process response
    console.log('Process redeem transaction response.');

    let paper = CommercialPaper.fromBuffer(redeemResponse);

    console.log(`${paper.issuer} commercial paper : ${paper.paperNumber} successfully redeemed with ${paper.owner}`);

    console.log('Transaction complete.');
    gateway.disconnect();
    return paper
  } catch (error) {

    console.log(`Error processing transaction. ${error}`);
    console.log(error.stack);

  } finally {

    // Disconnect from the gateway
    console.log('Disconnect from Fabric gateway.')
   

  }
}
// redeem(userName).then(() => {

//   console.log('Redeem program complete.');

// }).catch((e) => {

//   console.log('Redeem program exception.');
//   console.log(e);
//   console.log(e.stack);
//   process.exit(-1);

// });
