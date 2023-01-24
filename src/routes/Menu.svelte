<script>
  import Icon from "$lib/Icon.svelte";
  import { Svroller } from "svrollbar";
  import { onMount } from "svelte";
  import { subscribe } from "svelte/internal";

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
    console.log(
      (list_of_teachers.classList.value +=
        " flex flex-col divide-y-[2px] border-b-[2px] border-zinc-300 divide-zinc-300")
    );
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
      <Icon name="search" class="h-12 w-12 text-red-700" />

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
      class="leading-4 text-sm rounded-xl border-zinc-300 border-[3px] h-[480px]"
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
    <div class="bg-green-300">
      <!-- college map -->
      <div>College map</div>
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
