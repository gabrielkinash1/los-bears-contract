const hre = require("hardhat");

async function main() {
  const LosBears = await hre.ethers.getContractFactory("LosBears");
  const losBears = await LosBears.deploy();
  await losBears.deployed();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
