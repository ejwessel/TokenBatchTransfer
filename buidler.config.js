require('dotenv').config()
usePlugin('@nomiclabs/buidler-ethers')
usePlugin('@nomiclabs/buidler-truffle5')

module.exports = {
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
      timeout: 1000000,
    },
    mainnet: {
      url: 'https://mainnet.infura.io/v3/' + process.env.INFURA_API_KEY,
      timeout: 1000000,
      gasPrice: 150e9,
      accounts: {
        mnemonic: process.env.MNEMONIC
      }
    },
  },
  // This is a sample solc configuration that specifies which version of solc to use
  solc: {
    version: '0.6.10',
    optimizer: {
      enabled: true,
      runs: 2000,
    },
  },
  mocha: {
    timeout: 1000000,
  },
}
