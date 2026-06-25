export interface HeroResponseDTO {
    id: string;
    name: string;
    nickname: string;
    date_of_birth: string;
    universe: string;
    main_power: string;
    avatar_url: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}