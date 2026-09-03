import type { Sale } from '$lib/services/sales/sales.types';

export const salesData: Sale[] = [
	{
		_id: '66d01a11a1d4c8001a2b0001',
		receiptNumber: 'REC-2026-0101',
		customer: { name: 'John Kamau', phone: '+254712345678', email: 'john.k@gmail.com' },
		items: [
			{
				productId: '66b3f1e2a1d4c8001a2b3c4d',
				productName: 'Nordic Velvet Armchair',
				image: ['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c'],
				category: 'Furniture',
				colour: 'Navy Blue',
				description: 'Mid-century velvet lounge armchair.',
				code: 'FUR-001',
				sku: 'FUR-ARM-001',
				sellingPrice: 35000,
				costPrice: 22000,
				netProfit: 13000,
				netLoss: 0,
				quantity: 2,
				shop: {
					_id: 'shp-002',
					shopCode: 'SHP-NRB-002',
					name: 'CBD City Retail Hub',
					type: 'Retail Store',
					status: 'Active',
					address: {
						building: 'Kenyatta Avenue Plaza, Suite 4',
						town: 'Nairobi'
					},
					inventorySummary: {
						totalProducts: 5,
						totalItemsInStock: 44,
						totalStockValue: 539400,
						lowStockItemsCount: 1
					},
					notes:
						'Fast-moving urban storefront geared towards lighting, decor, and compact seating.',
					createdAt: '2025-03-01T09:00:00Z',
					updatedAt: '2026-08-10T11:00:00Z'
				},
				discount: 0,
				totalPrice: 70000
			}
		],
		subTotal: 70000,
		discountTotal: 0,
		grandTotal: 70000,
		dateOfSale: '2026-08-20',
		paymentMethod: 'M-Pesa',
		paymentStatus: 'Paid',
		status: 'Completed',
		saleperson: {
			_id: '66c01a9f1b2c3d001a100101',
			firstName: 'Kelvin',
			lastName: 'Kiprono',
			status: 'Active',
			assignedShop: {
				_id: '66a12b8f3c4d5e001f200101',
				shopCode: 'SHP-NRB-001',
				name: 'Kilimani Flagship Showroom',
				type: 'Showroom',
				status: 'Active',
				address: {
					building: 'Argwings Arcade, 2nd Floor',
					town: 'Nairobi'
				},
				inventoryItems: [],
				createdAt: '2025-01-10T08:00:00.000Z',
				updatedAt: '2026-08-01T10:30:00.000Z'
			},
			totalCommission: 145200,
			hireDate: '2024-03-15',
			createdAt: '2024-03-15T09:00:00.000Z',
			updatedAt: '2026-08-25T14:20:00.000Z'
		},
		commission: 7000,
		createdAt: '2026-02-20T09:15:00.000Z',
		updatedAt: '2026-02-15T09:15:00.000Z'
	},
	{
		_id: '66d01a11a1d4c8001a2b0002',
		receiptNumber: 'REC-2026-0102',
		customer: { name: 'Amina Mohamed', phone: '+254722987654' },
		items: [
			{
				productId: '66b3f1e2a1d4c8001a2b3c4e',
				productName: 'Minimalist Coffee Table',
				image: ['https://images.unsplash.com/photo-1532372576444-dda954194ad0'],
				category: 'Furniture',
				colour: 'Natural Oak',
				description: 'Solid oak center table with rounded edges.',
				code: 'FUR-004',
				sku: 'FUR-TBL-004',
				sellingPrice: 15000,
				costPrice: 9000,
				netProfit: 6000,
				netLoss: 0,
				quantity: 1,
				shop: {
					_id: 'shp-003',
					shopCode: 'SHP-MSA-001',
					name: 'Nyali Beach Showroom',
					type: 'Showroom',
					status: 'Active',
					address: {
						building: 'City Mall Nyali, Ground Floor',
						town: 'Mombasa'
					},
					inventorySummary: {
						totalProducts: 4,
						totalItemsInStock: 22,
						totalStockValue: 566500,
						lowStockItemsCount: 0
					},
					notes:
						'Coastal branch showcasing Swahili design aesthetics, outdoor planters, and resort-style furniture.',
					createdAt: '2025-06-10T14:20:00Z',
					updatedAt: '2026-08-15T16:45:00Z'
				},
				discount: 1000,
				totalPrice: 14000
			}
		],
		subTotal: 15000,
		discountTotal: 1000,
		grandTotal: 14000,
		dateOfSale: '2026-08-21',
		paymentMethod: 'M-Pesa',
		paymentStatus: 'Paid',
		status: 'Completed',
		saleperson: {
			_id: '66c01a9f1b2c3d001a100101',
			firstName: 'Kelvin',
			lastName: 'Kiprono',
			status: 'Active',
			assignedShop: {
				_id: '66a12b8f3c4d5e001f200101',
				shopCode: 'SHP-NRB-001',
				name: 'Kilimani Flagship Showroom',
				type: 'Showroom',
				status: 'Active',
				address: {
					building: 'Argwings Arcade, 2nd Floor',
					town: 'Nairobi'
				},
				inventoryItems: [],
				createdAt: '2025-01-10T08:00:00.000Z',
				updatedAt: '2026-08-01T10:30:00.000Z'
			},
			totalCommission: 145200,
			hireDate: '2024-03-15',
			createdAt: '2024-03-15T09:00:00.000Z',
			updatedAt: '2026-08-25T14:20:00.000Z'
		},
		commission: 1400,
		createdAt: '2026-02-15T10:30:00.000Z',
		updatedAt: '2026-02-15T10:30:00.000Z'
	},
	{
		_id: '66d01a11a1d4c8001a2b0003',
		receiptNumber: 'REC-2026-0103',
		customer: { name: 'Walk-in Customer' },
		items: [
			{
				productId: '66b3f1e2a1d4c8001a2b3c4f',
				productName: 'Ergonomic Mesh Desk Chair',
				image: ['https://images.unsplash.com/photo-1580481072645-022f9a6d1270'],
				category: 'Office',
				colour: 'Black',
				description: 'Adjustable lumbar support task chair.',
				code: 'OFF-012',
				sku: 'OFF-CHR-012',
				sellingPrice: 22000,
				costPrice: 14000,
				netProfit: 8000,
				netLoss: 0,
				quantity: 1,
				shop: {
					_id: 'shp-003',
					shopCode: 'SHP-MSA-001',
					name: 'Nyali Beach Showroom',
					type: 'Showroom',
					status: 'Active',
					address: {
						building: 'City Mall Nyali, Ground Floor',
						town: 'Mombasa'
					},
					inventorySummary: {
						totalProducts: 4,
						totalItemsInStock: 22,
						totalStockValue: 566500,
						lowStockItemsCount: 0
					},
					notes:
						'Coastal branch showcasing Swahili design aesthetics, outdoor planters, and resort-style furniture.',
					createdAt: '2025-06-10T14:20:00Z',
					updatedAt: '2026-08-15T16:45:00Z'
				},
				discount: 0,
				totalPrice: 22000
			}
		],
		subTotal: 22000,
		discountTotal: 0,
		grandTotal: 22000,
		dateOfSale: '2026-02-15',
		paymentMethod: 'Cash',
		paymentStatus: 'Paid',
		status: 'Completed',
		saleperson: {
			_id: '66c01a9f1b2c3d001a100101',
			firstName: 'Kelvin',
			lastName: 'Kiprono',
			status: 'Active',
			assignedShop: {
				_id: '66a12b8f3c4d5e001f200101',
				shopCode: 'SHP-NRB-001',
				name: 'Kilimani Flagship Showroom',
				type: 'Showroom',
				status: 'Active',
				address: {
					building: 'Argwings Arcade, 2nd Floor',
					town: 'Nairobi'
				},
				inventoryItems: [],
				createdAt: '2025-01-10T08:00:00.000Z',
				updatedAt: '2026-08-01T10:30:00.000Z'
			},
			totalCommission: 145200,
			hireDate: '2024-03-15',
			createdAt: '2024-03-15T09:00:00.000Z',
			updatedAt: '2026-08-25T14:20:00.000Z'
		},
		commission: 2200,
		createdAt: '2026-02-15T11:45:00.000Z',
		updatedAt: '2026-02-15T11:45:00.000Z'
	},
	{
		_id: '66d01a11a1d4c8001a2b0004',
		receiptNumber: 'REC-2026-0104',
		customer: { name: 'Apex Ltd', email: 'procurement@apex.co.ke' },
		items: [
			{
				productId: '66b3f1e2a1d4c8001a2b3c4f',
				productName: 'Ergonomic Mesh Desk Chair',
				image: ['https://images.unsplash.com/photo-1580481072645-022f9a6d1270'],
				category: 'Office',
				colour: 'Black',
				description: 'Adjustable lumbar support task chair.',
				code: 'OFF-012',
				sku: 'OFF-CHR-012',
				sellingPrice: 22000,
				costPrice: 14000,
				netProfit: 8000,
				netLoss: 0,
				quantity: 5,
				shop: {
					_id: 'shp-001',
					shopCode: 'SHP-NRB-001',
					name: 'Westlands Flagship Showroom',
					type: 'Showroom',
					status: 'Active',
					address: {
						building: 'Sarit Centre, 2nd Floor',
						town: 'Nairobi'
					},
					inventorySummary: {
						totalProducts: 6,
						totalItemsInStock: 22,
						totalStockValue: 1253400,
						lowStockItemsCount: 2
					},
					notes: 'Primary retail location for premium walk-ins and high-end furniture displays.',
					createdAt: '2025-01-15T08:00:00Z',
					updatedAt: '2026-08-01T10:30:00Z'
				},
				discount: 5000,
				totalPrice: 105000
			}
		],
		subTotal: 110000,
		discountTotal: 5000,
		grandTotal: 105000,
		dateOfSale: '2026-02-16',
		paymentMethod: 'Bank Transfer',
		paymentStatus: 'Partially Paid',
		status: 'Processing',
		saleperson: {
			_id: '66c01a9f1b2c3d001a100102',
			firstName: 'Mercy',
			lastName: 'Wanjiku',
			status: 'Active',
			assignedShop: {
				_id: '66a12b8f3c4d5e001f200101',
				shopCode: 'SHP-NRB-001',
				name: 'Kilimani Flagship Showroom',
				type: 'Showroom',
				status: 'Active',
				address: {
					building: 'Argwings Arcade, 2nd Floor',
					town: 'Nairobi'
				},
				inventoryItems: [],
				createdAt: '2025-01-10T08:00:00.000Z',
				updatedAt: '2026-08-01T10:30:00.000Z'
			},
			totalCommission: 210800,
			hireDate: '2023-11-01',
			createdAt: '2023-11-01T08:30:00.000Z',
			updatedAt: '2026-08-26T11:15:00.000Z'
		},
		commission: 10500,
		notes: '50% deposit paid via cheque. Delivery pending.',
		createdAt: '2026-02-16T08:20:00.000Z',
		updatedAt: '2026-02-16T08:20:00.000Z'
	},
	{
		_id: '66d01a11a1d4c8001a2b0005',
		receiptNumber: 'REC-2026-0105',
		customer: { name: 'Grace Wambui', phone: '+254700112233' },
		items: [
			{
				productId: '66b3f1e2a1d4c8001a2b3c50',
				productName: 'Ceramic Table Lamp',
				image: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c'],
				category: 'Lighting',
				colour: 'Terracotta',
				description: 'Handmade ceramic base with linen shade.',
				code: 'LGT-002',
				sku: 'LGT-LMP-002',
				sellingPrice: 5500,
				costPrice: 2800,
				netProfit: 2700,
				netLoss: 0,
				quantity: 2,
				shop: {
					_id: 'shp-002',
					shopCode: 'SHP-NRB-002',
					name: 'CBD City Retail Hub',
					type: 'Retail Store',
					status: 'Active',
					address: {
						building: 'Kenyatta Avenue Plaza, Suite 4',
						town: 'Nairobi'
					},
					inventorySummary: {
						totalProducts: 5,
						totalItemsInStock: 44,
						totalStockValue: 539400,
						lowStockItemsCount: 1
					},
					notes:
						'Fast-moving urban storefront geared towards lighting, decor, and compact seating.',
					createdAt: '2025-03-01T09:00:00Z',
					updatedAt: '2026-08-10T11:00:00Z'
				},
				discount: 0,
				totalPrice: 11000
			}
		],
		subTotal: 11000,
		discountTotal: 0,
		grandTotal: 11000,
		dateOfSale: '2026-02-16',
		paymentMethod: 'Credit Card',
		paymentStatus: 'Paid',
		status: 'Completed',
		saleperson: {
			_id: '66c01a9f1b2c3d001a100102',
			firstName: 'Mercy',
			lastName: 'Wanjiku',
			status: 'Active',
			assignedShop: {
				_id: '66a12b8f3c4d5e001f200101',
				shopCode: 'SHP-NRB-001',
				name: 'Kilimani Flagship Showroom',
				type: 'Showroom',
				status: 'Active',
				address: {
					building: 'Argwings Arcade, 2nd Floor',
					town: 'Nairobi'
				},
				inventoryItems: [],
				createdAt: '2025-01-10T08:00:00.000Z',
				updatedAt: '2026-08-01T10:30:00.000Z'
			},
			totalCommission: 210800,
			hireDate: '2023-11-01',
			createdAt: '2023-11-01T08:30:00.000Z',
			updatedAt: '2026-08-26T11:15:00.000Z'
		},
		commission: 1100,
		createdAt: '2026-02-16T12:10:00.000Z',
		updatedAt: '2026-02-16T12:10:00.000Z'
	},
	{
		_id: '66d01a11a1d4c8001a2b0006',
		receiptNumber: 'REC-2026-0106',
		customer: { name: 'Walk-in Customer' },
		items: [
			{
				productId: '66b3f1e2a1d4c8001a2b3c51',
				productName: 'Oak Wood Bookshelf',
				image: ['https://images.unsplash.com/photo-1594620302200-9a762244a156'],
				category: 'Furniture',
				colour: 'Natural Wood',
				description: '5-tier open shelf storage display.',
				code: 'FUR-009',
				sku: 'FUR-SHLF-009',
				sellingPrice: 32000,
				costPrice: 19000,
				netProfit: 13000,
				netLoss: 0,
				quantity: 1,
				shop: {
					_id: 'shp-001',
					shopCode: 'SHP-NRB-001',
					name: 'Westlands Flagship Showroom',
					type: 'Showroom',
					status: 'Active',
					address: {
						building: 'Sarit Centre, 2nd Floor',
						town: 'Nairobi'
					},
					inventorySummary: {
						totalProducts: 6,
						totalItemsInStock: 22,
						totalStockValue: 1253400,
						lowStockItemsCount: 2
					},
					notes: 'Primary retail location for premium walk-ins and high-end furniture displays.',
					createdAt: '2025-01-15T08:00:00Z',
					updatedAt: '2026-08-01T10:30:00Z'
				},
				discount: 0,
				totalPrice: 32000
			}
		],
		subTotal: 32000,
		discountTotal: 0,
		grandTotal: 32000,
		dateOfSale: '2026-02-16',
		paymentMethod: 'M-Pesa',
		paymentStatus: 'Paid',
		status: 'Completed',
		saleperson: {
			_id: '66c01a9f1b2c3d001a100103',
			firstName: 'Brian',
			lastName: 'Ochieng',
			status: 'Active',
			assignedShop: {
				_id: '66a12b8f3c4d5e001f200102',
				shopCode: 'SHP-NRB-002',
				name: 'Westlands Retail Outlet',
				type: 'Retail Store',
				status: 'Active',
				address: {
					building: 'Sarit Centre, Ground Floor',
					town: 'Nairobi'
				},
				inventoryItems: [],
				createdAt: '2025-02-01T08:00:00.000Z',
				updatedAt: '2026-07-20T09:00:00.000Z'
			},
			totalCommission: 98500,
			hireDate: '2025-01-15',
			createdAt: '2025-01-15T07:45:00.000Z',
			updatedAt: '2026-08-24T16:50:00.000Z'
		},
		commission: 3200,
		createdAt: '2026-02-16T14:50:00.000Z',
		updatedAt: '2026-02-16T14:50:00.000Z'
	},
	{
		_id: '66d01a11a1d4c8001a2b0007',
		receiptNumber: 'REC-2026-0107',
		customer: { name: 'Kevin Otieno', phone: '+254733445566' },
		items: [
			{
				productId: '66b3f1e2a1d4c8001a2b3c4d',
				productName: 'Nordic Velvet Armchair',
				image: ['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c'],
				category: 'Furniture',
				colour: 'Navy Blue',
				description: 'Mid-century velvet lounge armchair.',
				code: 'FUR-001',
				sku: 'FUR-ARM-001',
				sellingPrice: 35000,
				costPrice: 22000,
				netProfit: 11000,
				netLoss: 0,
				quantity: 1,
				shop: {
					_id: 'shp-001',
					shopCode: 'SHP-NRB-001',
					name: 'Westlands Flagship Showroom',
					type: 'Showroom',
					status: 'Active',
					address: {
						building: 'Sarit Centre, 2nd Floor',
						town: 'Nairobi'
					},
					inventorySummary: {
						totalProducts: 6,
						totalItemsInStock: 22,
						totalStockValue: 1253400,
						lowStockItemsCount: 2
					},
					notes: 'Primary retail location for premium walk-ins and high-end furniture displays.',
					createdAt: '2025-01-15T08:00:00Z',
					updatedAt: '2026-08-01T10:30:00Z'
				},
				discount: 0,
				totalPrice: 35000
			}
		],
		subTotal: 35000,
		discountTotal: 0,
		grandTotal: 35000,
		dateOfSale: '2026-02-17',
		paymentMethod: 'Credit Card',
		paymentStatus: 'Partially Paid',
		status: 'Returned',
		saleperson: {
			_id: '66c01a9f1b2c3d001a100103',
			firstName: 'Brian',
			lastName: 'Ochieng',
			status: 'Active',
			assignedShop: {
				_id: '66a12b8f3c4d5e001f200102',
				shopCode: 'SHP-NRB-002',
				name: 'Westlands Retail Outlet',
				type: 'Retail Store',
				status: 'Active',
				address: {
					building: 'Sarit Centre, Ground Floor',
					town: 'Nairobi'
				},
				inventoryItems: [],
				createdAt: '2025-02-01T08:00:00.000Z',
				updatedAt: '2026-07-20T09:00:00.000Z'
			},
			totalCommission: 98500,
			hireDate: '2025-01-15',
			createdAt: '2025-01-15T07:45:00.000Z',
			updatedAt: '2026-08-24T16:50:00.000Z'
		},
		commission: 3500,
		notes: 'Customer returned item due to color mismatch.',
		createdAt: '2026-02-17T09:00:00.000Z',
		updatedAt: '2026-02-17T15:30:00.000Z'
	},
	{
		_id: '66d01a11a1d4c8001a2b0008',
		receiptNumber: 'REC-2026-0108',
		customer: { name: 'Walk-in Customer' },
		items: [
			{
				productId: '66b3f1e2a1d4c8001a2b3c52',
				productName: 'Linen Throw Pillow',
				image: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2'],
				category: 'Decor',
				colour: 'Beige',
				description: 'Soft textured throw pillow insert included.',
				code: 'DEC-033',
				sku: 'DEC-PLW-033',
				sellingPrice: 3000,
				costPrice: 1200,
				netProfit: 1800,
				netLoss: 0,
				quantity: 4,
				shop: {
					_id: 'shp-002',
					shopCode: 'SHP-NRB-002',
					name: 'CBD City Retail Hub',
					type: 'Retail Store',
					status: 'Active',
					address: {
						building: 'Kenyatta Avenue Plaza, Suite 4',
						town: 'Nairobi'
					},
					inventorySummary: {
						totalProducts: 5,
						totalItemsInStock: 44,
						totalStockValue: 539400,
						lowStockItemsCount: 1
					},
					notes:
						'Fast-moving urban storefront geared towards lighting, decor, and compact seating.',
					createdAt: '2025-03-01T09:00:00Z',
					updatedAt: '2026-08-10T11:00:00Z'
				},
				discount: 1000,
				totalPrice: 11000
			}
		],
		subTotal: 12000,
		discountTotal: 1000,
		grandTotal: 11000,
		dateOfSale: '2026-02-17',
		paymentMethod: 'Cash',
		paymentStatus: 'Paid',
		status: 'Completed',
		saleperson: {
			_id: '66c01a9f1b2c3d001a100104',
			firstName: 'Faith',
			lastName: 'Achieng',
			status: 'Active',
			assignedShop: {
				_id: '66a12b8f3c4d5e001f200102',
				shopCode: 'SHP-NRB-002',
				name: 'Westlands Retail Outlet',
				type: 'Retail Store',
				status: 'Active',
				address: {
					building: 'Sarit Centre, Ground Floor',
					town: 'Nairobi'
				},
				inventoryItems: [],
				createdAt: '2025-02-01T08:00:00.000Z',
				updatedAt: '2026-07-20T09:00:00.000Z'
			},
			totalCommission: 175400,
			hireDate: '2024-06-01',
			createdAt: '2024-06-01T09:15:00.000Z',
			updatedAt: '2026-08-25T18:05:00.000Z'
		},
		commission: 1100,
		createdAt: '2026-02-17T11:15:00.000Z',
		updatedAt: '2026-02-17T11:15:00.000Z'
	},
	{
		_id: '66d01a11a1d4c8001a2b0009',
		receiptNumber: 'REC-2026-0109',
		customer: { name: 'Lucy Njeri', phone: '+254711998877' },
		items: [
			{
				productId: '66b3f1e2a1d4c8001a2b3c53',
				productName: 'Modular 3-Seater Sofa',
				image: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc'],
				category: 'Furniture',
				colour: 'Charcoal Grey',
				description: 'L-shaped sectional couch with high-density foam.',
				code: 'FUR-005',
				sku: 'FUR-SOF-005',
				sellingPrice: 60000,
				costPrice: 95000,
				netProfit: 0,
				netLoss: 35000,
				quantity: 1,
				shop: {
					_id: 'shp-001',
					shopCode: 'SHP-NRB-001',
					name: 'Westlands Flagship Showroom',
					type: 'Showroom',
					status: 'Active',
					address: {
						building: 'Sarit Centre, 2nd Floor',
						town: 'Nairobi'
					},
					inventorySummary: {
						totalProducts: 6,
						totalItemsInStock: 22,
						totalStockValue: 1253400,
						lowStockItemsCount: 2
					},
					notes: 'Primary retail location for premium walk-ins and high-end furniture displays.',
					createdAt: '2025-01-15T08:00:00Z',
					updatedAt: '2026-08-01T10:30:00Z'
				},
				discount: 5000,
				totalPrice: 90000
			}
		],
		subTotal: 95000,
		discountTotal: 5000,
		grandTotal: 90000,
		dateOfSale: '2026-02-17',
		paymentMethod: 'M-Pesa',
		paymentStatus: 'Paid',
		status: 'Completed',
		saleperson: {
			_id: '66c01a9f1b2c3d001a100104',
			firstName: 'Faith',
			lastName: 'Achieng',
			status: 'Active',
			assignedShop: {
				_id: '66a12b8f3c4d5e001f200102',
				shopCode: 'SHP-NRB-002',
				name: 'Westlands Retail Outlet',
				type: 'Retail Store',
				status: 'Active',
				address: {
					building: 'Sarit Centre, Ground Floor',
					town: 'Nairobi'
				},
				inventoryItems: [],
				createdAt: '2025-02-01T08:00:00.000Z',
				updatedAt: '2026-07-20T09:00:00.000Z'
			},
			totalCommission: 175400,
			hireDate: '2024-06-01',
			createdAt: '2024-06-01T09:15:00.000Z',
			updatedAt: '2026-08-25T18:05:00.000Z'
		},
		commission: 9000,
		createdAt: '2026-02-17T16:00:00.000Z',
		updatedAt: '2026-02-17T16:00:00.000Z'
	},
	{
		_id: '66d01a11a1d4c8001a2b0010',
		receiptNumber: 'REC-2026-0110',
		customer: { name: 'Walk-in Customer' },
		items: [
			{
				productId: '66b3f1e2a1d4c8001a2b3c50',
				productName: 'Ceramic Table Lamp',
				image: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c'],
				category: 'Lighting',
				colour: 'Terracotta',
				description: 'Handmade ceramic base with linen shade.',
				code: 'LGT-002',
				sku: 'LGT-LMP-002',
				sellingPrice: 2400,
				costPrice: 2800,
				netProfit: 0,
				netLoss: 400,
				quantity: 1,
				shop: {
					_id: 'shp-003',
					shopCode: 'SHP-MSA-001',
					name: 'Nyali Beach Showroom',
					type: 'Showroom',
					status: 'Active',
					address: {
						building: 'City Mall Nyali, Ground Floor',
						town: 'Mombasa'
					},
					inventorySummary: {
						totalProducts: 4,
						totalItemsInStock: 22,
						totalStockValue: 566500,
						lowStockItemsCount: 0
					},
					notes:
						'Coastal branch showcasing Swahili design aesthetics, outdoor planters, and resort-style furniture.',
					createdAt: '2025-06-10T14:20:00Z',
					updatedAt: '2026-08-15T16:45:00Z'
				},
				discount: 0,
				totalPrice: 5500
			}
		],
		subTotal: 5500,
		discountTotal: 0,
		grandTotal: 5500,
		dateOfSale: '2026-02-18',
		paymentMethod: 'Cash',
		paymentStatus: 'Paid',
		status: 'Completed',
		saleperson: {
			_id: '66c01a9f1b2c3d001a100105',
			firstName: 'David',
			lastName: 'Mutua',
			status: 'Active',
			assignedShop: {
				_id: '66a12b8f3c4d5e001f200103',
				shopCode: 'SHP-MBA-001',
				name: 'Nyali Coastal Branch',
				type: 'Retail Store',
				status: 'Under Maintenance',
				address: {
					building: 'City Mall Nyali',
					town: 'Mombasa'
				},
				inventoryItems: [],
				createdAt: '2025-04-12T08:00:00.000Z',
				updatedAt: '2026-08-10T12:00:00.000Z'
			},
			totalCommission: 82000,
			hireDate: '2025-03-01',
			createdAt: '2025-03-01T08:00:00.000Z',
			updatedAt: '2026-08-20T10:10:00.000Z'
		},
		commission: 0,
		createdAt: '2026-02-18T08:45:00.000Z',
		updatedAt: '2026-02-18T08:45:00.000Z'
	},
	{
		_id: '66d01a11a1d4c8001a2b0011',
		receiptNumber: 'REC-2026-0111',
		customer: { name: 'Brian Kiprop', email: 'brian.k@outlook.com' },
		items: [
			{
				productId: '66b3f1e2a1d4c8001a2b3c54',
				productName: 'Walnut Dining Table',
				image: ['https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf'],
				category: 'Furniture',
				colour: 'Dark Walnut',
				description: '6-seater solid timber dining table.',
				code: 'FUR-002',
				sku: 'FUR-DNG-002',
				sellingPrice: 70000,
				costPrice: 42000,
				netProfit: 28000,
				netLoss: 0,
				quantity: 1,
				shop: {
					_id: 'shp-001',
					shopCode: 'SHP-NRB-001',
					name: 'Westlands Flagship Showroom',
					type: 'Showroom',
					status: 'Active',
					address: {
						building: 'Sarit Centre, 2nd Floor',
						town: 'Nairobi'
					},
					inventorySummary: {
						totalProducts: 6,
						totalItemsInStock: 22,
						totalStockValue: 1253400,
						lowStockItemsCount: 2
					},
					notes: 'Primary retail location for premium walk-ins and high-end furniture displays.',
					createdAt: '2025-01-15T08:00:00Z',
					updatedAt: '2026-08-01T10:30:00Z'
				},
				discount: 0,
				totalPrice: 70000
			},
			{
				productId: '66b3f1e2a1d4c8001a2b3c55',
				productName: 'Dining Chairs Set of 4',
				image: ['https://images.unsplash.com/photo-1503602642458-232111445657'],
				category: 'Furniture',
				colour: 'Dark Walnut',
				description: 'Upholstered seat dining chairs.',
				code: 'FUR-003',
				sku: 'FUR-DNG-003',
				sellingPrice: 15000,
				costPrice: 20000,
				netProfit: 0,
				netLoss: 5000,
				quantity: 1,
				shop: {
					_id: 'shp-002',
					shopCode: 'SHP-NRB-002',
					name: 'CBD City Retail Hub',
					type: 'Retail Store',
					status: 'Active',
					address: {
						building: 'Kenyatta Avenue Plaza, Suite 4',
						town: 'Nairobi'
					},
					inventorySummary: {
						totalProducts: 5,
						totalItemsInStock: 44,
						totalStockValue: 539400,
						lowStockItemsCount: 1
					},
					notes:
						'Fast-moving urban storefront geared towards lighting, decor, and compact seating.',
					createdAt: '2025-03-01T09:00:00Z',
					updatedAt: '2026-08-10T11:00:00Z'
				},
				discount: 2000,
				totalPrice: 33000
			}
		],
		subTotal: 105000,
		discountTotal: 2000,
		grandTotal: 103000,
		dateOfSale: '2026-02-18',
		paymentMethod: 'Credit Card',
		paymentStatus: 'Paid',
		status: 'Completed',
		saleperson: {
			_id: '66c01a9f1b2c3d001a100105',
			firstName: 'David',
			lastName: 'Mutua',
			status: 'Active',
			assignedShop: {
				_id: '66a12b8f3c4d5e001f200103',
				shopCode: 'SHP-MBA-001',
				name: 'Nyali Coastal Branch',
				type: 'Retail Store',
				status: 'Under Maintenance',
				address: {
					building: 'City Mall Nyali',
					town: 'Mombasa'
				},
				inventoryItems: [],
				createdAt: '2025-04-12T08:00:00.000Z',
				updatedAt: '2026-08-10T12:00:00.000Z'
			},
			totalCommission: 82000,
			hireDate: '2025-03-01',
			createdAt: '2025-03-01T08:00:00.000Z',
			updatedAt: '2026-08-20T10:10:00.000Z'
		},
		commission: 10300,
		createdAt: '2026-02-18T10:10:00.000Z',
		updatedAt: '2026-02-18T10:10:00.000Z'
	},
	{
		_id: '66d01a11a1d4c8001a2b0012',
		receiptNumber: 'REC-2026-0112',
		customer: { name: 'Walk-in Customer' },
		items: [
			{
				productId: '66b3f1e2a1d4c8001a2b3c52',
				productName: 'Linen Throw Pillow',
				image: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2'],
				category: 'Decor',
				colour: 'Beige',
				description: 'Soft textured throw pillow insert included.',
				code: 'DEC-033',
				sku: 'DEC-PLW-033',
				sellingPrice: 3000,
				costPrice: 1200,
				netProfit: 1800,
				netLoss: 0,
				quantity: 2,
				shop: {
					_id: 'shp-002',
					shopCode: 'SHP-NRB-002',
					name: 'CBD City Retail Hub',
					type: 'Retail Store',
					status: 'Active',
					address: {
						building: 'Kenyatta Avenue Plaza, Suite 4',
						town: 'Nairobi'
					},
					inventorySummary: {
						totalProducts: 5,
						totalItemsInStock: 44,
						totalStockValue: 539400,
						lowStockItemsCount: 1
					},
					notes:
						'Fast-moving urban storefront geared towards lighting, decor, and compact seating.',
					createdAt: '2025-03-01T09:00:00Z',
					updatedAt: '2026-08-10T11:00:00Z'
				},
				discount: 0,
				totalPrice: 6000
			}
		],
		subTotal: 6000,
		discountTotal: 0,
		grandTotal: 6000,
		dateOfSale: '2026-02-18',
		paymentMethod: 'M-Pesa',
		paymentStatus: 'Pending',
		status: 'Cancelled',
		saleperson: {
			_id: '66c01a9f1b2c3d001a100106',
			firstName: 'Esther',
			lastName: 'Nanjala',
			status: 'Inactive',
			assignedShop: {
				_id: '66a12b8f3c4d5e001f200103',
				shopCode: 'SHP-MBA-001',
				name: 'Nyali Coastal Branch',
				type: 'Retail Store',
				status: 'Under Maintenance',
				address: {
					building: 'City Mall Nyali',
					town: 'Mombasa'
				},
				inventoryItems: [],
				createdAt: '2025-04-12T08:00:00.000Z',
				updatedAt: '2026-08-10T12:00:00.000Z'
			},
			totalCommission: 45000,
			hireDate: '2024-09-10',
			createdAt: '2024-09-10T07:30:00.000Z',
			updatedAt: '2026-07-01T09:00:00.000Z'
		},
		commission: 0,
		notes: 'Transaction timed out during STK push.',
		createdAt: '2026-02-18T13:20:00.000Z',
		updatedAt: '2026-02-18T13:25:00.000Z'
	},
	{
		_id: '66d01a11a1d4c8001a2b0013',
		receiptNumber: 'REC-2026-0113',
		customer: { name: 'Faith Chebet', phone: '+254720123123' },
		items: [
			{
				productId: '66b3f1e2a1d4c8001a2b3c51',
				productName: 'Oak Wood Bookshelf',
				image: ['https://images.unsplash.com/photo-1594620302200-9a762244a156'],
				category: 'Furniture',
				colour: 'Natural Wood',
				description: '5-tier open shelf storage display.',
				code: 'FUR-009',
				sku: 'FUR-SHLF-009',
				sellingPrice: 18000,
				costPrice: 19000,
				netProfit: 0,
				netLoss: 1000,
				quantity: 2,
				shop: {
					_id: 'shp-001',
					shopCode: 'SHP-NRB-001',
					name: 'Westlands Flagship Showroom',
					type: 'Showroom',
					status: 'Active',
					address: {
						building: 'Sarit Centre, 2nd Floor',
						town: 'Nairobi'
					},
					inventorySummary: {
						totalProducts: 6,
						totalItemsInStock: 22,
						totalStockValue: 1253400,
						lowStockItemsCount: 2
					},
					notes: 'Primary retail location for premium walk-ins and high-end furniture displays.',
					createdAt: '2025-01-15T08:00:00Z',
					updatedAt: '2026-08-01T10:30:00Z'
				},
				discount: 4000,
				totalPrice: 60000
			}
		],
		subTotal: 64000,
		discountTotal: 4000,
		grandTotal: 60000,
		dateOfSale: '2026-02-19',
		paymentMethod: 'M-Pesa',
		paymentStatus: 'Paid',
		status: 'Completed',
		saleperson: {
			_id: '66c01a9f1b2c3d001a100106',
			firstName: 'Esther',
			lastName: 'Nanjala',
			status: 'Inactive',
			assignedShop: {
				_id: '66a12b8f3c4d5e001f200103',
				shopCode: 'SHP-MBA-001',
				name: 'Nyali Coastal Branch',
				type: 'Retail Store',
				status: 'Under Maintenance',
				address: {
					building: 'City Mall Nyali',
					town: 'Mombasa'
				},
				inventoryItems: [],
				createdAt: '2025-04-12T08:00:00.000Z',
				updatedAt: '2026-08-10T12:00:00.000Z'
			},
			totalCommission: 45000,
			hireDate: '2024-09-10',
			createdAt: '2024-09-10T07:30:00.000Z',
			updatedAt: '2026-07-01T09:00:00.000Z'
		},
		commission: 6000,
		createdAt: '2026-02-19T09:30:00.000Z',
		updatedAt: '2026-02-19T09:30:00.000Z'
	},
	{
		_id: '66d01a11a1d4c8001a2b0014',
		receiptNumber: 'REC-2026-0114',
		customer: { name: 'Walk-in Customer' },
		items: [
			{
				productId: '66b3f1e2a1d4c8001a2b3c4e',
				productName: 'Minimalist Coffee Table',
				image: ['https://images.unsplash.com/photo-1532372576444-dda954194ad0'],
				category: 'Furniture',
				colour: 'Natural Oak',
				description: 'Solid oak center table with rounded edges.',
				code: 'FUR-004',
				sku: 'FUR-TBL-004',
				sellingPrice: 15000,
				costPrice: 9000,
				netProfit: 6000,
				netLoss: 0,
				quantity: 1,
				shop: {
					_id: 'shp-003',
					shopCode: 'SHP-MSA-001',
					name: 'Nyali Beach Showroom',
					type: 'Showroom',
					status: 'Active',
					address: {
						building: 'City Mall Nyali, Ground Floor',
						town: 'Mombasa'
					},
					inventorySummary: {
						totalProducts: 4,
						totalItemsInStock: 22,
						totalStockValue: 566500,
						lowStockItemsCount: 0
					},
					notes:
						'Coastal branch showcasing Swahili design aesthetics, outdoor planters, and resort-style furniture.',
					createdAt: '2025-06-10T14:20:00Z',
					updatedAt: '2026-08-15T16:45:00Z'
				},
				discount: 0,
				totalPrice: 15000
			}
		],
		subTotal: 15000,
		discountTotal: 0,
		grandTotal: 15000,
		dateOfSale: '2026-02-19',
		paymentMethod: 'Cash',
		paymentStatus: 'Paid',
		status: 'Completed',
		saleperson: {
			_id: '66c01a9f1b2c3d001a100102',
			firstName: 'Mercy',
			lastName: 'Wanjiku',
			status: 'Active',
			assignedShop: {
				_id: '66a12b8f3c4d5e001f200101',
				shopCode: 'SHP-NRB-001',
				name: 'Kilimani Flagship Showroom',
				type: 'Showroom',
				status: 'Active',
				address: {
					building: 'Argwings Arcade, 2nd Floor',
					town: 'Nairobi'
				},
				inventoryItems: [],
				createdAt: '2025-01-10T08:00:00.000Z',
				updatedAt: '2026-08-01T10:30:00.000Z'
			},
			totalCommission: 210800,
			hireDate: '2023-11-01',
			createdAt: '2023-11-01T08:30:00.000Z',
			updatedAt: '2026-08-26T11:15:00.000Z'
		},
		commission: 1500,
		createdAt: '2026-02-19T11:05:00.000Z',
		updatedAt: '2026-02-19T11:05:00.000Z'
	},
	{
		_id: '66d01a11a1d4c8001a2b0015',
		receiptNumber: 'REC-2026-0115',
		customer: { name: 'Samuel Maina', phone: '+254799001122', email: 's.maina@gmail.com' },
		items: [
			{
				productId: '66b3f1e2a1d4c8001a2b3c4d',
				productName: 'Nordic Velvet Armchair',
				image: ['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c'],
				category: 'Furniture',
				colour: 'Navy Blue',
				description: 'Mid-century velvet lounge armchair.',
				code: 'FUR-001',
				sku: 'FUR-ARM-001',
				sellingPrice: 20000,
				costPrice: 22000,
				netProfit: 0,
				netLoss: 2000,
				quantity: 1,
				shop: {
					_id: 'shp-002',
					shopCode: 'SHP-NRB-002',
					name: 'CBD City Retail Hub',
					type: 'Retail Store',
					status: 'Active',
					address: {
						building: 'Kenyatta Avenue Plaza, Suite 4',
						town: 'Nairobi'
					},
					inventorySummary: {
						totalProducts: 5,
						totalItemsInStock: 44,
						totalStockValue: 539400,
						lowStockItemsCount: 1
					},
					notes:
						'Fast-moving urban storefront geared towards lighting, decor, and compact seating.',
					createdAt: '2025-03-01T09:00:00Z',
					updatedAt: '2026-08-10T11:00:00Z'
				},
				discount: 2000,
				totalPrice: 33000
			},
			{
				productId: '66b3f1e2a1d4c8001a2b3c50',
				productName: 'Ceramic Table Lamp',
				image: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c'],
				category: 'Lighting',
				colour: 'Terracotta',
				description: 'Handmade ceramic base with linen shade.',
				code: 'LGT-002',
				sku: 'LGT-LMP-002',
				sellingPrice: 2000,
				costPrice: 2800,
				netProfit: 0,
				netLoss: 800,
				quantity: 1,
				shop: {
					_id: 'shp-001',
					shopCode: 'SHP-NRB-001',
					name: 'Westlands Flagship Showroom',
					type: 'Showroom',
					status: 'Active',
					address: {
						building: 'Sarit Centre, 2nd Floor',
						town: 'Nairobi'
					},
					inventorySummary: {
						totalProducts: 6,
						totalItemsInStock: 22,
						totalStockValue: 1253400,
						lowStockItemsCount: 2
					},
					notes: 'Primary retail location for premium walk-ins and high-end furniture displays.',
					createdAt: '2025-01-15T08:00:00Z',
					updatedAt: '2026-08-01T10:30:00Z'
				},
				discount: 0,
				totalPrice: 5500
			}
		],
		subTotal: 40500,
		discountTotal: 2000,
		grandTotal: 38500,
		dateOfSale: '2026-02-20',
		paymentMethod: 'M-Pesa',
		paymentStatus: 'Paid',
		status: 'Completed',
		saleperson: {
			_id: '66c01a9f1b2c3d001a100107',
			firstName: 'Dennis',
			lastName: 'Kipchumba',
			status: 'Active',
			assignedShop: {
				_id: '66a12b8f3c4d5e001f200104',
				shopCode: 'SHP-ELD-001',
				name: 'Rift Valley Home Depot',
				type: 'Showroom',
				status: 'Active',
				address: {
					building: 'Rupa Mills Complex',
					town: 'Eldoret'
				},
				inventoryItems: [],
				createdAt: '2025-06-01T08:00:00.000Z',
				updatedAt: '2026-08-15T14:00:00.000Z'
			},
			totalCommission: 132600,
			hireDate: '2025-05-15',
			createdAt: '2025-05-15T08:00:00.000Z',
			updatedAt: '2026-08-26T17:30:00.000Z'
		},
		commission: 3850,
		createdAt: '2026-02-20T08:15:00.000Z',
		updatedAt: '2026-02-20T08:15:00.000Z'
	}
];
