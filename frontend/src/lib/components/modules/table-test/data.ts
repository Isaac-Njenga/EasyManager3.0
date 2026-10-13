type Payment = {
	id: string;
	amount: number;
	status: 'pending' | 'processing' | 'success' | 'failed';
	email: string;
};

export const data: Payment[] = [
	{
		id: '728ed52f',
		amount: 100,
		status: 'pending',
		email: 'm@example.com'
	},
	{
		id: '489e1d42',
		amount: 125,
		status: 'processing',
		email: 'example@gmail.com'
	},
	{
		id: '3f9a2c11',
		amount: 250,
		status: 'success',
		email: 'john.doe@gmail.com'
	},
	{
		id: '8b4f6e90',
		amount: 75,
		status: 'pending',
		email: 'sarah.connor@sky net.com'
	},
	{
		id: '1a2b3c4d',
		amount: 500,
		status: 'processing',
		email: 'alex.smith@company.org'
	},
	{
		id: '9e8d7c6b',
		amount: 150,
		status: 'success',
		email: 'hello@world.io'
	},
	{
		id: '5f4e3d2c',
		amount: 320,
		status: 'failed',
		email: 'test.user@domain.net'
	},
	{
		id: '6a7b8c9d',
		amount: 45,
		status: 'pending',
		email: 'support@startup.co'
	},
	{
		id: '2f1e4d3c',
		amount: 1200,
		status: 'success',
		email: 'enterprise@client.com'
	},
	{
		id: '9c8b7a6f',
		amount: 95,
		status: 'processing',
		email: 'developer@code.dev'
	},
	{
		id: '4d3c2b1a',
		amount: 410,
		status: 'success',
		email: 'finance@store.shop'
	},
	{
		id: '7e6f5a4b',
		amount: 60,
		status: 'failed',
		email: 'user123@yahoo.com'
	}
	// ...
];
