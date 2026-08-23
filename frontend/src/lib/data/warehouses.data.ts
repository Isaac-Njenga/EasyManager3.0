// src/lib/data/warehouse.data.ts
import type { Warehouse } from '$lib/types/warehouse.types';

export const warehouseData: Warehouse[] = [
	{
		_id: 'wh_01h8x1',
		warehouseCode: 'WH-NRB-001',
		name: 'Embakasi Central Fulfillment Hub',
		status: 'Active',
		address: {
			building: 'North Gate Logistics Park, Block B',
			city: 'Nairobi'
		},
		inventorySummary: {
			totalProducts: 340,
			totalItemsInStock: 24500,
			totalStockValue: 18450000,
			lowStockItemsCount: 12,
			outOfStockItemsCount: 3
		},
		notes: 'Primary distribution center for nationwide retail store supply and bulk shipments.',
		createdAt: '2025-01-15T08:00:00.000Z',
		updatedAt: '2026-08-10T14:30:00.000Z'
	},
	{
		_id: 'wh_02h8x2',
		warehouseCode: 'WH-MBA-001',
		name: 'Kilindini Port Transit Warehouse',
		status: 'Active',
		address: {
			building: 'Mbaraki Logistics Centre, Gate 3',
			city: 'Mombasa'
		},
		inventorySummary: {
			totalProducts: 185,
			totalItemsInStock: 16200,
			totalStockValue: 12800000,
			lowStockItemsCount: 5,
			outOfStockItemsCount: 0
		},
		notes: 'Handles import clearance staging and coastal regional supply.',
		createdAt: '2025-03-20T09:15:00.000Z',
		updatedAt: '2026-08-18T11:00:00.000Z'
	},
	{
		_id: 'wh_03h8x3',
		warehouseCode: 'WH-EDR-001',
		name: 'Rift Valley Regional Depot',
		status: 'Active',
		address: {
			building: 'Uganda Road Industrial Zone',
			city: 'Eldoret'
		},
		inventorySummary: {
			totalProducts: 120,
			totalItemsInStock: 8900,
			totalStockValue: 6200000,
			lowStockItemsCount: 8,
			outOfStockItemsCount: 2
		},
		notes: 'Serves North Rift and Western region retail outlets.',
		createdAt: '2025-06-10T10:30:00.000Z',
		updatedAt: '2026-08-05T16:45:00.000Z'
	},
	{
		_id: 'wh_04h8x4',
		warehouseCode: 'WH-NKR-001',
		name: 'Nakuru Highway Storage Facility',
		status: 'Full Capacity',
		address: {
			building: 'Pipeline Industrial Park, Godown 4',
			city: 'Nakuru'
		},
		inventorySummary: {
			totalProducts: 210,
			totalItemsInStock: 19800,
			totalStockValue: 14100000,
			lowStockItemsCount: 18,
			outOfStockItemsCount: 5
		},
		notes: 'Currently operating at maximum capacity. Pending stock transfer to Embakasi.',
		createdAt: '2025-08-01T12:00:00.000Z',
		updatedAt: '2026-08-20T09:10:00.000Z'
	},
	{
		_id: 'wh_05h8x5',
		warehouseCode: 'WH-KSM-001',
		name: 'Lake Basin Distribution Centre',
		status: 'Under Maintenance',
		address: {
			building: 'Kisumu-Kakamega Road Complex',
			city: 'Kisumu'
		},
		inventorySummary: {
			totalProducts: 65,
			totalItemsInStock: 2100,
			totalStockValue: 1950000,
			lowStockItemsCount: 14,
			outOfStockItemsCount: 8
		},
		notes: 'Roof maintenance in progress. Partial operations active in Wing B.',
		createdAt: '2025-11-12T14:20:00.000Z',
		updatedAt: '2026-08-15T13:00:00.000Z'
	},
	{
		_id: 'wh_06h8x6',
		warehouseCode: 'WH-NRB-002',
		name: 'SGR Syokimau Overflow Reserve',
		status: 'Inactive',
		address: {
			building: 'Mlolongo Freight Park',
			city: 'Nairobi'
		},
		inventorySummary: {
			totalProducts: 0,
			totalItemsInStock: 0,
			totalStockValue: 0,
			lowStockItemsCount: 0,
			outOfStockItemsCount: 0
		},
		notes: 'Backup facility reserved for Q4 peak seasonal stock accumulation.',
		createdAt: '2026-02-01T11:00:00.000Z',
		updatedAt: '2026-07-01T10:00:00.000Z'
	}
];