// $lib/data/reports/productReports.data.ts

export interface ProductReportMetric {
	productId: string;
	productName: string;
	sku: string;
	category: string;
	unitsSold: number;
	totalRevenue: number;
	profitMargin: number; // percentage
	currentStock: number;
	turnoverRate: number; // times per month
	stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export const productReportMetrics: ProductReportMetric[] = [
	{
		productId: 'prod_001',
		productName: 'Mara Hand-Carved Teak Coffee Table',
		sku: 'FUR-TBL-001',
		category: 'Living Room',
		unitsSold: 42,
		totalRevenue: 1764000,
		profitMargin: 57.1,
		currentStock: 14,
		turnoverRate: 3.0,
		stockStatus: 'In Stock'
	},
	{
		productId: 'prod_002',
		productName: 'Nairobi Leather Executive Chair',
		sku: 'FUR-CHR-004',
		category: 'Office',
		unitsSold: 88,
		totalRevenue: 2816000,
		profitMargin: 45.0,
		currentStock: 5,
		turnoverRate: 5.2,
		stockStatus: 'Low Stock'
	},
	{
		productId: 'prod_003',
		productName: 'Savannah Acacia Dining Table (6 Seater)',
		sku: 'FUR-TBL-009',
		category: 'Dining',
		unitsSold: 19,
		totalRevenue: 1425000,
		profitMargin: 48.3,
		currentStock: 8,
		turnoverRate: 1.8,
		stockStatus: 'In Stock'
	},
	{
		productId: 'prod_004',
		productName: 'Rift Valley Handwoven Wool Rug (8x10)',
		sku: 'DEC-RUG-002',
		category: 'Decor & Textiles',
		unitsSold: 115,
		totalRevenue: 1840000,
		profitMargin: 62.5,
		currentStock: 0,
		turnoverRate: 7.6,
		stockStatus: 'Out of Stock'
	},
	{
		productId: 'prod_005',
		productName: 'Kilifi Teak Outdoor Sun Lounger',
		sku: 'OUT-LNG-001',
		category: 'Outdoor',
		unitsSold: 34,
		totalRevenue: 952000,
		profitMargin: 39.5,
		currentStock: 22,
		turnoverRate: 2.1,
		stockStatus: 'In Stock'
	}
];

export const categoryPerformance = [
	{ category: 'Living Room', revenue: 4200000, percentage: 35.5, itemsSold: 124 },
	{ category: 'Office', revenue: 3100000, percentage: 26.2, itemsSold: 142 },
	{ category: 'Dining', revenue: 2400000, percentage: 20.3, itemsSold: 68 },
	{ category: 'Decor & Textiles', revenue: 1400000, percentage: 11.8, itemsSold: 189 },
	{ category: 'Outdoor', revenue: 737000, percentage: 6.2, itemsSold: 45 }
];
