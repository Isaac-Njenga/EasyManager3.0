import type { Sale } from '$lib/types/sale.types';

export const salesData: Sale[] = [
	{
		_id: '66d01a11a1d4c8001a2b0001',
		receiptNumber: 'REC-2026-0101',
		customer: { name: 'John Kamau', phone: '+254712345678', email: 'john.k@gmail.com' },
		items: [
			{
				productId: '66b3f1e2a1d4c8001a2b3c4d',
				productName: 'Nordic Velvet Armchair',
				sku: 'FUR-ARM-001',
				unitPrice: 349.99,
				costPrice: 89,
				quantity: 2,
				discount: 0,
				totalPrice: 699.98
			}
		],
		subTotal: 699.98,
		// taxAmount: 111.99,
		discountTotal: 0,
		grandTotal: 811.97,
		paymentMethod: 'M-Pesa',
		paymentStatus: 'Paid',
		status: 'Completed',
		saleperson: 'Sarah Jenkins',
		createdAt: '2026-02-15T09:15:00.000Z',
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
				sku: 'FUR-TBL-004',
				unitPrice: 120.0,
				costPrice: 45,
				quantity: 1,
				discount: 10,
				totalPrice: 110.0
			}
		],
		subTotal: 120.0,
		// taxAmount: 17.6,
		discountTotal: 10,
		grandTotal: 127.6,
		paymentMethod: 'M-Pesa',
		paymentStatus: 'Paid',
		status: 'Completed',
		saleperson: 'David Ochieng',
		createdAt: '2026-02-15T10:30:00.000Z',
		updatedAt: '2026-02-15T10:30:00.000Z'
	},
	{
		_id: '66d01a11a1d4c8001a2b0003',
		receiptNumber: 'REC-2026-0103',
		items: [
			{
				productId: '66b3f1e2a1d4c8001a2b3c4f',
				productName: 'Ergonomic Mesh Desk Chair',
				sku: 'OFF-CHR-012',
				unitPrice: 210.0,
				costPrice: 75,
				quantity: 1,
				discount: 0,
				totalPrice: 210.0
			}
		],
		subTotal: 210.0,
		// taxAmount: 33.6,
		discountTotal: 0,
		grandTotal: 243.6,
		paymentMethod: 'Cash',
		paymentStatus: 'Paid',
		status: 'Completed',
		saleperson: 'Sarah Jenkins',
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
				sku: 'OFF-CHR-012',
				unitPrice: 200.0,
				costPrice: 75,
				quantity: 5,
				discount: 50,
				totalPrice: 950.0
			}
		],
		subTotal: 1000.0,
		// taxAmount: 152.0,
		discountTotal: 50,
		grandTotal: 1102.0,
		paymentMethod: 'Bank Transfer',
		paymentStatus: 'Partially Paid',
		status: 'Processing',
		saleperson: 'David Ochieng',
		notes: '50% deposit paid, remaining due on delivery.',
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
				sku: 'LGT-LMP-002',
				unitPrice: 45.0,
				costPrice: 15,
				quantity: 2,
				discount: 0,
				totalPrice: 90.0
			}
		],
		subTotal: 90.0,
		// taxAmount: 14.4,
		discountTotal: 0,
		grandTotal: 104.4,
		paymentMethod: 'Credit Card',
		paymentStatus: 'Paid',
		status: 'Completed',
		saleperson: 'Sarah Jenkins',
		createdAt: '2026-02-16T12:10:00.000Z',
		updatedAt: '2026-02-16T12:10:00.000Z'
	},
	{
		_id: '66d01a11a1d4c8001a2b0006',
		receiptNumber: 'REC-2026-0106',
		items: [
			{
				productId: '66b3f1e2a1d4c8001a2b3c51',
				productName: 'Oak Wood Bookshelf',
				sku: 'FUR-SHLF-009',
				unitPrice: 280.0,
				costPrice: 110,
				quantity: 1,
				discount: 0,
				totalPrice: 280.0
			}
		],
		subTotal: 280.0,
		// taxAmount: 44.8,
		discountTotal: 0,
		grandTotal: 324.8,
		paymentMethod: 'M-Pesa',
		paymentStatus: 'Paid',
		status: 'Completed',
		saleperson: 'David Ochieng',
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
				sku: 'FUR-ARM-001',
				unitPrice: 349.99,
				costPrice: 89,
				quantity: 1,
				discount: 0,
				totalPrice: 349.99
			}
		],
		subTotal: 349.99,
		// taxAmount: 56.0,
		discountTotal: 0,
		grandTotal: 405.99,
		paymentMethod: 'Credit Card',
		paymentStatus: 'Refunded',
		status: 'Returned',
		saleperson: 'Sarah Jenkins',
		notes: 'Customer returned item due to color mismatch.',
		createdAt: '2026-02-17T09:00:00.000Z',
		updatedAt: '2026-02-17T15:30:00.000Z'
	},
	{
		_id: '66d01a11a1d4c8001a2b0008',
		receiptNumber: 'REC-2026-0108',
		items: [
			{
				productId: '66b3f1e2a1d4c8001a2b3c52',
				productName: 'Linen Throw Pillow',
				sku: 'DEC-PLW-033',
				unitPrice: 25.0,
				costPrice: 8,
				quantity: 4,
				discount: 10,
				totalPrice: 90.0
			}
		],
		subTotal: 100.0,
		// taxAmount: 14.4,
		discountTotal: 10,
		grandTotal: 104.4,
		paymentMethod: 'Cash',
		paymentStatus: 'Paid',
		status: 'Completed',
		saleperson: 'David Ochieng',
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
				sku: 'FUR-SOF-005',
				unitPrice: 899.0,
				costPrice: 400,
				quantity: 1,
				discount: 50,
				totalPrice: 849.0
			}
		],
		subTotal: 899.0,
		// taxAmount: 135.84,
		discountTotal: 50,
		grandTotal: 984.84,
		paymentMethod: 'M-Pesa',
		paymentStatus: 'Paid',
		status: 'Completed',
		saleperson: 'Sarah Jenkins',
		createdAt: '2026-02-17T16:00:00.000Z',
		updatedAt: '2026-02-17T16:00:00.000Z'
	},
	{
		_id: '66d01a11a1d4c8001a2b0010',
		receiptNumber: 'REC-2026-0110',
		items: [
			{
				productId: '66b3f1e2a1d4c8001a2b3c50',
				productName: 'Ceramic Table Lamp',
				sku: 'LGT-LMP-002',
				unitPrice: 45.0,
				costPrice: 15,
				quantity: 1,
				discount: 0,
				totalPrice: 45.0
			}
		],
		subTotal: 45.0,
		// taxAmount: 7.2,
		discountTotal: 0,
		grandTotal: 52.2,
		paymentMethod: 'Cash',
		paymentStatus: 'Paid',
		status: 'Completed',
		saleperson: 'David Ochieng',
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
				sku: 'FUR-DNG-002',
				unitPrice: 650.0,
				costPrice: 280,
				quantity: 1,
				discount: 0,
				totalPrice: 650.0
			},
			{
				productId: '66b3f1e2a1d4c8001a2b3c55',
				productName: 'Dining Chairs Set of 4',
				sku: 'FUR-DNG-003',
				unitPrice: 320.0,
				costPrice: 140,
				quantity: 1,
				discount: 20,
				totalPrice: 300.0
			}
		],
		subTotal: 970.0,
		// taxAmount: 152.0,
		discountTotal: 20,
		grandTotal: 1102.0,
		paymentMethod: 'Credit Card',
		paymentStatus: 'Paid',
		status: 'Completed',
		saleperson: 'Sarah Jenkins',
		createdAt: '2026-02-18T10:10:00.000Z',
		updatedAt: '2026-02-18T10:10:00.000Z'
	},
	{
		_id: '66d01a11a1d4c8001a2b0012',
		receiptNumber: 'REC-2026-0112',
		items: [
			{
				productId: '66b3f1e2a1d4c8001a2b3c52',
				productName: 'Linen Throw Pillow',
				sku: 'DEC-PLW-033',
				unitPrice: 25.0,
				costPrice: 8,
				quantity: 2,
				discount: 0,
				totalPrice: 50.0
			}
		],
		subTotal: 50.0,
		// taxAmount: 8.0,
		discountTotal: 0,
		grandTotal: 58.0,
		paymentMethod: 'M-Pesa',
		paymentStatus: 'Pending',
		status: 'Cancelled',
		saleperson: 'David Ochieng',
		notes: 'M-Pesa payment timed out.',
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
				sku: 'FUR-SHLF-009',
				unitPrice: 280.0,
				costPrice: 110,
				quantity: 2,
				discount: 30,
				totalPrice: 530.0
			}
		],
		subTotal: 560.0,
		// taxAmount: 84.8,
		discountTotal: 30,
		grandTotal: 614.8,
		paymentMethod: 'M-Pesa',
		paymentStatus: 'Paid',
		status: 'Completed',
		saleperson: 'Sarah Jenkins',
		createdAt: '2026-02-19T09:30:00.000Z',
		updatedAt: '2026-02-19T09:30:00.000Z'
	},
	{
		_id: '66d01a11a1d4c8001a2b0014',
		receiptNumber: 'REC-2026-0114',
		items: [
			{
				productId: '66b3f1e2a1d4c8001a2b3c4e',
				productName: 'Minimalist Coffee Table',
				sku: 'FUR-TBL-004',
				unitPrice: 120.0,
				costPrice: 45,
				quantity: 1,
				discount: 0,
				totalPrice: 120.0
			}
		],
		subTotal: 120.0,
		// taxAmount: 19.2,
		discountTotal: 0,
		grandTotal: 139.2,
		paymentMethod: 'Cash',
		paymentStatus: 'Paid',
		status: 'Completed',
		saleperson: 'David Ochieng',
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
				sku: 'FUR-ARM-001',
				unitPrice: 349.99,
				costPrice: 89,
				quantity: 1,
				discount: 15,
				totalPrice: 334.99
			},
			{
				productId: '66b3f1e2a1d4c8001a2b3c50',
				productName: 'Ceramic Table Lamp',
				sku: 'LGT-LMP-002',
				unitPrice: 45.0,
				costPrice: 15,
				quantity: 1,
				discount: 0,
				totalPrice: 45.0
			}
		],
		subTotal: 394.99,
		// taxAmount: 60.8,
		discountTotal: 15,
		grandTotal: 440.79,
		paymentMethod: 'M-Pesa',
		paymentStatus: 'Paid',
		status: 'Completed',
		saleperson: 'Sarah Jenkins',
		createdAt: '2026-02-20T08:15:00.000Z',
		updatedAt: '2026-02-20T08:15:00.000Z'
	}
];
