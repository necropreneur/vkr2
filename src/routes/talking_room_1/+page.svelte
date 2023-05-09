<!-- src/routes/SvgComponent.svelte -->
<script>
	import { onMount, afterUpdate } from 'svelte';
	import { DateInput } from 'date-picker-svelte';

	import Search from '../../lib/Search.svelte';
	import Back from '../../lib/Back.svelte';

	const bookings_key = 'bookings1';


	function dateToString(date) {
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1
		const year = date.getFullYear();

		return `${day}-${month}-${year}`;
	}

	function stringToDate(dateString) {
		const [day, month, year] = dateString.split('-').map(Number);

		// Subtract 1 from the month since months are zero-based in JavaScript Date objects
		return new Date(year, month - 1, day);
	}

	let bookings = {
		'01-04-2023': {
			'08:00 - 09:00': { booked: false, description: '' },
			'09:00 - 10:00': { booked: true, description: '' },
			'10:00 - 11:00': { booked: true, description: '' },
			'11:00 - 12:00': { booked: true, description: '' },
			'12:00 - 13:00': { booked: false, description: '' },
			'13:00 - 14:00': { booked: true, description: '' },
			'14:00 - 15:00': { booked: true, description: '' },
			'15:00 - 16:00': { booked: false, description: '' }
		},
		'02-04-2023': {
			'08:00 - 09:00': { booked: true, description: '' },
			'09:00 - 10:00': { booked: true, description: '' },
			'10:00 - 11:00': { booked: false, description: '' },
			'11:00 - 12:00': { booked: true, description: '' },
			'12:00 - 13:00': { booked: false, description: '' },
			'13:00 - 14:00': { booked: true, description: '' },
			'14:00 - 15:00': { booked: true, description: '' },
			'15:00 - 16:00': { booked: false, description: '' }
		}
	};

	function saveBookings() {
		localStorage.setItem(bookings_key, JSON.stringify(bookings));
	}

	function loadBookings() {
		const storedBookings1 = localStorage.getItem(bookings_key);
		if (storedBookings1) {
			bookings = JSON.parse(storedBookings1);
		}
	}

	function checkAndCreateBooking(dateString) {
		if (!bookings[dateString]) {
			bookings[dateString] = {
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
	}

	let selectedDate = new Date();
	let selectedDateString = dateToString(selectedDate);
	checkAndCreateBooking(selectedDateString);

	$: selectedDateString = dateToString(selectedDate);
	$: {
		if (selectedDateString) {
			checkAndCreateBooking(selectedDateString);
			console.log(selectedDateString)
			console.log(bookings)
		}
	}
	let selectedTimeString;

	$: {
		if (selectedDateString && selectedTimeString) {
			bookings[selectedDateString][selectedTimeString].booked = bookings[selectedDateString][selectedTimeString].booked;
		}
	}

	function bookTimeSlot() {
		const booking = bookings[selectedDateString];
		if (booking) {
			const timeSlot = booking[selectedTimeString];
			if (timeSlot) {
				bookings[selectedDateString][selectedTimeString].booked = !bookings[selectedDateString][selectedTimeString].booked;
			}
		}
	}


	onMount(() => {
		loadBookings();

		const handleUrlChange = () => {
			const urlSearchParams = new URLSearchParams(window.location.search);
			const resultSelectedTimeString = urlSearchParams.get('selectedTimeString');
			if (resultSelectedTimeString !== undefined && resultSelectedTimeString !== null) {
				selectedTimeString = resultSelectedTimeString;
			}
			const result = urlSearchParams.get('selectedDateString');
			if (result !== undefined && result !== null) {
				selectedDate = stringToDate(result);
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
		saveBookings();
	});

	
</script>

<div class="flex justify-between !bg-gpt-bg h-screen">
	<div id="map" class="h-fit flex w-[28%] !bg-gpt-secondary-bg rounded-br-3xl p-4">
		<div class="relative mx-auto w-full">
			<div class="text-3xl text-white ">Переговорная 1</div>
			<div id="rooms_svg_container" class="z-20 relative mt-4 ">
				<svg width="100%" height="52.356%" viewBox="0 0 382 200" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M379.701 65.4424V89.5879H319.092V197.916H295.184V89.5879H234.704V77.5151V65.4424H379.701Z" stroke="white" stroke-width="3" stroke-miterlimit="10" />
					<path d="M209.704 4H29C15.1929 4 4 15.1929 4 29V126.345C4 140.152 15.1929 151.345 29 151.345H209.704C223.511 151.345 234.704 140.152 234.704 126.345V29C234.704 15.1929 223.511 4 209.704 4Z" fill="#F1D74B" fill-opacity="0.14" stroke="#F1D74B" stroke-width="8" stroke-miterlimit="10" />
				</svg>
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
								<div class="text-xl py-2 rounded-lg select-none text-center cursor-pointer bg-red" on:click={() => (selectedTimeString = timeSlot)}>Забронировано</div>
							{:else}
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
						<!-- <div>{selectedDateString}</div> -->
						<div class="text-3xl border-2 rounded-xl px-2 py-1">{selectedDateString}</div>
					</div>
					<div class="mt-4 flex justify-between items-center">
						<div class="text-3xl h-fit">Время:</div>
						<!-- <div>{selectedTimeString}</div> -->
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
						<div class="px-4 py-2 rounded-lg select-none text-center bg-green-600 hover:bg-green-700 cursor-pointer" on:click={bookTimeSlot}>Забронировать</div>
					{:else}
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
	.hover-color {
		stroke: red !important;
	}

	.bg-red {
		@apply bg-red-600;
	}

	.bg-green {
		@apply bg-green-600;
	}
</style>
