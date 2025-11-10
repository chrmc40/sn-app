/**
 * Global Application State
 *
 * Centralized reactive state for app-wide configuration and status.
 * Uses Svelte writable store for reactivity across components.
 */

import { writable } from 'svelte/store';

export interface AppState {
	/** Mount path for storage (null if not configured) */
	mountPath: string | null;

	/** Whether storage is configured and ready */
	isConfigured: boolean;

	/** App is loading/initializing */
	isLoading: boolean;

	/** Current platform */
	platform: 'web' | 'android';

	/** App version (from package.json) */
	version?: string;
}

/**
 * Default initial state
 */
const initialState: AppState = {
	mountPath: null,
	isConfigured: false,
	isLoading: true,
	platform: 'web' // Will be updated during initialization
};

/**
 * Global app state store
 *
 * Usage:
 * ```typescript
 * import { appState } from '$lib/stores/appState';
 *
 * // Read current state
 * const state = $appState;
 *
 * // Update state
 * appState.update(s => ({ ...s, isLoading: false }));
 *
 * // Set entire state
 * appState.set({ mountPath: '/storage', isConfigured: true, ... });
 * ```
 */
export const appState = writable<AppState>(initialState);

/**
 * Helper to update mount path and configuration status together
 */
export function setMountPath(path: string | null): void {
	appState.update((s) => ({
		...s,
		mountPath: path,
		isConfigured: !!path
	}));
}

/**
 * Helper to set loading state
 */
export function setLoading(isLoading: boolean): void {
	appState.update((s) => ({ ...s, isLoading }));
}

/**
 * Helper to set platform
 */
export function setPlatform(platform: 'web' | 'android'): void {
	appState.update((s) => ({ ...s, platform }));
}

/**
 * Reset app state to initial values (useful for testing or sign out)
 */
export function resetAppState(): void {
	appState.set(initialState);
}
