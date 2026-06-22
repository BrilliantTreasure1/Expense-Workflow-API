import { Workflow } from "../../entities/workflow";
import { pool } from "../../config/db";
import { IWorkflowRepository, WorkflowStats } from "./workflow-repository.interface";

export class WorkflowRepositoryPostgresql implements IWorkflowRepository {
    async createWorkflow(workflow: Workflow): Promise<Workflow | null> {
        try {
            const query = `
                INSERT INTO workflows (user_id, title, budget, description, created_at, updated_at, status)
                VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
            `;

            const values = [
                workflow.userId,
                workflow.getTitle(),
                workflow.getBudget(),
                workflow.getDescription(),
                workflow.getCreatedAt(),
                workflow.getUpdatedAt(),
                workflow.getStatus()
            ];

            const result = await pool.query(query, values);
            const row = result.rows[0];

            if (!row) {
                return null;
            }

            return Workflow.create(
                row.id,
                row.user_id,
                row.title,
                Number(row.budget),
                row.description,
                row.status
            );

        } catch (error) {
            console.error("Error saving workflow to database:", error);
            throw new Error("Could not save workflow to database");
        }
    }

    async getAllByUserId(userId: number, status?: string): Promise<Workflow[]> {
        try {
            let query: string;
            let values: any[];

            if (status) {
                query = `
                    SELECT * FROM workflows WHERE user_id = $1 AND status = $2 ORDER BY created_at DESC
                `;
                values = [userId, status];
            } else {
                query = `
                    SELECT * FROM workflows WHERE user_id = $1 ORDER BY created_at DESC
                `;
                values = [userId];
            }

            const result = await pool.query(query, values);

            return result.rows.map(row =>
                Workflow.create(
                    row.id,
                    row.user_id,
                    row.title,
                    Number(row.budget),
                    row.description,
                    row.status
                )
            );

        } catch (error) {
            console.error("Error fetching workflows:", error);
            throw new Error("Could not fetch workflows");
        }
    }

    async findById(id: number, userId: number): Promise<Workflow | null> {
        try {
            const query = `
                SELECT * FROM workflows WHERE id = $1 AND user_id = $2
            `;

            const result = await pool.query(query, [id, userId]);
            const row = result.rows[0];

            if (!row) {
                return null;
            }

            return Workflow.create(
                row.id,
                row.user_id,
                row.title,
                Number(row.budget),
                row.description,
                row.status
            );

        } catch (error) {
            console.error("Error fetching workflow:", error);
            throw new Error("Could not fetch workflow");
        }
    }

    async updateWorkflow(workflow: Workflow): Promise<Workflow | null> {
        try {
            const query = `
                UPDATE workflows
                SET title = $1, budget = $2, description = $3, status = $4, updated_at = NOW()
                WHERE id = $5 AND user_id = $6
                RETURNING *
            `;

            const values = [
                workflow.getTitle(),
                workflow.getBudget(),
                workflow.getDescription(),
                workflow.getStatus(),
                workflow.id,
                workflow.userId
            ];

            const result = await pool.query(query, values);
            const row = result.rows[0];

            if (!row) {
                return null;
            }

            return Workflow.create(
                row.id,
                row.user_id,
                row.title,
                Number(row.budget),
                row.description,
                row.status
            );

        } catch (error) {
            console.error("Error updating workflow:", error);
            throw new Error("Could not update workflow");
        }
    }

    async deleteWorkflow(id: number, userId: number): Promise<Workflow | null> {
        try {
            const query = `
                DELETE FROM workflows WHERE id = $1 AND user_id = $2 RETURNING *
            `;

            const result = await pool.query(query, [id, userId]);
            const row = result.rows[0];

            if (!row) {
                return null;
            }

            return Workflow.create(
                row.id,
                row.user_id,
                row.title,
                Number(row.budget),
                row.description,
                row.status
            );

        } catch (error) {
            console.error("Error deleting workflow:", error);
            throw new Error("Could not delete workflow");
        }
    }

    async archiveWorkflow(id: number, userId: number): Promise<Workflow | null> {
        try {
            const query = `
                UPDATE workflows SET status = 'archive', updated_at = NOW()
                WHERE id = $1 AND user_id = $2
                RETURNING *
            `;

            const result = await pool.query(query, [id, userId]);
            const row = result.rows[0];

            if (!row) {
                return null;
            }

            return Workflow.create(
                row.id,
                row.user_id,
                row.title,
                Number(row.budget),
                row.description,
                row.status
            );

        } catch (error) {
            console.error("Error archiving workflow:", error);
            throw new Error("Could not archive workflow");
        }
    }

    async unarchiveWorkflow(id: number, userId: number): Promise<Workflow | null> {
        try {
            const query = `
                UPDATE workflows SET status = 'active', updated_at = NOW()
                WHERE id = $1 AND user_id = $2
                RETURNING *
            `;

            const result = await pool.query(query, [id, userId]);
            const row = result.rows[0];

            if (!row) {
                return null;
            }

            return Workflow.create(
                row.id,
                row.user_id,
                row.title,
                Number(row.budget),
                row.description,
                row.status
            );

        } catch (error) {
            console.error("Error unarchiving workflow:", error);
            throw new Error("Could not unarchive workflow");
        }
    }

    async getWorkflowStats(userId: number): Promise<WorkflowStats> {
        try {
            const query = `
                SELECT COUNT(*)::int AS total_workflows, COALESCE(SUM(budget), 0)::float AS total_budget
                FROM workflows WHERE user_id = $1
            `;
            const result = await pool.query(query, [userId]);
            return {
                totalWorkflows: Number(result.rows[0].total_workflows),
                totalBudget: Number(result.rows[0].total_budget),
            };
        } catch (error) {
            console.error("Error fetching workflow stats:", error);
            throw new Error("Could not fetch workflow stats");
        }
    }
}
