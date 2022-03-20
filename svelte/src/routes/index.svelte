<script>
	import { ethers } from 'ethers';
	import ConnectWallet from '../components/ConnectWallet.svelte';
	import LotteryABI from '../contracts/Lottery.json';
	const lotteryAddress = '0x8858970eF4c50d4e1250097a3d2160D6e8778a6D';
	let web3Props = {};
	$: show = false;
	$: showAdd = false;
	$: account = null;
	$: chainID = null;
	$: vals = [];
	$: pickingWinner = false;
	$: listSubmitted = false;
	$: winner = 'No Winner YET!';
	let convert;
	function convertToByte32() {
		vals = [];
		convert.split(',').forEach((element) => {
			vals.push(ethers.utils.formatBytes32String(element));
		});
	}
	async function submitList() {
		listSubmitted = false;
		winner = 'No Winner YET!';
		let txn = await web3Props.lotteryContract.addPlayers(vals);
		txn.wait();
		listSubmitted = true;
	}

	async function pickWinner() {
		pickingWinner = true;
		winner = 'No Winner YET!';
		let txn = await web3Props.lotteryContract.selectWinner();
		txn.wait();
		web3Props.lotteryContract.on('Winner', (pick) => {
			pickingWinner = false;
			winner = ethers.utils.parseBytes32String(pick);
		});
	}
</script>

<div class="grid place-items-center">
	<div>
		<h1 class="text-center text-2xl font-bold">Lottery Winner: {winner}</h1>
	</div>
	{#if listSubmitted}
		<div>
			<button class="btn btn-accent" on:click={pickWinner}>Pick Winner</button>
		</div>
	{/if}
</div>
{#if pickingWinner}
	<div class="text-center">picking</div>
{/if}
{#if !account || chainID !== 4}
	<ConnectWallet bind:account bind:chainID bind:web3Props {LotteryABI} {lotteryAddress} />
{:else}
	{#if show}
		Submitted
	{/if}
	<div class="grid place-content-center pt-6">
		<h1 class="text-3xl font-bold">Submit Entries</h1>

		<div class="grid-cols-1 w-full">
			<div>
				<textarea class="textarea textarea-primary" placeholder="Entries" bind:value={convert} />
			</div>
			<div>
				<button class="btn btn-secondary" on:click={convertToByte32}>Convert</button>
				{#if vals.length > 0}
					<button class="btn btn-primary" on:click={submitList}>Submit</button>
				{/if}
			</div>
			[
			{#each vals as element}
				<div>'{element}',</div>
			{/each}
			]
		</div>
	</div>
{/if}
