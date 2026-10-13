<script lang="ts">
	import DataTable from '$lib/components/modules/table-test/table.svelte';
	import { columns } from '$lib/components/modules/table-test/test.column';
	import { data } from '$lib/components/modules/table-test/data';
</script>

<DataTable {data} {columns} />
