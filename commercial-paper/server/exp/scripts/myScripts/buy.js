
const CommercialPaper = require('../../contract/lib/paper.js');///contract/lib/paper.js
const { login } = require("./utils/login.js");
// Bring key classes into scope, most importantly Fabric SDK network class

// const CommercialPaper = require('../../magnetocorp/contract/lib/paper.js');
// 'buy', 'MagnetoCorp', '00001', 'MagnetoCorp', 'DigiBank', '4900000', '2020-05-31'


// Main program function
module.exports = async function buy (certificate, privateKey) {

    // Main try/catch block
    try {

        const { network, company, gateway } = await login(certificate, privateKey);

        // const network = await gateway.getNetwork('mychannel');


        const contract = await network.getContract('papercontract', 'org.papernet.commercialpaper');

        console.log('Submit commercial paper buy transaction.');
                                                            // buy(ctx, issuer, paperNumber, currentOwner, newOwner, price, purchaseDateTime
        const buyResponse = await contract.submitTransaction('buy', 'magnetocorp', '00003', 'magnetocorp', company, '4900000', '2020-05-31');
        // readonly chaincodeId: string;
        // readonly namespace: string;
        // createTransaction(name: string): Transaction;
        // evaluateTransaction(name: string, ...args: string[]): Promise<Buffer>;
        // submitTransaction(name: string, ...args: string[]): Promise<Buffer>;
        // addContractListener(listener: ContractListener, options?: ListenerOptions): Promise<ContractListener>;
        // removeContractListener(listener: ContractListener): void;
        // addDiscoveryInterest(interest: DiscoveryInterest): Contract;
        // resetDiscoveryInterests(): Contract;

        let paper = CommercialPaper.fromBuffer(buyResponse);

        console.log(`${paper.issuer} commercial paper : ${paper.paperNumber} successfully purchased by ${paper.owner}`);

        gateway.disconnect();
        return paper;
        
    } catch (error) {

        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

    } finally {

        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        
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
