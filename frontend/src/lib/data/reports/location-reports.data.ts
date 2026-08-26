// $lib/data/reports/locationReports.data.ts

export interface LocationReportMetric {
	locationId: string;
	locationName: string;
	type: 'Retail Store' | 'Central Warehouse';
	city: string;
	totalStockValue: number;
	totalUnits: number;
	capacityUtilization: number; // percentage
	monthlySalesVolume: number;
	pendingTransfers: number;
	status: 'Active' | 'Maintenance' | 'Near Capacity';
}

export const locationReportMetrics: LocationReportMetric[] = [
	{
		locationId: 'loc_001',
		locationName: 'Kilimani Flagship Showroom',
		type: 'Retail Store',
		city: 'Nairobi',
		totalStockValue: 12400000,
		totalUnits: 450,
		capacityUtilization: 82.0,
		monthlySalesVolume: 8500000,
		pendingTransfers: 3,
		status: 'Active'
	},
	{
		locationId: 'loc_002',
		locationName: 'Industrial Area Central Hub',
		type: 'Central Warehouse',
		city: 'Nairobi',
		totalStockValue: 48500000,
		totalUnits: 3200,
		capacityUtilization: 94.5,
		monthlySalesVolume: 0,
		pendingTransfers: 12,
		status: 'Near Capacity'
	},
	{
		locationId: 'loc_003',
		locationName: 'Westlands Retail Outlet',
		type: 'Retail Store',
		city: 'Nairobi',
		totalStockValue: 8900000,
		totalUnits: 310,
		capacityUtilization: 68.4,
		monthlySalesVolume: 4200000,
		pendingTransfers: 1,
		status: 'Active'
	},
	{
		locationId: 'loc_004',
		locationName: 'Mombasa Road Logistics Center',
		type: 'Central Warehouse',
		city: 'Nairobi',
		totalStockValue: 29000000,
		totalUnits: 1850,
		capacityUtilization: 55.0,
		monthlySalesVolume: 0,
		pendingTransfers: 4,
		status: 'Active'
	},
	{
		locationId: 'loc_005',
		locationName: 'Nyali Coastal Branch',
		type: 'Retail Store',
		city: 'Mombasa',
		totalStockValue: 6200000,
		totalUnits: 210,
		capacityUtilization: 45.0,
		monthlySalesVolume: 2100000,
		pendingTransfers: 0,
		status: 'Maintenance'
	}
];

export const inventoryDistribution = [
	{ name: 'Industrial Area Central Hub', percentage: 46.2, value: 48500000 },
	{ name: 'Mombasa Road Logistics Center', percentage: 27.6, value: 29000000 },
	{ name: 'Kilimani Flagship Showroom', percentage: 11.8, value: 12400000 },
	{ name: 'Westlands Retail Outlet', percentage: 8.5, value: 8900000 },
	{ name: 'Nyali Coastal Branch', percentage: 5.9, value: 6200000 }
];
