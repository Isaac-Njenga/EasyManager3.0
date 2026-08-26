import type { InventoryTransfer } from '$lib/types/transfers.types';

export const transferData: InventoryTransfer[] = [
	{
		_id: '3849732',
		transferNumber: 'TRN-9457',
		type: 'return_to_hub',
		source: {
			id: 'wh_01h8x1',
			name: 'Embakasi Central Fulfillment Hub',
			type: 'warehouse'
		},
		destination: {
			id: 'wh_03h8x3',
			name: 'Rift Valley Regional Depot',
			type: 'warehouse'
		},
		items: [
			{
				_id: '66b3f1e2a1d4c8001a2b3c01',
				name: 'Mara Hand-Carved Teak Coffee Table',
				code: 'MARA-TBL-BRN',
				totalQuantity: 6,
				sku: 'FUR-TBL-001',
				colour: 'red',
				image: ['https://images.unsplash.com/photo-1533090161767-e6ffed986c88'],
				description:
					'Reclaimed Kenyan teak table featuring subtle geometric tribal carvings along the apron.',
				category: 'Living Room',
				costPrice: 18000,
				sellingPrice: 42000,
				status: 'Active'
			}
		],
		totalItemsCount: 6,
		date: '2026-08-26T04:41:12.626Z',
		notes: '',
		createdAt: '2026-08-26T04:41:12.626Z',
		updatedAt: '2026-08-26T04:41:12.626Z'
	},
	{
		_id: '384f972',
		transferNumber: 'TRN-9157',
		type: 'inter_warehouse',
		source: {
			id: 'wh_industrial_area_001',
			name: 'Embakasi Central Fulfillment Hub',
			type: 'warehouse'
		},
		destination: {
			id: 'wh_nakuru_depot_002',
			name: 'Rift Valley Regional Depot',
			type: 'warehouse'
		},
		items: [
			{
				_id: '66b3f1e2a1d4c8001a2b3c01',
				name: 'Mara Hand-Carved Teak Coffee Table',
				code: 'MARA-TBL-BRN',
				totalQuantity: 3,
				sku: 'FUR-TBL-001',
				colour: 'Earthy Teak',
				image: ['https://images.unsplash.com/photo-1533090161767-e6ffed986c88'],
				description:
					'Reclaimed Kenyan teak table featuring subtle geometric tribal carvings along the apron.',
				category: 'Living Room',
				costPrice: 18000,
				sellingPrice: 42000,
				status: 'Active'
			}
		],
		totalItemsCount: 3,
		date: '2026-08-26T04:41:12.626Z',
		notes: 'Routine stock rebalancing across regional fulfillment nodes.',
		createdAt: '2026-08-26T04:41:12.626Z',
		updatedAt: '2026-08-26T04:41:12.626Z'
	},
	{
		_id: '38498873',
		transferNumber: 'TRN-9158',
		type: 'store_replenishment',
		source: {
			id: 'wh_industrial_area_001',
			name: 'Industrial Area Central Warehouse',
			type: 'warehouse'
		},
		destination: {
			id: 'shp-001',
			name: 'Westlands Flagship Showroom',
			type: 'shop'
		},
		items: [
			{
				_id: '66b3f1e2a1d4c8001a2b3c03',
				name: 'Naivasha Sunset Leather 3-Seater Sofa',
				code: 'NAI-SOF-TAN',
				totalQuantity: 2,
				sku: 'FUR-SOF-001',
				colour: 'Cognac Tan',
				image: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc'],
				description:
					'Top-grain leather sofa with deep brass-accented cushions inspired by Rift Valley tones.',
				category: 'Living Room',
				costPrice: 72000,
				sellingPrice: 165000,
				status: 'Active'
			},
			{
				_id: '66b3f1e2a1d4c8001a2b3c10',
				name: 'Rift Valley Hammered Brass Floor Lamp',
				code: 'RIF-LMP-GLD',
				totalQuantity: 4,
				sku: 'LGT-FLR-001',
				colour: 'Antique Gold',
				image: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15'],
				description:
					'Slender brass floor lamp with hand-hammered shade made by artisan metalsmiths.',
				category: 'Lighting',
				costPrice: 8500,
				sellingPrice: 21000,
				status: 'Active'
			}
		],
		totalItemsCount: 6,
		date: '2026-08-26T06:15:30.120Z',
		notes: 'Replenishing showroom display floor ahead of weekend promotion.',
		createdAt: '2026-08-26T06:15:30.120Z',
		updatedAt: '2026-08-26T06:15:30.120Z'
	},
	{
		_id: '38497hfj4',
		transferNumber: 'TRN-9159',
		type: 'inter_shop',
		source: {
			id: 'shp-002',
			name: 'CBD City Retail Hub',
			type: 'shop'
		},
		destination: {
			id: 'shp-003',
			name: 'Nyali Beach Showroom',
			type: 'shop'
		},
		items: [
			{
				_id: '66b3f1e2a1d4c8001a2b3c04',
				name: 'Samburu Beaded Pendant Light',
				code: 'SAM-LGT-RED',
				totalQuantity: 5,
				sku: 'LGT-PND-001',
				colour: 'Terracotta & Crimson',
				image: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c'],
				description:
					'Handcrafted steel framework threaded with traditional colorful glass trade beads.',
				category: 'Lighting',
				costPrice: 4200,
				sellingPrice: 12800,
				status: 'Active'
			},
			{
				_id: '66b3f1e2a1d4c8001a2b3c09',
				name: 'Turkana Soapstone Decorative Bowl',
				code: 'TUR-BWL-GRY',
				totalQuantity: 8,
				sku: 'DEC-ACC-001',
				colour: 'Smoky Charcoal',
				image: ['https://images.unsplash.com/photo-1616046229478-9901c5536a45'],
				description:
					'Hand-carved kisii soapstone vessel with polished graphite finish, ideal for centerpieces.',
				category: 'Decor',
				costPrice: 1200,
				sellingPrice: 4500,
				status: 'Active'
			}
		],
		totalItemsCount: 13,
		date: '2026-08-26T07:30:45.000Z',
		notes: 'Inter-store transfer requested to meet high demand at coastal branch.',
		createdAt: '2026-08-26T07:30:45.000Z',
		updatedAt: '2026-08-26T07:30:45.000Z'
	},
	{
		_id: '3849ryry75',
		transferNumber: 'TRN-9160',
		type: 'store_replenishment',
		source: {
			id: 'wh_industrial_area_001',
			name: 'Industrial Area Central Warehouse',
			type: 'warehouse'
		},
		destination: {
			id: 'shp-004',
			name: 'Rift Commercial Hub Store',
			type: 'shop'
		},
		items: [
			{
				_id: '66b3f1e2a1d4c8001a2b3c15',
				name: 'Nairobi Executive Camphor Desk',
				code: 'NAI-DSK-BRN',
				totalQuantity: 1,
				sku: 'FUR-DSK-001',
				colour: 'Dark Camphor',
				image: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd'],
				description:
					'Spacious home office desk featuring soft-close drawers and built-in cable routing channels.',
				category: 'Office',
				costPrice: 28000,
				sellingPrice: 68000,
				status: 'Active'
			},
			{
				_id: '66b3f1e2a1d4c8001a2b3c08',
				name: 'Aberdare Cypress Bookshelf',
				code: 'ABE-SHL-NAT',
				totalQuantity: 2,
				sku: 'FUR-STG-001',
				colour: 'Honey Honeycomb',
				image: ['https://images.unsplash.com/photo-1594620302200-9a762244a156'],
				description:
					'5-tier open bookshelf engineered from kiln-dried cypress timber with matte black steel framing.',
				category: 'Office',
				costPrice: 14000,
				sellingPrice: 32900,
				status: 'Active'
			}
		],
		totalItemsCount: 3,
		date: '2026-08-26T08:05:10.890Z',
		notes: 'Direct client order fulfillment via Nakuru outlet.',
		createdAt: '2026-08-26T08:05:10.890Z',
		updatedAt: '2026-08-26T08:05:10.890Z'
	},
	{
		_id: '384966hhd76',
		transferNumber: 'TRN-9161',
		type: 'return_to_hub',
		source: {
			id: 'shp-002',
			name: 'CBD City Retail Hub',
			type: 'shop'
		},
		destination: {
			id: 'wh_industrial_area_001',
			name: 'Industrial Area Central Warehouse',
			type: 'warehouse'
		},
		items: [
			{
				_id: '66b3f1e2a1d4c8001a2b3c07',
				name: 'Kikuyu Woven Sisal Floor Rug (2x3m)',
				code: 'KIK-RUG-BEI',
				totalQuantity: 4,
				sku: 'DEC-RUG-001',
				colour: 'Sand & Slate',
				image: ['https://images.unsplash.com/photo-1600121848594-d8644e57abab'],
				description:
					'Heavy-duty floor rug braided locally from organic sisal fibers with non-slip backing.',
				category: 'Decor',
				costPrice: 3800,
				sellingPrice: 11500,
				status: 'Active'
			}
		],
		totalItemsCount: 4,
		date: '2026-08-26T08:50:00.000Z',
		notes: 'Returning excess inventory to central storage for quality control audit.',
		createdAt: '2026-08-26T08:50:00.000Z',
		updatedAt: '2026-08-26T08:50:00.000Z'
	}
];
