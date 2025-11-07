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
				// Convert from physical pixels to CSS pixels using device pixel ratio
				const dpr = window.devicePixelRatio || 1;
				const statusBarHeight = heights.statusBar / dpr;
				const navBarHeight = heights.navigationBar / dpr;

				document.documentElement.style.setProperty('--status-bar-height', `${statusBarHeight}px`);
				document.documentElement.style.setProperty('--nav-bar-height', `${navBarHeight}px`);

				console.log('Status bar height (px):', heights.statusBar, '→ CSS px:', statusBarHeight);
				console.log('Nav bar height (px):', heights.navigationBar, '→ CSS px:', navBarHeight);
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

<!-- Android status bar (solid, always at top) -->
<div class="status-bar"></div>

<!-- Main content area -->
<div class="content-wrapper">
	{@render children?.()}
</div>

<!-- Android navigation bar overlay (frosted glass, on top of content) -->
<div class="nav-bar-overlay"></div>

<style>
	.status-bar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: var(--status-bar-height, 0);
		background-color: var(--bg-primary);
		z-index: var(--z-header);
	}

	.content-wrapper {
		padding-top: var(--status-bar-height, 0);
		padding-bottom: var(--nav-bar-height, 0);
		min-height: 100dvh;
	}

	.nav-bar-overlay {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: var(--nav-bar-height, 0);
		backdrop-filter: blur(20px) saturate(180%);
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 9999;
		pointer-events: none;
	}

	/* Hide on web */
	@media (hover: hover) and (pointer: fine) {
		.status-bar,
		.nav-bar-overlay {
			display: none;
		}
	}
</style>
