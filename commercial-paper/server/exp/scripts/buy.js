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
 * 4. Construct request to buy commercial paper
 * 5. Submit transaction
 * 6. Process response
 */

'use strict';
const FabricCAServices = require('fabric-ca-client');
const { Wallets, Gateway  } = require('fabric-network');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const CommercialPaper = require('../contract/lib/paper.js');
// Bring key classes into scope, most importantly Fabric SDK network class

// const CommercialPaper = require('../../magnetocorp/contract/lib/paper.js');
// 'buy', 'MagnetoCorp', '00001', 'MagnetoCorp', 'DigiBank', '4900000', '2020-05-31'


// Main program function
module.exports = async function buy (userName, company, x509Identity) {
    let companyIndex;

    switch(company) {
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
    const wallet = await Wallets.newFileSystemWallet(`./identity/${company}/users/wallet`);

    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {

        // Specify userName for network access


        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync(`./gateway/connection-org${companyIndex}.yaml`, 'utf8'));

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled: true, asLocalhost: true }

        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');

        await gateway.connect(connectionProfile, connectionOptions);

        // Access PaperNet network
        console.log('Use network channel: mychannel.');

        const network = await gateway.getNetwork('mychannel');

        // Get addressability to commercial paper contract
        console.log('Use org.papernet.commercialpaper smart contract.');

        const contract = await network.getContract('papercontract', 'org.papernet.commercialpaper');
        console.log(contract)
        // buy commercial paper
        console.log('Submit commercial paper buy transaction.');

        const buyResponse = await contract.submitTransaction('buy', 'magnetocorp', '00001', 'magnetocorp', 'DigiBank', '4900000', '2020-05-31');
        // readonly chaincodeId: string;
        // readonly namespace: string;
        // createTransaction(name: string): Transaction;
        // evaluateTransaction(name: string, ...args: string[]): Promise<Buffer>;
        // submitTransaction(name: string, ...args: string[]): Promise<Buffer>;
        // addContractListener(listener: ContractListener, options?: ListenerOptions): Promise<ContractListener>;
        // removeContractListener(listener: ContractListener): void;
        // addDiscoveryInterest(interest: DiscoveryInterest): Contract;
        // resetDiscoveryInterests(): Contract;

        // process response
        console.log('Process buy transaction response.');

        let paper = CommercialPaper.fromBuffer(buyResponse);

        console.log(`${paper.issuer} commercial paper : ${paper.paperNumber} successfully purchased by ${paper.owner}`);
        console.log('Transaction complete.');
        return paper;
    } catch (error) {

        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

    } finally {

        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();

    }
}

// buy(userName).then(() => {

//     console.log('Buy program complete.');

// }).catch((e) => {

//     console.log('Buy program exception.');
//     console.log(e);
//     console.log(e.stack);
//     process.exit(-1);

// });
