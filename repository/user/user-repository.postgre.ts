import { User } from "../../entities/user";
import { IUserRepository } from "./user-repository.interface";
import { pool } from "../../config/db";

export class UserRepositoryPostgresql implements IUserRepository{
    async findByEmail(email: string): Promise<User | null> {
        const query = `
        select * from users where email = $1
        `;
        const value = [email]

        const result = await pool.query(query, value);

         if (result.rows.length === 0) {
            return null;
        }

        const rawUser = result.rows[0];
        
         return User.create(
            rawUser.id,
            rawUser.username,
            rawUser.email,
            rawUser.phonenumber,
            rawUser.password
        );
    }

    async register(user: User): Promise<User | null> {
         try {
            const query = `
                INSERT INTO users (username, email, phonenumber, password) 
                VALUES ($1, $2, $3, $4) RETURNING *
            `;

            const values = [
                user.getUsername(), 
                user.getEmail(), 
                user.getPhoneNumber(), 
                user.getPassword()
            ];

            const result = await pool.query(query, values);

            const row = result.rows[0];

             if (!row) {
            return null;
        }

         return User.create(
            row.id,
            row.username,
            row.email,
            row.phonenumber,
            row.password
        );

        } catch (error) {
            console.error("Error saving user to database:", error);
            throw new Error("Could not save user to database");
        }
    }
    }
