<!-- src/routes/SvgComponent.svelte -->
<script>
	import { onMount, afterUpdate } from 'svelte';
	import ArrowSvg from '$lib/icons/arrow.svelte';
	import { goto } from '$app/navigation';

	import { DateInput } from 'date-picker-svelte';

	let arrowDiv;
	let scaleFactor;

	// let printers = {
	// 	printer_1: {
	// 		location: 'workspace_1',
	// 		currentlyPrinting: false,
	// 	}
	// }

	let tables2 = {
		table_1: {
			name: 'Павел Буров',
			ocupation: '',
			devices: '',
			fulltime: false,
			start_date: new Date(),
			end_date: new Date(),
			booked: false
		},
		table_2: {
			name: '',
			ocupation: '',
			devices: '',
			fulltime: false,
			start_date: new Date(),
			end_date: new Date(),
			booked: false
		},
		table_3: {
			name: '',
			ocupation: '',
			devices: '',
			fulltime: false,
			start_date: new Date(),
			end_date: new Date(),
			booked: false
		},
		table_4: {
			name: '',
			ocupation: '',
			devices: '',
			fulltime: false,
			start_date: new Date(),
			end_date: new Date(),
			booked: false
		},
		table_5: {
			name: '',
			ocupation: '',
			devices: '',
			fulltime: false,
			start_date: new Date(),
			end_date: new Date(),
			booked: false
		},
		table_6: {
			name: '',
			ocupation: '',
			devices: '',
			fulltime: false,
			start_date: new Date(),
			end_date: new Date(),
			booked: false
		},
		table_7: {
			name: '',
			ocupation: '',
			devices: '',
			fulltime: false,
			start_date: new Date(),
			end_date: new Date(),
			booked: false
		}
	};

	function savetables2() {
		localStorage.setItem('tables2', JSON.stringify(tables2));
	}

	function loadtables2() {
		const storedtables2 = localStorage.getItem('tables2');
		if (storedtables2) {
			tables2 = JSON.parse(storedtables2);

			// Convert date strings back to Date objects
			for (const key in tables2) {
				tables2[key].start_date = new Date(tables2[key].start_date);
				tables2[key].end_date = new Date(tables2[key].end_date);
			}
		}
	}

	let selectedTableKey = undefined;
	let disabled = false;

	$: if (selectedTableKey !== undefined) {
		disabled = tables2[selectedTableKey].fulltime;
	}

	function bookTable() {
		if (selectedTableKey in tables2) {
			console.log('yey');
			tables2[selectedTableKey].booked = !tables2[selectedTableKey].booked;
		}
	}

	function updateColors() {
		// Check if the room_svg_container is already in the DOM
		const room_svg_container = document.getElementById('rooms_svg_container');
		if (room_svg_container) {
			// Iterate over all keys in tables2
			for (const key in tables2) {
				// Get the path with the corresponding ID from room_svg_containers
				const path = room_svg_container.querySelector(`#${key}`);
				if (path) {
					// If booked is false, set the fill color to red, otherwise use the original color
					let fillColor;
					let strokeColor;
					if (tables2[key].booked) {
						if (!tables2[key].fulltime) {
							// blue
							strokeColor = 'rgb(0, 133, 255)';
							fillColor = 'rgb(0, 133, 255)';
						} else {
							// red
							strokeColor = 'rgb(177, 49, 49)';
							fillColor = 'rgb(255, 0, 0)';
						}
					} else {
						strokeColor = fillColor = 'white';
					}
					path.style.fill = fillColor;
					path.style.stroke = strokeColor;
				}
			}
		}
	}

	onMount(() => {
		loadtables2();
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
				selectedTableKey = target.id;
				console.log(selectedTableKey);
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
				selectedTableKey = undefined;
			}
		});

		document.addEventListener('keyup', (event) => {
			if (event.key === 'Escape') {
				const arrowDiv = document.getElementById('ArrowSvgDiv');
				arrowDiv.style = 'position: absolute; display: none';
				selectedTableKey = undefined;
			}
		});
		updateColors();
	});

	afterUpdate(() => {
		savetables2();
		updateColors();
	});

	function goBackToMenu() {
		goto('/');
	}
</script>

