<script>
	import { onMount, afterUpdate } from 'svelte';
	import { goto } from '$app/navigation';
	import { DateInput } from 'date-picker-svelte';
	import Search from '../../lib/Search.svelte';
	import Workspace_1Svg from '../../lib/svg_svelte/Workspace_1Svg.svelte';
	import Back from '../../lib/Back.svelte';

	const tables_key = 'tables1';

	let tables = generateInitialTables();
	let disabled;
	let selectedTableKey = getSelectedTableKeyFromUrl();

	// Helper functions
	function generateInitialTables() {
		const initialTable = {
			name: '',
			ocupation: '',
			devices: '',
			fulltime: false,
			start_date: new Date(),
			end_date: new Date(),
			booked: false
		};
		return Array.from({ length: 7 }, (_, i) => ({ ...initialTable })).reduce((acc, table, i) => {
			acc[`table_${i + 1}`] = table;
			return acc;
		}, {});
	}

	function saveTablesToLocalStorage() {
		localStorage.setItem(tables_key, JSON.stringify(tables));
	}

	function loadTablesFromLocalStorage() {
		const storedtables = localStorage.getItem(tables_key);
		if (storedtables) {
			tables = JSON.parse(storedtables);
			convertDateStringsToDateObjects(tables);
		}
	}

	function convertDateStringsToDateObjects(obj) {
		for (const key in obj) {
			obj[key].start_date = new Date(obj[key].start_date);
			obj[key].end_date = new Date(obj[key].end_date);
		}
	}

	function getSelectedTableKeyFromUrl() {
		if (typeof window === 'undefined') {
			return undefined;
		}
		const urlSearchParams = new URLSearchParams(window.location.search);
		return urlSearchParams.get('selectedTableKey');
	}

	$: if (selectedTableKey !== undefined && tables[selectedTableKey]) {
		disabled = tables[selectedTableKey].fulltime;
	}

	function bookTable() {
		if (selectedTableKey in tables) {
			tables[selectedTableKey].booked = !tables[selectedTableKey].booked;
		}
	}

	function updateColorForKey(key) {
		const room_svg_container = document.getElementById('tables_svg_container');
		const path = room_svg_container.querySelector(`#${key}`);
		if (path) {
			let fillColor;
			let strokeColor;
			if (tables[key].booked) {
				if (!tables[key].fulltime) {
					strokeColor = fillColor = 'rgb(0, 133, 255)';
				} else {
					strokeColor = fillColor = 'rgb(177, 49, 49)';
				}
			} else {
				strokeColor = fillColor = 'white';
			}
			path.style.fill = fillColor;
			path.style.stroke = strokeColor;
		}
	}

	function updateColors() {
		for (const key in tables) {
			updateColorForKey(key);
		}
	}

	function handleSvgContainerClick(event) {
		const { target } = event;
		selectedTableKey = (target.tagName === 'path' && target.id) || undefined;
	}

	function handleDocumentKeyUp(event) {
		if (event.key === 'Escape') {
			selectedTableKey = undefined;
		}
	}

	function updateTableHighlights() {
		const tableSvgContainer = document.getElementById('tables_svg_container');
		if (tableSvgContainer) {
			for (const key in tables) {
				const path = tableSvgContainer.querySelector(`#${key}`);
				if (path) {
					if (key === selectedTableKey) {
						path.classList.add('blinking');
					} else {
						path.classList.remove('blinking');
					}
				}
			}
		}
	}

	// Lifecycle hooks
	onMount(() => {
		loadTablesFromLocalStorage();
		saveTablesToLocalStorage();

		const svgContainer = document.getElementById('tables_svg_container');
		svgContainer.addEventListener('click', handleSvgContainerClick);
		document.addEventListener('keyup', handleDocumentKeyUp);
	});

	afterUpdate(() => {
		updateTableHighlights();
		updateColors();
		saveTablesToLocalStorage();
	});
</script>

<div class="flex">
	<div id="map" class="h-screen !bg-gpt-bg flex w-[72%]">
		<div class="mx-auto">
			<div id="tables_svg_container" class="h-full">
				<Workspace_1Svg />
			</div>
		</div>
	</div>

	<div class="w-[28%] bg-gpt-secondary-bg text-white">
		<div class="w-full p-4 relative h-full flex flex-col justify-between">
			<div>
				<Search />
				<div class="mt-4 text-3xl">Бронирование</div>
				{#if selectedTableKey}
					<div class="mt-4">Имя бронирующего</div>
					<input class="bg-gpt-bg" bind:value={tables[selectedTableKey].name} />
					<div class="mt-4">Должность</div>
					<input class="bg-gpt-bg" bind:value={tables[selectedTableKey].ocupation} />
					<div class="mt-4">Необходимое оборудование</div>
					<textarea class="bg-gpt-bg" bind:value={tables[selectedTableKey].devices} />
					<div class="mt-4 flex">
						<div>Постоянное посещение</div>
						<div class="ml-4"><input type="checkbox" bind:checked={tables[selectedTableKey].fulltime} /></div>
					</div>
					<div class="mt-4">или</div>
					<div class="mt-4 flex">
						<div class={disabled ? 'text-white/50' : 'text-white'}>Начало брони</div>
						<div class="ml-4"><DateInput bind:value={tables[selectedTableKey].start_date} format="yyyy-MM-dd" {disabled} /></div>
					</div>
					<div class="mt-4 flex">
						<div class={disabled ? 'text-white/50' : 'text-white'}>Конец брони</div>
						<div class="ml-6"><DateInput bind:value={tables[selectedTableKey].end_date} format="yyyy-MM-dd" {disabled} /></div>
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
	<Back />
</div>

<style>
	:root {
		--date-picker-background: #313131;
		--date-picker-foreground: #fff;
	}

	:global(.blinking) {
		animation: blinking 1s infinite;
	}

	@keyframes blinking {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}
</style>
