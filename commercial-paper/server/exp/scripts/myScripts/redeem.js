const CommercialPaper = require('../../contract/lib/paper.js');
const { login } = require("./utils/login.js");


// Main program function
module.exports = async function redeem(certificate, privateKey) {

 try{

		const { network, gateway } = await login(certificate, privateKey);

			const contract = await network.getContract('papercontract', 'org.papernet.commercialpaper');
			const redeemResponse = await contract.submitTransaction('redeem', 'magnetocorp', '00003', 'digibank', 'Org2MSP', '2020-11-30');
			let paper = CommercialPaper.fromBuffer(redeemResponse);
			console.log(`${paper.issuer} commercial paper : ${paper.paperNumber} successfully redeemed with ${paper.owner}`);
			return paper
		} catch (error) {

			console.log(`Error processing transaction. ${error}`);
			console.log(error.stack);

		} finally {
			gateway.disconnect();
		}
}
