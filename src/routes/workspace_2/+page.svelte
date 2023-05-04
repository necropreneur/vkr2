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
		<div class="relative border-0 m-auto w-4/5">
			<div id="rooms_svg_container" class="z-20 relative">
				<svg width="100%" height="56.94%" viewBox="0 0 1231 701" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M304 203V2H279H254V203H304Z" stroke="white" stroke-width="3" stroke-miterlimit="10" />
					<path d="M1112.38 52.9541H1062.93V205.279H1112.38V52.9541Z" stroke="white" stroke-width="3" stroke-miterlimit="10" />
					<path d="M1202 204.829H29C15.1929 204.829 4 216.022 4 229.829V671.773C4 685.58 15.1929 696.773 29 696.773H1202C1215.81 696.773 1227 685.58 1227 671.773V229.829C1227 216.022 1215.81 204.829 1202 204.829Z" stroke="#0085FF" stroke-width="8" stroke-miterlimit="10" />
					<path id="table_3" d="M143.5 629.5L143.5 549L12 549L12 629.5L143.5 629.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_4" d="M384.5 628.5L384.5 548L253 548L253 628.5L384.5 628.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_5" d="M631.5 627.5L631.5 547L500 547L500 627.5L631.5 627.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_6" d="M873.5 626.5L873.5 546L742 546L742 626.5L873.5 626.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_2" d="M873.5 353.5L873.5 273L742 273L742 353.5L873.5 353.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path d="M795.296 332V327.146L808.173 314.523C809.404 313.279 810.431 312.175 811.252 311.209C812.073 310.243 812.689 309.307 813.099 308.402C813.51 307.496 813.715 306.53 813.715 305.504C813.715 304.333 813.449 303.331 812.918 302.498C812.387 301.652 811.656 301 810.727 300.542C809.797 300.083 808.74 299.853 807.557 299.853C806.338 299.853 805.269 300.107 804.352 300.614C803.434 301.109 802.722 301.815 802.214 302.733C801.719 303.651 801.472 304.743 801.472 306.011H795.079C795.079 303.657 795.616 301.61 796.691 299.871C797.765 298.133 799.244 296.787 801.128 295.833C803.023 294.879 805.197 294.402 807.648 294.402C810.135 294.402 812.32 294.867 814.204 295.797C816.087 296.726 817.548 298 818.587 299.618C819.637 301.236 820.162 303.083 820.162 305.16C820.162 306.548 819.897 307.913 819.365 309.253C818.834 310.593 817.898 312.078 816.558 313.708C815.23 315.338 813.365 317.312 810.962 319.63L804.569 326.132V326.386H820.724V332H795.296Z" fill="white" />
					<path d="M77.6076 608.507C74.9996 608.507 72.6815 608.06 70.6531 607.167C68.6367 606.273 67.043 605.03 65.8718 603.436C64.7006 601.842 64.0788 600.001 64.0064 597.912H70.8161C70.8764 598.914 71.2085 599.79 71.8121 600.538C72.4158 601.275 73.2188 601.848 74.2209 602.259C75.223 602.669 76.3459 602.875 77.5895 602.875C78.9176 602.875 80.0948 602.645 81.1211 602.186C82.1474 601.716 82.9503 601.064 83.5298 600.23C84.1094 599.397 84.3931 598.437 84.381 597.351C84.3931 596.228 84.1033 595.238 83.5117 594.381C82.9201 593.523 82.0629 592.853 80.94 592.37C79.8292 591.887 78.489 591.646 76.9194 591.646H73.6413V586.466H76.9194C78.2113 586.466 79.3402 586.243 80.3061 585.796C81.2841 585.349 82.0508 584.722 82.6062 583.913C83.1616 583.092 83.4332 582.144 83.4212 581.069C83.4332 580.019 83.1978 579.107 82.7148 578.335C82.244 577.55 81.5739 576.94 80.7045 576.505C79.8473 576.071 78.8391 575.853 77.68 575.853C76.5451 575.853 75.4947 576.059 74.5288 576.469C73.5629 576.88 72.7841 577.465 72.1925 578.226C71.6009 578.974 71.2869 579.868 71.2507 580.906H64.7852C64.8335 578.83 65.4311 577.006 66.5781 575.437C67.7372 573.855 69.2827 572.624 71.2145 571.742C73.1463 570.849 75.3136 570.402 77.7163 570.402C80.1914 570.402 82.3406 570.867 84.1637 571.797C85.9989 572.714 87.4176 573.952 88.4197 575.509C89.4219 577.067 89.9229 578.787 89.9229 580.671C89.935 582.76 89.3192 584.51 88.0756 585.923C86.8441 587.336 85.2262 588.259 83.2219 588.694V588.984C85.8299 589.346 87.8281 590.312 89.2166 591.881C90.6172 593.439 91.3114 595.377 91.2994 597.695C91.2994 599.772 90.7077 601.631 89.5245 603.273C88.3533 604.903 86.7354 606.183 84.6708 607.113C82.6183 608.042 80.2639 608.507 77.6076 608.507Z" fill="white" />
					<path d="M304.626 600.118V594.775L320.364 569.909H324.82V577.516H322.103L311.508 594.304V594.594H333.477V600.118H304.626ZM322.32 607V598.488L322.393 596.097V569.909H328.732V607H322.32Z" fill="white" />
					<path d="M565.191 605.507C562.776 605.507 560.615 605.054 558.707 604.149C556.8 603.231 555.284 601.975 554.162 600.382C553.051 598.788 552.459 596.965 552.387 594.912H558.907C559.027 596.434 559.685 597.677 560.881 598.643C562.076 599.597 563.513 600.074 565.191 600.074C566.507 600.074 567.678 599.772 568.705 599.168C569.731 598.565 570.54 597.725 571.131 596.651C571.723 595.576 572.013 594.351 572.001 592.974C572.013 591.574 571.717 590.33 571.113 589.244C570.51 588.157 569.683 587.306 568.632 586.69C567.582 586.062 566.374 585.748 565.01 585.748C563.899 585.736 562.806 585.941 561.732 586.364C560.657 586.787 559.806 587.342 559.178 588.03L553.111 587.034L555.049 567.909H576.565V573.523H560.609L559.54 583.358H559.758C560.446 582.549 561.418 581.879 562.674 581.347C563.929 580.804 565.306 580.532 566.803 580.532C569.049 580.532 571.053 581.064 572.816 582.126C574.578 583.176 575.967 584.625 576.981 586.473C577.995 588.32 578.502 590.433 578.502 592.811C578.502 595.262 577.935 597.448 576.8 599.368C575.677 601.275 574.114 602.778 572.109 603.877C570.117 604.964 567.811 605.507 565.191 605.507Z" fill="white" />
					<path d="M807.879 606.507C806.104 606.495 804.372 606.187 802.681 605.583C800.991 604.968 799.47 603.972 798.118 602.595C796.765 601.207 795.691 599.365 794.894 597.071C794.097 594.765 793.705 591.91 793.717 588.505C793.717 585.33 794.055 582.498 794.731 580.011C795.407 577.524 796.379 575.423 797.647 573.708C798.914 571.982 800.442 570.666 802.229 569.76C804.028 568.855 806.038 568.402 808.26 568.402C810.59 568.402 812.654 568.861 814.453 569.778C816.265 570.696 817.725 571.952 818.836 573.545C819.947 575.127 820.635 576.914 820.901 578.906H814.29C813.952 577.482 813.258 576.347 812.208 575.501C811.169 574.644 809.853 574.216 808.26 574.216C805.688 574.216 803.708 575.332 802.319 577.566C800.943 579.8 800.249 582.866 800.237 586.766H800.49C801.082 585.704 801.848 584.792 802.79 584.032C803.732 583.271 804.794 582.685 805.978 582.275C807.173 581.852 808.435 581.641 809.763 581.641C811.936 581.641 813.886 582.16 815.613 583.199C817.351 584.237 818.728 585.668 819.742 587.491C820.756 589.302 821.257 591.379 821.245 593.721C821.257 596.16 820.702 598.351 819.579 600.295C818.456 602.227 816.892 603.748 814.888 604.859C812.884 605.97 810.548 606.519 807.879 606.507ZM807.843 601.074C809.159 601.074 810.336 600.754 811.375 600.114C812.413 599.474 813.234 598.611 813.838 597.524C814.441 596.437 814.737 595.218 814.725 593.866C814.737 592.538 814.447 591.336 813.856 590.262C813.276 589.187 812.473 588.336 811.447 587.708C810.421 587.08 809.25 586.766 807.934 586.766C806.956 586.766 806.044 586.953 805.199 587.328C804.354 587.702 803.617 588.221 802.989 588.885C802.362 589.537 801.866 590.298 801.504 591.167C801.154 592.025 800.973 592.942 800.961 593.92C800.973 595.212 801.275 596.401 801.866 597.488C802.458 598.575 803.273 599.444 804.311 600.096C805.35 600.748 806.527 601.074 807.843 601.074Z" fill="white" />
					<path id="table_1" d="M632.5 353.5L632.5 273L501 273L501 353.5L632.5 353.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_7" d="M1115.5 626.5L1115.5 546L984 546L984 626.5L1049.75 626.5L1115.5 626.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
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
					<path d="M572.382 294.909V332H565.663V301.447H565.446L556.771 306.989V300.831L565.989 294.909H572.382Z" fill="white" />
					<path d="M1039.65 605L1055.43 573.777V573.523H1037.12V567.909H1062.38V573.65L1046.63 605H1039.65Z" fill="white" />
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
