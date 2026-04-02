const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const PoCCEscrow = await hre.ethers.getContractFactory("PoCCEscrow");
    const pocc = await PoCCEscrow.deploy();
    await pocc.waitForDeployment();

    console.log("PoCCEscrow deployed to:", await pocc.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
