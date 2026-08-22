import type { Shop } from '$lib/types/shop.types';

export const shopsData: Shop[] = [
	{
		_id: 'shp-001',
		shopCode: 'SHP-NRB-001',
		name: 'Westlands Flagship Showroom',
		type: 'Showroom',
		status: 'Active',
		address: {
			building: 'Westlands Commercial Centre, Ground Floor',
			town: 'Nairobi'
		},
		inventorySummary: {
			totalProducts: 142,
			totalItemsInStock: 850,
			totalStockValue: 12450000,
			lowStockItemsCount: 4
		},
		notes: 'Primary retail location for customer walk-ins and high-end furniture displays.',
		createdAt: '2025-01-15T08:00:00Z',
		updatedAt: '2026-08-01T10:30:00Z'
	},
	{
		_id: 'shp-002',
		shopCode: 'SHP-NRB-002',
		name: 'Kilimani Express Retail Outlet',
		type: 'Retail Store',
		status: 'Active',
		address: {
			building: 'Yaya Centre Plaza, Shop #12',
			town: 'Nairobi'
		},
		inventorySummary: {
			totalProducts: 88,
			totalItemsInStock: 410,
			totalStockValue: 5120000,
			lowStockItemsCount: 8
		},
		notes: 'Focuses on fast-moving accent chairs, lamps, and small home accessories.',
		createdAt: '2025-06-20T09:15:00Z',
		updatedAt: '2026-08-10T14:20:00Z'
	},
	{
		_id: 'shp-003',
		shopCode: 'SHP-MKS-001',
		name: 'Syokimau Gateway Store',
		type: 'Retail Store',
		status: 'Active',
		address: {
			building: 'Gateway Mall, Ground Level',
			town: 'Syokimau'
		},
		inventorySummary: {
			totalProducts: 65,
			totalItemsInStock: 290,
			totalStockValue: 3800000,
			lowStockItemsCount: 2
		},
		notes: 'Strategic pickup point for eastern Nairobi and Mombasa Road clients.',
		createdAt: '2025-11-05T11:00:00Z',
		updatedAt: '2026-08-12T08:45:00Z'
	},
	{
		_id: 'shp-004',
		shopCode: 'SHP-THK-001',
		name: 'Thika Road Mall Display',
		type: 'Showroom',
		status: 'Under Maintenance',
		address: {
			building: 'TRM, 1st Floor Suite B',
			town: 'Thika Road'
		},
		inventorySummary: {
			totalProducts: 40,
			totalItemsInStock: 110,
			totalStockValue: 1950000,
			lowStockItemsCount: 12
		},
		notes: 'Currently undergoing floor expansion and lighting renovations.',
		createdAt: '2026-02-10T10:00:00Z',
		updatedAt: '2026-08-18T16:00:00Z'
	},
	{
		_id: 'shp-005',
		shopCode: 'SHP-NKR-001',
		name: 'Nakuru Town Branch',
		type: 'Retail Store',
		status: 'Inactive',
		address: {
			building: 'Kenyatta Avenue Arcade',
			town: 'Nakuru'
		},
		inventorySummary: {
			totalProducts: 0,
			totalItemsInStock: 0,
			totalStockValue: 0,
			lowStockItemsCount: 0
		},
		notes: 'Location pre-registered for regional expansion.',
		createdAt: '2026-05-01T09:00:00Z',
		updatedAt: '2026-05-01T09:00:00Z'
	}
];
