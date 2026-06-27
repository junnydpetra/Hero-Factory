import { randomUUID } from 'node:crypto';
import { IHeroRepository } from '../../domain/repositories/IHeroRepository';
import { CreateHeroDTO } from '../dtos/CreateHeroDTO';
import { UpdateHeroDTO } from '../dtos/UpdateHeroDTO';
import { HeroResponseDTO } from '../dtos/HeroResponseDTO';
import { AppError } from '../errors/AppError';

export class HeroService {
    constructor(private readonly heroRepository: IHeroRepository) { }

    async createHero(data: CreateHeroDTO): Promise<HeroResponseDTO> {
        const id = randomUUID();

        const newHero = await this.heroRepository.create({
            ...data,
            id,
        });

        return newHero;
    }

    async listHeroes(page: number, search?: string): Promise<{ heroes: HeroResponseDTO[]; total: number }> {
        return this.heroRepository.findAll(page, search);
    }

    async getHeroById(id: string): Promise<HeroResponseDTO> {
        const hero = await this.heroRepository.findById(id);

        if (!hero) {
            throw new AppError('Herói não encontrado!', 404);
        }
        return hero;
    }

    async updateHero(id: string, data: UpdateHeroDTO): Promise<HeroResponseDTO> {
        const existingHero = await this.heroRepository.findById(id);

        if (!existingHero) {
            throw new AppError('Herói não encontrado!', 404);
        }

        if (!existingHero.is_active) {
            throw new AppError('Não é possível editar um herói desativado!', 403);
        }

        const updatedHero = await this.heroRepository.update(id, data);
        if (!updatedHero) {
            throw new AppError('Falha ao atualizar o herói!', 500);
        }

        return updatedHero;
    }

    async deleteHero(id: string): Promise<void> {
        const existingHero = await this.heroRepository.findById(id);

        if (!existingHero) {
            throw new AppError('Herói não encontrado!', 404);
        }

        await this.heroRepository.toggleActive(id, false);
    }

    async reactivateHero(id: string): Promise<void> {
        const existingHero = await this.heroRepository.findById(id);

        if (!existingHero) {
            throw new AppError('Herói não encontrado!', 404);
        }

        if (existingHero.is_active) {
            throw new AppError('Herói já está ativo!', 400);
        }

        await this.heroRepository.toggleActive(id, true);
    }
}