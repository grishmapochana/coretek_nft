

deploy:
	npx hardhat clean
	rm -rf contracts
	mkdir -p contracts/types contracts/abis
	HH_NTWK=bsc_testnet_s1_2 npx hardhat run --network bsc_testnet_s1_2 scripts/main.ts
	npm run gen-types


tst:
	npx hardhat clean
	npx hardhat compile
	npx hardhat test