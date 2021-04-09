'use strict';

const { Wallets, InMemoryWallet } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

module.exports = async function registerAdmin() {
    try {
        const ccpPath = path.resolve(__dirname, '..', '..', '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
        console.log(ccpPath)

        const inMemoryWallet = new InMemoryWallet();
        
    } catch (error) {
        console.error(`Failed to register admin`);
        process.exit(1);
    }
}