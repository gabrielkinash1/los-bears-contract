const { expect } = require("chai");
const { ethers } = require("hardhat");
const { abi } = require("../artifacts/contracts/LosBears.sol/LosBears.json");

describe("LosBears", function () {
  it("Check if whitelist is working", async function () {
    const LosBears = await ethers.getContractFactory("LosBears");
    const losBears = await LosBears.deploy();
    await losBears.deployed();

    const accounts = await ethers.getSigners();
    const account1 = accounts[0];
    const account2 = accounts[1];

    const ownerContract = new ethers.Contract(losBears.address, abi, account1);
    const userContract = new ethers.Contract(losBears.address, abi, account2);

    const txn1 = await ownerContract.setWhitelistSaleStart(Date.now() - 10000);
    await txn1.wait();

    const txn2 = await ownerContract.whitelist(account2.address);
    await txn2.wait();

    expect(await userContract.isWhitelisted(account2.address)).to.equal(true);
  });

  it("Buy 3 NFT in whitelist sale and check if balance is 3", async function () {
    const LosBears = await ethers.getContractFactory("LosBears");
    const losBears = await LosBears.deploy();
    await losBears.deployed();

    const accounts = await ethers.getSigners();
    const account1 = accounts[0];
    const account2 = accounts[1];

    const ownerContract = new ethers.Contract(losBears.address, abi, account1);
    const userContract = new ethers.Contract(losBears.address, abi, account2);

    const txn0 = await ownerContract.setPublicSaleStart(Date.now() * 2);
    await txn0.wait();

    const txn1 = await ownerContract.setWhitelistSaleStart(0);
    await txn1.wait();

    const txn2 = await ownerContract.whitelist(account2.address);
    await txn2.wait();

    const quantity = 3;
    const whitelistPrice = 5;
    const price = ethers.utils.parseUnits(
      String(whitelistPrice * quantity),
      18
    );
    const txn3 = await userContract.claim(quantity, { value: price });
    await txn3.wait();

    expect(await userContract.balanceOf(account2.address)).to.equal(quantity);
  });

  it("Buy 3 NFT in public sale as whitelist member and check if balance is 3", async function () {
    const LosBears = await ethers.getContractFactory("LosBears");
    const losBears = await LosBears.deploy();
    await losBears.deployed();

    const accounts = await ethers.getSigners();
    const account1 = accounts[0];
    const account2 = accounts[1];

    const ownerContract = new ethers.Contract(losBears.address, abi, account1);
    const userContract = new ethers.Contract(losBears.address, abi, account2);

    const txn0 = await ownerContract.setPublicSaleStart(1);
    await txn0.wait();

    const txn1 = await ownerContract.setWhitelistSaleStart(0);
    await txn1.wait();

    const txn2 = await ownerContract.whitelist(account2.address);
    await txn2.wait();

    const quantity = 3;
    const publicPrice = 7;
    const price = ethers.utils.parseUnits(String(publicPrice * quantity), 18);
    const txn3 = await userContract.claim(quantity, { value: price });
    await txn3.wait();

    expect(await userContract.balanceOf(account2.address)).to.equal(quantity);
  });

  it("Whitelist various addresses", async function () {
    const LosBears = await ethers.getContractFactory("LosBears");
    const losBears = await LosBears.deploy();
    await losBears.deployed();

    const accounts = await ethers.getSigners();
    const account1 = accounts[0];

    const ownerContract = new ethers.Contract(losBears.address, abi, account1);

    const addresses = [
      "0xeF93ec90708A4B691cA14C53Ca4744B305B29d6c",
      "0x32C1105710c03a4FBA65b7bFD0C0c231a23450de",
      "0x2C6b345D4A95E20808e1797f652e27C9fCb58BD0",
      "0xED8E924735F590572361b52657ABd9A3260F35a0",
      "0xf71062110CDb057362CE665b07CAB41Df38Aa969",
      "0x44b8c7b4599911723687d4744bf62e3d3efC88Eb",
      "0x0CB7440c85110AE3c5DFBC2F2B1944ED3cd5bD46",
      "0xeDc8e3b2aE699a23D4A6D73E2171acAc809156eE",
      "0x9669e465E236fa5b5A240832415CF92d9236D2c3",
      "0xe4e0Ae7f9a21a583573E20838ac2d860406969b3",
      "0x7D0aE0a6b86c1Dd943500b808BC20464550AA62d",
      "0x71C424EfdbE677B7373c3725B224F5389CDd6b81",
      "0x33f7130d43df1545b8B906D5ebee68F52f5109b6",
      "0x9a411E810Cc44B7Df4e3a50C436404C01C2E0866",
      "0xdA48bfFAb683506a8aB0CF19D67D54C0c40C89E8",
      "0x3164092782c67Eb018b29248df0da9032D7Ad1Cd",
      "0xd6DB8C87Ad79bD6a694c007820cd623a1D573A7a",
      "0x44b8c7b4599911723687d4744bf62e3d3efC88Eb",
      "0xBdFFAe1F7425c82533ff3193CdbEBB3b138AFec7",
      "0x50d8Deadd2b3140B151CaB2C4FB76F1f59b236F8",
      "0x13dcFa26F0A2352Ebf0a854eac2155a49876808f",
      "0xeDc8e3b2aE699a23D4A6D73E2171acAc809156eE",
      "0x6702a7F0E560B925f405daed29D7E0a3A7e5c3BB",
      "0x1969b322f0EBD01CE466087973B867E5bEEb2831",
      "0xf71062110CDb057362CE665b07CAB41Df38Aa969",
      "0x93cbf59774e566aD1F423A3Ac565D9996CD03DB8",
      "0xE56DA12694d01126Ca346aC08300b06E1e03d4De",
      "0x4C7b4B097F37354694D6e313fF372eF8E351e2Db",
      "0x1ECdd6dE99277d4228A9De50Ea73ba7e10D662e6",
      "0x8f96D626f5D0622857145fB741168B0E3fa15643",
      "0xb6A88E8f1d67Ea23c8a91cFf1E4aDB81385571C2",
      "0xA8d07E4A64dC7d9E04570DefB3B6CEf9f150e461",
      "0xA1fc594f6B58a7c24C0d85bdBA98e3242C49549C",
      "0x7C117eBF1066e80878A8FF46D29e0452b021f1ab",
      "0x92020bccfbD65E20bD61F62184c537Fe2Ff3aB50",
      "0xE8954a20C8812317F6471C628B198A750b5205e9",
      "0x73Cb4C2127C1235cAe16F4eC8ab6dc08a061ac5F",
      "0x0CB7440c85110AE3c5DFBC2F2B1944ED3cd5bD46",
      "0x1016112b289BCd8Fd00d11391E797FDDB379cE2F",
      "0x3D0Db72EB8d80BC016698f1BC19AEa2443F75252",
      "0xED8E924735F590572361b52657ABd9A3260F35a0",
      "0x8553E24b9eb99c21Ea96A3E167CF4B8c75fb345C",
      "0x74284e688820737298cB0CADf518a3F60bA2D4d1",
    ];

    const txn1 = await ownerContract.whitelistAddresses(addresses);
    await txn1.wait();

    expect(txn1).to.not.equal(undefined);
  });
});
