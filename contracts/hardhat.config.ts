import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      // rpc url, change it according to your ganache configuration
      url: 'http://127.0.0.1:8545',
      // the private key of signers, change it according to your ganache user
      accounts: [
        '0xa64126ebab13a803f86e24b5705fbbb427bbda8197aac109df5673ddcb7b0799',
        '0xdb82164770a2760793c51632ff553ed7729fa8035c45330e19062d87421a6364',
        '0xccec225f89fc7c144d3590cf2008210e3a2a16afeaf6cb05be475b9107619909',
        '0x885b96bbb2cff19f4cfc7efbc70cae68e0a953c319167817f10d9f1d9c03394f',
        '0xb114f90e8144d50b1cfc0ba68274180e727648202d56ad511cefcc0d025f0531'
      ]
    },
  },
};

export default config;
