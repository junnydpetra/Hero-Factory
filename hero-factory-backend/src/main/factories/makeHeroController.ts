import { HeroRepository } from '../../infra/repositories/HeroRepository';
import { HeroService } from '../../application/services/HeroService';
import { HeroController } from '../../presentation/controllers/HeroController';
import { IHeroRepository } from '../../domain/repositories/IHeroRepository';

export function makeHeroController(): HeroController {
    const heroRepository: IHeroRepository = new HeroRepository();
    const heroService = new HeroService(heroRepository);
    return new HeroController(heroService);
}