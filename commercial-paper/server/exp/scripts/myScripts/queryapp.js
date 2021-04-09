const CommercialPaper = require('../../contract/lib/paper.js');
const { login } = require("./utils/login.js");


module.exports = async function queryApp(certificate, privateKey, paperNumber ) {
    const { network, gateway, org, name } = await login(certificate, privateKey);
    company = 'magnetocorp';
    let queryResponse;
    try{
        const contract = await network.getContract('papercontract', 'org.papernet.commercialpaper');
        if(paperNumber !== 'all'){
            queryResponse = await contract.evaluateTransaction('queryHistory', company, paperNumber);

        }
        else {
            queryResponse = await contract.evaluateTransaction('queryPartial', company);
        }
        let json = JSON.parse(queryResponse.toString());
        return json;
    } catch (error) {   
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

    } finally {
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
