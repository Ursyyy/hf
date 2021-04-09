#!/bin/bash

cd commercial-paper/organization/digibank

source digibank.sh

peer lifecycle chaincode package cp.tar.gz --lang node --path ./contract --label cp_0

peer lifecycle chaincode install cp.tar.gz

read cp

export PACKAGE_ID=$cp

peer lifecycle chaincode approveformyorg --orderer localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name papercontract -v 0 --package-id $PACKAGE_ID --sequence 1 --tls --cafile $ORDERER_CA

peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --peerAddresses localhost:7051 --tlsRootCertFiles ${PEER0_ORG1_CA} --peerAddresses localhost:9051 --tlsRootCertFiles ${PEER0_ORG2_CA} --channelID mychannel --name papercontract -v 0 --sequence 1 --tls --cafile $ORDERER_CA --waitForEvent

cd ../../server/exp 
npm i

sudo fuser -k 3000/tcp

npm run serve