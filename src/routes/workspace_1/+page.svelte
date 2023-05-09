<script>
	import { onMount, afterUpdate } from 'svelte';
	import { goto } from '$app/navigation';
	import { DateInput } from 'date-picker-svelte';
	import Search from '../../lib/Search.svelte';

	let tables1 = generateInitialTables();
	let disabled;
	let selectedTableKey = getSelectedTableKeyFromUrl();

	// onMount(init);
	// afterUpdate(update);

	// function init() {
	// 	loadtables1();
	// 	attachEventListeners();
	// 	handleUrlChange();
	// }

	// function update() {
	// 	savetables1();
	// 	updateColors();
	// 	updateSelectedTableColor();
	// }

	function goBackToMenu() {
		goto('/');
	}

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

	function savetables1() {
		localStorage.setItem('tables1', JSON.stringify(tables1));
	}

	function loadtables1() {
		const storedtables1 = localStorage.getItem('tables1');
		if (storedtables1) {
			tables1 = JSON.parse(storedtables1);
			convertDateStringsToDateObjects(tables1);
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

	function handleUrlChange() {
		selectedTableKey = getSelectedTableKeyFromUrl();
		updateSelectedTableColor();
		updateColors();
	}

	$: if (selectedTableKey !== undefined && tables1[selectedTableKey]) {
		disabled = tables1[selectedTableKey].fulltime;
	}

	function bookTable() {
		if (selectedTableKey in tables1) {
			tables1[selectedTableKey].booked = !tables1[selectedTableKey].booked;
		}
	}

	function updateColors() {
		const room_svg_container = document.getElementById('rooms_svg_container');
		if (room_svg_container) {
			for (const key in tables1) {
				updateColorForKey(key);
			}
		}
	}

	function updateColorForKey(key) {
		const room_svg_container = document.getElementById('rooms_svg_container');
		const path = room_svg_container.querySelector(`#${key}`);
		if (path) {
			let fillColor;
			let strokeColor;
			if (tables1[key].booked) {
				if (!tables1[key].fulltime) {
					strokeColor = fillColor = 'rgb(0, 133, 255)';
				} else {
					strokeColor = fillColor = 'rgb(177, 49, 49)';
				}
			} else {
				strokeColor = fillColor = 'white';
			}
			path.style.fill = fillColor;
			path.style.stroke = strokeColor;

			// Remove the blinking class if the table is not selected
			if (key !== selectedTableKey) {
				path.classList.remove('blinking');
			}
		}
	}

	function attachEventListeners() {
		window.addEventListener('popstate', handleUrlChange);
		const svgContainer = document.getElementById('rooms_svg_container');
		svgContainer.addEventListener('click', handleSvgContainerClick);
		document.addEventListener('keyup', handleKeyUp);
	}

	function handleSvgContainerClick(event) {
		const target = event.target;

		if (target.tagName === 'path' && target.hasAttribute('id')) {
			selectedTableKey = target.id;
		} else {
			const arrowDiv = document.getElementById('ArrowSvgDiv');
			arrowDiv.style = 'position: absolute; display: none';
			selectedTableKey = undefined;
		}
		updateSelectedTableColor();
		updateColors();
	}

	function handleKeyUp(event) {
		if (event.key === 'Escape') {
			const arrowDiv = document.getElementById('ArrowSvgDiv');
			arrowDiv.style = 'position: absolute; display: none';
			selectedTableKey = undefined;
		}
		updateColors();
		updateSelectedTableColor();
	}

	function updateSelectedTableColor() {
		const room_svg_container = document.getElementById('rooms_svg_container');
		if (room_svg_container && selectedTableKey) {
			const path = room_svg_container.querySelector(`#${selectedTableKey}`);
			if (path) {
				// Add the blinking class to the selected path
				path.classList.add('blinking');
			}
		}
	}

	// Lifecycle hooks
	onMount(() => {
		saveTablesToLocalStorage();
		loadTablesFromLocalStorage();

		const svgContainer = document.getElementById('rooms_svg_container');
		svgContainer.addEventListener('click', handleSvgContainerClick);
		document.addEventListener('keyup', handleDocumentKeyUp);
	});

	afterUpdate(() => {
		updateTableHighlights();
	});
</script>

<div class="flex">
	<div id="map" class="h-screen !bg-gpt-bg flex w-[72%]">
		<div class="relative border-0 mx-auto y-auto">
			<div id="rooms_svg_container" class="z-20 relative w-full h-full">
				<svg class="m-auto" width="66.59%" height="100%" viewBox="0 0 640 961" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M347.83 722.619H291.09V959.295H347.83V722.619Z" stroke="white" stroke-width="3" stroke-miterlimit="10" />
					<path d="M611 4H29C15.1929 4 4 15.1929 4 29V698.715C4 712.522 15.1929 723.715 29 723.715H611C624.807 723.715 636 712.522 636 698.715V29C636 15.1929 624.807 4 611 4Z" stroke="#0085FF" stroke-width="8" stroke-miterlimit="10" />
					<path id="table_2" d="M628.5 177.5L628.5 97L497 97L497 177.5L628.5 177.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_6" d="M628.5 566.5L628.5 486L497 486L497 566.5L628.5 566.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_4" d="M628.5 358.5L628.5 278L497 278L497 358.5L628.5 358.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_1" d="M143.5 177.5L143.5 97L12 97L12 177.5L143.5 177.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_5" d="M143.5 566.5L143.5 486L12 486L12 566.5L143.5 566.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_3" d="M143.5 358.5L143.5 278L12 278L12 358.5L143.5 358.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<!-- <g clip-path="url(#clip0_143_200)">
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
					</g> -->
					<path d="M83.3825 118.909V156H76.6634V125.447H76.446L67.771 130.989V124.831L76.9893 118.909H83.3825Z" fill="white" />
					<path d="M81.6076 337.507C78.9996 337.507 76.6815 337.06 74.6531 336.167C72.6367 335.273 71.043 334.03 69.8718 332.436C68.7006 330.842 68.0788 329.001 68.0064 326.912H74.8161C74.8764 327.914 75.2085 328.79 75.8121 329.538C76.4158 330.275 77.2188 330.848 78.2209 331.259C79.223 331.669 80.3459 331.875 81.5895 331.875C82.9176 331.875 84.0948 331.645 85.1211 331.186C86.1474 330.716 86.9503 330.064 87.5298 329.23C88.1094 328.397 88.3931 327.437 88.381 326.351C88.3931 325.228 88.1033 324.238 87.5117 323.381C86.9201 322.523 86.0629 321.853 84.94 321.37C83.8292 320.887 82.489 320.646 80.9194 320.646H77.6413V315.466H80.9194C82.2113 315.466 83.3402 315.243 84.3061 314.796C85.2841 314.349 86.0508 313.722 86.6062 312.913C87.1616 312.092 87.4332 311.144 87.4212 310.069C87.4332 309.019 87.1978 308.107 86.7148 307.335C86.244 306.55 85.5739 305.94 84.7045 305.505C83.8473 305.071 82.8391 304.853 81.68 304.853C80.5451 304.853 79.4947 305.059 78.5288 305.469C77.5629 305.88 76.7841 306.465 76.1925 307.226C75.6009 307.974 75.2869 308.868 75.2507 309.906H68.7852C68.8335 307.83 69.4311 306.006 70.5781 304.437C71.7372 302.855 73.2827 301.624 75.2145 300.742C77.1463 299.849 79.3136 299.402 81.7163 299.402C84.1914 299.402 86.3406 299.867 88.1637 300.797C89.9989 301.714 91.4176 302.952 92.4197 304.509C93.4219 306.067 93.9229 307.787 93.9229 309.671C93.935 311.76 93.3192 313.51 92.0756 314.923C90.8441 316.336 89.2262 317.259 87.2219 317.694V317.984C89.8299 318.346 91.8281 319.312 93.2166 320.881C94.6172 322.439 95.3114 324.377 95.2994 326.695C95.2994 328.772 94.7077 330.631 93.5245 332.273C92.3533 333.903 90.7354 335.183 88.6708 336.113C86.6183 337.042 84.2639 337.507 81.6076 337.507Z" fill="white" />
					<path d="M81.1911 545.507C78.7763 545.507 76.6151 545.054 74.7074 544.149C72.7997 543.231 71.2844 541.975 70.1616 540.382C69.0508 538.788 68.4592 536.965 68.3867 534.912H74.9066C75.0273 536.434 75.6854 537.677 76.8807 538.643C78.076 539.597 79.5128 540.074 81.1911 540.074C82.5071 540.074 83.6783 539.772 84.7045 539.168C85.7308 538.565 86.5398 537.725 87.1314 536.651C87.723 535.576 88.0128 534.351 88.0007 532.974C88.0128 531.574 87.717 530.33 87.1133 529.244C86.5096 528.157 85.6825 527.306 84.6321 526.69C83.5817 526.062 82.3743 525.748 81.0099 525.748C79.8991 525.736 78.8065 525.941 77.7319 526.364C76.6573 526.787 75.8061 527.342 75.1783 528.03L69.1112 527.034L71.049 507.909H92.5646V513.523H76.609L75.5405 523.358H75.7578C76.446 522.549 77.418 521.879 78.6737 521.347C79.9293 520.804 81.3058 520.532 82.8029 520.532C85.0487 520.532 87.0529 521.064 88.8157 522.126C90.5785 523.176 91.967 524.625 92.9812 526.473C93.9954 528.32 94.5025 530.433 94.5025 532.811C94.5025 535.262 93.935 537.448 92.8001 539.368C91.6772 541.275 90.1136 542.778 88.1094 543.877C86.1172 544.964 83.8111 545.507 81.1911 545.507Z" fill="white" />
					<path d="M553.296 156V151.146L566.173 138.523C567.404 137.279 568.431 136.175 569.252 135.209C570.073 134.243 570.689 133.307 571.099 132.402C571.51 131.496 571.715 130.53 571.715 129.504C571.715 128.333 571.449 127.331 570.918 126.498C570.387 125.652 569.656 125 568.727 124.542C567.797 124.083 566.74 123.853 565.557 123.853C564.338 123.853 563.269 124.107 562.352 124.614C561.434 125.109 560.722 125.815 560.214 126.733C559.719 127.651 559.472 128.743 559.472 130.011H553.079C553.079 127.657 553.616 125.61 554.691 123.871C555.765 122.133 557.244 120.787 559.128 119.833C561.023 118.879 563.197 118.402 565.648 118.402C568.135 118.402 570.32 118.867 572.204 119.797C574.087 120.726 575.548 122 576.587 123.618C577.637 125.236 578.162 127.083 578.162 129.16C578.162 130.548 577.897 131.913 577.365 133.253C576.834 134.593 575.898 136.078 574.558 137.708C573.23 139.338 571.365 141.312 568.962 143.63L562.569 150.132V150.386H578.724V156H553.296Z" fill="white" />
					<path d="M552.626 330.118V324.775L568.364 299.909H572.82V307.516H570.103L559.508 324.304V324.594H581.477V330.118H552.626ZM570.32 337V328.488L570.393 326.097V299.909H576.732V337H570.32Z" fill="white" />
					<path d="M566.879 545.507C565.104 545.495 563.372 545.187 561.681 544.583C559.991 543.968 558.47 542.972 557.118 541.595C555.765 540.207 554.691 538.365 553.894 536.071C553.097 533.765 552.705 530.91 552.717 527.505C552.717 524.33 553.055 521.498 553.731 519.011C554.407 516.524 555.379 514.423 556.647 512.708C557.914 510.982 559.442 509.666 561.229 508.76C563.028 507.855 565.038 507.402 567.26 507.402C569.59 507.402 571.654 507.861 573.453 508.778C575.265 509.696 576.725 510.952 577.836 512.545C578.947 514.127 579.635 515.914 579.901 517.906H573.29C572.952 516.482 572.258 515.347 571.208 514.501C570.169 513.644 568.853 513.216 567.26 513.216C564.688 513.216 562.708 514.332 561.319 516.566C559.943 518.8 559.249 521.866 559.237 525.766H559.49C560.082 524.704 560.848 523.792 561.79 523.032C562.732 522.271 563.794 521.685 564.978 521.275C566.173 520.852 567.435 520.641 568.763 520.641C570.936 520.641 572.886 521.16 574.613 522.199C576.351 523.237 577.728 524.668 578.742 526.491C579.756 528.302 580.257 530.379 580.245 532.721C580.257 535.16 579.702 537.351 578.579 539.295C577.456 541.227 575.892 542.748 573.888 543.859C571.884 544.97 569.548 545.519 566.879 545.507ZM566.843 540.074C568.159 540.074 569.336 539.754 570.375 539.114C571.413 538.474 572.234 537.611 572.838 536.524C573.441 535.437 573.737 534.218 573.725 532.866C573.737 531.538 573.447 530.336 572.856 529.262C572.276 528.187 571.473 527.336 570.447 526.708C569.421 526.08 568.25 525.766 566.934 525.766C565.956 525.766 565.044 525.953 564.199 526.328C563.354 526.702 562.617 527.221 561.989 527.885C561.362 528.537 560.866 529.298 560.504 530.167C560.154 531.025 559.973 531.942 559.961 532.92C559.973 534.212 560.275 535.401 560.866 536.488C561.458 537.575 562.273 538.444 563.311 539.096C564.35 539.748 565.527 540.074 566.843 540.074Z" fill="white" />
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
				<Search />
				<div class="mt-4 text-3xl">Бронирование</div>
				{#if selectedTableKey}
					<div class="mt-4">Имя бронирующего</div>
					<input class="bg-gpt-bg" bind:value={tables1[selectedTableKey].name} />
					<div class="mt-4">Должность</div>
					<input class="bg-gpt-bg" bind:value={tables1[selectedTableKey].ocupation} />
					<div class="mt-4">Необходимое оборудование</div>
					<textarea class="bg-gpt-bg" bind:value={tables1[selectedTableKey].devices} />
					<div class="mt-4 flex">
						<div>Постоянное посещение</div>
						<div class="ml-4"><input type="checkbox" bind:checked={tables1[selectedTableKey].fulltime} /></div>
					</div>
					<div class="mt-4">или</div>
					<div class="mt-4 flex">
						<div class={disabled ? 'text-white/50' : 'text-white'}>Начало брони</div>
						<div class="ml-4"><DateInput bind:value={tables1[selectedTableKey].start_date} format="yyyy-MM-dd" {disabled} /></div>
					</div>
					<div class="mt-4 flex">
						<div class={disabled ? 'text-white/50' : 'text-white'}>Конец брони</div>
						<div class="ml-6"><DateInput bind:value={tables1[selectedTableKey].end_date} format="yyyy-MM-dd" {disabled} /></div>
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
