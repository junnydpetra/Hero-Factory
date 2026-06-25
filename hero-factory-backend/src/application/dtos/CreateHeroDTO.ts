export interface CreateHeroDTO {
    id?: string;
    name: string;
    nickname: string;
    date_of_birth: Date | string;
    universe: string;
    main_power: string;
    avatar_url?: string | null;
    is_active?: boolean;
}