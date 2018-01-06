#!/bin/bash
cd dronesym-frontend;
sudo npm i -D cypress --unsafe-perm;
sudo $(npm bin)/cypress open;
sudo cp DroneSym_test.js cypress/integration;

