/**
 * StorageManager Capacitor Plugin
 *
 * Native plugin for managing persistent storage paths on Android.
 * Uses SharedPreferences for storage and Storage Access Framework (SAF) for folder picking.
 */

import { registerPlugin } from '@capacitor/core';

export interface StorageManagerPlugin {
	/**
	 * Get the currently configured mount path from SharedPreferences
	 * @returns Promise resolving to the path string, or null if not set
	 */
	getMountPath(): Promise<{ path: string | null }>;

	/**
	 * Set the mount path in SharedPreferences
	 * @param options Object containing the path to store
	 */
	setMountPath(options: { path: string }): Promise<void>;

	/**
	 * Open Android Storage Access Framework folder picker
	 * Requests persistent URI permissions and stores the selected path
	 * @param options Optional preset path (e.g., "downloads" for /storage/emulated/0/Download)
	 * @returns Promise resolving to the selected path/URI
	 */
	requestMountPath(options?: { preset?: string }): Promise<{ path: string }>;

	/**
	 * Clear the stored mount path from SharedPreferences
	 */
	clearMountPath(): Promise<void>;
}

const StorageManager = registerPlugin<StorageManagerPlugin>('StorageManager', {
	web: () => import('./storage-manager-web').then((m) => new m.StorageManagerWeb())
});

export default StorageManager;
