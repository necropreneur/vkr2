<script>
  import Icon from "$lib/Icon.svelte";
  import { Svroller } from "svrollbar";
  import { onMount } from "svelte";
  import { subscribe } from "svelte/internal";
  import Search from "$lib/icons/search.svg";
  import Floor2 from "$lib/floors/2floor.png";
  import Map from "./Map.svelte";

  // const items = Array.from({ length: 50 }).map((_, i) => `teacher ${i}`);
  const teachers = [
    {
      fio: "Абазалимов Ришат Рфаикович",
      classroom: "102 каб.",
      subjects: ["Оптимизация веб-приложений", "УП.05.01", "Классный Час"],
    },
    {
      fio: "Абазалимов Ришат Рфаикович",
      classroom: "304 каб.",
      subjects: ["Оптимизация веб-приложений", "УП.05.01", "Классный Час"],
    },
    {
      fio: "Абазалимов Ришат Рфаикович",
      classroom: "23 каб.",
      subjects: ["Оптимизация веб-приложений", "УП.05.01", "Классный Час"],
    },
    {
      fio: "Абазалимов Ришат Рфаикович",
      classroom: "436 каб.",
      subjects: ["Оптимизация веб-приложений", "УП.05.01", "Классный Час"],
    },
    {
      fio: "Абазалимов Ришат Рфаикович",
      classroom: "2346 каб.",
      subjects: ["Оптимизация веб-приложений", "УП.05.01", "Классный Час"],
    },
    {
      fio: "Абазалимов Ришат Рфаикович",
      classroom: "267 каб.",
      subjects: ["Оптимизация веб-приложений", "УП.05.01", "Классный Час"],
    },
    {
      fio: "Абазалимов Ришат Рфаикович",
      classroom: "468 каб.",
      subjects: ["Оптимизация веб-приложений", "УП.05.01", "Классный Час"],
    },
    {
      fio: "Абазалимов Ришат Рфаикович",
      classroom: "467 каб.",
      subjects: ["Оптимизация веб-приложений", "УП.05.01", "Классный Час"],
    },
    {
      fio: "Абазалимов Ришат Рфаикович",
      classroom: "Физ зал.",
      subjects: ["Оптимизация веб-приложений", "УП.05.01", "Классный Час"],
    },
  ];

  let list_of_teachers;

  onMount(async () => {
    list_of_teachers = await document.querySelector(".svlr-contents");
    list_of_teachers.classList.value +=
      " flex flex-col divide-y-[2px] border-b-[2px] border-zinc-300 divide-zinc-300";

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

  let searchClass = "";

  $: teachersFiltered = teachers.filter(
    (teacher) =>
      teacher.classroom
        .toLowerCase()
        .trim()
        .indexOf(searchClass.toLowerCase().trim()) !== -1
  );

  function handleClick(event, teacher_index) {
    // alert("hello");
    // console.log(event);
    console.log(teacher_index);
  }
</script>

<div class="bg-white w-fit h-screen">
  <div class="mx-16 flex flex-col space-y-4 w-[386px]">
    <!-- menu -->
    <div class="text-2xl flex items-center mt-4">
      <!-- search bar -->
      <!-- <Icon name="search" class="h-12 w-12 text-red-700" /> -->
      <Search class="h-12 w-12 text-red-500" fill="currentColor" />

      <input
        bind:value={searchClass}
        placeholder="Поиск кабинета"
        class="placeholder-zinc-500 w-48 ml-2
        font-bold
      focus:outline-none
      focus:placeholder-transparent"
      />

      <p class="inline-block font-bold px-1 text-red-500">|</p>
      <p class="inline-block font-bold">3-й этаж</p>
    </div>
    <div
      class="leading-4 text-sm rounded-xl border-zinc-300 border-[3px] h-[340px]"
    >
      <!-- list of teachers -->
      <Svroller width="100%" height="100%" initiallyVisible>
        {#each teachersFiltered as teacher, teacher_index}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <div on:click={(event) => handleClick(event, teacher_index)}>
            <div
              class="pl-4 py-1 {teacher_index % 2 === 1
                ? 'bg-neutral-100'
                : ''} hover:bg-purple-200"
            >
              <div class="font-bold">{teacher.fio} - {teacher.classroom}</div>

              <div class="">
                {#each teacher.subjects as subject, subject_index}
                  <p class="inline-block text-zinc-500 font-semibold">
                    {subject}
                  </p>
                  {#if subject_index !== teacher.subjects.length - 1}
                    <p class="inline-block font-bold px-1">|</p>
                  {/if}
                {/each}
              </div>
            </div>
          </div>
        {/each}
      </Svroller>
    </div>
    <div class="">
      <div
        class="w-full h-[330px] relative z-0 rounded-xl border-zinc-300 border-[3px]"
      >
        <!-- <div class="absolute top-[calc(50%-8px)] left-[80px] z-0">
          <div
            class="w-4 h-4 rounded-full border-2 border-red-500 hover:bg-red-500 transition duration-500 ease-out"
            on:click={() => console.log("hello")}
          />
        </div>
        <div class="absolute top-[calc(50%-8px)] left-[168px] z-0">
          <div class="bg-red-500 w-4 h-4 rounded-full" />
        </div>
        <div class="absolute top-[calc(50%-8px)] left-[240px] z-0">
          <div class="bg-red-500 w-4 h-4 rounded-full" />
        </div> -->
        <!-- <div class="z-10"> -->
        <!-- <Icon name="2floor" class="h-full z-10" /> -->
        <!-- <img src={Floor2} alt="background image" class="m-auto h-full z-10"/> -->
        <!-- </div> -->
        <Map />
      </div>
    </div>
  </div>
  <div>
    <!-- panoram view -->
  </div>
</div>

<style>
  /* p {
    margin: 0;
  } */
</style>
