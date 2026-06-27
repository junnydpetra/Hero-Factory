import { pool } from '../../config/database';
import { CreateHeroDTO } from '../../application/dtos/CreateHeroDTO';
import { UpdateHeroDTO } from '../../application/dtos/UpdateHeroDTO';
import { HeroResponseDTO } from '../../application/dtos/HeroResponseDTO';
import { IHeroRepository } from '../../domain/repositories/IHeroRepository';
import { RowDataPacket, ResultSetHeader, ExecuteValues } from 'mysql2';

export class HeroRepository implements IHeroRepository {

    async create(data: CreateHeroDTO): Promise<HeroResponseDTO> {
        const {
            id, name, nickname, date_of_birth, universe, main_power, avatar_url, is_active
        } = data;

        const query = `
      INSERT INTO heroes (id, name, nickname, date_of_birth, universe, main_power, avatar_url, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

        const values: ExecuteValues = [
            id as string,
            name,
            nickname,
            date_of_birth,
            universe,
            main_power,
            avatar_url || null,
            is_active !== undefined ? is_active : true
        ];

        await pool.execute(query, values);

        const result = await this.findById(id!);
        return result!;
    }

    async findAll(page: number, search?: string): Promise<{ heroes: HeroResponseDTO[]; total: number }> {
        const limit = 10;
        const offset = (page - 1) * limit;
        let searchParam = '';

        let countQuery = 'SELECT COUNT(*) as total FROM heroes';
        let countParams: ExecuteValues = [];

        let dataQuery = `
      SELECT 
        id, name, nickname, DATE_FORMAT(date_of_birth, '%Y-%m-%d %H:%i:%s') as date_of_birth,
        universe, main_power, avatar_url, is_active,
        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at,
        DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
      FROM heroes
    `;
        let dataParams: ExecuteValues = [];

        if (search && search.trim() !== '') {
            searchParam = `%${search.trim()}%`;
            const whereClause = ' WHERE name LIKE ? OR nickname LIKE ?';
            countQuery += whereClause;
            dataQuery += whereClause;
            countParams = [searchParam, searchParam];
            dataParams = [searchParam, searchParam];
        }

        dataQuery += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        dataParams.push(limit, offset);

        const [countResult] = await pool.query<RowDataPacket[]>(countQuery, countParams);
        const total = countResult[0]?.total || 0;

        const [rows] = await pool.query<RowDataPacket[]>(dataQuery, dataParams);

        return {
            heroes: rows as HeroResponseDTO[],
            total
        };
    }

    async findById(id: string): Promise<HeroResponseDTO | null> {
        const query = `
      SELECT 
        id, name, nickname, DATE_FORMAT(date_of_birth, '%Y-%m-%d %H:%i:%s') as date_of_birth,
        universe, main_power, avatar_url, is_active,
        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at,
        DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
      FROM heroes
      WHERE id = ?
    `;

        const [rows] = await pool.query<RowDataPacket[]>(query, [id]);

        if (rows.length === 0) return null;
        return rows[0] as HeroResponseDTO;
    }

    async update(id: string, data: UpdateHeroDTO): Promise<HeroResponseDTO | null> {
        const fields: string[] = [];
        const values: ExecuteValues = [];

        if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
        if (data.nickname !== undefined) { fields.push('nickname = ?'); values.push(data.nickname); }
        if (data.date_of_birth !== undefined) { fields.push('date_of_birth = ?'); values.push(data.date_of_birth); }
        if (data.universe !== undefined) { fields.push('universe = ?'); values.push(data.universe); }
        if (data.main_power !== undefined) { fields.push('main_power = ?'); values.push(data.main_power); }
        if (data.avatar_url !== undefined) { fields.push('avatar_url = ?'); values.push(data.avatar_url); }

        if (fields.length === 0) {
            return await this.findById(id);
        }

        fields.push('updated_at = NOW()');

        const query = `UPDATE heroes SET ${fields.join(', ')} WHERE id = ?`;
        values.push(id);

        const [result] = await pool.execute<ResultSetHeader>(query, values);

        if (result.affectedRows === 0) return null;

        return await this.findById(id);
    }

    async toggleActive(id: string, isActive: boolean): Promise<void> {
        const query = 'UPDATE heroes SET is_active = ?, updated_at = NOW() WHERE id = ?';
        const values: ExecuteValues = [isActive, id];
        await pool.execute(query, values);
    }
}