import type { Product } from '$lib/types/product.types';

export const productsData: Product[] = [
	{
		_id: '66b3f1e2a1d4c8001a2b3c01',
		name: 'Mara Hand-Carved Teak Coffee Table',
		sku: 'FUR-TBL-001',
		code: 'MARA-TBL-BRN',
		colour: 'Earthy Teak',
		image: ['https://images.unsplash.com/photo-1533090161767-e6ffed986c88'],
		description:
			'Reclaimed Kenyan teak table featuring subtle geometric tribal carvings along the apron.',
		category: 'Living Room',
		costPrice: 18000,
		sellingPrice: 42000,
		status: 'Active',
		totalQuantity: 18,
		inventory: [
			{ locationId: 'wh_industrial_area_001', locationType: 'Warehouse', quantity: 10 },
			{ locationId: 'shp-001', locationType: 'Shop', quantity: 5 },
			{ locationId: 'shp-002', locationType: 'Shop', quantity: 3 },
			{ locationId: 'shp-003', locationType: 'Shop', quantity: 3 }
		],
		createdAt: '2026-01-10T08:30:00.000Z',
		updatedAt: '2026-02-12T10:15:00.000Z'
	},
	{
		_id: '66b3f1e2a1d4c8001a2b3c02',
		name: 'Kilifi Woven Rattan Accent Chair',
		sku: 'FUR-ARM-002',
		code: 'KIL-CHR-NAT',
		colour: 'Natural Ochre',
		image: ['https://images.unsplash.com/photo-1533090161767-e6ffed986c88'],
		description:
			'Coastal-inspired arm chair handwoven with durable natural rattan over a mahogany frame.',
		category: 'Living Room',
		costPrice: 9500,
		sellingPrice: 24500,
		status: 'Active',
		totalQuantity: 25,
		inventory: [
			{ locationId: 'wh_industrial_area_001', locationType: 'Warehouse', quantity: 15 },
			{ locationId: 'shop_cbd_002', locationType: 'Shop', quantity: 6 },
			{ locationId: 'shop_westlands_003', locationType: 'Shop', quantity: 4 }
		],
		createdAt: '2026-01-12T09:14:00.000Z',
		updatedAt: '2026-02-18T16:05:00.000Z'
	},
	{
		_id: '66b3f1e2a1d4c8001a2b3c03',
		name: 'Naivasha Sunset Leather 3-Seater Sofa',
		sku: 'FUR-SOF-001',
		code: 'NAI-SOF-TAN',
		colour: 'Cognac Tan',
		image: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc'],
		description:
			'Top-grain leather sofa with deep brass-accented cushions inspired by Rift Valley tones.',
		category: 'Living Room',
		costPrice: 72000,
		sellingPrice: 165000,
		status: 'Active',
		totalQuantity: 8,
		inventory: [
			{ locationId: 'wh_industrial_area_001', locationType: 'Warehouse', quantity: 4 },
			{ locationId: 'shop_cbd_002', locationType: 'Shop', quantity: 2 },
			{ locationId: 'shop_westlands_003', locationType: 'Shop', quantity: 2 }
		],
		createdAt: '2026-01-15T11:00:00.000Z',
		updatedAt: '2026-02-20T09:40:00.000Z'
	},
	{
		_id: '66b3f1e2a1d4c8001a2b3c04',
		name: 'Samburu Beaded Pendant Light',
		sku: 'LGT-PND-001',
		code: 'SAM-LGT-RED',
		colour: 'Terracotta & Crimson',
		image: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c'],
		description:
			'Handcrafted steel framework threaded with traditional colorful glass trade beads.',
		category: 'Lighting',
		costPrice: 4200,
		sellingPrice: 12800,
		status: 'Active',
		totalQuantity: 40,
		inventory: [
			{ locationId: 'wh_industrial_area_001', locationType: 'Warehouse', quantity: 25 },
			{ locationId: 'shop_cbd_002', locationType: 'Shop', quantity: 10 },
			{ locationId: 'shop_westlands_003', locationType: 'Shop', quantity: 5 }
		],
		createdAt: '2026-01-18T14:20:00.000Z',
		updatedAt: '2026-02-14T11:22:00.000Z'
	},
	{
		_id: '66b3f1e2a1d4c8001a2b3c05',
		name: 'Elgon Solid Blue Gum Dining Table',
		sku: 'FUR-TBL-002',
		code: 'ELG-DIN-RAW',
		colour: 'Raw Eucalyptus',
		image: ['https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf'],
		description:
			'Live-edge dining table seating 8, sourced from sustainably harvested Mount Elgon timber.',
		category: 'Dining Room',
		costPrice: 45000,
		sellingPrice: 110000,
		status: 'Active',
		totalQuantity: 6,
		inventory: [
			{ locationId: 'wh_industrial_area_001', locationType: 'Warehouse', quantity: 3 },
			{ locationId: 'shop_cbd_002', locationType: 'Shop', quantity: 1 },
			{ locationId: 'shop_westlands_003', locationType: 'Shop', quantity: 2 }
		],
		createdAt: '2026-01-20T07:45:00.000Z',
		updatedAt: '2026-02-01T15:10:00.000Z'
	},
	{
		_id: '66b3f1e2a1d4c8001a2b3c06',
		name: 'Mombasa Swahili-Carved King Bed',
		sku: 'FUR-BED-001',
		code: 'MOM-BED-BLK',
		colour: 'Ebony Stain',
		image: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85'],
		description: 'Intricately patterned headboard inspired by traditional Lamu wooden door motifs.',
		category: 'Bedroom',
		costPrice: 55000,
		sellingPrice: 135000,
		status: 'Active',
		totalQuantity: 10,
		inventory: [
			{ locationId: 'wh_industrial_area_001', locationType: 'Warehouse', quantity: 6 },
			{ locationId: 'shop_cbd_002', locationType: 'Shop', quantity: 2 },
			{ locationId: 'shop_westlands_003', locationType: 'Shop', quantity: 2 }
		],
		createdAt: '2026-01-22T10:30:00.000Z',
		updatedAt: '2026-02-15T08:50:00.000Z'
	},
	{
		_id: '66b3f1e2a1d4c8001a2b3c07',
		name: 'Kikuyu Woven Sisal Floor Rug (2x3m)',
		sku: 'DEC-RUG-001',
		code: 'KIK-RUG-BEI',
		colour: 'Sand & Slate',
		image: ['https://images.unsplash.com/photo-1600121848594-d8644e57abab'],
		description:
			'Heavy-duty floor rug braided locally from organic sisal fibers with non-slip backing.',
		category: 'Decor',
		costPrice: 3800,
		sellingPrice: 11500,
		status: 'Active',
		totalQuantity: 32,
		inventory: [
			{ locationId: 'wh_industrial_area_001', locationType: 'Warehouse', quantity: 20 },
			{ locationId: 'shop_cbd_002', locationType: 'Shop', quantity: 7 },
			{ locationId: 'shop_westlands_003', locationType: 'Shop', quantity: 5 }
		],
		createdAt: '2026-01-25T13:10:00.000Z',
		updatedAt: '2026-02-19T17:30:00.000Z'
	},
	{
		_id: '66b3f1e2a1d4c8001a2b3c08',
		name: 'Aberdare Cypress Bookshelf',
		sku: 'FUR-STG-001',
		code: 'ABE-SHL-NAT',
		colour: 'Honey Honeycomb',
		image: ['https://images.unsplash.com/photo-1594620302200-9a762244a156'],
		description:
			'5-tier open bookshelf engineered from kiln-dried cypress timber with matte black steel framing.',
		category: 'Office',
		costPrice: 14000,
		sellingPrice: 32900,
		status: 'Active',
		totalQuantity: 14,
		inventory: [
			{ locationId: 'wh_industrial_area_001', locationType: 'Warehouse', quantity: 8 },
			{ locationId: 'shop_cbd_002', locationType: 'Shop', quantity: 3 },
			{ locationId: 'shop_westlands_003', locationType: 'Shop', quantity: 3 }
		],
		createdAt: '2026-01-28T09:00:00.000Z',
		updatedAt: '2026-02-11T12:00:00.000Z'
	},
	{
		_id: '66b3f1e2a1d4c8001a2b3c09',
		name: 'Turkana Soapstone Decorative Bowl',
		sku: 'DEC-ACC-001',
		code: 'TUR-BWL-GRY',
		colour: 'Smoky Charcoal',
		image: ['https://images.unsplash.com/photo-1616046229478-9901c5536a45'],
		description:
			'Hand-carved kisii soapstone vessel with polished graphite finish, ideal for centerpieces.',
		category: 'Decor',
		costPrice: 1200,
		sellingPrice: 4500,
		status: 'Active',
		totalQuantity: 50,
		inventory: [
			{ locationId: 'wh_industrial_area_001', locationType: 'Warehouse', quantity: 30 },
			{ locationId: 'shop_cbd_002', locationType: 'Shop', quantity: 12 },
			{ locationId: 'shop_westlands_003', locationType: 'Shop', quantity: 8 }
		],
		createdAt: '2026-01-29T16:40:00.000Z',
		updatedAt: '2026-02-05T14:15:00.000Z'
	},
	{
		_id: '66b3f1e2a1d4c8001a2b3c10',
		name: 'Rift Valley Hammered Brass Floor Lamp',
		sku: 'LGT-FLR-001',
		code: 'RIF-LMP-GLD',
		colour: 'Antique Gold',
		image: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15'],
		description: 'Slender brass floor lamp with hand-hammered shade made by artisan metalsmiths.',
		category: 'Lighting',
		costPrice: 8500,
		sellingPrice: 21000,
		status: 'Active',
		totalQuantity: 15,
		inventory: [
			{ locationId: 'wh_industrial_area_001', locationType: 'Warehouse', quantity: 9 },
			{ locationId: 'shop_cbd_002', locationType: 'Shop', quantity: 4 },
			{ locationId: 'shop_westlands_003', locationType: 'Shop', quantity: 2 }
		],
		createdAt: '2026-02-01T11:15:00.000Z',
		updatedAt: '2026-02-21T08:30:00.000Z'
	},
	{
		_id: '66b3f1e2a1d4c8001a2b3c11',
		name: 'Taita Linen Daybed Lounge',
		sku: 'FUR-SOF-002',
		code: 'TAI-DAY-OLV',
		colour: 'Safari Olive',
		image: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7'],
		description:
			'Low-profile daybed wrapped in breathable washed linen with dense recycled-cotton cushions.',
		category: 'Living Room',
		costPrice: 32000,
		sellingPrice: 78000,
		status: 'Active',
		totalQuantity: 11,
		inventory: [
			{ locationId: 'wh_industrial_area_001', locationType: 'Warehouse', quantity: 6 },
			{ locationId: 'shop_cbd_002', locationType: 'Shop', quantity: 3 },
			{ locationId: 'shop_westlands_003', locationType: 'Shop', quantity: 2 }
		],
		createdAt: '2026-02-03T10:00:00.000Z',
		updatedAt: '2026-02-22T13:45:00.000Z'
	},
	{
		_id: '66b3f1e2a1d4c8001a2b3c12',
		name: 'Tsavo Recycled Iron Barstool',
		sku: 'FUR-STL-001',
		code: 'TSA-STL-BLK',
		colour: 'Matte Charcoal',
		image: ['https://images.unsplash.com/photo-1503602642458-232111445657'],
		description:
			'Industrial counter barstool constructed from salvaged scrap iron with a polished oak seat.',
		category: 'Dining Room',
		costPrice: 3500,
		sellingPrice: 8900,
		status: 'Active',
		totalQuantity: 36,
		inventory: [
			{ locationId: 'wh_industrial_area_001', locationType: 'Warehouse', quantity: 20 },
			{ locationId: 'shop_cbd_002', locationType: 'Shop', quantity: 10 },
			{ locationId: 'shop_westlands_003', locationType: 'Shop', quantity: 6 }
		],
		createdAt: '2026-02-05T08:20:00.000Z',
		updatedAt: '2026-02-17T11:10:00.000Z'
	},
	{
		_id: '66b3f1e2a1d4c8001a2b3c13',
		name: 'Kwale Terracotta Planter Pot',
		sku: 'DEC-PLN-001',
		code: 'KWA-PLN-CLY',
		colour: 'Burnt Clay',
		image: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411'],
		description:
			'Kiln-fired earthen ceramic planter with drainage tray, suitable for indoor palms.',
		category: 'Decor',
		costPrice: 1500,
		sellingPrice: 4200,
		status: 'Active',
		totalQuantity: 45,
		inventory: [
			{ locationId: 'wh_industrial_area_001', locationType: 'Warehouse', quantity: 25 },
			{ locationId: 'shop_cbd_002', locationType: 'Shop', quantity: 12 },
			{ locationId: 'shop_westlands_003', locationType: 'Shop', quantity: 8 }
		],
		createdAt: '2026-02-08T12:00:00.000Z',
		updatedAt: '2026-02-23T09:15:00.000Z'
	},
	{
		_id: '66b3f1e2a1d4c8001a2b3c14',
		name: 'Lamu Hand-Carved Vanity Mirror',
		sku: 'DEC-MIR-001',
		code: 'LAM-MIR-WHT',
		colour: 'Whitewashed Mahogany',
		image: ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6'],
		description: 'Arch-top wall mirror surrounded by intricate floral relief woodcarvings.',
		category: 'Decor',
		costPrice: 6500,
		sellingPrice: 18500,
		status: 'Active',
		totalQuantity: 20,
		inventory: [
			{ locationId: 'wh_industrial_area_001', locationType: 'Warehouse', quantity: 12 },
			{ locationId: 'shop_cbd_002', locationType: 'Shop', quantity: 5 },
			{ locationId: 'shop_westlands_003', locationType: 'Shop', quantity: 3 }
		],
		createdAt: '2026-02-10T14:30:00.000Z',
		updatedAt: '2026-02-20T16:00:00.000Z'
	},
	{
		_id: '66b3f1e2a1d4c8001a2b3c15',
		name: 'Nairobi Executive Camphor Desk',
		sku: 'FUR-DSK-001',
		code: 'NAI-DSK-BRN',
		colour: 'Dark Camphor',
		image: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd'],
		description:
			'Spacious home office desk featuring soft-close drawers and built-in cable routing channels.',
		category: 'Office',
		costPrice: 28000,
		sellingPrice: 68000,
		status: 'Active',
		totalQuantity: 7,
		inventory: [
			{ locationId: 'wh_industrial_area_001', locationType: 'Warehouse', quantity: 4 },
			{ locationId: 'shop_cbd_002', locationType: 'Shop', quantity: 2 },
			{ locationId: 'shop_westlands_003', locationType: 'Shop', quantity: 1 }
		],
		createdAt: '2026-02-12T09:10:00.000Z',
		updatedAt: '2026-02-24T08:00:00.000Z'
	}
];
