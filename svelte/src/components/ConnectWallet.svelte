<script>
	import { ethers } from 'ethers';
	export let account;
	export let chainID;
	export let web3Props;
	export let lotteryAddress;
	export let LotteryABI;
	// Attach Wallet if not already attached
	async function attachWallet() {
		const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
		// Prompt user for account connections
		await provider.send('eth_requestAccounts', []);
		const signer = provider.getSigner();
		account = await signer.getAddress();
		chainID = await signer.getChainId();
		if (account && chainID == 4) {
			const lotteryContract = new ethers.Contract(lotteryAddress, LotteryABI.abi, signer);
			web3Props = {
				lotteryContract,
				signer,
				provider
			};
		}
	}
</script>

<!-- 4 is for Rinkeby This will need to be changed -->
{#if !account || chainID !== 4}
	<div class="hero min-h-screen" style="background-image: url(/metamask-fox-wordmark-stacked.svg);">
		<div class="hero-overlay bg-opacity-60" />
		<div class="hero-content text-center text-neutral-content">
			<div class="max-w-md">
				<h3 class="font-bold text-lg">Please connect your wallet on the Rinkeby Test Network.</h3>
				{#if chainID !== 4 && chainID}
					<p class="text-sm text-gray-500 px-8" />
					<p>Network Name: Rinkeby Testnet</p>
					<p>New RPC URL: https://rinkeby.infura.io/</p>
					<p>Chain ID: 4</p>
					<p>Currency Symbol: ETH</p>
					<p>Block Explorer URL: https://rinkeby.etherscan.io</p>
				{/if}
				<button class="btn btn-accent" on:click={attachWallet}>Attach Wallet</button>
			</div>
		</div>
	</div>
{/if}
