const { expect } = require("chai");
const { ethers, waffle} = require("hardhat");
const provider = waffle.provider;


let donations;
let storage;
let user1;
let user2;


describe("Donations", function () {

  this.beforeAll(async function () {
    [user1, user2] = await hre.ethers.getSigners(); 
    const Storage = await ethers.getContractFactory("Storage");
    storage = await Storage.deploy();
    await storage.deployed();

    const Donations = await ethers.getContractFactory("Donations");
    donations = await Donations.deploy(storage.address);
    await donations.deployed();

    await storage.setDonationsAdr(donations.address);
  })
  

  it("Should return true if the address is added to the benefited list", async function () {


    await donations.AddBenefited(user1.address, ethers.utils.parseEther("2.0"), "project description");

    expect(await donations.CheckBenefited(user1.address)).to.equal(true);
    expect(await donations.CheckBenefited(user2.address)).to.equal(false);

  });
  it("sending donations to addresses", async function () {

    await donations.ReceiveDonations(user1.address, {value: ethers.utils.parseEther("1.0")})
    expect(await donations.GetAmountCollectedByAdr(user1.address)).to.equal(ethers.utils.parseEther("1.0"))
    await expect(donations.ReceiveDonations(user2.address, {value: ethers.utils.parseEther("1.0")})).to.be.revertedWith("that address is not in the benefited list")
  })
  it("removing benefited", async function () {
    await donations.RemoveBenefited(user1.address, true);
    await expect(donations.ReceiveDonations(user1.address, {value: ethers.utils.parseEther("1.0")})).to.be.revertedWith("that address is not in the benefited list")
  })
  it("checking amount donated by address", async function () {
    expect(await donations.CheckAmountDonatedByAdr(user1.address)).to.be.equal(ethers.utils.parseEther("1.0"))
    expect(await donations.CheckAmountDonatedByAdr(user2.address)).to.be.equal(ethers.utils.parseEther("0"))
  })
  it("checking balance of user1 and contract", async function () {
    expect(await donations.balanceOf(user1.address)).to.be.equal(ethers.utils.parseEther("1"))
    expect(await donations.balanceOf(donations.address)).to.be.equal(ethers.utils.parseEther("99"))
    expect(await donations.balanceOf(user2.address)).to.be.equal(ethers.utils.parseEther("0"))
  })
  it("sending more eth to benefited1 and then check if it's transferred to their balance", async function() {
    const currentBalance = await provider.getBalance(user2.address);
    await donations.AddBenefited(user2.address, ethers.utils.parseEther("2.0"), "project description");
    await donations.ReceiveDonations(user2.address, {value: ethers.utils.parseEther("3.0")})
    expect(await provider.getBalance(user2.address)).to.be.equal(BigInt(currentBalance) + BigInt(ethers.utils.parseEther("3.0")))
    console.log(await provider.getBalance(user2.address))
  })
});

//0.1756
//0.1484