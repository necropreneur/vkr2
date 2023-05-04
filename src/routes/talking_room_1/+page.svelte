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

	let bookings1 = {
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

	function saveBookings1() {
		localStorage.setItem('bookings1', JSON.stringify(bookings1));
	}

	function loadBookings1() {
		const storedBookings1 = localStorage.getItem('bookings1');
		if (storedBookings1) {
			bookings1 = JSON.parse(storedBookings1);
		}
	}

	function checkAndCreateBooking(dateString) {
		if (!bookings1[dateString]) {
			bookings1[dateString] = {
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
		}
	}
	let selectedTimeString;
	// $: console.log(selectedDateString, selectedTimeString);

	$: {
		if (selectedDateString && selectedTimeString) {
			bookings1[selectedDateString][selectedTimeString].booked = bookings1[selectedDateString][selectedTimeString].booked;
		}
	}

	function bookTimeSlot() {
		const booking = bookings1[selectedDateString];
		if (booking) {
			const timeSlot = booking[selectedTimeString];
			if (timeSlot) {
				bookings1[selectedDateString][selectedTimeString].booked = !bookings1[selectedDateString][selectedTimeString].booked;
			}
		}
		// console.log(bookings1[selectedDateString][selectedTimeString]);
	}

	function decodeTimeString(encodedString) {
		return decodeURIComponent(encodedString);
	}

	// function stringToDate(dateString) {
	// 	const [day, month, year] = dateString.split('-');
	// 	return new Date(year, month - 1, day);
	// }

	onMount(() => {
		loadBookings1();

		const handleUrlChange = () => {
			const urlSearchParams = new URLSearchParams(window.location.search);
			selectedDateString = stringToDate(urlSearchParams.get('selectedDateString'));
			selectedTimeString = decodeTimeString(urlSearchParams.get('selectedTimeString'));
			console.log(selectedDateString);
		};
		window.addEventListener('popstate', handleUrlChange);
		handleUrlChange();

		const svgContainer = document.getElementById('rooms_svg_container');
		const svg = document.querySelector('svg');
		const viewBox = svg.viewBox.baseVal;
		const width = viewBox.width;
		const height = viewBox.height;
		const aspectRatio = width / height;
		const svgContainerWidth = svgContainer.clientWidth;
		const svgContainerHeight = svgContainer.clientHeight;
		const svgContainerAspectRatio = svgContainerWidth / svgContainerHeight;
		const scaleFactor = svgContainerAspectRatio > aspectRatio ? svgContainerHeight / height : svgContainerWidth / width;

		svgContainer.addEventListener('click', (event) => {
			const target = event.target;

			if (target.tagName === 'path' && target.hasAttribute('id')) {
				// console.log(target.id);
			}
		});
		const svgContainerPaths = document.getElementById('rooms_svg_container').querySelectorAll('path');
		let arrowDiv = document.getElementById('ArrowSvgDiv');
		let arrowSvg = document.getElementById('ArrowSvg');


		svgContainerPaths.forEach((path) => {
			path.addEventListener('click', () => {
				let bbox = path.getBBox();
				let arrow_bbox = arrowSvg.getBBox();

				bbox.x *= scaleFactor;
				bbox.y *= scaleFactor;
				bbox.width *= scaleFactor;
				bbox.height *= scaleFactor;
				arrow_bbox.width *= scaleFactor;
				arrow_bbox.height *= scaleFactor;

				// console.log(bbox);

				if (arrowDiv.style.display === 'none') {
					adjustPosition(arrow_bbox, bbox, false);
					bbox = path.getBBox();
					arrow_bbox = arrowSvg.getBBox();

					bbox.x *= scaleFactor;
					bbox.y *= scaleFactor;
					bbox.width *= scaleFactor;
					bbox.height *= scaleFactor;
					arrow_bbox.width *= scaleFactor;
					arrow_bbox.height *= scaleFactor;

					adjustPosition(arrow_bbox, bbox, false);

					return;
				}
				// Get the path's bounding box to position the image at the center
				adjustPosition(arrow_bbox, bbox, true);
			});
		});

		svgContainer.addEventListener('click', (event) => {
			const target = event.target;

			if (target.tagName !== 'path' || !target.hasAttribute('id')) {
				const arrowDiv = document.getElementById('ArrowSvgDiv');
				arrowDiv.style = 'position: absolute; display: none';
			}
		});

		document.addEventListener('keyup', (event) => {
			if (event.key === 'Escape') {
				const arrowDiv = document.getElementById('ArrowSvgDiv');
				arrowDiv.style = 'position: absolute; display: none';
			}
		});
	});

	afterUpdate(() => {
		saveBookings1();
		// ... (other afterUpdate code)
	});

	function goBackToMenu() {
		goto('/');
	}
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
				<div class="text-3xl">Выберите дату:</div>
				<div><DateInput format="dd-MM-yyyy" bind:value={selectedDate} placeholder="год месяц день" /></div>
			</div>
			<div class="mt-4 flex flex-col justify-between">
				{#each Object.keys(bookings1[selectedDateString]) as timeSlot}
					<div class="flex justify-between text-white mt-4 items-center">
						<div class="text-3xl border-2 rounded-xl px-2 py-1">{timeSlot}</div>
						<div class="w-1/2">
							{#if bookings1[selectedDateString][timeSlot].booked}
								<div class="text-2xl py-2 rounded-lg select-none text-center cursor-pointer bg-red" on:click={() => (selectedTimeString = timeSlot)}>Забронировано</div>
							{:else}
								<div class="text-2xl py-2 rounded-lg select-none text-center cursor-pointer bg-green" on:click={() => (selectedTimeString = timeSlot)}>Свободно</div>
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
					<div class="mt-4 flex justify-between">
						<div>Дата:</div>
						<div>{selectedDateString}</div>
					</div>
					<div class="mt-4 flex justify-between">
						<div>Время:</div>
						<div>{selectedTimeString}</div>
					</div>
					<div class="mt-4 flex flex-col justify-between">
						<div>Введите название</div>
						<input class="bg-gpt-bg" bind:value={bookings1[selectedDateString][selectedTimeString].description} />
					</div>
				{:else}
					<div>Пожалуйтса, выберите дату и время (нажмите "Свободно" или "Забронировано")</div>
				{/if}
			</div>
			<div class="mx-auto w-full">
				{#if selectedTimeString}
					{#if !bookings1[selectedDateString][selectedTimeString].booked}
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
