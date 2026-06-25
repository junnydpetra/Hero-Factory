import { Router } from 'express';
import { HeroRepository } from '../../infra/repositories/HeroRepository';
import { HeroService } from '../../application/services/HeroService';
import { HeroController } from '../controllers/HeroController';

const heroRepository = new HeroRepository();
const heroService = new HeroService(heroRepository);
const heroController = new HeroController(heroService);

const heroRoutes = Router();

heroRoutes.post('/', heroController.create.bind(heroController));
heroRoutes.get('/', heroController.list.bind(heroController));
heroRoutes.get('/:id', heroController.show.bind(heroController));
heroRoutes.patch('/:id', heroController.update.bind(heroController));
heroRoutes.delete('/:id', heroController.delete.bind(heroController));
heroRoutes.patch('/:id/reactivate', heroController.reactivate.bind(heroController));

export { heroRoutes };