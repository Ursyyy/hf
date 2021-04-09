#!/bin/bash
cd commercial-paper/organization/magnetocorp
source magnetocorp.sh


peer lifecycle chaincode package cp.tar.gz --lang node --path ./contract --label cp_0

peer lifecycle chaincode install cp.tar.gz

read cp

export PACKAGE_ID=$cp

peer lifecycle chaincode approveformyorg --orderer localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name papercontract -v 0 --package-id $PACKAGE_ID --sequence 1 --tls --cafile $ORDERER_CA

# cd application

# nvm i 14
# npm i

#sudo fuser -k 3001/tcp
#npm run serve