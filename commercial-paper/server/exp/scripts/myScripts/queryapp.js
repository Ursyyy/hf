const CommercialPaper = require('../../contract/lib/paper.js');
const { login } = require("./utils/login.js");


module.exports = async function queryApp(certificate, privateKey, paperNumber ) {
    const { network, gateway, org, name } = await login(certificate, privateKey);
    company = 'magnetocorp';
    let queryResponse;
    try{
    
        
        // const network = await gateway.getNetwork('mychannel');

        // Get addressability to commercial paper contract
        console.log('Use org.papernet.commercialpaper smart contract.');

        const contract = await network.getContract('papercontract', 'org.papernet.commercialpaper');

        // queries - commercial paper
        console.log('-----------------------------------------------------------------------------------------');
        console.log('****** Submitting commercial paper queries ****** \n\n ');


        // 1 asset history

        console.log('1. Query Commercial Paper History....');
        console.log('-----------------------------------------------------------------------------------------\n');
        if(paperNumber !== 'all'){
            queryResponse = await contract.evaluateTransaction('queryHistory', company, paperNumber);

        }
        else {
            queryResponse = await contract.evaluateTransaction('queryPartial', company);
        }
        // let queryResponse = await contract.evaluateTransaction('queryHistory', company, paperNumber);
        // let queryResponse = await contract.evaluateTransaction('queryPartial', 'magnetocorp');
        // let queryResponse = await contract.evaluateTransaction('queryNamed', "trading"); //'TRADING''redeemed'
        let json = JSON.parse(queryResponse.toString());
        console.log(json);
        return json;

        // let json = JSON.parse(queryResponse.toString());
        // console.log(json);
        // console.log('\n\n');
        // console.log('\n  History query complete.');
        // console.log('-----------------------------------------------------------------------------------------\n\n');

        // 2 ownership query
        // console.log('2. Query Commercial Paper Ownership.... Papers owned by MagnetoCorp');
        // console.log('-----------------------------------------------------------------------------------------\n');
        // let queryResponseMagnetocorp = await contract.evaluateTransaction('queryOwner', 'magnetocorp');
        // let queryResponseDigibank = await contract.evaluateTransaction('queryOwner', 'DigiBank');
        // console.log('fdfdfdfdfdf', queryResponseDigibank.toString())

        // // json = JSON.parse(queryResponseMagnetocorp, ...queryResponseDigibank].toString());
        // // console.log(json);
        // // return json
        // return JSON.parse(queryResponseMagnetocorp.toString())//JSON.parse
        // console.log('\n\n');
        // console.log('\n  Paper Ownership query complete.');
        // console.log('-----------------------------------------------------------------------------------------\n\n');

        

        // // 3 partial key query
        // console.log('3. Query Commercial Paper Partial Key.... Papers in org.papernet.papers namespace and prefixed MagnetoCorp');
        // console.log('-----------------------------------------------------------------------------------------\n');
        // let queryResponse3 = await contract.evaluateTransaction('queryPartial', 'magnetocorp');

        // let json = JSON.parse(queryResponse3.toString());
        // console.log(json);
        // return json;
        // console.log('\n\n');

        // console.log('\n  Partial Key query complete.');
        // console.log('-----------------------------------------------------------------------------------------\n\n');


        // // 4 Named query - all redeemed papers
        // console.log('4. Named Query: ... All papers in org.papernet.papers that are in current state of redeemed');
        // console.log('-----------------------------------------------------------------------------------------\n');
        // let queryResponse4 = await contract.evaluateTransaction('queryNamed', 'redeemed');

        // json = JSON.parse(queryResponse4.toString());
        // console.log(json);
        // console.log('\n\n');

        // console.log('\n  Named query "redeemed" complete.');
        // console.log('-----------------------------------------------------------------------------------------\n\n');


        // // 5 named query - by value
        // console.log('5. Named Query:.... All papers in org.papernet.papers with faceValue > 4000000');
        // console.log('-----------------------------------------------------------------------------------------\n');
        // let queryResponse5 = await contract.evaluateTransaction('queryNamed', 'value');

        // json = JSON.parse(queryResponse5.toString());
        // console.log(json);
        // console.log('\n\n');

        // console.log('\n  Named query by "value" complete.');
        // console.log('-----------------------------------------------------------------------------------------\n\n');
        
    } catch (error) {

        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

    } finally {

        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();

    }
}


// queryApp(userName)
// main().then(() => {

//     console.log('Queryapp program complete.');

// }).catch((e) => {

//     console.log('Queryapp program exception.');
//     console.log(e);
//     console.log(e.stack);
//     process.exit(-1);

// });
