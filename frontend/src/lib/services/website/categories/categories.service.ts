import { apiClient } from '$lib/services/api/client';
import type { ServiceContext } from '../../api/types';
import type { Category } from './categories.types';

export const CategoryService = {
	async get(context: ServiceContext): Promise<Category> {
		return apiClient.get<Category>(`/category/`, context);
	}
};
