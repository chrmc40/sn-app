<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { SystemBars } from '$lib/plugins/system-bars';

	let { children } = $props();
	let isBottomNavHidden = $state(false);

	onMount(async () => {
		// Listen for bottom nav visibility changes
		window.addEventListener('bottomNavVisibilityChange', ((e: CustomEvent) => {
			isBottomNavHidden = e.detail.hidden;
		}) as EventListener);

		return () => {
			window.removeEventListener('bottomNavVisibilityChange', ((e: CustomEvent) => {
				isBottomNavHidden = e.detail.hidden;
			}) as EventListener);
		};
	});

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

<!-- Main app content area -->
<div class="app-content-area">
	{@render children?.()}
</div>

<!-- Android navigation bar (frosted glass overlay) -->
<div class="mobile-nav-bar" class:nav-icons-hidden={isBottomNavHidden}></div>

<style>
	.app-content-area {
		padding-bottom: calc(56px + var(--nav-bar-height, 0px));
		min-height: 100dvh;
	}

	.mobile-nav-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: calc(56px + var(--nav-bar-height, 0px));
		backdrop-filter: blur(20px) saturate(180%);
		background-color: rgba(0, 0, 0, 0.75);
		z-index: 9999;
		pointer-events: none;
		transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.mobile-nav-bar.nav-icons-hidden {
		height: var(--nav-bar-height, 0px);
	}

	/* Hide on web */
	@media (hover: hover) and (pointer: fine) {
		.mobile-nav-bar {
			display: none;
		}
	}
</style>
