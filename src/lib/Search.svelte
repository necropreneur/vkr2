<script>
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';

	let rooms = {};
	let tables1 = {};
	let tables2 = {};
	let tables3 = {};
	let bookings1 = {};
	let bookings2 = {};

	let searchQuery = '';
	let searchResults = [];

	const locationToRussian = {
		rooms: 'Карта',
		workspace_1: 'Рабочее пространство 1',
		workspace_2: 'Рабочее пространство 2',
		workspace_3: 'Рабочее пространство 3',
		talking_room_1: 'Переговорная 1',
		talking_room_2: 'Переговорная 2'
	};

	const typeToRussian = {
		room: 'Карта',
		table: 'Стол',
		booking: 'Бронирование',
		printer: 'Принтер'
	};

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
		const tablesData = [
			{ data: tables1, location: 'workspace_1' },
			{ data: tables2, location: 'workspace_2' },
			{ data: tables3, location: 'workspace_3' }
		];

		const bookingsData = [
			{ data: bookings1, location: 'talking_room_1' },
			{ data: bookings2, location: 'talking_room_2' }
		];

		const printersData = [
			{ name: 'Принтер', location: 'workspace_2' },
			{ name: 'Принтер', location: 'workspace_3' }
		];

		// Search names in printers
		for (const printer of printersData) {
			if (printer.name.toLowerCase().includes(query.toLowerCase())) {
				results.push({
					type: 'printer',
					name: printer.name,
					location: printer.location
				});
			}
		}

		// Search names in tables
		for (const tableInfo of tablesData) {
			for (const tableKey in tableInfo.data) {
				const table = tableInfo.data[tableKey];
				if (table.name.toLowerCase().includes(query.toLowerCase())) {
					results.push({
						type: 'table',
						name: table.name,
						key: tableKey,
						location: tableInfo.location
					});
				}
			}
		}

		// Search rooms by name in bookings
		for (const bookingInfo of bookingsData) {
			for (const bookingKey in bookingInfo.data) {
				const booking = bookingInfo.data[bookingKey];
				for (const timeSlot in booking) {
					const room = booking[timeSlot];
					if (room.booked && room.description.toLowerCase().includes(query.toLowerCase())) {
						results.push({
							type: 'booking',
							name: room.description,
							key: bookingKey,
							time: timeSlot,
							location: bookingInfo.location
						});
					}
				}
			}
		}
		console.log(bookingsData);

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
		// console.log(rooms);

		searchResults = results;
	}

	function handleInput(event) {
		searchQuery = event.target.value;
		updateSearchResults(searchQuery);
	}

	let inputElem;
	let resultsElem;

	onMount(() => {
		const data = loadDataFromLocalStorage();
		rooms = data.rooms;
		tables1 = data.tables1;
		tables2 = data.tables2;
		tables3 = data.tables3;
		bookings1 = data.bookings1;
		bookings2 = data.bookings2;

		inputElem.focus();
	});

	function customGoto(url, options) {
		goto(url, options).then(() => {
			if (url.includes('?')) {
				location.reload();
			}
		});
	}

	function handleResultClick(result) {
		if (result.type === 'room') {
			customGoto(`/?selectedRoomKey=${result.key}`);
		} else {
			console.log(result);
		}

		if (result.type === 'table') {
			customGoto(`/${result.location}?selectedTableKey=${result.key}`);
		} else {
			console.log(result);
		}

		if (result.type === 'booking') {
			customGoto(`/${result.location}?selectedDateString=${result.key}&selectedTimeString=${result.time}`);
		} else {
			console.log(result);
		}

		if (result.type === 'printer') {
			customGoto(`/${result.location}`);
		} else {
			console.log(result);
		}
		// Handle the click on the search result
	}
</script>

<div>
	<div class="mx-auto w-full">
		<div class="border-2 rounded-l-lg rounded-tr-lg flex items-center bg-neutral-700">
			<div class="w-10 p-2 border-r-2 bg-pink-800 rounded-l-lg">
				<svg width="100%" height="100%" class="scale-125" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19C12.125 19 14.078 18.2635 15.6177 17.0319L20.2929 21.7071C20.6834 22.0976 21.3166 22.0976 21.7071 21.7071C22.0976 21.3166 22.0976 20.6834 21.7071 20.2929L17.0319 15.6177C18.2635 14.078 19 12.125 19 10C19 5.02944 14.9706 1 10 1ZM3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10Z" fill="#fff" />
				</svg>
			</div>
			<input class="w-full p-1 bg-transparent placeholder-neutral-200 border-none focus:ring-transparent ml-2 text-white" type="text" value={searchQuery} on:input={handleInput} placeholder="Поиск..." autocomplete="off" bind:this={inputElem} />
		</div>
	</div>

	{#if searchQuery}
		<div class="ml-[38px] border-x-2 border-b-2 overflow-y-auto z-10 max-h-72 rounded-b-lg flex flex-col divide-y-2" bind:this={resultsElem}>
			{#if searchResults.length > 0}
				{#each searchResults as result}
					<div class="p-2 cursor-pointer flex flex-col hover:bg-neutral-300 hover:text-neutral-500 text-white " on:click={() => handleResultClick(result)}>
						<div class="flex">
							<div class="italic font-semibold">Тип:</div>
							<div class="ml-4">{typeToRussian[result.type]}</div>
						</div>
						<div class="flex">
							<div class="italic font-semibold">Описание:</div>
							<div class="ml-4">{result.name}</div>
						</div>
						{#if result.location}
							<div class="flex">
								<div class="italic font-semibold">Расположение:</div>
								<div class="ml-4">{locationToRussian[result.location]}</div>
							</div>
						{/if}
						{#if result.time}
						<div class="flex">
							<div class="italic font-semibold">Дата:</div>
							<div class="ml-4">{result.key}</div>
						</div>
							<div class="flex">
								<div class="italic font-semibold">Время:</div>
								<div class="ml-4">{result.time}</div>
							</div>
						{/if}
					</div>
				{/each}
			{:else}
				<div class="p-2 cursor-pointer flexa items-center text-white hover:bg-neutral-300 hover:text-neutral-500 text-center italic">No results found</div>
			{/if}
		</div>
	{/if}
</div>
