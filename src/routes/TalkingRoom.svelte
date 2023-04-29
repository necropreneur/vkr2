<!-- src/routes/SvgComponent.svelte -->
<script>
	import { onMount } from 'svelte';
	import ArrowSvg from '$lib/icons/arrow.svelte';

	let arrowDiv;
	let scaleFactor;

	let bookings = [
		{
			date: '23.03.2023',
			table: [
				{ time: '08:00 - 09:00', booked: false },
				{ time: '09:00 - 10:00', booked: true },
				{ time: '10:00 - 11:00', booked: true },
				{ time: '11:00 - 12:00', booked: true },
				{ time: '12:00 - 13:00', booked: false },
				{ time: '13:00 - 14:00', booked: true },
				{ time: '14:00 - 15:00', booked: true },
				{ time: '15:00 - 16:00', booked: false },
			]
		},
		{
			date: '24.03.2023',
			table: [
				{ time: '08:00 - 09:00', booked: true },
				{ time: '09:00 - 10:00', booked: true },
				{ time: '10:00 - 11:00', booked: false },
				{ time: '11:00 - 12:00', booked: true },
				{ time: '12:00 - 13:00', booked: false },
				{ time: '13:00 - 14:00', booked: true },
				{ time: '14:00 - 15:00', booked: true },
				{ time: '15:00 - 16:00', booked: false }
			]
		}
	];

	onMount(() => {
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
				console.log(target.id);
			}
		});
		const svgContainerPaths = document.getElementById('rooms_svg_container').querySelectorAll('path');
		let arrowDiv = document.getElementById('ArrowSvgDiv');
		let arrowSvg = document.getElementById('ArrowSvg');

		function adjustPosition(arrow_bbox, room_bbox, withTransition = false) {
			arrowDiv.style = `position: absolute; pointer-events: none;
      top: ${room_bbox.y + room_bbox.height / 2 - arrow_bbox.height * 0.9}px;
      left: ${room_bbox.x + room_bbox.width / 2 - arrow_bbox.width / 2}px;
      ${withTransition ? 'transition: all 0.3s ease;' : ''}`;
		}

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
				<div class="text-3xl border-2 rounded-xl px-2 py-1">23.03.2023</div>
			</div>
			<div class="mt-4 flex flex-col justify-between">
				{#each bookings[0].table as table}
					<div class="flex justify-between text-white mt-4 items-center">
						<div class="text-3xl border-2 rounded-xl px-2 py-1">{table.time}</div>
						<div class="w-1/2">
							<div class="text-2xl py-2 rounded-lg select-none text-center cursor-pointer bg-{table.booked ? 'red' : 'green'}">
								{table.booked ? 'Забронировано' : 'Свободно'}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="w-[28%] bg-gpt-secondary-bg text-white">
		<div class="w-full p-4 relative h-full flex flex-col justify-between">
			<div>
				<div class="mx-auto w-full">
					<div class="border-2 rounded-lg flex items-center">
						<div class="w-10 p-2 border-r-2 bg-pink-800 rounded-l-lg">
							<svg width="100%" height="100%" class="scale-125" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19C12.125 19 14.078 18.2635 15.6177 17.0319L20.2929 21.7071C20.6834 22.0976 21.3166 22.0976 21.7071 21.7071C22.0976 21.3166 22.0976 20.6834 21.7071 20.2929L17.0319 15.6177C18.2635 14.078 19 12.125 19 10C19 5.02944 14.9706 1 10 1ZM3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10Z" fill="#fff" />
							</svg>
						</div>
						<div class="ml-2">Поиск...</div>
					</div>
				</div>
				<div class="mt-4 text-3xl">Бронирование</div>
				<div class="mt-4">Дата и прочая фигня</div>
				<div class="mt-4">введите название</div>
			</div>
			<div class="mx-auto w-full">
				<div class="px-4 py-2 ищк rounded-lg select-none text-center bg-green-600 hover:bg-green-700 cursor-pointer">Забронировать</div>
			</div>
		</div>

		<!-- <button on:click={updateBoundVal}>Update Bound Value</button> -->
	</div>
	<!-- <div>{customGlobalRemovalMode}</div> -->
</div>

<style>
	.hover-color {
		stroke: red !important;
	}

	.bg-red {
		@apply bg-red-600 ;
	}

	.bg-green {
		@apply bg-green-600 ;
	}
</style>
