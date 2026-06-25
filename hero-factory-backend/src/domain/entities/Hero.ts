export class Hero {
    constructor(
        public id: string,
        public name: string,
        public nickname: string,
        public date_of_birth: Date,
        public universe: string,
        public main_power: string,
        public avatar_url: string | null,
        public is_active: boolean,
        public created_at: Date,
        public updated_at: Date
    ) { }
}