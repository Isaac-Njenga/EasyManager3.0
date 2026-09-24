import { apiClient } from '$lib/services/api/client';
import type { ServiceContext } from '$lib/services/api/types';

export type LogEntry = {
	_id: string;
	type: string;
	action: string;
	title?: string;
	description?: string;
	refModel: string;
	createdAt: string;
};

export type LogListResponse = {
	logs: LogEntry[];
	totalLogs: number;
	currentPage: number;
	totalPages: number;
};

export const logsService = {
	fetch(context: ServiceContext, page = 1) {
		return apiClient.get<LogListResponse>(`/logs/fetch-logs?page=${page}&limit=25`, context);
	}
};
