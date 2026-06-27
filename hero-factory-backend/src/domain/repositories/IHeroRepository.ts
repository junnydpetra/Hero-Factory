import { CreateHeroDTO } from '../../application/dtos/CreateHeroDTO';
import { UpdateHeroDTO } from '../../application/dtos/UpdateHeroDTO';
import { HeroResponseDTO } from '../../application/dtos/HeroResponseDTO';

export interface IHeroRepository {
    create(data: CreateHeroDTO): Promise<HeroResponseDTO>;
    findAll(page: number, search?: string): Promise<{ heroes: HeroResponseDTO[]; total: number }>;
    findById(id: string): Promise<HeroResponseDTO | null>;
    update(id: string, data: UpdateHeroDTO): Promise<HeroResponseDTO | null>;
    toggleActive(id: string, isActive: boolean): Promise<void>;
}