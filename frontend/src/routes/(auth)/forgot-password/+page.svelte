<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from "$lib/components/ui/card";
</script>

<div class="flex min-h-screen items-center justify-center px-4">
	<Card class="w-full max-w-md">
		<CardHeader>
			<CardTitle>Forgot password?</CardTitle>

			<CardDescription>
				Enter your email address and we'll help you reset your password.
			</CardDescription>
		</CardHeader>

		<CardContent>
			<Button href="/login" variant="outline" class="w-full">
				Back to sign in
			</Button>
		</CardContent>
	</Card>
</div>