<script>
	import { ethers } from 'ethers';
	import ConnectWallet from '../components/ConnectWallet.svelte';
	let web3Props = {};
	$: show = false;
	$: showAdd = false;
	$: account = null;
	$: chainID = null;
	$: vals = [];
	let convert;
	function convertToByte32() {
		vals = [];
		convert.split(',').forEach((element) => {
			vals.push(ethers.utils.formatBytes32String(element));
		});
	}
	function submitList() {
		console.log('submitted:  ', vals);
	}
</script>

{#if !account || chainID !== 4}
	<ConnectWallet bind:account bind:chainID bind:web3Props />
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
