import { Status } from "./status";
import { ValidationError } from "../errors/app-error";

export class Workflow {

    private constructor(
        readonly id: number | null,
        readonly userId: number,
        private title: string,
        private budget: number,
        private description: string,
        private createdAt: Date,
        private updatedAt: Date | null,
        private status: Status
    ) {}

    static create(id: number | null, userId: number, title: string, budget: number, description: string, status: Status = "active"): Workflow {

        if (title.length < 5) {
            throw new ValidationError("Title is too short");
        }

        if (budget < 0) {
            throw new ValidationError("Invalid budget");
        }

        return new Workflow(id, userId, title, budget, description, new Date(), null, status);
    }

    getTitle(): string {
        return this.title;
    }

    getBudget(): number {
        return this.budget;
    }

    getDescription(): string {
        return this.description;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getUpdatedAt(): Date | null {
        return this.updatedAt;
    }

    getStatus(): Status {
        return this.status;
    }

    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            title: this.title,
            budget: this.budget,
            description: this.description,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            status: this.status,
        };
    }
}
