<!-- src/routes/SvgComponent.svelte -->
<script>
	import { onMount, afterUpdate } from 'svelte';
	import { DateInput } from 'date-picker-svelte';
	import Search from '../../lib/Search.svelte';
	import Back from '../../lib/Back.svelte';
	import TalkingRoom1Svg from '../../lib/svg_svelte/TalkingRoom1Svg.svelte';

	const bookings_key = 'bookings1';

	let selectedDate = new Date();
	let selectedDateString = dateToString(selectedDate);
	let selectedTimeString = '';

	let bookings = loadBookingsFromLocalStorage() || {};

	function generateInitialBooking() {
		return {
			'08:00 - 09:00': { booked: false, description: '' },
			'09:00 - 10:00': { booked: false, description: '' },
			'10:00 - 11:00': { booked: false, description: '' },
			'11:00 - 12:00': { booked: false, description: '' },
			'12:00 - 13:00': { booked: false, description: '' },
			'13:00 - 14:00': { booked: false, description: '' },
			'14:00 - 15:00': { booked: false, description: '' },
			'15:00 - 16:00': { booked: false, description: '' }
		};
	}

	// Helper functions
	function dateToString(date) {
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1
		const year = date.getFullYear();

		return `${day}-${month}-${year}`;
	}

	function stringToDate(dateString) {
		const [day, month, year] = dateString.split('-').map(Number);
		return new Date(year, month - 1, day);
	}

	function saveBookingsToLocalStorage() {
		localStorage.setItem(bookings_key, JSON.stringify(bookings));
	}

	function loadBookingsFromLocalStorage() {
		const storedBookings = localStorage.getItem(bookings_key);
		return storedBookings ? JSON.parse(storedBookings) : null;
	}

	function checkAndCreateBooking(dateString) {
		if (!bookings[dateString]) {
			bookings[dateString] = generateInitialBooking();
		}
	}

	function bookTimeSlot() {
		if (bookings[selectedDateString]?.[selectedTimeString]) {
			bookings[selectedDateString][selectedTimeString].booked = !bookings[selectedDateString][selectedTimeString].booked;
		}
	}

	// Lifecycle hooks
	onMount(() => {
		const handleUrlChange = () => {
			const urlSearchParams = new URLSearchParams(window.location.search);
			selectedTimeString = urlSearchParams.get('selectedTimeString') || '';
			if (urlSearchParams.get('selectedDateString')){
				selectedDate = stringToDate(urlSearchParams.get('selectedDateString'));
			} else {
				selectedDate = new Date();
			}
		};
		
		window.addEventListener('popstate', handleUrlChange);
		handleUrlChange();

		document.addEventListener('keyup', (event) => {
			if (event.key === 'Escape') {
				selectedTimeString = '';
			}
		});
	});

	afterUpdate(() => {
		saveBookingsToLocalStorage();
	});

	// Reactive statements
	$: {
		selectedDateString = dateToString(selectedDate);
		checkAndCreateBooking(selectedDateString);
	}

	$: {
		if (selectedDateString && selectedTimeString) {
			bookings[selectedDateString][selectedTimeString].booked = bookings[selectedDateString][selectedTimeString].booked;
		}
	}
</script>

<div class="flex justify-between !bg-gpt-bg h-screen">
	<div id="map" class="h-fit flex w-[28%] !bg-gpt-secondary-bg rounded-br-3xl p-4">
		<div class="relative mx-auto w-full">
			<div class="text-3xl text-white ">Переговорная 1</div>
			<div id="rooms_svg_container" class="mt-4 ">
				<TalkingRoom1Svg />
			</div>
		</div>
	</div>
	<div id="map" class="h-screen flex w-[28%]  p-4">
		<div class="relative m-auto w-full !bg-gpt-secondary-bg rounded-3xl px-4 py-4">
			<div class="text-3xl text-white ">Расписание</div>
			<div class="mt-4 flex justify-between text-white">
				<div class="text-2xl">Выберите дату:</div>
				<div><DateInput format="dd-MM-yyyy" bind:value={selectedDate} placeholder="год месяц день" /></div>
			</div>
			<div class="mt-4 flex flex-col justify-between">
				{#each Object.keys(bookings[selectedDateString]) as timeSlot}
					<div class="flex justify-between text-white mt-4 items-center">
						<div class="text-2xl border-2 rounded-xl px-2 py-1">{timeSlot}</div>
						<div class="w-1/2">
							{#if bookings[selectedDateString][timeSlot].booked}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
								<div class="text-xl py-2 rounded-lg select-none text-center cursor-pointer bg-red" on:click={() => (selectedTimeString = timeSlot)}>Забронировано</div>
							{:else}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
								<div class="text-xl py-2 rounded-lg select-none text-center cursor-pointer bg-green" on:click={() => (selectedTimeString = timeSlot)}>Свободно</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="w-[28%] bg-gpt-secondary-bg text-white">
		<div class="w-full p-4 relative h-full flex flex-col justify-between">
			<div>
				<Search />
				<div class="mt-4 text-3xl">Бронирование</div>
				{#if selectedTimeString}
					<div class="mt-4 flex justify-between items-center">
						<div class="text-3xl h-fit">Дата:</div>
						<div class="text-3xl border-2 rounded-xl px-2 py-1">{selectedDateString}</div>
					</div>
					<div class="mt-4 flex justify-between items-center">
						<div class="text-3xl h-fit">Время:</div>
						<div class="text-3xl border-2 rounded-xl px-2 py-1">{selectedTimeString}</div>
					</div>
					<div class="mt-4 flex flex-col justify-between ">
						<div class="text-3xl h-fit">Описание:</div>
						<textarea class="bg-gpt-bg text-3xl px-4 py-2 mt-2" placeholder="Введите описание..." bind:value={bookings[selectedDateString][selectedTimeString].description} />
					</div>
				{:else}
					<div>Пожалуйтса, выберите дату и время (нажмите "Свободно" или "Забронировано")</div>
				{/if}
			</div>
			<div class="mx-auto w-full">
				{#if selectedTimeString}
					{#if !bookings[selectedDateString][selectedTimeString].booked}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div class="px-4 py-2 rounded-lg select-none text-center bg-green-600 hover:bg-green-700 cursor-pointer" on:click={bookTimeSlot}>Забронировать</div>
					{:else}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div class="px-4 py-2 rounded-lg select-none text-center bg-red-600 hover:bg-red-700 cursor-pointer" on:click={bookTimeSlot}>Отменить бронирование</div>
					{/if}
				{:else}
					<div class="border-2 px-4 py-2 rounded-lg select-none text-center">Выберите бронирование</div>
				{/if}
			</div>
		</div>
	</div>

	<Back />
</div>

<style>
	.bg-red {
		@apply bg-red-600;
	}

	.bg-green {
		@apply bg-green-600;
	}
</style>
