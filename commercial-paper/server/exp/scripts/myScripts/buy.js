
const CommercialPaper = require('../../contract/lib/paper.js');
const { login } = require("./utils/login.js");

module.exports = async function buy (certificate, privateKey) {
    try {
        const { network, company, gateway } = await login(certificate, privateKey);
        const contract = await network.getContract('papercontract', 'org.papernet.commercialpaper');
        const buyResponse = await contract.submitTransaction('buy', 'magnetocorp', '00003', 'magnetocorp', company, '4900000', '2020-05-31');
        let paper = CommercialPaper.fromBuffer(buyResponse);
        console.log(`${paper.issuer} commercial paper : ${paper.paperNumber} successfully purchased by ${paper.owner}`);
        gateway.disconnect();
        return paper;
        
    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

    }
}

