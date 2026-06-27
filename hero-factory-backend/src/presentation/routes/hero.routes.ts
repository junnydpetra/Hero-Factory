import { Router } from 'express';
import { makeHeroController } from '../../main/factories/makeHeroController';
import { validate } from '../middlewares/validate';
import { createHeroSchema, updateHeroSchema } from '../../application/validators/hero.schemas';

const heroController = makeHeroController();

const heroRoutes = Router();

heroRoutes.post('/', validate(createHeroSchema), heroController.create.bind(heroController));
heroRoutes.get('/', heroController.list.bind(heroController));
heroRoutes.get('/:id', heroController.show.bind(heroController));
heroRoutes.patch('/:id', validate(updateHeroSchema), heroController.update.bind(heroController));
heroRoutes.delete('/:id', heroController.delete.bind(heroController));
heroRoutes.patch('/:id/reactivate', heroController.reactivate.bind(heroController));

export { heroRoutes };