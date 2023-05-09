<!-- src/routes/SvgComponent.svelte -->
<script>
	import { onMount, afterUpdate } from 'svelte';
	import ArrowSvg from '$lib/icons/arrow.svelte';
	import { goto } from '$app/navigation';
	import { DateInput } from 'date-picker-svelte';
	import Search from '../../lib/Search.svelte';

	let arrowDiv;
	let scaleFactor;

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

	let bookings2 = {
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

	function saveBookings2() {
		localStorage.setItem('bookings2', JSON.stringify(bookings2));
	}

	function loadBookings2() {
		const storedBookings2 = localStorage.getItem('bookings2');
		if (storedBookings2) {
			bookings2 = JSON.parse(storedBookings2);
		}
	}

	function checkAndCreateBooking(dateString) {
		if (!bookings2[dateString]) {
			bookings2[dateString] = {
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
			console.log(bookings2)
		}
	}
	let selectedTimeString;
	// $: console.log(selectedDateString, selectedTimeString);

	$: {
		if (selectedDateString && selectedTimeString) {
			bookings2[selectedDateString][selectedTimeString].booked = bookings2[selectedDateString][selectedTimeString].booked;
		}
	}

	function bookTimeSlot() {
		const booking = bookings2[selectedDateString];
		if (booking) {
			const timeSlot = booking[selectedTimeString];
			if (timeSlot) {
				bookings2[selectedDateString][selectedTimeString].booked = !bookings2[selectedDateString][selectedTimeString].booked;
			}
		}
		// console.log(bookings2[selectedDateString][selectedTimeString]);
	}

	function decodeTimeString(encodedString) {
		return decodeURIComponent(encodedString);
	}

	// function stringToDate(dateString) {
	// 	const [day, month, year] = dateString.split('-').map(Number);

	// 	// Subtract 1 from the month since months are zero-based in JavaScript Date objects
	// 	return new Date(year, month - 1, day);
	// }

	onMount(() => {
		loadBookings2();

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
		saveBookings2();
		// ... (other afterUpdate code)
	});

	function goBackToMenu() {
		goto('/');
	}
</script>

<div class="flex justify-between !bg-gpt-bg h-screen">
	<div id="map" class="h-fit flex w-[28%] !bg-gpt-secondary-bg rounded-br-3xl p-4">
		<div class="relative mx-auto w-full">
			<div class="text-3xl text-white ">Переговорная 2</div>
			<div id="rooms_svg_container" class="z-20 relative mt-4 w-48 mx-auto">
				<svg width="100%" height="198.80%" viewBox="0 0 168 334" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M96 2H71V79H96V2Z" stroke="white" stroke-width="3" stroke-miterlimit="10" />
					<path d="M139 79H29C15.1929 79 4 90.1929 4 104V305C4 318.807 15.1929 330 29 330H139C152.807 330 164 318.807 164 305V104C164 90.1929 152.807 79 139 79Z" fill="#F1D74B" fill-opacity="0.14" stroke="#F1D74B" stroke-width="8" stroke-miterlimit="10" />
				</svg>
			</div>
		</div>
	</div>
	<div id="map" class="h-screen flex w-[28%]  p-4">
		<div class="relative m-auto w-full !bg-gpt-secondary-bg rounded-3xl px-4 py-4">
			<div class="text-3xl text-white ">Расписание</div>
			<div class="mt-4 flex justify-between items-center text-white">
				<div class="text-2xl">Выберите дату:</div>
				<DateInput format="dd-MM-yyyy" bind:value={selectedDate} placeholder="год месяц день" class="h-fit mt-[2px]" />
			</div>
			<div class="mt-4 flex flex-col justify-between">
				{#each Object.keys(bookings2[selectedDateString]) as timeSlot}
					<div class="flex justify-between text-white mt-4 items-center">
						<div class="text-2xl border-2 rounded-xl px-2 py-1">{timeSlot}</div>
						<div class="w-1/2">
							{#if bookings2[selectedDateString][timeSlot].booked}
								<div id={selectedTimeString} class="text-xl py-2 rounded-lg select-none text-center cursor-pointer bg-red" on:click={() => (selectedTimeString = timeSlot)}>Забронировано</div>
							{:else}
								<div id={selectedTimeString} class="text-xl py-2 rounded-lg select-none text-center cursor-pointer bg-green" on:click={() => (selectedTimeString = timeSlot)}>Свободно</div>
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
						<textarea class="bg-gpt-bg text-3xl px-4 py-2 mt-2" placeholder="Введите описание..." bind:value={bookings2[selectedDateString][selectedTimeString].description} />
					</div>
				{:else}
					<div>Пожалуйтса, выберите дату и время (нажмите "Свободно" или "Забронировано")</div>
				{/if}
			</div>
			<div id="booking_button" class="mx-auto w-full">
				{#if selectedTimeString}
					{#if !bookings2[selectedDateString][selectedTimeString].booked}
						<div class="px-4 py-2 rounded-lg select-none text-center bg-green-600 hover:bg-green-700 cursor-pointer" on:click={bookTimeSlot}>Забронировать</div>
					{:else}
						<div class="px-4 py-2 rounded-lg select-none text-center bg-red-600 hover:bg-red-700 cursor-pointer" on:click={bookTimeSlot}>Отменить бронирование</div>
					{/if}
				{:else}
					<div class="border-2 px-4 py-2 rounded-lg select-none text-center">Выберите бронирование</div>
				{/if}
			</div>
		</div>

		<!-- ... other parts ... -->
	</div>
	<!-- <div>{customGlobalRemovalMode}</div> -->
	<div class="absolute bottom-0 text-white border-2 p-2 ml-4 mb-4 rounded-lg flex items-center bg-gpt-secondary-bg hover:bg-gpt-bg cursor-pointer select-none" on:click={goBackToMenu}>
		<!-- <BackSvg /> -->
		<div class="ml-2 w-4 scale-[200%] text-white fill-none stroke-white stroke-[6px]">
			<svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 100 100"><path d="M95 44.892v10.216a8.987 8.987 0 0 1-8.961 8.96h-22.8V73.3a8.958 8.958 0 0 1-13.441 7.751L28.466 68.728l-19-10.977a8.956 8.956 0 0 1 0-15.5l19-10.977 21.327-12.323A8.958 8.958 0 0 1 63.234 26.7v9.23h22.805A8.987 8.987 0 0 1 95 44.892Z" /></svg>
		</div>
		<div class="w-fit ml-4">Назад в меню</div>
	</div>
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
