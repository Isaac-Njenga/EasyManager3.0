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

<svelte:head>
    <title>EasyManager</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center">
    <Card class="w-[400px]">
        <CardHeader>
            <CardTitle>Sales Management</CardTitle>
            <CardDescription>
                Application foundation is ready.
            </CardDescription>
        </CardHeader>

        <CardContent>
            <Button>
                Get Started
            </Button>
        </CardContent>
    </Card>
</div>