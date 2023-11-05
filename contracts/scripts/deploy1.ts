import { ethers } from "hardhat";

async function main() {
  const MyERC4907 = await ethers.getContractFactory("MyERC4907");
  const myERC4907 = await MyERC4907.deploy("CarNFT","CarNFTSymbol");
  await myERC4907.deployed();

  console.log(`MyERC4907 deployed to ${myERC4907.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});