# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

# IN ORDER TO TEST, WE HAVE TO RUN THESE COMMANDS
```
npx hardhat clean
npx hardhat compile
npx hardhat test
```

# IN ORDER TO DEPLOY, WE HAVE TO RUN THESE COMMANDS
```
npx hardhat clean
HH_NTWK={{network}} npx hardhat run --network {{network}} scripts/main.ts

eg: HH_NTWK=bsc_testnet_s2_2 npx hardhat run --network bsc_testnet_s2_2 scripts/main.ts
```

# THIS SHOULD BE ALSO RUN, AT THE TIME OF DEPLOYEMENT FOR GENERATING TYPE
```
"gen-types": "typechain --target ethers-v5 --out-dir contracts/types 'contracts/abis/*.json'"
npm run gen-types
```