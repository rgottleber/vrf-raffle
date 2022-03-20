const main = async () => {
    const Lottery = await hre.ethers.getContractFactory("Lottery");
    const LotteryContract = await Lottery.deploy(1648);
    await LotteryContract.deployed();
    console.log("Contract deployed to: ", LotteryContract.address);
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1)
    }
}

runMain();