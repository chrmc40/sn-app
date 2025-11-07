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

<!-- Android status bar (frosted glass overlay) -->
<div class="mobile-status-bar"></div>

<!-- Main app content area -->
<div class="app-content-area">
	{@render children?.()}
</div>

<!-- Android navigation bar (frosted glass overlay) -->
<div class="mobile-nav-bar"></div>

<style>
	.mobile-status-bar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: var(--status-bar-height, 0);
		backdrop-filter: blur(20px) saturate(180%);
		background-color: rgba(0, 0, 0, 0.5);
		z-index: var(--z-header);
	}

	.app-content-area {
		padding-top: var(--status-bar-height, 0);
		padding-bottom: var(--nav-bar-height, 0);
		min-height: 100dvh;
	}

	.mobile-nav-bar {
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
		.mobile-status-bar,
		.mobile-nav-bar {
			display: none;
		}
	}
</style>
