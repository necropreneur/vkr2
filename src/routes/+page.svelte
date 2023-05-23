<script>
	import { onMount, afterUpdate } from 'svelte';
	import { goto } from '$app/navigation';
	import Search from '$lib/Search.svelte';
	import MapSvg from '../lib/svg_svelte/MapSvg.svelte';

	let selectedRoomKey;

	let rooms = {
		workspace_1: {
			name: 'Рабочее пространство 1',
			description: 'В этом рабочем пространстве располагаются члены команды разработки A'
		},
		workspace_2: {
			name: 'Рабочее пространство 2',
			description: 'В этом рабочем пространстве располагаются члены команды разработки B'
		},
		workspace_3: {
			name: 'Рабочее пространство 3',
			description: 'В этом рабочем пространстве располагаются члены команды разработки C'
		},
		talking_room_1: {
			name: 'Переговорная 1',
			description: 'В этой переговорной комнате поместится до 18-ти человек'
		},
		talking_room_2: {
			name: 'Переговорная 2',
			description: 'В этой переговорной комнате поместится до 11-ти человек'
		},
		dining_room: {
			name: 'Столовая',
			description: 'Здесь всегда можно найти вкусный кофе и легкий перекус'
		},
		gaming_room: {
			name: 'Игровая комната',
			description: 'Здесь можно поиграться с очками виртуальной реальности и PS4'
		},
		exit: {
			name: 'Выход',
			description: 'Выход, ведущий к главной лестнице'
		},
		toilet: {
			name: 'Туалет',
			description: 'Мужской и женский туалет'
		}
	};

	// Local storage functions
	function saveRoomsToLocalStorage() {
		localStorage.setItem('rooms', JSON.stringify(rooms));
	}

	function loadRoomsFromLocalStorage() {
		const storedRooms = localStorage.getItem('rooms');
		if (storedRooms) {
			rooms = JSON.parse(storedRooms);
		}
	}

	// Event handlers
	function handleSvgContainerClick(event) {
		const { target } = event;
		selectedRoomKey = (target.tagName === 'path' && target.id) || undefined;
	}

	function handleDocumentKeyUp(event) {
		if (event.key === 'Escape') {
			selectedRoomKey = undefined;
		}
	}

	// DOM manipulation functions
	function updateRoomHighlights() {
		const roomSvgContainer = document.getElementById('rooms_svg_container');

		if (roomSvgContainer) {
			for (const key in rooms) {
				const path = roomSvgContainer.querySelector(`#${key}`);
				if (path) {
					if (key === selectedRoomKey) {
						path.classList.add('blinking');
					} else {
						path.classList.remove('blinking');
					}
				}
			}
		}
	}

	const handleUrlChange = () => {
		const urlSearchParams = new URLSearchParams(window.location.search);
		selectedRoomKey = urlSearchParams.get('selectedRoomKey');
	};

	// Lifecycle hooks
	onMount(() => {
		handleUrlChange();

		saveRoomsToLocalStorage();
		loadRoomsFromLocalStorage();

		const svgContainer = document.getElementById('rooms_svg_container');
		svgContainer.addEventListener('click', handleSvgContainerClick);
		document.addEventListener('keyup', handleDocumentKeyUp);
	});

	afterUpdate(() => {
		updateRoomHighlights();
	});
</script>

<div class="flex">
	<div id="map" class="h-screen !bg-gpt-bg flex w-[72%]">
		<div class="m-auto w-4/5">
			<div id="rooms_svg_container">
				<MapSvg />
			</div>
		</div>
	</div>

	<div class="w-[28%] bg-gpt-secondary-bg text-white">
		<div class="w-full p-4 relative h-full flex flex-col justify-between">
			<div>
				<Search />
				{#if rooms[selectedRoomKey]}
					<div class="mt-4 text-3xl">{rooms[selectedRoomKey].name}</div>
					<div class="mt-4">{rooms[selectedRoomKey].description}</div>
				{/if}
			</div>
			<div class="mx-auto w-full">
				{#if selectedRoomKey && rooms[selectedRoomKey]}
					{#if selectedRoomKey.includes('talking_room')}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div class="px-4 py-2 rounded-lg select-none text-center bg-yellow-600 hover:bg-yellow-700 cursor-pointer" on:click={goto(selectedRoomKey)}>Перейти в переговорную</div>
					{:else if selectedRoomKey.includes('workspace')}
						<!-- svelte-ignore a11y-click-events-have-key-events -->

						<div class="px-4 py-2 rounded-lg select-none text-center bg-blue-600 hover:bg-blue-700 cursor-pointer" on:click={goto(selectedRoomKey)}>Перейти в рабочую комнату</div>
					{/if}
				{:else}
					<div class="border-2 px-4 py-2 rounded-lg select-none text-center">Выберите комнату</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
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
