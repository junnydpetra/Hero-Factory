import { api } from './api';
import type { Hero } from '../types/Hero';

interface PaginatedResponse {
    heroes: Hero[];
    total: number;
}

export const heroService = {
    async list(page: number, search?: string): Promise<PaginatedResponse> {
        const response = await api.get<PaginatedResponse>('/heroes', {
            params: { page, search },
        });
        return response.data;
    },
    async findById(id: string): Promise<Hero> {
        const response = await api.get<Hero>(`/heroes/${id}`);
        return response.data;
    },
    async create(data: Omit<Hero, 'id' | 'is_active' | 'created_at' | 'updated_at'>): Promise<Hero> {
        const response = await api.post<Hero>('/heroes', data);
        return response.data;
    },
    async update(id: string, data: Partial<Hero>): Promise<Hero> {
        const response = await api.patch<Hero>(`/heroes/${id}`, data);
        return response.data;
    },
    async delete(id: string): Promise<void> {
        await api.delete(`/heroes/${id}`);
    },
    async reactivate(id: string): Promise<void> {
        await api.patch(`/heroes/${id}/reactivate`);
    },
};