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

	let tables = {
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
		},
		table_8: {
			name: '',
			ocupation: '',
			devices: '',
			fulltime: false,
			start_date: new Date(),
			end_date: new Date(),
			booked: false
		},
		table_9: {
			name: '',
			ocupation: '',
			devices: '',
			fulltime: false,
			start_date: new Date(),
			end_date: new Date(),
			booked: false
		},
		table_10: {
			name: '',
			ocupation: '',
			devices: '',
			fulltime: false,
			start_date: new Date(),
			end_date: new Date(),
			booked: false
		}
	};

	function saveTables() {
		localStorage.setItem('tables', JSON.stringify(tables));
	}

	function loadTables() {
		const storedTables = localStorage.getItem('tables');
		if (storedTables) {
			tables = JSON.parse(storedTables);

			// Convert date strings back to Date objects
			for (const key in tables) {
				tables[key].start_date = new Date(tables[key].start_date);
				tables[key].end_date = new Date(tables[key].end_date);
			}
		}
	}

	let selectedTableKey = undefined;
	let disabled = false;

	$: if (selectedTableKey !== undefined) {
		disabled = tables[selectedTableKey].fulltime;
	}

	function bookTable() {
		if (selectedTableKey in tables) {
			console.log('yey');
			tables[selectedTableKey].booked = !tables[selectedTableKey].booked;
		}
	}

	function updateColors() {
		// Check if the room_svg_container is already in the DOM
		const room_svg_container = document.getElementById('rooms_svg_container');
		if (room_svg_container) {
			// Iterate over all keys in tables
			for (const key in tables) {
				// Get the path with the corresponding ID from room_svg_containers
				const path = room_svg_container.querySelector(`#${key}`);
				if (path) {
					// If booked is false, set the fill color to red, otherwise use the original color
					let fillColor;
					let strokeColor;
					if (tables[key].booked) {
						if (!tables[key].fulltime) {
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
		loadTables();
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
		saveTables();
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
				<svg width="100%" height="108.6044%"  viewBox="0 0 953 1035" fill="none" xmlns="http://www.w3.org/2000/svg">
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
					<path id="table_9" d="M940.5 738.5L940.5 658L809 658L809 738.5L940.5 738.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_10" d="M940.5 530.5L940.5 450L809 450L809 530.5L940.5 530.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<g id="printer_1" clip-path="url(#clip0_127_64)">
						<path d="M633 483.979V506.065V528.152C633 534.251 628.056 539.196 621.957 539.196H517.043C510.944 539.196 506 534.251 506 528.152V506.065V483.979C506 477.88 510.944 472.935 517.043 472.935H621.957C628.056 472.935 633 477.88 633 483.979Z" fill="#9CA09E" />
						<path d="M633 483.979V506.065H506V483.979C506 477.88 510.944 472.935 517.043 472.935H621.957C628.056 472.935 633 477.88 633 483.979Z" fill="#D2D6D5" />
						<path d="M610.913 492.261H528.087C525.038 492.261 522.565 489.789 522.565 486.739V472.935H616.435V486.739C616.435 489.789 613.963 492.261 610.913 492.261Z" fill="#3C3B42" />
						<path d="M610.913 466.033V483.978C610.913 485.503 609.677 486.739 608.152 486.739H530.848C529.323 486.739 528.087 485.503 528.087 483.978V466.033C528.087 465.271 528.705 464.652 529.467 464.652H609.533C610.295 464.652 610.913 465.271 610.913 466.033Z" fill="#66646D" />
						<path d="M616.435 525.391V539.196H522.565V525.391C522.565 522.342 525.038 519.87 528.087 519.87H610.913C613.963 519.87 616.435 522.342 616.435 525.391Z" fill="#3C3B42" />
						<path d="M609.533 547.479H529.467C528.705 547.479 528.087 546.86 528.087 546.098V528.152C528.087 526.628 529.323 525.392 530.848 525.392H608.152C609.677 525.392 610.913 526.628 610.913 528.152V546.098C610.913 546.86 610.295 547.479 609.533 547.479Z" fill="#66646D" />
						<path d="M619.196 511.587C619.196 510.062 620.432 508.826 621.957 508.826C623.481 508.826 624.718 510.062 624.718 511.587C624.718 513.112 623.481 514.348 621.957 514.348C620.432 514.348 619.196 513.112 619.196 511.587Z" fill="#C8DD7F" />
						<path d="M608.152 511.587C608.152 510.062 609.388 508.826 610.913 508.826C612.438 508.826 613.674 510.062 613.674 511.587C613.674 513.112 612.438 514.348 610.913 514.348C609.388 514.348 608.152 513.112 608.152 511.587Z" fill="#C8DD7F" />
						<path d="M619.196 500.544C619.196 499.019 620.432 497.783 621.957 497.783C623.481 497.783 624.718 499.019 624.718 500.544C624.718 502.068 623.481 503.304 621.957 503.304C620.432 503.304 619.196 502.068 619.196 500.544Z" fill="#9CA09E" />
						<path d="M608.152 551.619C608.152 552.382 607.534 553 606.772 553H532.228C531.466 553 530.848 552.382 530.848 551.619V525.391H608.152V551.619Z" fill="#E0E0E0" />
						<path d="M608.152 530.913H530.848V525.391H608.152V530.913Z" fill="#C3C9C7" />
						<path d="M530.848 486.739V433.73C530.848 429.461 534.309 426 538.578 426H590.181C591.462 426 592.691 426.509 593.597 427.415L606.737 440.555C607.643 441.461 608.152 442.69 608.152 443.971V486.739H530.848Z" fill="#F2F2F2" />
						<path d="M592.691 449.191H608.152V486.739H530.848V433.73C530.848 429.461 534.309 426 538.578 426H584.961V441.461C584.961 445.73 588.422 449.191 592.691 449.191Z" fill="#E0E0E0" />
						<path d="M592.691 449.191H608.152V454.989L594.566 451.593C593.464 451.317 592.691 450.327 592.691 449.191Z" fill="#AAAFAD" />
						<path d="M553.083 454.801H585.917C591.687 454.801 596.364 459.479 596.364 465.248C596.364 471.018 591.687 475.696 585.917 475.696H553.083C547.313 475.696 542.636 471.018 542.636 465.248C542.635 459.479 547.313 454.801 553.083 454.801Z" fill="#73A09C" />
						<path d="M548.605 454.079C548.605 448.722 552.949 444.378 558.306 444.378C563.664 444.378 568.007 448.722 568.007 454.079C568.007 459.437 563.664 463.78 558.306 463.78C552.949 463.78 548.605 459.437 548.605 454.079Z" fill="#90BFBB" />
						<path d="M557.897 465.995C557.897 460.637 562.241 456.294 567.598 456.294C572.956 456.294 577.299 460.637 577.299 465.995C577.299 471.352 572.956 475.696 567.598 475.696C562.241 475.696 557.897 471.352 557.897 465.995Z" fill="#B4DBD5" />
						<path d="M557.56 454.079C557.56 445.012 564.91 437.662 573.977 437.662C583.044 437.662 590.394 445.012 590.394 454.079C590.394 463.146 583.044 470.496 573.977 470.496C564.91 470.496 557.56 463.146 557.56 454.079Z" fill="#B4DBD5" />
						<path d="M593.597 427.415L606.737 440.555C607.643 441.461 608.152 442.69 608.152 443.971V449.191H592.691C588.422 449.191 584.961 445.73 584.961 441.461V426H590.181C591.462 426 592.691 426.509 593.597 427.415Z" fill="#F2F2F2" />
					</g>
					<defs>
						<clipPath id="clip0_127_64">
							<rect width="127" height="127" fill="white" transform="translate(506 426)" />
						</clipPath>
					</defs>
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
					<input class="bg-gpt-bg" bind:value={tables[selectedTableKey].name} />
					<div class="mt-4">Должность</div>
					<input class="bg-gpt-bg" bind:value={tables[selectedTableKey].ocupation} />
					<div class="mt-4">Необходимое оборудование</div>
					<textarea class="bg-gpt-bg" bind:value={tables[selectedTableKey].devices} />
					<div class="mt-4 flex">
						<div>Постоянное посещение</div>
						<div><input type="checkbox" bind:checked={tables[selectedTableKey].fulltime} /></div>
					</div>
					<div class="mt-4">или</div>
					<div class="mt-4 flex">
						<div class={disabled ? 'text-white/50' : 'text-white'}>Начало брони</div>
						<div><DateInput bind:value={tables[selectedTableKey].start_date} format="yyyy-MM-dd" {disabled} /></div>
					</div>
					<div class="mt-4 flex">
						<div class={disabled ? 'text-white/50' : 'text-white'}>Конец брони</div>
						<div><DateInput bind:value={tables[selectedTableKey].end_date} format="yyyy-MM-dd" {disabled} /></div>
					</div>
				{/if}
			</div>
			<div class="mx-auto w-full">
				{#if selectedTableKey && tables[selectedTableKey]}
					{#if !tables[selectedTableKey].booked}
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
