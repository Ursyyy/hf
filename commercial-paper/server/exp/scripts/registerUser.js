/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
// const wallet = require("./inMemoryWallet");
// const { Wallets } = require('fabric-network');
const { Gateway, InMemoryWallet, X509WalletMixin } = require ('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');



module.exports = async function registerUser(name, company) {

    let admin = 'admin';
    let adminPass = 'adminpw';
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
    
    try {
        
        // load the network configuration
        // const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccpPath = path.resolve(__dirname, '..', 'connection' , `connection-org${companyIndex}.json`);
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        console.log(ccp)

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities[`ca.org${companyIndex}.example.com`].url;
        const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        // const walletPath = path.join(process.cwd(), 'identity', `${company}`, 'users', 'wallet');

        // const wallet = await Wallets.newFileSystemWallet(walletPath);
        // const wallet = await Wallets.newInMemoryWallet();
        // console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userIdentity = await wallet.get(name);
        if (userIdentity) {
            return {"error": `An identity for the user ${name} already exists in the wallet`};
            
        }

        // Check to see if we've already enrolled the admin user.
        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            console.log('An identity for the admin user "admin" does not exist in the wallet');
            console.log('Run the enrollAdmin.js application before retrying');
            return;
        }

        // build a user object for authenticating with the CA
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');
        
        // console.log(adminIdentity);
        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({
            affiliation: `org${companyIndex}.department1`,
            enrollmentID: name,
            role: 'client',
            // enrollmentID: string;
            // enrollmentSecret?: string;   
            // role?: string;
            // affiliation: string;
            // maxEnrollments?: number;
            // attrs?: IKeyValueAttribute[];
        }, adminUser);
        console.log(secret)

        const enrollment = await ca.enroll({
            enrollmentID: name,
            enrollmentSecret: secret
        });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: `Org${companyIndex}MSP`,
            type: 'X.509',
        };
        // await wallet.put(name, x509Identity);
        console.log(name , wallet.put(name, x509Identity))
        console.log(`Successfully registered and enrolled admin user ${name} and imported it into the wallet`);

        fs.writeFile(`certificates/${company}/${name}.pem`, x509Identity.credentials.certificate, function (err,data) {
        if (err) {
              return console.log(err);
            }
            console.log(data);
        });
      
        return {x509Identity: x509Identity, password: secret, name: name };
    } catch (error) {
        console.error(`Failed to register user ${name}: ${error}`);
        process.exit(1);
    }
}

// registerUser(name)

// exports.module.registerUser = registerUser;
