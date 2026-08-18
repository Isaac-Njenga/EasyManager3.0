<script lang="ts">
	import { Bell, User } from "@lucide/svelte";
	import { Button } from "$lib/components/ui/button";
	// import { appConfig } from "$lib/config/app";
</script>

<header class="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6">
	<div>
		<!-- We'll add breadcrumbs/page title here later -->
	</div>

	<div class="flex items-center gap-2">
		<Button variant="ghost" size="icon" aria-label="Notifications">
			<Bell size={18} />
		</Button>

		<Button variant="ghost" size="icon" aria-label="Account">
			<User size={18} />
		</Button>
	</div>
</header>