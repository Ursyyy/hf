#!/bin/bash

#cd hf
docker image prune -a
chmod +x bootstrap.sh
./bootstrap.sh
cd commercial-paper
./network-clean.sh
./network-starter.sh
cd ..

chmod +x deployMagnetocorp.sh
./deployMagnetocorp.sh

chmod +x deployDigiBank.sh
./deployDigiBank.sh

