#!/bin/sh

cd ..

pnx build sneat-app
npx cap sync ios
