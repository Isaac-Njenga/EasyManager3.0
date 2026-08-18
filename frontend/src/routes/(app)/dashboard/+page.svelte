<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
</script>

<div class="space-y-6">
	<PageHeader title="Dashboard" description="Here's what's happening with your business today." />

	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<Card>
			<CardHeader>
				<CardTitle class="text-sm font-medium text-muted-foreground">Today's Sales</CardTitle>
			</CardHeader>

			<CardContent>
				<div class="text-2xl font-bold">KES 0.00</div>
			</CardContent>
		</Card>

		<Card>
			<CardHeader>
				<CardTitle class="text-sm font-medium text-muted-foreground">Expenses</CardTitle>
			</CardHeader>

			<CardContent>
				<div class="text-2xl font-bold">KES 0.00</div>
			</CardContent>
		</Card>

		<Card>
			<CardHeader>
				<CardTitle class="text-sm font-medium text-muted-foreground">Products</CardTitle>
			</CardHeader>

			<CardContent>
				<div class="text-2xl font-bold">0</div>
			</CardContent>
		</Card>

		<Card>
			<CardHeader>
				<CardTitle class="text-sm font-medium text-muted-foreground">Low Stock</CardTitle>
			</CardHeader>

			<CardContent>
				<div class="text-2xl font-bold">0</div>
			</CardContent>
		</Card>
	</div>
</div>
