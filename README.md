# Donations Project

[Click here to access to the deployed website of the repo](https://soliditydonations.000webhostapp.com/) 

This is a decentralized site where users can donate to different projects with their respective amount targets, or upload their own project to receive donations.

Every project has an address, description, target, and amount collected. If the project reached its amount target, it will just be deleted. 

Note: a user can only upload 1 project by address.

Frontend will be improved. Btw, I didn't put a lot of effort into frontend, I prioritized the smart contract development.

## Technical Details
- The donator will receive 1 "DNC" token every time it makes a donation. To see it on your Metamask wallet, just import the address of the Smart Contract.

- The data of the smart contract is 100% independent of the smart contract itself. So, it's upgradeable. The data is stored in Storage.sol contract, while the execution of the functions are specified in Donations.sol

If you want to modify a function and upload the new SC, you won't lose the currently stored data. Just send the address as a parameter when deploying the SC, go to Storage.sol and execute the setDonationsAdr function (only available by the owner of the Storage SC). 

- Made with Solidity and Javascript. Using hardhat and etherjs. Front deployed to 000webhost. Contracts deployed to Rinkeby testing network. 

**If you want to clone the repo, please add your own alchemy and rinkeby private keys into the hardhat config file"**
