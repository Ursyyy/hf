"use strict";


const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
const path = require("path");

let finished;
exports.module = async function history() {
  try {
    let result = {};
    // Set up the wallet - just use Org2's wallet (isabella)
    const wallet = await Wallets.newFileSystemWallet(
      "../identity/user/isabella/wallet"
    );

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();

    const userName = "isabella";

    // Load connection profile; will be used to locate a gateway
    let connectionProfile = yaml.safeLoad(
      fs.readFileSync("../gateway/connection-org2.yaml", "utf8")
    );

    // Set connection options; identity and wallet
    let connectionOptions = {
      identity: userName,
      wallet: wallet,
      discovery: { enabled: true, asLocalhost: true },
    };

    // connect to the gateway
    await gateway.connect(connectionProfile, connectionOptions);
    // get the channel and smart contract
    const network = await gateway.getNetwork("mychannel");

    // Listen for blocks being added, display relevant contents: in particular, the transaction inputs
    finished = false;
    result.block = [];
    const listener = async (event) => {
      if (event.blockData !== undefined) {
        for (const i in event.blockData.data.data) {
          if (event.blockData.data.data[i].payload.data.actions !== undefined) {
            const inputArgs =
              event.blockData.data.data[i].payload.data.actions[0].payload
                .chaincode_proposal_payload.input.chaincode_spec.input.args;
            // Print block details
            console.log("----------");
            
            result.block.push((parseInt(event.blockData.header.number)) + "transaction: " + i)

            console.log(
              "Block:",
              parseInt(event.blockData.header.number),
              "transaction",
              i
            );
            // Show ID and timestamp of the transaction
            const tx_id =
              event.blockData.data.data[i].payload.header.channel_header.tx_id;
            const txTime = new Date(
              event.blockData.data.data[
                i
              ].payload.header.channel_header.timestamp
            ).toUTCString();
            // Show ID, date and time of transaction
            console.log("Transaction ID:", tx_id);
            console.log("Timestamp:", txTime);
            // Show transaction inputs (formatted, as may contain binary data)
            let inputData = "Inputs: ";
            for (let j = 0; j < inputArgs.length; j++) {
              const inputArgPrintable = inputArgs[j]
                .toString()
                .replace(/[^\x20-\x7E]+/g, "");
              inputData = inputData.concat(inputArgPrintable, " ");
            }
            console.log(inputData);
            // Show the proposed writes to the world state
            let keyData = "Keys updated: ";
            for (const l in event.blockData.data.data[i].payload.data.actions[0]
              .payload.action.proposal_response_payload.extension.results
              .ns_rwset[1].rwset.writes) {
              // add a ' ' space between multiple keys in 'concat'
              keyData = keyData.concat(
                event.blockData.data.data[i].payload.data.actions[0].payload
                  .action.proposal_response_payload.extension.results
                  .ns_rwset[1].rwset.writes[l].key,
                " "
              );
            }
            console.log(keyData);
            // Show which organizations endorsed
            let endorsers = "Endorsers: ";
            for (const k in event.blockData.data.data[i].payload.data.actions[0]
              .payload.action.endorsements) {
              endorsers = endorsers.concat(
                event.blockData.data.data[i].payload.data.actions[0].payload
                  .action.endorsements[k].endorser.mspid,
                " "
              );
            }
            console.log(endorsers);
            // Was the transaction valid or not?
            // (Invalid transactions are still logged on the blockchain but don't affect the world state)
            if (event.blockData.metadata.metadata[2][i] !== 0) {
              console.log("INVALID TRANSACTION");
            }
          }
        }
      }
    };
    const options = {
      type: "full",
      startBlock: 1,
    };
    await network.addBlockListener(listener, options);
    while (!finished) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      // Disconnect from the gateway after Promise is resolved.
      // ... do other things
    }
    gateway.disconnect();
    return result;
  } catch (error) {
    console.error("Error: ", error);
    process.exit(1);
  }
}
