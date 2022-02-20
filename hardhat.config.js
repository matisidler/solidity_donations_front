require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html


task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
}); 

const ALCHEMY_API_KEY = "https://eth-rinkeby.alchemyapi.io/v2/foUOO4lS7AxslVPdTE_-5rnUZt7gIiDK";

const RINKEBY_PRIVATE_KEY = "565679a38479ba1358bbf5cf1081dcb117e43608ef1e852243792a0b8470e09b";

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: ALCHEMY_API_KEY,
      accounts: [`${RINKEBY_PRIVATE_KEY}`],
      gas: 2100000,
      gasPrice: 8000000000,
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    },
  }
};

//0.1852