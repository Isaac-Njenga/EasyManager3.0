<script lang="ts">
	import Bell from '@lucide/svelte/icons/bell';
	import User from '@lucide/svelte/icons/user';

	import { SidebarTrigger } from '$lib/components/ui/sidebar';

	import { Button } from '$lib/components/ui/button';
	import Separator from '$lib/components/ui/separator/separator.svelte';
</script>

<header
	class="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur sm:px-6"
>
	<SidebarTrigger />

	<Separator orientation="vertical" class="mr-2 h-4" />

	<div class="flex-1">
		<!-- Page title/breadcrumbs will go here -->
	</div>

	<div class="flex items-center gap-1">
		<Button variant="ghost" size="icon" aria-label="Notifications">
			<Bell />
		</Button>

		<Button variant="ghost" size="icon" aria-label="Account">
			<User />
		</Button>
	</div>
</header>
