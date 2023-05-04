<script>
	import { onMount, onDestroy } from 'svelte';

	let rooms = {};
	let tables1 = {};
	let tables2 = {};
	let tables3 = {};
	let bookings1 = {};
	let bookings2 = {};

	let searchQuery = '';
	let searchResults = [];

	function loadDataFromLocalStorage() {
		return {
			rooms: JSON.parse(localStorage.getItem('rooms') || '{}'),
			tables1: JSON.parse(localStorage.getItem('tables1') || '{}'),
			tables2: JSON.parse(localStorage.getItem('tables2') || '{}'),
			tables3: JSON.parse(localStorage.getItem('tables3') || '{}'),
			bookings1: JSON.parse(localStorage.getItem('bookings1') || '{}'),
			bookings2: JSON.parse(localStorage.getItem('bookings2') || '{}')
		};
	}

	function updateSearchResults(query) {
		let results = [];
		const tables = { ...tables1, ...tables2, ...tables3 };
		const bookings = { ...bookings1, ...bookings2 };

		// Search rooms by name
		for (const roomKey in rooms) {
			const room = rooms[roomKey];
			// console.log(room)
			if (room.name.toLowerCase().includes(query.toLowerCase())) {
				results.push({
					type: 'room',
					name: room.name,
					key: roomKey
				});
			}
		}

		// Search names in tables
		for (const tableKey in tables) {
			const table = tables[tableKey];
			if (table.name.toLowerCase().includes(query.toLowerCase())) {
				results.push({
					type: 'table',
					name: table.name,
					key: tableKey,
					location: 'tables'
				});
			}
		}

		// Search rooms by name in bookings
		for (const bookingKey in bookings) {
			const booking = bookings[bookingKey];
			for (const timeSlot in booking) {
				const room = booking[timeSlot];
				if (room.booked && room.description.toLowerCase().includes(query.toLowerCase())) {
					results.push({
						type: 'booking',
						name: room.description,
						key: bookingKey,
						time: timeSlot,
						location: 'bookings'
					});
				}
			}
		}

		searchResults = results;
	}

	function handleInput(event) {
		searchQuery = event.target.value;
		updateSearchResults(searchQuery);
	}

	let inputElem;
	let resultsElem;

	onMount(() => {
		if (typeof window !== 'undefined') {
			const data = loadDataFromLocalStorage();
			rooms = data.rooms;
			tables1 = data.tables1;
			tables2 = data.tables2;
			tables3 = data.tables3;
			bookings1 = data.bookings1;
			bookings2 = data.bookings2;
		}

		inputElem.focus();
	});

	function handleResultClick(result) {
		console.log(result);
		// Handle the click on the search result
	}
</script>

<input type="text" value={searchQuery} on:input={handleInput} placeholder="Search..." autocomplete="off" bind:this={inputElem} />

{#if searchQuery}
	<div id="search-results" bind:this={resultsElem}>
		{#if searchResults.length > 0}
			{#each searchResults as result}
				<div class="result" on:click={() => handleResultClick(result)}>
					{#if result.type === 'room'}
						<span class="result-type">Room</span>
					{:else if result.type === 'table'}
						<span class="result-type">Table</span>
					{:else}
						<span class="result-type">Booking</span>
					{/if}
					<span class="result-name">{result.name}</span>
					{#if result.location}
						<span class="result-location">{result.location}</span>
					{/if}
					{#if result.time}
						<span class="result-time">{result.time}</span>
					{/if}
				</div>
			{/each}
		{:else}
			<div class="result no-results">No results found</div>
		{/if}
	</div>
{/if}


<style>
	/* Add CSS styles for the search component */
	#search-results {
		/* position: absolute; */
		top: 100%;
		left: 0;
		right: 0;
		border: 1px solid gray;
		background-color: white;
		max-height: 200px;
		overflow-y: auto;
		z-index: 100;
	}

	.result {
		padding: 5px;
		cursor: pointer;
		display: flex;
		align-items: center;
	}

	.result:hover {
		background-color: #f0f0f0;
	}

	.result-type {
		font-weight: bold;
		margin-right: 5px;
	}

	.result-name {
		flex: 1;
	}

	.result-location {
		font-style: italic;
		margin-right: 5px;
	}

	.result-time {
		font-style: italic;
		margin-left: 5px;
	}

	.no-results {
		text-align: center;
		color: gray;
		font-style: italic;
	}
</style>
