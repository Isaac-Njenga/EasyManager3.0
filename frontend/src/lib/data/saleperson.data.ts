import type { Salesperson } from '$lib/types/saleperson.types';

export const salespersonsData: Salesperson[] = [
	{
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
	{
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
	{
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
	{
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
	{
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
	{
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
	{
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
	{
		_id: '66c01a9f1b2c3d001a100108',
		firstName: 'Joy',
		lastName: 'Chebet',
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
		totalCommission: 112000,
		hireDate: '2025-06-01',
		createdAt: '2025-06-01T08:30:00.000Z',
		updatedAt: '2026-08-22T13:45:00.000Z'
	},
	{
		_id: '66c01a9f1b2c3d001a100109',
		firstName: 'Samuel',
		lastName: 'Maina',
		status: 'Terminated',
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
		totalCommission: 15000,
		hireDate: '2024-01-10',
		createdAt: '2024-01-10T09:00:00.000Z',
		updatedAt: '2025-11-30T16:00:00.000Z'
	},
	{
		_id: '66c01a9f1b2c3d001a100110',
		firstName: 'Agnes',
		lastName: 'Kaveri',
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
		totalCommission: 189000,
		hireDate: '2023-08-20',
		createdAt: '2023-08-20T08:00:00.000Z',
		updatedAt: '2026-08-26T15:40:00.000Z'
	}
];
