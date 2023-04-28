<script>
	import Icon from '$lib/Icon.svelte';
	import { Svroller } from 'svrollbar';
	import { onMount } from 'svelte';
	import { subscribe } from 'svelte/internal';
	import Search from '$lib/icons/search.svg';
	import Floor2 from '$lib/floors/2floor.png';
	import Map from './Map.svelte';

	// const items = Array.from({ length: 50 }).map((_, i) => `teacher ${i}`);
	const teachers = [
		{
			fio: 'Абазалимов Ришат Рфаикович',
			classroom: '102 каб.',
			subjects: ['Оптимизация веб-приложений', 'УП.05.01', 'Классный Час']
		},
		{
			fio: 'Абазалимов Ришат Рфаикович',
			classroom: '304 каб.',
			subjects: ['Оптимизация веб-приложений', 'УП.05.01', 'Классный Час']
		},
		{
			fio: 'Абазалимов Ришат Рфаикович',
			classroom: '23 каб.',
			subjects: ['Оптимизация веб-приложений', 'УП.05.01', 'Классный Час']
		},
		{
			fio: 'Абазалимов Ришат Рфаикович',
			classroom: '436 каб.',
			subjects: ['Оптимизация веб-приложений', 'УП.05.01', 'Классный Час']
		},
		{
			fio: 'Абазалимов Ришат Рфаикович',
			classroom: '2346 каб.',
			subjects: ['Оптимизация веб-приложений', 'УП.05.01', 'Классный Час']
		},
		{
			fio: 'Абазалимов Ришат Рфаикович',
			classroom: '267 каб.',
			subjects: ['Оптимизация веб-приложений', 'УП.05.01', 'Классный Час']
		},
		{
			fio: 'Абазалимов Ришат Рфаикович',
			classroom: '468 каб.',
			subjects: ['Оптимизация веб-приложений', 'УП.05.01', 'Классный Час']
		},
		{
			fio: 'Абазалимов Ришат Рфаикович',
			classroom: '467 каб.',
			subjects: ['Оптимизация веб-приложений', 'УП.05.01', 'Классный Час']
		},
		{
			fio: 'Абазалимов Ришат Рфаикович',
			classroom: 'Физ зал.',
			subjects: ['Оптимизация веб-приложений', 'УП.05.01', 'Классный Час']
		}
	];

	let list_of_teachers;

	onMount(async () => {
		list_of_teachers = await document.querySelector('.svlr-contents');
		list_of_teachers.classList.value +=
			' flex flex-col divide-y-[2px] border-b-[2px] border-zinc-300 divide-zinc-300';

		// const map = document.querySelector("#map");
		// let gElements = map.querySelectorAll("g");
		// console.log(gElements);
		// gElements.forEach((element) => {
		//   element.setAttribute("fill", "#ff0000");
		// });
		// let pathElements = map.querySelectorAll("path");
		// pathElements.forEach((element) => {
		//   element.setAttribute("fill", "#ff0000");
		// });

		// list_of_teachers = await document
		//   .querySelector("#map_svg")
		//   .each(function () {
		//     this.width = this.parentNode.width;
		//     this.height = this.parentNode.height;
		//   });
	});

	let searchClass = '';

	$: teachersFiltered = teachers.filter(
		(teacher) =>
			teacher.classroom.toLowerCase().trim().indexOf(searchClass.toLowerCase().trim()) !== -1
	);

	function handleClick(event, teacher_index) {
		// alert("hello");
		// console.log(event);
		console.log(teacher_index);
	}
</script>

<div class="">
	<div class="mx-16 flex flex-col space-y-4 w-[386px]">
		<div class="w-full h-[330px] relative z-0 rounded-xl border-zinc-300 border-[3px]">
			<Map />
		</div>
	</div>
	<div>
		<!-- panoram view -->
	</div>
</div>
