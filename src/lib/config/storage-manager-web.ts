/**
 * Web fallback implementation of StorageManager plugin
 *
 * DEV ONLY - This app is mobile-first (Android).
 * Web fallback uses localStorage for component testing during development.
 */

import { WebPlugin } from '@capacitor/core';
import type { StorageManagerPlugin } from './storage-manager';

export class StorageManagerWeb extends WebPlugin implements StorageManagerPlugin {
	async getMountPath(): Promise<{ path: string | null }> {
		const path = localStorage.getItem('sn_mount_path');
		return { path };
	}

	async setMountPath(options: { path: string }): Promise<void> {
		localStorage.setItem('sn_mount_path', options.path);
	}

	async requestMountPath(_options?: { preset?: string }): Promise<{ path: string }> {
		throw new Error(
			'StorageManager.requestMountPath() is not available on web. This is a mobile-first Android app.'
		);
	}

	async clearMountPath(): Promise<void> {
		localStorage.removeItem('sn_mount_path');
	}
}
