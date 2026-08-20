<script lang="ts">
	import {
		PUBLIC_CLOUDINARY_CLOUD_NAME,
		PUBLIC_CLOUDINARY_UPLOAD_PRESET
	} from '$env/static/public';
	import UploadCloudIcon from '@lucide/svelte/icons/upload-cloud';
	import InboxIcon from '@lucide/svelte/icons/inbox';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import { toast } from 'svelte-sonner';

	let {
		selectedImages = $bindable([]),
		imageUploading = $bindable(false)
	}: {
		selectedImages?: string[];
		imageUploading?: boolean;
	} = $props();

	async function handleImageUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const files = target.files;
		if (!files || files.length === 0) return;

		imageUploading = true;
		// toast.loading('Uploading...');
		const maxSize = 10 * 1024 * 1024; // 10MB limit

		try {
			const uploadPromises = Array.from(files).map(async (file) => {
				if (file.size > maxSize) {
					throw new Error(`File ${file.name} exceeds 10MB size limit.`);
				}

				const formData = new FormData();
				formData.append('file', file);
				formData.append('upload_preset', PUBLIC_CLOUDINARY_UPLOAD_PRESET);

				const response = await fetch(
					`https://api.cloudinary.com/v1_1/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
					{
						method: 'POST',
						body: formData
					}
				);

				if (!response.ok) {
					toast.error('Failed to upload image to Cloudinary. Refresh and try again');
					throw new Error('Failed to upload image to Cloudinary');
				}

				const data = await response.json();
				return data.secure_url as string;
			});

			const uploadedUrls = await Promise.all(uploadPromises);

			// Append newly uploaded image URLs to the bound array
			selectedImages = [...selectedImages, ...uploadedUrls];
			toast.success('Uploaded successfully!');
		} catch (error) {
			console.error('Upload error:', error);
			// alert(error instanceof Error ? error.message : 'Upload failed');

			toast.error(
				error instanceof Error
					? error.message
					: 'Failed to upload image to Cloudinary. Refresh and try again'
			);
		} finally {
			imageUploading = false;
			// Clear input value so selecting the same file again triggers change event
			target.value = '';
		}
	}

	function removeImage(index: number) {
		selectedImages = selectedImages.filter((_, i) => i !== index);
	}
</script>

<div class="space-y-4">
	<!-- Upload Dropzone Container -->
	<div
		class="relative mx-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center transition-all duration-300 hover:border-primary"
	>
		<div class="mb-2 flex items-center gap-2 text-gray-700">
			<UploadCloudIcon class="h-5 w-5 text-primary" />
		</div>

		<div class="flex flex-col items-center">
			<InboxIcon class="mb-4 h-12 w-12 text-primary" />
			<div class="mb-2 text-sm">
				<span class="font-semibold text-primary">Click to upload</span>
				<span class="text-gray-500"> or drag and drop</span>
			</div>
			<p class="text-xs text-gray-400">PNG, JPG up to 10MB</p>
		</div>

		<!-- Transparent File Input Overlay -->
		<input
			type="file"
			accept="image/*"
			multiple
			disabled={imageUploading}
			onchange={handleImageUpload}
			class="absolute inset-0 cursor-pointer opacity-0"
		/>
	</div>

	<!-- Loading Spinner -->
	{#if imageUploading}
		<div class="my-6 text-center">
			<Loader2Icon class="mx-auto h-8 w-8 animate-spin text-primary" />
			<div class="mt-3 text-sm font-medium text-primary">Uploading images...</div>
		</div>
	{/if}

	<!-- Image Preview Grid -->
	{#if selectedImages?.length > 0}
		<div class="m-4 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
			{#each selectedImages as item, index (item)}
				<div
					class="group relative h-48 overflow-hidden rounded-xl bg-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
				>
					<button
						type="button"
						title="Remove Image"
						onclick={() => removeImage(index)}
						class="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-red-500 bg-white/95 text-red-500 shadow-sm transition-transform hover:scale-110 active:scale-95"
					>
						<Trash2Icon class="h-4 w-4" />
					</button>
					<img src={item} alt="uploaded_img" class="h-full w-full object-cover" />
				</div>
			{/each}
		</div>
	{:else if !imageUploading}
		<!-- Empty State -->
		<div class="mt-4 flex flex-col items-center rounded-xl p-8 text-center text-gray-400">
			<InboxIcon class="mb-2 h-9 w-9" />
			<div class="text-sm">No images selected yet</div>
		</div>
	{/if}
</div>
