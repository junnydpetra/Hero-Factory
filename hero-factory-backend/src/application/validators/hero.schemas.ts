import { z } from 'zod';

export const createHeroSchema = z.object({
    name: z.string()
        .min(1, 'Nome biológico do herói é obrigatório!')
        .max(255),
    nickname: z.string()
        .min(1, 'Nome de guerra do herói é obrigatório!')
        .max(255),
    date_of_birth: z.coerce.date(),
    universe: z.string()
        .min(1, 'Universo do herói é obrigatório')
        .max(100),
    main_power: z.string()
        .min(1, 'Habilidade do herói é obrigatória')
        .max(255),
    avatar_url: z.string()
        .url('Avatar deve ser uma URL válida')
        .max(500)
        .optional()
        .nullable(),
});

export const updateHeroSchema = createHeroSchema.partial();