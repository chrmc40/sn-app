import { registerPlugin } from '@capacitor/core';

export interface SystemBarsPlugin {
	getHeights(): Promise<{ statusBar: number; navigationBar: number }>;
}

export const SystemBars = registerPlugin<SystemBarsPlugin>('SystemBars');
