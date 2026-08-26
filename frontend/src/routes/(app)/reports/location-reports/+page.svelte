<script lang="ts">
    import * as Card from '$lib/components/ui/card/index.js';
    import Badge from '$lib/components/ui/badge/badge.svelte';
    import DataTable from '$lib/components/common/DataTable.svelte';
    import Search from '$lib/components/common/Search.svelte';
    import StoreIcon from '@lucide/svelte/icons/store';
    import WarehouseIcon from '@lucide/svelte/icons/warehouse';
    import ArrowLeftRightIcon from '@lucide/svelte/icons/arrow-left-right';
    import Building2Icon from '@lucide/svelte/icons/building-2';
    import {
        locationReportMetrics,
        inventoryDistribution,
        type LocationReportMetric
    } from '$lib/data/reports/location-reports.data';
	import { formatCurrency } from '$lib/utils';

    let searchTerm = $state('');

    // Computed KPIs
    let totalStockValuation = $derived(
        locationReportMetrics.reduce((acc, curr) => acc + curr.totalStockValue, 0)
    );
    let totalUnitsAcrossLocations = $derived(
        locationReportMetrics.reduce((acc, curr) => acc + curr.totalUnits, 0)
    );
    let activeTransfersCount = $derived(
        locationReportMetrics.reduce((acc, curr) => acc + curr.pendingTransfers, 0)
    );

    let filteredLocations = $derived(
        locationReportMetrics.filter((item) => {
            if (!searchTerm.trim()) return true;
            const term = searchTerm.toLowerCase();
            return (
                item.locationName.toLowerCase().includes(term) ||
                item.city.toLowerCase().includes(term) ||
                item.type.toLowerCase().includes(term)
            );
        })
    );

   

    const columns = [
        { key: 'locationName', header: 'Facility & Location', cell: 'locationCell' },
        { key: 'type', header: 'Facility Type', cell: 'typeCell' },
        { key: 'totalUnits', header: 'Total Units', class: 'text-right' },
        { key: 'totalStockValue', header: 'Stock Valuation', cell: 'valuationCell', class: 'text-right' },
        { key: 'capacityUtilization', header: 'Capacity Used', cell: 'capacityCell', class: 'text-right' },
        { key: 'status', header: 'Operational Status', cell: 'statusCell' }
    ];
</script>

<!-- eslint-disable-next-line -->
{#snippet locationCell(value: unknown, item: LocationReportMetric)}
    <div class="flex flex-col">
        <span class="font-medium text-foreground">{item.locationName}</span>
        <span class="text-xs text-muted-foreground">{item.city}</span>
    </div>
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet typeCell(value: unknown, item: LocationReportMetric)}
    <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
        {#if item.type === 'Retail Store'}
            <StoreIcon class="size-3.5 text-sky-600" />
        {:else}
            <WarehouseIcon class="size-3.5 text-indigo-600" />
        {/if}
        <span>{item.type}</span>
    </div>
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet valuationCell(value: unknown, item: LocationReportMetric)}
    <div class="font-semibold text-foreground text-right">
        {formatCurrency(item.totalStockValue)}
    </div>
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet capacityCell(value: unknown, item: LocationReportMetric)}
    <div class="font-medium text-right {item.capacityUtilization > 90 ? 'text-amber-600' : 'text-foreground'}">
        {item.capacityUtilization}%
    </div>
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet statusCell(value: unknown, item: LocationReportMetric)}
    <Badge
        variant={item.status === 'Active'
            ? 'outline'
            : item.status === 'Near Capacity'
              ? 'default'
              : 'destructive'}
    >
        {item.status}
    </Badge>
{/snippet}

<div class="space-y-6">
    <!-- Summary KPIs -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card.Root>
            <Card.Header class="flex flex-row items-center justify-between pb-2">
                <Card.Title class="text-sm font-medium">Total Stock Valuation</Card.Title>
                <Building2Icon class="size-4 text-muted-foreground" />
            </Card.Header>
            <Card.Content>
                <div class="text-2xl font-bold">{formatCurrency(totalStockValuation)}</div>
                <p class="text-xs text-muted-foreground">Across all warehouses & shops</p>
            </Card.Content>
        </Card.Root>

        <Card.Root>
            <Card.Header class="flex flex-row items-center justify-between pb-2">
                <Card.Title class="text-sm font-medium">Total On-Hand Inventory</Card.Title>
                <WarehouseIcon class="size-4 text-indigo-600" />
            </Card.Header>
            <Card.Content>
                <div class="text-2xl font-bold">{totalUnitsAcrossLocations.toLocaleString()} units</div>
                <p class="text-xs text-muted-foreground">Stored across {locationReportMetrics.length} facilities</p>
            </Card.Content>
        </Card.Root>

        <Card.Root>
            <Card.Header class="flex flex-row items-center justify-between pb-2">
                <Card.Title class="text-sm font-medium">Active Stock Transfers</Card.Title>
                <ArrowLeftRightIcon class="size-4 text-sky-600" />
            </Card.Header>
            <Card.Content>
                <div class="text-2xl font-bold text-sky-600">{activeTransfersCount} Requests</div>
                <p class="text-xs text-muted-foreground">In-transit between facilities</p>
            </Card.Content>
        </Card.Root>

        <Card.Root>
            <Card.Header class="flex flex-row items-center justify-between pb-2">
                <Card.Title class="text-sm font-medium">Retail Outlets</Card.Title>
                <StoreIcon class="size-4 text-emerald-600" />
            </Card.Header>
            <Card.Content>
                <div class="text-2xl font-bold">3 Active Stores</div>
                <p class="text-xs text-muted-foreground">Generating active store sales</p>
            </Card.Content>
        </Card.Root>
    </div>

    <!-- Inventory Allocation Breakdown -->
    <Card.Root>
        <Card.Header>
            <Card.Title>Inventory Valuation Share by Location</Card.Title>
            <Card.Description>Capital distribution across retail fronts vs. central distribution hubs.</Card.Description>
        </Card.Header>
        <Card.Content>
            <div class="space-y-4">
                {#each inventoryDistribution as loc(loc.name)}
                    <div class="space-y-1">
                        <div class="flex items-center justify-between text-sm">
                            <span class="font-medium text-foreground">{loc.name}</span>
                            <span class="text-muted-foreground">
                                {formatCurrency(loc.value)} ({loc.percentage}%)
                            </span>
                        </div>
                        <div class="h-2 w-full rounded-full bg-muted">
                            <div
                                class="h-2 rounded-full bg-indigo-600"
                                style="width: {loc.percentage}%"
                            ></div>
                        </div>
                    </div>
                {/each}
            </div>
        </Card.Content>
    </Card.Root>

    <!-- Location Overview Table -->
    <div class="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
        <div class="flex items-center justify-between gap-4">
            <div class="w-full sm:w-80">
                <Search
                    value={searchTerm}
                    onChange={(val) => (searchTerm = val)}
                />
            </div>
            <span class="text-xs font-medium text-muted-foreground">
                Showing {filteredLocations.length} of {locationReportMetrics.length} locations
            </span>
        </div>

        <DataTable
            data={filteredLocations}
            {columns}
            getRowKey={(item) => item.locationId}
            emptyMessage="No locations found."
            cells={{ locationCell, typeCell, valuationCell, capacityCell, statusCell }}
            pagination
            pageSize={5}
        />
    </div>
</div>