const FabricCAServices = require("fabric-ca-client");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { X509 } = require("jsrsasign");

module.exports.getConnectedProfile = function getConnectedProfile(company) {
	try {
		let mspId = {
			org2: "Org2MSP",
			org1: "Org1MSP",
		};

		let pathToYaml, link;
		let mspid = mspId[company]
		switch (mspid) {
				case "Org1MSP":
					pathToYaml = "../exp/gateway/connection-org1.yaml"
					link = "ca.org1.example.com"
					break
				case "Org2MSP":
					pathToYaml = "../exp/gateway/connection-org2.yaml"
					link = "ca.org2.example.com"
					break

				default:
					return { error: "Invalid company mspid." };
		}
		const ccpPath = path.resolve(pathToYaml);
		const connectionProfile = yaml.safeLoad(fs.readFileSync(ccpPath, "utf8"));
		const caInfo = connectionProfile.certificateAuthorities[link];
		const caTLSCACerts = caInfo.tlsCACerts.pem;
		const ca = new FabricCAServices(caInfo.url);

		return { connectionProfile, ca, caTLSCACerts, mspid };
	} catch (e) {
		console.error(e);
		throw new Error(e.message);
	}
};

module.exports.pemParse = function pemParse(pemStr) {
	let c = new X509();
	c.readCertPEM(pemStr);

	let data = c.getSubjectString();  
	let org = data.slice(data.indexOf("org"), data.indexOf("org") + 4);
	let name = data.split(/[=|+|\n]/).reverse()[0];
	let company;

	switch (org) {
		case "org1":
			company = "digibank";
			break;

		case "org2":
			company = "magnetocorp";
			break;

		default:
			return { error: "Invalid company mspid." };
	}
	return { org, name, company };
};
