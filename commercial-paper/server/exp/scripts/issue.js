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

const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
const CommercialPaper = require('../contract/lib/paper.js'); //../contract/lib/paper.js




// 'issue', 'MagnetoCorp', '00001', '2020-05-31', '2020-11-30', '5000000'
// { name, paperNumber, org, releaseDate, redeemDate, cost } 
// Main program function
module.exports = async function issue(userName, x509Identity, paperNumber, company, releaseDate, redeemDate, cost) {
    let companyIndex;
    switch(company.toLowerCase()) {
      case 'magnetocorp':
        companyIndex = '2';
      break;
  
      case 'digibank':
        companyIndex = '1';
      break;
  
      default:
        console.log('Invalid company name.')
    }
    // A wallet stores a collection of identities for use
    const wallet = await Wallets.newFileSystemWallet(`./identity/${company.toLowerCase()}/users/wallet`);
    console.log(wallet)
    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {

        // Specify userName for network access
        // const userName = 'isabella.issuer@magnetocorp.com';
        console.log('------------->')
        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync(`./gateway/connection-org${companyIndex}.yaml`, `utf8`));//${companyIndex}
        console.log('------------->')
        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled:true, asLocalhost: true }
        };
        // console.log(connectionOptions)
        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');

        await gateway.connect(connectionProfile, connectionOptions);

        // Access PaperNet network
        console.log('Use network channel: mychannel.');

        const network = await gateway.getNetwork('mychannel');

        // Get addressability to commercial paper contract
        console.log('Use org.papernet.commercialpaper smart contract.');

        const contract = await network.getContract('papercontract');

        // issue commercial paper
        console.log('Submit commercial paper issue transaction.');

        const issueResponse = await contract.submitTransaction('issue', company, paperNumber, releaseDate, redeemDate, cost);

        // process response
        console.log('Process issue transaction response.'+issueResponse);

        let paper = CommercialPaper.fromBuffer(issueResponse);

        console.log(`${paper.issuer} commercial paper : ${paper.paperNumber} successfully issued for value ${paper.faceValue}`);
        console.log('Transaction complete.');

        return paper
    } catch (error) {

        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

    } finally {

        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();

    }
}


// issue(name)
// exports.module.issue = issue;

// main().then(() => {

//     console.log('Issue program complete.');

// }).catch((e) => {

//     console.log('Issue program exception.');
//     console.log(e);
//     console.log(e.stack);
//     process.exit(-1);

// });
