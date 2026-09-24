<script lang="ts">
	import { browser } from '$app/environment';
	import Cookies from 'universal-cookie';
	import { setMode } from 'mode-watcher';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { Switch } from '$lib/components/ui/switch';
	import { authCookies, type AuthUser } from '$lib/config/auth';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';

	type Preferences = { displayName: string; currency: string; timezone: string; theme: 'light' | 'dark' | 'system'; emailNotifications: boolean; lowStockAlerts: boolean; dailySummary: boolean; dashboardRefresh: boolean };
	const user = new Cookies().get(authCookies.user) as AuthUser | undefined;
	const defaults: Preferences = { displayName: user ? `${user.firstname} ${user.lastname}`.trim() : '', currency: 'KES', timezone: 'Africa/Nairobi', theme: 'system', emailNotifications: true, lowStockAlerts: true, dailySummary: false, dashboardRefresh: true };
	let preferences = $state<Preferences>({ ...defaults });
	if (browser) { try { const saved = localStorage.getItem('easy_manager_preferences'); if (saved) preferences = { ...defaults, ...JSON.parse(saved) }; } catch {} }
	function save() { localStorage.setItem('easy_manager_preferences', JSON.stringify(preferences)); setMode(preferences.theme); toast.success('Preferences saved', { description: 'Saved on this device.' }); }
</script>

<svelte:head>
	<title>Settings | EasyManager</title>
</svelte:head>
<div class="space-y-6">
	<PageHeader title="Settings" description="Manage your account and application preferences." />
	<div class="grid gap-6 lg:grid-cols-2">
		<Card><CardHeader><CardTitle>Profile</CardTitle><CardDescription>Your account identity and display preference.</CardDescription></CardHeader><CardContent class="space-y-4"><div class="space-y-2"><Label for="display-name">Display name</Label><Input id="display-name" bind:value={preferences.displayName} /></div><div class="grid grid-cols-2 gap-4"><div class="space-y-2"><Label>User ID</Label><Input value={user?.userId ?? ''} readonly /></div><div class="space-y-2"><Label>Role</Label><Input value={user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'User'} readonly /></div></div></CardContent></Card>
		<Card><CardHeader><CardTitle>Regional preferences</CardTitle><CardDescription>Formats applied to your workspace.</CardDescription></CardHeader><CardContent class="grid gap-4 sm:grid-cols-2"><div class="space-y-2"><Label>Currency</Label><Select.Root type="single" bind:value={preferences.currency}><Select.Trigger>{preferences.currency}</Select.Trigger><Select.Content><Select.Group><Select.Item value="KES" label="KES">KES</Select.Item><Select.Item value="USD" label="USD">USD</Select.Item><Select.Item value="EUR" label="EUR">EUR</Select.Item></Select.Group></Select.Content></Select.Root></div><div class="space-y-2"><Label>Time zone</Label><Select.Root type="single" bind:value={preferences.timezone}><Select.Trigger>{preferences.timezone}</Select.Trigger><Select.Content><Select.Group><Select.Item value="Africa/Nairobi" label="Africa/Nairobi">Africa/Nairobi</Select.Item><Select.Item value="UTC" label="UTC">UTC</Select.Item></Select.Group></Select.Content></Select.Root></div></CardContent></Card>
		<Card><CardHeader><CardTitle>Appearance & workflow</CardTitle><CardDescription>Choose the workspace appearance and refresh behavior.</CardDescription></CardHeader><CardContent class="space-y-4"><div class="flex items-center justify-between gap-3"><Label>Theme</Label><Select.Root type="single" bind:value={preferences.theme} onValueChange={(value) => setMode(value as Preferences['theme'])}><Select.Trigger class="w-36">{preferences.theme}</Select.Trigger><Select.Content><Select.Group><Select.Item value="system" label="System">System</Select.Item><Select.Item value="light" label="Light">Light</Select.Item><Select.Item value="dark" label="Dark">Dark</Select.Item></Select.Group></Select.Content></Select.Root></div><div class="flex items-center justify-between border-t pt-4"><div><Label>Auto-refresh dashboard</Label><p class="text-xs text-muted-foreground">Keep figures current while you work.</p></div><Switch bind:checked={preferences.dashboardRefresh} /></div></CardContent></Card>
		<Card><CardHeader><CardTitle>Notifications</CardTitle><CardDescription>Control routine operational alerts.</CardDescription></CardHeader><CardContent class="space-y-4"><div class="flex items-center justify-between"><div><Label>Email notifications</Label><p class="text-xs text-muted-foreground">Account and operational updates.</p></div><Switch bind:checked={preferences.emailNotifications} /></div><div class="flex items-center justify-between border-t pt-4"><div><Label>Low-stock alerts</Label><p class="text-xs text-muted-foreground">Alert when stock needs replenishing.</p></div><Switch bind:checked={preferences.lowStockAlerts} /></div><div class="flex items-center justify-between border-t pt-4"><div><Label>Daily summary</Label><p class="text-xs text-muted-foreground">A daily sales and inventory recap.</p></div><Switch bind:checked={preferences.dailySummary} /></div></CardContent></Card>
		<Card class="lg:col-span-2"><CardHeader><CardTitle>Security</CardTitle><CardDescription>Use the recovery flow when you need to change your password.</CardDescription></CardHeader><CardContent><Button variant="outline" href="/forgot-password">Reset password</Button></CardContent></Card>
	</div>
	<div class="flex justify-end"><Button onclick={save}>Save preferences</Button></div>
</div>
