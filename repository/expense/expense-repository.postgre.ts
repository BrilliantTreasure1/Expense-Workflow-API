import { Expense } from "../../entities/expense";
import { pool } from "../../config/db";
import { IExpenseRepository, CategorySummary } from "./expense-repository.interface";

export class ExpenseRepositoryPostgresql implements IExpenseRepository {
    async create(expense: Expense): Promise<Expense | null> {
        try {
            const query = `
                INSERT INTO expenses (workflow_id, title, description, amount, category, date, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
            `;

            const values = [
                expense.workflowId,
                expense.getTitle(),
                expense.getDescription(),
                expense.getAmount(),
                expense.getCategory(),
                expense.getDate(),
                expense.getCreatedAt(),
                expense.getUpdatedAt()
            ];

            const result = await pool.query(query, values);
            const row = result.rows[0];

            if (!row) {
                return null;
            }

            return Expense.create(
                row.id,
                row.workflow_id,
                row.title,
                row.description,
                Number(row.amount),
                row.category,
                row.date
            );

        } catch (error) {
            console.error("Error saving expense:", error);
            throw new Error("Could not save expense");
        }
    }

    async getAllByWorkflowId(workflowId: number, from?: string, to?: string): Promise<Expense[]> {
        try {
            let query: string;
            let values: any[];

            if (from && to) {
                query = `
                    SELECT * FROM expenses
                    WHERE workflow_id = $1 AND date >= $2 AND date <= $3
                    ORDER BY date DESC
                `;
                values = [workflowId, from, to];
            } else if (from) {
                query = `
                    SELECT * FROM expenses
                    WHERE workflow_id = $1 AND date >= $2
                    ORDER BY date DESC
                `;
                values = [workflowId, from];
            } else if (to) {
                query = `
                    SELECT * FROM expenses
                    WHERE workflow_id = $1 AND date <= $2
                    ORDER BY date DESC
                `;
                values = [workflowId, to];
            } else {
                query = `
                    SELECT * FROM expenses WHERE workflow_id = $1 ORDER BY date DESC
                `;
                values = [workflowId];
            }

            const result = await pool.query(query, values);

            return result.rows.map(row =>
                Expense.create(
                    row.id,
                    row.workflow_id,
                    row.title,
                    row.description,
                    Number(row.amount),
                    row.category,
                    row.date
                )
            );

        } catch (error) {
            console.error("Error fetching expenses:", error);
            throw new Error("Could not fetch expenses");
        }
    }

    async findById(id: number): Promise<Expense | null> {
        try {
            const query = `
                SELECT * FROM expenses WHERE id = $1
            `;

            const result = await pool.query(query, [id]);
            const row = result.rows[0];

            if (!row) {
                return null;
            }

            return Expense.create(
                row.id,
                row.workflow_id,
                row.title,
                row.description,
                Number(row.amount),
                row.category,
                row.date
            );

        } catch (error) {
            console.error("Error fetching expense:", error);
            throw new Error("Could not fetch expense");
        }
    }

    async update(expense: Expense): Promise<Expense | null> {
        try {
            const query = `
                UPDATE expenses
                SET title = $1, description = $2, amount = $3, category = $4, date = $5, updated_at = NOW()
                WHERE id = $6 AND workflow_id = $7
                RETURNING *
            `;

            const values = [
                expense.getTitle(),
                expense.getDescription(),
                expense.getAmount(),
                expense.getCategory(),
                expense.getDate(),
                expense.id,
                expense.workflowId
            ];

            const result = await pool.query(query, values);
            const row = result.rows[0];

            if (!row) {
                return null;
            }

            return Expense.create(
                row.id,
                row.workflow_id,
                row.title,
                row.description,
                Number(row.amount),
                row.category,
                row.date
            );

        } catch (error) {
            console.error("Error updating expense:", error);
            throw new Error("Could not update expense");
        }
    }

    async getTotalExpensesByWorkflowId(workflowId: number): Promise<{ total: number; count: number }> {
        try {
            const query = `
                SELECT COALESCE(SUM(amount), 0) as total, COUNT(*) as count
                FROM expenses WHERE workflow_id = $1
            `;
            const result = await pool.query(query, [workflowId]);
            return { total: Number(result.rows[0].total), count: Number(result.rows[0].count) };
        } catch (error) {
            console.error("Error fetching total expenses:", error);
            throw new Error("Could not fetch total expenses");
        }
    }

    async getCategorySummaryByWorkflowId(workflowId: number): Promise<CategorySummary[]> {
        try {
            const query = `
                SELECT category, COUNT(*) as count, SUM(amount) as total
                FROM expenses WHERE workflow_id = $1
                GROUP BY category ORDER BY total DESC
            `;
            const result = await pool.query(query, [workflowId]);
            return result.rows.map(row => ({
                category: row.category,
                count: Number(row.count),
                total: Number(row.total),
            }));
        } catch (error) {
            console.error("Error fetching category summary:", error);
            throw new Error("Could not fetch category summary");
        }
    }

    async getTotalExpensesByUserId(userId: number): Promise<number> {
        try {
            const query = `
                SELECT COALESCE(SUM(e.amount), 0) as total
                FROM expenses e
                JOIN workflows w ON w.id = e.workflow_id
                WHERE w.user_id = $1
            `;
            const result = await pool.query(query, [userId]);
            return Number(result.rows[0].total);
        } catch (error) {
            console.error("Error fetching total expenses:", error);
            throw new Error("Could not fetch total expenses");
        }
    }

    async getCategorySummaryByUserId(userId: number): Promise<CategorySummary[]> {
        try {
            const query = `
                SELECT e.category, COUNT(*) as count, SUM(e.amount) as total
                FROM expenses e
                JOIN workflows w ON w.id = e.workflow_id
                WHERE w.user_id = $1
                GROUP BY e.category ORDER BY total DESC
            `;
            const result = await pool.query(query, [userId]);
            return result.rows.map(row => ({
                category: row.category,
                count: Number(row.count),
                total: Number(row.total),
            }));
        } catch (error) {
            console.error("Error fetching category summary:", error);
            throw new Error("Could not fetch category summary");
        }
    }

    async delete(id: number, workflowId: number): Promise<Expense | null> {
        try {
            const query = `
                DELETE FROM expenses WHERE id = $1 AND workflow_id = $2 RETURNING *
            `;

            const result = await pool.query(query, [id, workflowId]);
            const row = result.rows[0];

            if (!row) {
                return null;
            }

            return Expense.create(
                row.id,
                row.workflow_id,
                row.title,
                row.description,
                Number(row.amount),
                row.category,
                row.date
            );

        } catch (error) {
            console.error("Error deleting expense:", error);
            throw new Error("Could not delete expense");
        }
    }
}