<div class="flex">
	<div id="map" class="h-screen !bg-gpt-bg flex w-[72%]">
		<div class="relative border-2 m-auto w-2/3">
			<div id="rooms_svg_container" class="z-20 relative">
				<!-- <svg width="100%" height="108.6044%" viewBox="0 0 953 1035" fill="none" xmlns="http://www.w3.org/2000/svg">
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
				</svg> -->
				<svg width="100%" height="56.94%" viewBox="0 0 1231 701" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M304 203V2H279H254V203H304Z" stroke="white" stroke-width="3" stroke-miterlimit="10" />
					<path  d="M1112.38 52.9541H1062.93V205.279H1112.38V52.9541Z" stroke="white" stroke-width="3" stroke-miterlimit="10" />
					<path  d="M1202 204.829H29C15.1929 204.829 4 216.022 4 229.829V671.773C4 685.58 15.1929 696.773 29 696.773H1202C1215.81 696.773 1227 685.58 1227 671.773V229.829C1227 216.022 1215.81 204.829 1202 204.829Z" stroke="#0085FF" stroke-width="8" stroke-miterlimit="10" />
					<path id="table_1" d="M143.5 629.5L143.5 549L12 549L12 629.5L143.5 629.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_2" d="M384.5 628.5L384.5 548L253 548L253 628.5L384.5 628.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_3" d="M631.5 627.5L631.5 547L500 547L500 627.5L631.5 627.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_4" d="M873.5 626.5L873.5 546L742 546L742 626.5L873.5 626.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_5" d="M873.5 353.5L873.5 273L742 273L742 353.5L873.5 353.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_6" d="M632.5 353.5L632.5 273L501 273L501 353.5L632.5 353.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_7" d="M1115.5 627.5L1115.5 547L984 547L984 627.5L1115.5 627.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path d="M144 299.979V322.065V344.152C144 350.251 139.056 355.196 132.957 355.196H28.0435C21.9444 355.196 17 350.251 17 344.152V322.065V299.979C17 293.88 21.9444 288.935 28.0435 288.935H132.957C139.056 288.935 144 293.88 144 299.979Z" fill="#9CA09E" />
					<path d="M144 299.979V322.065H17V299.979C17 293.88 21.9444 288.935 28.0435 288.935H132.957C139.056 288.935 144 293.88 144 299.979Z" fill="#D2D6D5" />
					<path d="M121.913 308.261H39.0872C36.0375 308.261 33.5654 305.789 33.5654 302.739V288.935H127.435V302.739C127.435 305.789 124.963 308.261 121.913 308.261Z" fill="#3C3B42" />
					<path d="M121.913 282.033V299.978C121.913 301.503 120.677 302.739 119.152 302.739H41.8478C40.323 302.739 39.0869 301.503 39.0869 299.978V282.033C39.0869 281.271 39.7051 280.652 40.4673 280.652H120.533C121.295 280.652 121.913 281.271 121.913 282.033Z" fill="#66646D" />
					<path d="M127.435 341.391V355.196H33.5654V341.391C33.5654 338.342 36.0375 335.87 39.0872 335.87H121.913C124.963 335.87 127.435 338.342 127.435 341.391Z" fill="#3C3B42" />
					<path d="M120.533 363.479H40.4673C39.7051 363.479 39.0869 362.86 39.0869 362.098V344.152C39.0869 342.628 40.323 341.392 41.8478 341.392H119.152C120.677 341.392 121.913 342.628 121.913 344.152V362.098C121.913 362.86 121.295 363.479 120.533 363.479Z" fill="#66646D" />
					<path d="M130.196 327.587C130.196 326.062 131.432 324.826 132.957 324.826C134.481 324.826 135.718 326.062 135.718 327.587C135.718 329.112 134.481 330.348 132.957 330.348C131.432 330.348 130.196 329.112 130.196 327.587Z" fill="#C8DD7F" />
					<path d="M119.152 327.587C119.152 326.062 120.388 324.826 121.913 324.826C123.438 324.826 124.674 326.062 124.674 327.587C124.674 329.112 123.438 330.348 121.913 330.348C120.388 330.348 119.152 329.112 119.152 327.587Z" fill="#C8DD7F" />
					<path d="M130.196 316.544C130.196 315.019 131.432 313.783 132.957 313.783C134.481 313.783 135.718 315.019 135.718 316.544C135.718 318.068 134.481 319.304 132.957 319.304C131.432 319.304 130.196 318.068 130.196 316.544Z" fill="#9CA09E" />
					<path d="M119.152 367.619C119.152 368.382 118.534 369 117.772 369H43.2281C42.4658 369 41.8477 368.382 41.8477 367.619V341.391H119.152V367.619Z" fill="#E0E0E0" />
					<path d="M119.152 346.913H41.8477V341.391H119.152V346.913Z" fill="#C3C9C7" />
					<path d="M41.8477 302.739V249.73C41.8477 245.461 45.3087 242 49.5781 242H101.181C102.462 242 103.691 242.509 104.597 243.415L117.737 256.555C118.643 257.461 119.152 258.69 119.152 259.971V302.739H41.8477Z" fill="#F2F2F2" />
					<path d="M103.691 265.191H119.152V302.739H41.8477V249.73C41.8477 245.461 45.3087 242 49.5781 242H95.9607V257.461C95.9607 261.73 99.4217 265.191 103.691 265.191Z" fill="#E0E0E0" />
					<path d="M103.691 265.191H119.152V270.989L105.566 267.593C104.464 267.317 103.691 266.327 103.691 265.191Z" fill="#AAAFAD" />
					<path d="M64.0829 270.801H96.9171C102.687 270.801 107.364 275.479 107.364 281.248C107.364 287.018 102.687 291.696 96.9171 291.696H64.0829C58.3129 291.696 53.6357 287.018 53.6357 281.248C53.6355 275.479 58.3129 270.801 64.0829 270.801Z" fill="#73A09C" />
					<path d="M59.6055 270.079C59.6055 264.722 63.9489 260.378 69.3063 260.378C74.6638 260.378 79.0072 264.722 79.0072 270.079C79.0072 275.437 74.6638 279.78 69.3063 279.78C63.9489 279.78 59.6055 275.437 59.6055 270.079Z" fill="#90BFBB" />
					<path d="M68.8975 281.995C68.8975 276.637 73.2409 272.294 78.5983 272.294C83.9558 272.294 88.2992 276.637 88.2992 281.995C88.2992 287.352 83.9561 291.696 78.5983 291.696C73.2406 291.696 68.8975 287.352 68.8975 281.995Z" fill="#B4DBD5" />
					<path d="M68.5601 270.079C68.5601 261.012 75.9103 253.662 84.977 253.662C94.0437 253.662 101.394 261.012 101.394 270.079C101.394 279.146 94.0437 286.496 84.977 286.496C75.9103 286.496 68.5601 279.146 68.5601 270.079Z" fill="#B4DBD5" />
					<path d="M104.597 243.415L117.737 256.555C118.643 257.461 119.152 258.69 119.152 259.971V265.191H103.691C99.422 265.191 95.9609 261.73 95.9609 257.461V242H101.181C102.462 242 103.691 242.509 104.597 243.415Z" fill="#F2F2F2" />
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
				{#if selectedTableKey}
					<div class="mt-4">имя бронирующего</div>
					<input class="bg-gpt-bg" bind:value={tables2[selectedTableKey].name} />
					<div class="mt-4">Должность</div>
					<input class="bg-gpt-bg" bind:value={tables2[selectedTableKey].ocupation} />
					<div class="mt-4">Необходимое оборудование</div>
					<textarea class="bg-gpt-bg" bind:value={tables2[selectedTableKey].devices} />
					<div class="mt-4 flex">
						<div>Постоянное посещение</div>
						<div><input type="checkbox" bind:checked={tables2[selectedTableKey].fulltime} /></div>
					</div>
					<div class="mt-4">или</div>
					<div class="mt-4 flex">
						<div class={disabled ? 'text-white/50' : 'text-white'}>Начало брони</div>
						<div><DateInput bind:value={tables2[selectedTableKey].start_date} format="yyyy-MM-dd" {disabled} /></div>
					</div>
					<div class="mt-4 flex">
						<div class={disabled ? 'text-white/50' : 'text-white'}>Конец брони</div>
						<div><DateInput bind:value={tables2[selectedTableKey].end_date} format="yyyy-MM-dd" {disabled} /></div>
					</div>
				{/if}
			</div>
			<div class="mx-auto w-full">
				{#if selectedTableKey && tables2[selectedTableKey]}
					{#if !tables2[selectedTableKey].booked}
						<div class="px-4 py-2 rounded-lg select-none text-center bg-green-600 hover:bg-green-700 cursor-pointer" on:click={bookTable}>Забронировать</div>
					{:else}
						<div class="px-4 py-2 rounded-lg select-none text-center bg-red-600 hover:bg-red-700 cursor-pointer" on:click={bookTable}>Отменить бронирование</div>
					{/if}
				{:else}
					<div class="border-2 px-4 py-2 rounded-lg select-none text-center">Выберите стол на карте</div>
				{/if}
			</div>
		</div>
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

	:root {
		--date-picker-background: #313131;
		--date-picker-foreground: #fff;
	}
</style>
