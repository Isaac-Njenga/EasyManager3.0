export type LocationType = 'Warehouse' | 'Shop';

export type TransferStatus = 'Pending' | 'In Transit' | 'Completed' | 'Cancelled';

export type StockTransferItem = {
	productId: string;
	productName: string;
	code: string;
	quantity: number;
};

export type StockTransfer = {
	_id: string;
	date: string;
	transferCode: string; // e.g. "TRF-2026-0801"
	status: TransferStatus;
	source: {
		id: string;
		name: string;
		type: LocationType;
	};
	destination: {
		id: string;
		name: string;
		type: LocationType;
	};
	items: StockTransferItem[];
	notes?: string;
	createdAt: string;
	updatedAt: string;
};
