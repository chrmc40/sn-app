<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { SystemBars } from '$lib/plugins/system-bars';

	let { children } = $props();

	onMount(async () => {
		// Get system bar heights and inject as CSS variables
		if ((window as any).Capacitor?.isNativePlatform?.()) {
			try {
				const heights = await SystemBars.getHeights();
				document.documentElement.style.setProperty('--status-bar-height', `${heights.statusBar}px`);
				document.documentElement.style.setProperty('--nav-bar-height', `${heights.navigationBar}px`);
				console.log('Status bar height:', heights.statusBar);
				console.log('Nav bar height:', heights.navigationBar);
			} catch (error) {
				console.error('Failed to get system bar heights:', error);
			}

			// Handle Android back button
			const { App } = await import('@capacitor/app');
			App.addListener('backButton', ({ canGoBack }) => {
				const currentPath = window.location.pathname;

				if (currentPath === '/' || currentPath === '/app') {
					App.exitApp();
				} else {
					goto('/app');
				}
			});
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
