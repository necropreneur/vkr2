<!-- src/routes/SvgComponent.svelte -->
<script>
	import { onMount } from 'svelte';
	import ArrowSvg from '$lib/icons/arrow.svelte';

	import { DateInput } from 'date-picker-svelte';

	let arrowDiv;
	let scaleFactor;

	let tables = {
		table_1: {
			name: 'Павел Буров',
			ocupation: '',
			devices: '',
			fulltime: false,
			start_date: new Date(),
			end_date: new Date()
		},
		table_2: {
			name: '',
			ocupation: '',
			devices: '',
			fulltime: false,
			start_date: '',
			end_date: ''
		},
		table_3: {
			name: '',
			ocupation: '',
			devices: '',
			fulltime: false,
			start_date: '',
			end_date: ''
		},
		table_4: {
			name: '',
			ocupation: '',
			devices: '',
			fulltime: false,
			start_date: '',
			end_date: ''
		},
		table_5: {
			name: '',
			ocupation: '',
			devices: '',
			fulltime: false,
			start_date: '',
			end_date: ''
		},
		table_6: {
			name: '',
			ocupation: '',
			devices: '',
			fulltime: false,
			start_date: '',
			end_date: ''
		},
		table_7: {
			name: '',
			ocupation: '',
			devices: '',
			fulltime: false,
			start_date: '',
			end_date: ''
		},
		table_8: {
			name: '',
			ocupation: '',
			devices: '',
			fulltime: false,
			start_date: '',
			end_date: ''
		},
		table_9: {
			name: '',
			ocupation: '',
			devices: '',
			fulltime: false,
			start_date: '',
			end_date: ''
		},
		table_10: {
			name: '',
			ocupation: '',
			devices: '',
			fulltime: false,
			start_date: '',
			end_date: ''
		}
	};

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
      top: ${room_bbox.y + room_bbox.height / 2 - arrow_bbox.height * 0.65}px;
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

<div class="flex">
	<div id="map" class="h-screen !bg-gpt-bg flex w-[72%]">
		<div class="relative border-2 m-auto w-2/3">
			<div id="rooms_svg_container" class="z-20 relative">
				<svg width="100%" height="108.6044%" viewBox="0 0 953 1035" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path id="table_1" d="M210.5 948.5L210.5 868L79 868L79 948.5L210.5 948.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_2" d="M451.5 947.5L451.5 867L320 867L320 947.5L451.5 947.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_3" d="M698.5 946.5L698.5 866L567 866L567 946.5L698.5 946.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_4" d="M940.5 945.5L940.5 865L809 865L809 945.5L940.5 945.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_5" d="M501 268L501 348.5L632.5 348.5L632.5 268L501 268Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_6" d="M940.5 349.5L940.5 269L809 269L809 349.5L940.5 349.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_7" d="M501 87L501 167.5L632.5 167.5L632.5 87L501 87Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_8" d="M809 88L809 168.5L940.5 168.5L940.5 88L809 88Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path d="M92 149.046V534.228H159V149.046" stroke="white" stroke-width="3" stroke-miterlimit="10" />
					<path d="M924 4.87207C937.807 4.87207 949 16.065 949 29.8721V1005.23C949 1019.04 937.807 1030.23 924 1030.23H29C15.1929 1030.23 4 1019.04 4 1005.23V559.431C4 545.624 15.1929 534.431 29 534.431H467.057C480.864 534.431 492.057 523.238 492.057 509.431V29.8721C492.057 16.065 503.25 4.87207 517.057 4.87207H924Z" stroke="#0085FF" stroke-width="8" stroke-miterlimit="10" />
					<path id="table_9" d="M940.5 770.5L940.5 690L809 690L809 770.5L940.5 770.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_10" d="M940.5 598.5L940.5 518L809 518L809 598.5L940.5 598.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
				</svg>
			</div>
			<div id="ArrowSvgDiv" class="absolute z-30 !w-[8%]" style="top: 0; display: none;">
				<ArrowSvg id="ArrowSvg" />
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
				<div class="mt-4">имя бронирующего</div>
				<input class="bg-gpt-bg" bind:value={tables['table_1'].name} />
				<div class="mt-4">Должность</div>
				<input class="bg-gpt-bg" bind:value={tables['table_1'].ocupation} />
				<div class="mt-4">Необходимое оборудование</div>
				<textarea class="bg-gpt-bg" bind:value={tables['table_1'].devices} />
				<div class="mt-4 flex">
					<div>Постоянное посещение</div>
					<div><input type="checkbox" checked={tables['table_1'].fulltime} /></div>
				</div>
				<div class="mt-4">или</div>
				<div class="mt-4 flex">
					<div>Начало брони</div>
					<div><DateInput bind:value={tables['table_1'].start_date} format="yyyy-MM-dd" /></div>
				</div>
				<div class="mt-4 flex">
					<div>Конец брони</div>
					<div><DateInput bind:value={tables['table_1'].end_date} format="yyyy-MM-dd" /></div>
				</div>
			</div>
			<div class="mx-auto w-full">
				<div class="px-4 py-2 ищк rounded-lg select-none text-center bg-green-600 hover:bg-green-700 cursor-pointer">Забронировать</div>
			</div>
		</div>
	</div>
	<!-- <div>{customGlobalRemovalMode}</div> -->
</div>

<style>
	.hover-color {
		stroke: red !important;
	}

	:root {
		--date-picker-background: #313131;
		--date-picker-foreground: #fff;
	}
</style>
