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

	let tables1 = {
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

	function savetables1() {
		localStorage.setItem('tables1', JSON.stringify(tables1));
	}

	function loadtables1() {
		const storedtables1 = localStorage.getItem('tables1');
		if (storedtables1) {
			tables1 = JSON.parse(storedtables1);

			// Convert date strings back to Date objects
			for (const key in tables1) {
				tables1[key].start_date = new Date(tables1[key].start_date);
				tables1[key].end_date = new Date(tables1[key].end_date);
			}
		}
	}

	let selectedTableKey = undefined;
	let disabled = false;

	$: if (selectedTableKey !== undefined) {
		disabled = tables1[selectedTableKey].fulltime;
	}

	function bookTable() {
		if (selectedTableKey in tables1) {
			console.log('yey');
			tables1[selectedTableKey].booked = !tables1[selectedTableKey].booked;
		}
	}

	function updateColors() {
		// Check if the room_svg_container is already in the DOM
		const room_svg_container = document.getElementById('rooms_svg_container');
		if (room_svg_container) {
			// Iterate over all keys in tables1
			for (const key in tables1) {
				// Get the path with the corresponding ID from room_svg_containers
				const path = room_svg_container.querySelector(`#${key}`);
				if (path) {
					// If booked is false, set the fill color to red, otherwise use the original color
					let fillColor;
					let strokeColor;
					if (tables1[key].booked) {
						if (!tables1[key].fulltime) {
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
		loadtables1();
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
		savetables1();
		updateColors();
	});

	function goBackToMenu() {
		goto('/');
	}
</script>

<div class="flex">
	<div id="map" class="h-screen !bg-gpt-bg flex w-[72%]">
		<div class="relative border-2 mx-auto w-2/3 h-full">
			<div id="rooms_svg_container" class="z-20 relative  h-full w-fit">

				<svg width="100%" height="100%"  viewBox="0 0 640 961" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M347.83 722.619H291.09V959.295H347.83V722.619Z" stroke="white" stroke-width="3" stroke-miterlimit="10" />
					<path d="M611 4H29C15.1929 4 4 15.1929 4 29V698.715C4 712.522 15.1929 723.715 29 723.715H611C624.807 723.715 636 712.522 636 698.715V29C636 15.1929 624.807 4 611 4Z" stroke="#0085FF" stroke-width="8" stroke-miterlimit="10" />
					<path id="table_1"  d="M628.5 177.5L628.5 97L497 97L497 177.5L628.5 177.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_2"  d="M628.5 566.5L628.5 486L497 486L497 566.5L628.5 566.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_3"  d="M628.5 358.5L628.5 278L497 278L497 358.5L628.5 358.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_4"  d="M143.5 177.5L143.5 97L12 97L12 177.5L143.5 177.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_5"  d="M143.5 566.5L143.5 486L12 486L12 566.5L143.5 566.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_6"  d="M143.5 358.5L143.5 278L12 278L12 358.5L143.5 358.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<g clip-path="url(#clip0_143_200)">
						<path d="M383 108.978V131.065V153.152C383 159.251 378.056 164.196 371.957 164.196H267.043C260.944 164.196 256 159.251 256 153.152V131.065V108.978C256 102.879 260.944 97.9348 267.043 97.9348H371.957C378.056 97.9348 383 102.879 383 108.978Z" fill="#9CA09E" />
						<path d="M383 108.978V131.065H256V108.978C256 102.879 260.944 97.9348 267.043 97.9348H371.957C378.056 97.9348 383 102.879 383 108.978Z" fill="#D2D6D5" />
						<path d="M360.913 117.261H278.087C275.038 117.261 272.565 114.789 272.565 111.739V97.9348H366.435V111.739C366.435 114.789 363.963 117.261 360.913 117.261Z" fill="#3C3B42" />
						<path d="M360.913 91.0325V108.978C360.913 110.503 359.677 111.739 358.152 111.739H280.848C279.323 111.739 278.087 110.503 278.087 108.978V91.0325C278.087 90.2703 278.705 89.6521 279.467 89.6521H359.533C360.295 89.6521 360.913 90.2703 360.913 91.0325Z" fill="#66646D" />
						<path d="M366.435 150.391V164.195H272.565V150.391C272.565 147.341 275.038 144.869 278.087 144.869H360.913C363.963 144.869 366.435 147.341 366.435 150.391Z" fill="#3C3B42" />
						<path d="M359.533 172.478H279.467C278.705 172.478 278.087 171.86 278.087 171.098V153.152C278.087 151.627 279.323 150.391 280.848 150.391H358.152C359.677 150.391 360.913 151.627 360.913 153.152V171.098C360.913 171.86 360.295 172.478 359.533 172.478Z" fill="#66646D" />
						<path d="M383 108.979V131.065V153.152C383 159.251 378.056 164.196 371.957 164.196H267.043C260.944 164.196 256 159.251 256 153.152V131.065V108.979C256 102.88 260.944 97.9351 267.043 97.9351H371.957C378.056 97.9351 383 102.88 383 108.979Z" fill="#9CA09E" />
						<path d="M383 108.979V131.065H256V108.979C256 102.88 260.944 97.9351 267.043 97.9351H371.957C378.056 97.9351 383 102.88 383 108.979Z" fill="#D2D6D5" />
						<path d="M360.913 117.261H278.087C275.038 117.261 272.565 114.789 272.565 111.739V97.9351H366.435V111.739C366.435 114.789 363.963 117.261 360.913 117.261Z" fill="#3C3B42" />
						<path d="M360.913 91.0328V108.978C360.913 110.503 359.677 111.739 358.152 111.739H280.848C279.323 111.739 278.087 110.503 278.087 108.978V91.0328C278.087 90.2705 278.705 89.6523 279.467 89.6523H359.533C360.295 89.6523 360.913 90.2705 360.913 91.0328Z" fill="#66646D" />
						<path d="M366.435 150.391V164.196H272.565V150.391C272.565 147.342 275.038 144.87 278.087 144.87H360.913C363.963 144.87 366.435 147.342 366.435 150.391Z" fill="#3C3B42" />
						<path d="M359.533 172.478H279.467C278.705 172.478 278.087 171.86 278.087 171.098V153.152C278.087 151.627 279.323 150.391 280.848 150.391H358.152C359.677 150.391 360.913 151.627 360.913 153.152V171.098C360.913 171.86 360.295 172.478 359.533 172.478Z" fill="#66646D" />
						<path d="M369.196 136.587C369.196 135.062 370.432 133.826 371.957 133.826C373.481 133.826 374.718 135.062 374.718 136.587C374.718 138.112 373.481 139.348 371.957 139.348C370.432 139.348 369.196 138.112 369.196 136.587Z" fill="#C8DD7F" />
						<path d="M358.152 136.587C358.152 135.062 359.388 133.826 360.913 133.826C362.438 133.826 363.674 135.062 363.674 136.587C363.674 138.112 362.438 139.348 360.913 139.348C359.388 139.348 358.152 138.112 358.152 136.587Z" fill="#C8DD7F" />
						<path d="M369.196 125.544C369.196 124.019 370.432 122.783 371.957 122.783C373.481 122.783 374.718 124.019 374.718 125.544C374.718 127.068 373.481 128.304 371.957 128.304C370.432 128.304 369.196 127.068 369.196 125.544Z" fill="#9CA09E" />
						<path d="M358.152 176.62C358.152 177.382 357.534 178 356.772 178H282.228C281.466 178 280.848 177.382 280.848 176.62V150.391H358.152V176.62Z" fill="#E0E0E0" />
						<path d="M358.152 155.913H280.848V150.391H358.152V155.913Z" fill="#C3C9C7" />
						<path d="M280.848 111.739V58.7304C280.848 54.461 284.309 51 288.578 51H340.181C341.462 51 342.691 51.5091 343.597 52.4152L356.737 65.555C357.643 66.4609 358.152 67.69 358.152 68.9713V111.739H280.848Z" fill="#F2F2F2" />
						<path d="M342.691 74.1913H358.152V111.739H280.848V58.7304C280.848 54.461 284.309 51 288.578 51H334.961V66.4609C334.961 70.7303 338.422 74.1913 342.691 74.1913Z" fill="#E0E0E0" />
						<path d="M342.691 74.1914H358.152V79.9892L344.566 76.5928C343.464 76.3173 342.691 75.3272 342.691 74.1914Z" fill="#AAAFAD" />
						<path d="M303.083 79.801H335.917C341.687 79.801 346.364 84.4785 346.364 90.2482C346.364 96.0181 341.687 100.695 335.917 100.695H303.083C297.313 100.695 292.636 96.0178 292.636 90.2482C292.635 84.4785 297.313 79.801 303.083 79.801Z" fill="#73A09C" />
						<path d="M298.605 79.079C298.605 73.7213 302.949 69.3782 308.306 69.3782C313.664 69.3782 318.007 73.7216 318.007 79.079C318.007 84.4365 313.664 88.7799 308.306 88.7799C302.949 88.7799 298.605 84.4365 298.605 79.079Z" fill="#90BFBB" />
						<path d="M307.897 90.9948C307.897 85.6371 312.241 81.2939 317.598 81.2939C322.956 81.2939 327.299 85.6373 327.299 90.9948C327.299 96.3523 322.956 100.696 317.598 100.696C312.241 100.696 307.897 96.3523 307.897 90.9948Z" fill="#B4DBD5" />
						<path d="M307.56 79.0791C307.56 70.0121 314.91 62.6621 323.977 62.6621C333.044 62.6621 340.394 70.0124 340.394 79.0791C340.394 88.1458 333.044 95.496 323.977 95.496C314.91 95.496 307.56 88.1458 307.56 79.0791Z" fill="#B4DBD5" />
						<path d="M343.597 52.4152L356.737 65.555C357.643 66.4609 358.152 67.69 358.152 68.9713V74.1913H342.691C338.422 74.1913 334.961 70.7303 334.961 66.4609V51H340.181C341.462 51 342.691 51.5091 343.597 52.4152Z" fill="#F2F2F2" />
					</g>
					<defs>
						<clipPath id="clip0_143_200">
							<rect width="127" height="127" fill="white" transform="translate(256 51)" />
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
					<input class="bg-gpt-bg" bind:value={tables1[selectedTableKey].name} />
					<div class="mt-4">Должность</div>
					<input class="bg-gpt-bg" bind:value={tables1[selectedTableKey].ocupation} />
					<div class="mt-4">Необходимое оборудование</div>
					<textarea class="bg-gpt-bg" bind:value={tables1[selectedTableKey].devices} />
					<div class="mt-4 flex">
						<div>Постоянное посещение</div>
						<div><input type="checkbox" bind:checked={tables1[selectedTableKey].fulltime} /></div>
					</div>
					<div class="mt-4">или</div>
					<div class="mt-4 flex">
						<div class={disabled ? 'text-white/50' : 'text-white'}>Начало брони</div>
						<div><DateInput bind:value={tables1[selectedTableKey].start_date} format="yyyy-MM-dd" {disabled} /></div>
					</div>
					<div class="mt-4 flex">
						<div class={disabled ? 'text-white/50' : 'text-white'}>Конец брони</div>
						<div><DateInput bind:value={tables1[selectedTableKey].end_date} format="yyyy-MM-dd" {disabled} /></div>
					</div>
				{/if}
			</div>
			<div class="mx-auto w-full">
				{#if selectedTableKey && tables1[selectedTableKey]}
					{#if !tables1[selectedTableKey].booked}
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
