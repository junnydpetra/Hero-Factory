import { Request, Response, NextFunction } from 'express';
import { HeroService } from '../../application/services/HeroService';
import { AppError } from '../../application/errors/AppError';

export class HeroController {
    constructor(private readonly heroService: HeroService) { }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const heroData = req.body;
            const newHero = await this.heroService.createHero(heroData);
            res.status(201).json(newHero);
        } catch (error) {
            next(error);
        }
    }

    async list(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = Number(req.query.page) || 1;
            const search = req.query.search as string | undefined;

            const result = await this.heroService.listHeroes(page, search);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async show(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params as { id: string };

            const hero = await this.heroService.getHeroById(id);
            res.status(200).json(hero);
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params as { id: string };
            const data = req.body;

            const updatedHero = await this.heroService.updateHero(id, data);
            res.status(200).json(updatedHero);
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params as { id: string };

            await this.heroService.deleteHero(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async reactivate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params as { id: string };

            await this.heroService.reactivateHero(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}