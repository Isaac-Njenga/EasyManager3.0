import { browser } from '$app/environment';

export type ProductUpdatePayload = {
	id: string;
	status: 'Active' | 'Inactive';
	totalQuantity: number;
	costPrice: number;
	sellingPrice: number;
};

export function createProductSocket(onProductUpdated: (payload: ProductUpdatePayload) => void) {
	if (!browser) return () => {};

	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	const wsUrl = `${protocol}//${window.location.host}/ws`;

	let socket: WebSocket | null = null;
	let reconnectTimer: NodeJS.Timeout;

	function connect() {
		socket = new WebSocket(wsUrl);

		socket.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				if (data.event === 'product:updated') {
					onProductUpdated(data.payload);
				}
			} catch (err) {
				console.error('Failed to parse WebSocket message:', err);
			}
		};

		socket.onclose = () => {
			// Auto-reconnect after 3 seconds if disconnected
			reconnectTimer = setTimeout(connect, 3000);
		};
	}

	connect();

	// Return cleanup function to unsubscribe on component unmount
	return () => {
		clearTimeout(reconnectTimer);
		socket?.close();
	};
}
