import { registerPlugin, PluginListenerHandle } from '@capacitor/core';

export interface SystemBarsPlugin {
	getHeights(): Promise<{
		statusBar: number;
		navigationBar: number;
		navBarLeft: number;
		navBarRight: number;
		orientation: number;
		navBarSide: 'left' | 'right' | 'bottom';
	}>;
	addListener(
		eventName: 'configurationChanged',
		listenerFunc: () => void
	): Promise<PluginListenerHandle>;
}

export const SystemBars = registerPlugin<SystemBarsPlugin>('SystemBars');
