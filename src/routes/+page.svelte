<script>
	import Search from '../lib/Search.svelte';
	import Map from './Map.svelte';
	import TalkingRoom from './talking_room_1/+page.svelte';
	import Workspace from './workspace_1/+page.svelte';
	import {onMount} from 'svelte'

	let selectedRoomKey;


	onMount(() => {
    const handleUrlChange = () => {
      const urlSearchParams = new URLSearchParams(window.location.search);
      selectedRoomKey = urlSearchParams.get('selectedRoomKey');
    };

    window.addEventListener('popstate', handleUrlChange);
    handleUrlChange();

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  });
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section >
	<!-- <Search /> -->
	<Map {selectedRoomKey}/>
	<!-- <TalkingRoom /> -->
	<!-- <Workspace /> -->
	
</section>
