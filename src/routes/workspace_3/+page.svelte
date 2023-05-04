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

	let tables3 = {
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

	function savetables3() {
		localStorage.setItem('tables3', JSON.stringify(tables3));
	}

	function loadtables3() {
		const storedtables3 = localStorage.getItem('tables3');
		if (storedtables3) {
			tables3 = JSON.parse(storedtables3);

			// Convert date strings back to Date objects
			for (const key in tables3) {
				tables3[key].start_date = new Date(tables3[key].start_date);
				tables3[key].end_date = new Date(tables3[key].end_date);
			}
		}
	}

	let selectedTableKey = undefined;
	let disabled = false;

	$: if (selectedTableKey !== undefined) {
		disabled = tables3[selectedTableKey].fulltime;
	}

	function bookTable() {
		if (selectedTableKey in tables3) {
			console.log('yey');
			tables3[selectedTableKey].booked = !tables3[selectedTableKey].booked;
		}
	}

	function updateColors() {
		// Check if the room_svg_container is already in the DOM
		const room_svg_container = document.getElementById('rooms_svg_container');
		if (room_svg_container) {
			// Iterate over all keys in tables3
			for (const key in tables3) {
				// Get the path with the corresponding ID from room_svg_containers
				const path = room_svg_container.querySelector(`#${key}`);
				if (path) {
					// If booked is false, set the fill color to red, otherwise use the original color
					let fillColor;
					let strokeColor;
					if (tables3[key].booked) {
						if (!tables3[key].fulltime) {
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
		loadtables3();
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
		savetables3();
		updateColors();
	});

	function goBackToMenu() {
		goto('/');
	}
</script>

<div class="flex">
	<div id="map" class="h-screen !bg-gpt-bg flex w-[72%]">
		<div class="relative border-0 m-auto w-2/3">
			<div id="rooms_svg_container" class="z-20 relative">
				<svg width="100%" height="108.6044%" viewBox="0 0 953 1035" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path id="table_1" d="M210.5 947.5L210.5 867L79 867L79 947.5L210.5 947.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_2" d="M451.5 947.5L451.5 867L320 867L320 947.5L451.5 947.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_3" d="M698.5 946.5L698.5 866L567 866L567 946.5L698.5 946.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_4" d="M940.5 945.5L940.5 865L809 865L809 945.5L940.5 945.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_10" d="M501 268L501 348.5L632.5 348.5L632.5 268L501 268Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_7" d="M940.5 349.5L940.5 269L809 269L809 349.5L940.5 349.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_9" d="M501 87L501 167.5L632.5 167.5L632.5 87L501 87Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_8" d="M809 88L809 168.5L940.5 168.5L940.5 88L809 88Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path d="M92 149.046V534.228H159V149.046" stroke="white" stroke-width="3" stroke-miterlimit="10" />
					<path d="M924 4.87207C937.807 4.87207 949 16.065 949 29.8721V1005.23C949 1019.04 937.807 1030.23 924 1030.23H29C15.1929 1030.23 4 1019.04 4 1005.23V559.431C4 545.624 15.1929 534.431 29 534.431H467.057C480.864 534.431 492.057 523.238 492.057 509.431V29.8721C492.057 16.065 503.25 4.87207 517.057 4.87207H924Z" stroke="#0085FF" stroke-width="8" stroke-miterlimit="10" />
					<path id="table_5" d="M940.5 738.5L940.5 658L809 658L809 738.5L940.5 738.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<path id="table_6" d="M940.5 530.5L940.5 450L809 450L809 530.5L940.5 530.5Z" fill="white" fill-opacity="0.24" stroke="white" stroke-width="8" />
					<g clip-path="url(#clip0_127_64)">
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
					<path d="M566.173 108.402C567.948 108.414 569.674 108.728 571.353 109.344C573.043 109.947 574.564 110.938 575.917 112.314C577.269 113.678 578.343 115.507 579.14 117.801C579.937 120.096 580.336 122.933 580.336 126.314C580.348 129.501 580.01 132.35 579.321 134.862C578.645 137.361 577.673 139.474 576.406 141.201C575.138 142.927 573.61 144.243 571.824 145.149C570.037 146.054 568.026 146.507 565.793 146.507C563.45 146.507 561.374 146.048 559.562 145.131C557.763 144.213 556.309 142.957 555.198 141.364C554.087 139.77 553.405 137.947 553.151 135.894H559.762C560.1 137.367 560.788 138.538 561.826 139.408C562.877 140.265 564.199 140.694 565.793 140.694C568.364 140.694 570.344 139.577 571.733 137.343C573.121 135.109 573.816 132.006 573.816 128.034H573.562C572.971 129.097 572.204 130.014 571.262 130.787C570.32 131.548 569.252 132.133 568.056 132.544C566.873 132.954 565.618 133.159 564.289 133.159C562.116 133.159 560.16 132.64 558.422 131.602C556.695 130.564 555.325 129.139 554.31 127.328C553.308 125.517 552.801 123.446 552.789 121.116C552.789 118.701 553.344 116.534 554.455 114.614C555.578 112.682 557.142 111.161 559.146 110.05C561.15 108.927 563.493 108.378 566.173 108.402ZM566.191 113.835C564.887 113.835 563.71 114.155 562.659 114.795C561.621 115.423 560.8 116.28 560.196 117.367C559.605 118.441 559.309 119.643 559.309 120.971C559.321 122.287 559.617 123.482 560.196 124.557C560.788 125.631 561.591 126.483 562.605 127.11C563.631 127.738 564.803 128.052 566.119 128.052C567.097 128.052 568.008 127.865 568.853 127.491C569.699 127.116 570.435 126.597 571.063 125.933C571.703 125.257 572.198 124.49 572.548 123.633C572.91 122.776 573.085 121.87 573.073 120.917C573.073 119.649 572.771 118.478 572.168 117.403C571.576 116.328 570.761 115.465 569.723 114.813C568.696 114.161 567.519 113.835 566.191 113.835Z" fill="white" />
					<path d="M150.382 889.909V927H143.663V896.447H143.446L134.771 901.989V895.831L143.989 889.909H150.382Z" fill="white" />
					<path d="M373.296 926V921.146L386.173 908.523C387.404 907.279 388.431 906.175 389.252 905.209C390.073 904.243 390.689 903.307 391.099 902.402C391.51 901.496 391.715 900.53 391.715 899.504C391.715 898.333 391.449 897.331 390.918 896.498C390.387 895.652 389.656 895 388.727 894.542C387.797 894.083 386.74 893.853 385.557 893.853C384.338 893.853 383.269 894.107 382.352 894.614C381.434 895.109 380.722 895.815 380.214 896.733C379.719 897.651 379.472 898.743 379.472 900.011H373.079C373.079 897.657 373.616 895.61 374.691 893.871C375.765 892.133 377.244 890.787 379.128 889.833C381.023 888.879 383.197 888.402 385.648 888.402C388.135 888.402 390.32 888.867 392.204 889.797C394.087 890.726 395.548 892 396.587 893.618C397.637 895.236 398.162 897.083 398.162 899.16C398.162 900.548 397.897 901.913 397.365 903.253C396.834 904.593 395.898 906.078 394.558 907.708C393.23 909.338 391.365 911.312 388.962 913.63L382.569 920.132V920.386H398.724V926H373.296Z" fill="white" />
					<path d="M632.608 927.507C630 927.507 627.681 927.06 625.653 926.167C623.637 925.273 622.043 924.03 620.872 922.436C619.701 920.842 619.079 919.001 619.006 916.912H625.816C625.876 917.914 626.208 918.79 626.812 919.538C627.416 920.275 628.219 920.848 629.221 921.259C630.223 921.669 631.346 921.875 632.589 921.875C633.918 921.875 635.095 921.645 636.121 921.186C637.147 920.716 637.95 920.064 638.53 919.23C639.109 918.397 639.393 917.437 639.381 916.351C639.393 915.228 639.103 914.238 638.512 913.381C637.92 912.523 637.063 911.853 635.94 911.37C634.829 910.887 633.489 910.646 631.919 910.646H628.641V905.466H631.919C633.211 905.466 634.34 905.243 635.306 904.796C636.284 904.349 637.051 903.722 637.606 902.913C638.162 902.092 638.433 901.144 638.421 900.069C638.433 899.019 638.198 898.107 637.715 897.335C637.244 896.55 636.574 895.94 635.705 895.505C634.847 895.071 633.839 894.853 632.68 894.853C631.545 894.853 630.495 895.059 629.529 895.469C628.563 895.88 627.784 896.465 627.192 897.226C626.601 897.974 626.287 898.868 626.251 899.906H619.785C619.833 897.83 620.431 896.006 621.578 894.437C622.737 892.855 624.283 891.624 626.214 890.742C628.146 889.849 630.314 889.402 632.716 889.402C635.191 889.402 637.341 889.867 639.164 890.797C640.999 891.714 642.418 892.952 643.42 894.509C644.422 896.067 644.923 897.787 644.923 899.671C644.935 901.76 644.319 903.51 643.076 904.923C641.844 906.336 640.226 907.259 638.222 907.694V907.984C640.83 908.346 642.828 909.312 644.217 910.881C645.617 912.439 646.311 914.377 646.299 916.695C646.299 918.772 645.708 920.631 644.525 922.273C643.353 923.903 641.735 925.183 639.671 926.113C637.618 927.042 635.264 927.507 632.608 927.507Z" fill="white" />
					<path d="M860.626 920.118V914.775L876.364 889.909H880.82V897.516H878.103L867.508 914.304V914.594H889.477V920.118H860.626ZM878.32 927V918.488L878.393 916.097V889.909H884.732V927H878.32Z" fill="white" />
					<path d="M874.191 717.507C871.776 717.507 869.615 717.054 867.707 716.149C865.8 715.231 864.284 713.975 863.162 712.382C862.051 710.788 861.459 708.965 861.387 706.912H867.907C868.027 708.434 868.685 709.677 869.881 710.643C871.076 711.597 872.513 712.074 874.191 712.074C875.507 712.074 876.678 711.772 877.705 711.168C878.731 710.565 879.54 709.725 880.131 708.651C880.723 707.576 881.013 706.351 881.001 704.974C881.013 703.574 880.717 702.33 880.113 701.244C879.51 700.157 878.683 699.306 877.632 698.69C876.582 698.062 875.374 697.748 874.01 697.748C872.899 697.736 871.806 697.941 870.732 698.364C869.657 698.787 868.806 699.342 868.178 700.03L862.111 699.034L864.049 679.909H885.565V685.523H869.609L868.54 695.358H868.758C869.446 694.549 870.418 693.879 871.674 693.347C872.929 692.804 874.306 692.532 875.803 692.532C878.049 692.532 880.053 693.064 881.816 694.126C883.578 695.176 884.967 696.625 885.981 698.473C886.995 700.32 887.502 702.433 887.502 704.811C887.502 707.262 886.935 709.448 885.8 711.368C884.677 713.275 883.114 714.778 881.109 715.877C879.117 716.964 876.811 717.507 874.191 717.507Z" fill="white" />
					<path d="M874.879 509.507C873.104 509.495 871.372 509.187 869.681 508.583C867.991 507.968 866.47 506.972 865.118 505.595C863.765 504.207 862.691 502.365 861.894 500.071C861.097 497.765 860.705 494.91 860.717 491.505C860.717 488.33 861.055 485.498 861.731 483.011C862.407 480.524 863.379 478.423 864.647 476.708C865.914 474.982 867.442 473.666 869.229 472.76C871.028 471.855 873.038 471.402 875.26 471.402C877.59 471.402 879.654 471.861 881.453 472.778C883.265 473.696 884.725 474.952 885.836 476.545C886.947 478.127 887.635 479.914 887.901 481.906H881.29C880.952 480.482 880.258 479.347 879.208 478.501C878.169 477.644 876.853 477.216 875.26 477.216C872.688 477.216 870.708 478.332 869.319 480.566C867.943 482.8 867.249 485.866 867.237 489.766H867.49C868.082 488.704 868.848 487.792 869.79 487.032C870.732 486.271 871.794 485.685 872.978 485.275C874.173 484.852 875.435 484.641 876.763 484.641C878.936 484.641 880.886 485.16 882.613 486.199C884.351 487.237 885.728 488.668 886.742 490.491C887.756 492.302 888.257 494.379 888.245 496.721C888.257 499.16 887.702 501.351 886.579 503.295C885.456 505.227 883.892 506.748 881.888 507.859C879.884 508.97 877.548 509.519 874.879 509.507ZM874.843 504.074C876.159 504.074 877.336 503.754 878.375 503.114C879.413 502.474 880.234 501.611 880.838 500.524C881.441 499.437 881.737 498.218 881.725 496.866C881.737 495.538 881.447 494.336 880.856 493.262C880.276 492.187 879.473 491.336 878.447 490.708C877.421 490.08 876.25 489.766 874.934 489.766C873.956 489.766 873.044 489.953 872.199 490.328C871.354 490.702 870.617 491.221 869.989 491.885C869.362 492.537 868.866 493.298 868.504 494.167C868.154 495.025 867.973 495.942 867.961 496.92C867.973 498.212 868.275 499.401 868.866 500.488C869.458 501.575 870.273 502.444 871.311 503.096C872.35 503.748 873.527 504.074 874.843 504.074Z" fill="white" />
					<path d="M864.654 328L880.429 296.777V296.523H862.119V290.909H887.384V296.65L871.627 328H864.654Z" fill="white" />
					<path d="M874.481 147.507C871.788 147.507 869.398 147.054 867.309 146.149C865.232 145.243 863.602 144.006 862.419 142.436C861.248 140.854 860.668 139.061 860.68 137.057C860.668 135.5 861.006 134.069 861.695 132.765C862.383 131.461 863.313 130.374 864.484 129.505C865.667 128.624 866.983 128.062 868.432 127.821V127.567C866.524 127.145 864.979 126.173 863.795 124.651C862.624 123.118 862.045 121.349 862.057 119.345C862.045 117.437 862.576 115.735 863.651 114.238C864.725 112.74 866.198 111.563 868.07 110.706C869.941 109.837 872.078 109.402 874.481 109.402C876.859 109.402 878.978 109.837 880.838 110.706C882.709 111.563 884.182 112.74 885.257 114.238C886.343 115.735 886.887 117.437 886.887 119.345C886.887 121.349 886.289 123.118 885.094 124.651C883.911 126.173 882.383 127.145 880.512 127.567V127.821C881.961 128.062 883.265 128.624 884.424 129.505C885.595 130.374 886.525 131.461 887.213 132.765C887.913 134.069 888.263 135.5 888.263 137.057C888.263 139.061 887.672 140.854 886.488 142.436C885.305 144.006 883.675 145.243 881.598 146.149C879.534 147.054 877.161 147.507 874.481 147.507ZM874.481 142.327C875.869 142.327 877.077 142.092 878.103 141.621C879.129 141.138 879.926 140.462 880.494 139.593C881.061 138.723 881.351 137.721 881.363 136.586C881.351 135.403 881.043 134.359 880.439 133.453C879.848 132.536 879.033 131.817 877.994 131.298C876.968 130.779 875.797 130.519 874.481 130.519C873.153 130.519 871.969 130.779 870.931 131.298C869.893 131.817 869.072 132.536 868.468 133.453C867.876 134.359 867.587 135.403 867.599 136.586C867.587 137.721 867.864 138.723 868.432 139.593C868.999 140.45 869.796 141.12 870.822 141.603C871.861 142.086 873.08 142.327 874.481 142.327ZM874.481 125.43C875.616 125.43 876.618 125.201 877.487 124.742C878.369 124.283 879.063 123.643 879.57 122.822C880.077 122.001 880.337 121.053 880.349 119.979C880.337 118.916 880.083 117.987 879.588 117.19C879.093 116.381 878.405 115.759 877.523 115.324C876.642 114.877 875.628 114.654 874.481 114.654C873.31 114.654 872.277 114.877 871.384 115.324C870.502 115.759 869.814 116.381 869.319 117.19C868.836 117.987 868.601 118.916 868.613 119.979C868.601 121.053 868.842 122.001 869.337 122.822C869.844 123.631 870.539 124.271 871.42 124.742C872.314 125.201 873.334 125.43 874.481 125.43Z" fill="white" />
					<path d="M555.382 289.909V327H548.663V296.447H548.446L539.771 301.989V295.831L548.989 289.909H555.382ZM578.51 327.706C575.528 327.706 572.968 326.952 570.831 325.442C568.706 323.921 567.07 321.73 565.923 318.868C564.788 315.995 564.221 312.536 564.221 308.491C564.233 304.446 564.806 301.005 565.941 298.168C567.088 295.318 568.724 293.145 570.849 291.648C572.986 290.151 575.54 289.402 578.51 289.402C581.48 289.402 584.034 290.151 586.171 291.648C588.308 293.145 589.944 295.318 591.079 298.168C592.226 301.017 592.799 304.458 592.799 308.491C592.799 312.548 592.226 316.013 591.079 318.886C589.944 321.748 588.308 323.933 586.171 325.442C584.046 326.952 581.492 327.706 578.51 327.706ZM578.51 322.038C580.828 322.038 582.657 320.897 583.998 318.615C585.35 316.321 586.026 312.946 586.026 308.491C586.026 305.545 585.718 303.07 585.102 301.065C584.487 299.061 583.617 297.552 582.494 296.538C581.371 295.511 580.043 294.998 578.51 294.998C576.204 294.998 574.381 296.145 573.04 298.439C571.7 300.721 571.024 304.072 571.012 308.491C571 311.449 571.296 313.936 571.9 315.952C572.515 317.969 573.385 319.49 574.507 320.516C575.63 321.531 576.964 322.038 578.51 322.038Z" fill="white" />
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
					<input class="bg-gpt-bg" bind:value={tables3[selectedTableKey].name} />
					<div class="mt-4">Должность</div>
					<input class="bg-gpt-bg" bind:value={tables3[selectedTableKey].ocupation} />
					<div class="mt-4">Необходимое оборудование</div>
					<textarea class="bg-gpt-bg" bind:value={tables3[selectedTableKey].devices} />
					<div class="mt-4 flex">
						<div>Постоянное посещение</div>
						<div><input type="checkbox" bind:checked={tables3[selectedTableKey].fulltime} /></div>
					</div>
					<div class="mt-4">или</div>
					<div class="mt-4 flex">
						<div class={disabled ? 'text-white/50' : 'text-white'}>Начало брони</div>
						<div><DateInput bind:value={tables3[selectedTableKey].start_date} format="yyyy-MM-dd" {disabled} /></div>
					</div>
					<div class="mt-4 flex">
						<div class={disabled ? 'text-white/50' : 'text-white'}>Конец брони</div>
						<div><DateInput bind:value={tables3[selectedTableKey].end_date} format="yyyy-MM-dd" {disabled} /></div>
					</div>
				{/if}
			</div>
			<div class="mx-auto w-full">
				{#if selectedTableKey && tables3[selectedTableKey]}
					{#if !tables3[selectedTableKey].booked}
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
