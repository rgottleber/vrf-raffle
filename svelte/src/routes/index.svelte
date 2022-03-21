<script>
	import { ethers } from 'ethers';
	import ConnectWallet from '../components/ConnectWallet.svelte';
	import LotteryABI from '../contracts/Lottery.json';
	const lotteryAddress = '0x5b46FD5Bb0EB337C9a04672543c4154F958D4bC0';
	let web3Props = {};
	$: account = null;
	$: chainID = null;
	$: vals = [];
	$: listSubmitted = false;
	$: pickingWinner = false;
	$: winnerPicked = false;
	$: winnersPicked = false;
	$: winnersSet = false;
	$: winners = ['No Winner YET!'];
	let convert;

	function convertToByte32() {
		vals = [];
		convert.split(',').forEach((element) => {
			vals.push(ethers.utils.formatBytes32String(element));
		});
		submitList();
	}
	async function submitList() {
		listSubmitted = true;
		winners = [];
		winners[0] = 'No Winner YET!';
		let txn = await web3Props.lotteryContract.addPlayers(vals);
		txn.wait();
		pickingWinner = true;
		winners = [];
		winners[0] = "Let's Pick Some Winners!";
		web3Props.lotteryContract.once('RandomWords', () => {
			pickingWinner = false;
			winnerPicked = true;
		});
	}
	async function pickWinners() {
		winners[0] = 'Picking Winners...';
		winnersPicked = true;
		web3Props.lotteryContract.setWinners();
		web3Props.lotteryContract.once('Winner', (w1, w2, w3) => {
			winners[0] = ethers.utils.parseBytes32String(w1);
			winners[1] = ethers.utils.parseBytes32String(w2);
			winners[2] = ethers.utils.parseBytes32String(w3);
			winnersSet = true;
		});
	}
</script>

<div class="grid place-items-center">
	<div>
		<h1 class="text-center text-2xl font-bold">Lottery Winners:</h1>
		{#if pickingWinner}
			<div class="text-center">
				<button
					disabled
					type="button"
					class="py-2.5 px-5 mr-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center"
				>
					<svg
						role="status"
						class="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600"
						viewBox="0 0 100 101"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
							fill="currentColor"
						/>
						<path
							d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
							fill="#1C64F2"
						/>
					</svg>
					Submitting Players...
				</button>
			</div>
		{:else}
			{#each winners as winner}
				<div class="text-center text-xl text-primary">
					{winner}
				</div>
			{/each}
		{/if}
	</div>
	{#if winnerPicked && !winnersSet}
		<div>
			<button disabled={winnersPicked} class="btn btn-accent" on:click={pickWinners}
				>Pick Winners</button
			>
		</div>
	{/if}
</div>
{#if !account || chainID !== 43113}
	<ConnectWallet bind:account bind:chainID bind:web3Props {LotteryABI} {lotteryAddress} />
{:else}
	<div class="grid place-content-center pt-6">
		<div class="grid-cols-1 justify-center">
			<h1 class="text-3xl font-bold">Submit Entries</h1>
			<div>
				<textarea class="textarea textarea-primary" placeholder="Entries" bind:value={convert} />
			</div>
			<div>
				<button disabled={listSubmitted} class="btn btn-secondary" on:click={convertToByte32}
					>Submit</button
				>
			</div>
		</div>
	</div>
{/if}
