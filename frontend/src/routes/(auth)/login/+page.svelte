<script lang="ts">
	import LoginForm from '$lib/components/modules/auth/LoginForm.svelte';
</script>

<div class="flex min-h-screen items-center justify-center px-4 py-12">
	<div class="flex w-full max-w-md flex-col items-center">
		<div class="mb-8 text-center">
			<div
				class="mb-1 flex h-20 w-40 items-center justify-center rounded-xl bg-primary text-primary-foreground"
			>
				<span class="text-xl font-bold">EasyManager</span>
			</div>
		</div>

		<LoginForm />

		<p class="mt-6 text-center text-xs text-muted-foreground">
			© 2026 EasyManager. All rights reserved.
		</p>
	</div>
</div>
