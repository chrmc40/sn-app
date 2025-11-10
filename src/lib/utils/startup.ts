/**
 * App Startup & Initialization
 *
 * Orchestrates app initialization sequence:
 * 1. Detect platform
 * 2. Load storage configuration
 * 3. Initialize app state
 * 4. Return configuration status
 */

import { Capacitor } from '@capacitor/core';
import { getStorageConfig } from '$lib/api/storage';
import { appState, setPlatform, setLoading, setMountPath } from '$lib/stores/appState';
import { get } from 'svelte/store';

/**
 * Initialize the application
 *
 * Call this once during app startup (in root +layout.svelte onMount)
 *
 * @returns Promise<boolean> - true if app is configured and ready, false if needs setup
 */
export async function initializeApp(): Promise<boolean> {
	try {
		// 1. Detect platform
		const platform = Capacitor.isNativePlatform() ? 'android' : 'web';
		setPlatform(platform);

		// 2. Load storage configuration
		const config = await getStorageConfig();

		// 3. Update app state
		setMountPath(config.path);
		setLoading(false);

		// 4. Return ready status
		return config.isConfigured;
	} catch (err) {
		console.error('App initialization failed:', err);
		setLoading(false);
		return false;
	}
}

/**
 * Request storage configuration from user
 *
 * - Web: Throws error (must use .env)
 * - Android: Opens SAF folder picker
 *
 * @returns Promise<boolean> - true if configured successfully
 */
export async function requestStorageSetup(): Promise<boolean> {
	const { requestMountPath } = await import('$lib/api/storage');

	try {
		const path = await requestMountPath();
		setMountPath(path);
		return true;
	} catch (err) {
		console.error('Storage setup failed:', err);
		return false;
	}
}

/**
 * Check if app is ready to use (configured and not loading)
 */
export function isAppReady(): boolean {
	const state = get(appState);
	return state.isConfigured && !state.isLoading;
}

/**
 * Check if app needs initial setup
 */
export function needsSetup(): boolean {
	const state = get(appState);
	return !state.isConfigured && !state.isLoading;
}
