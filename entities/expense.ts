export class Expense {

    private constructor(
        readonly id: number | null,
        readonly workflowId: number,
        private title: string,
        private description: string,
        private amount: number,
        private category: string | null,
        private date: Date,
        private createdAt: Date,
        private updatedAt: Date | null
    ) {}

    static create(
        id: number | null,
        workflowId: number,
        title: string,
        description: string,
        amount: number,
        category: string | null,
        date: Date
    ): Expense {

        if (!title || title.length < 1) {
            throw new Error("Title is required");
        }

        if (amount <= 0) {
            throw new Error("Amount must be greater than zero");
        }

        return new Expense(id, workflowId, title, description, amount, category, date, new Date(), null);
    }

    getTitle(): string {
        return this.title;
    }

    getDescription(): string {
        return this.description;
    }

    getAmount(): number {
        return this.amount;
    }

    getCategory(): string | null {
        return this.category;
    }

    getDate(): Date {
        return this.date;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getUpdatedAt(): Date | null {
        return this.updatedAt;
    }

    toJSON() {
        return {
            id: this.id,
            workflowId: this.workflowId,
            title: this.title,
            description: this.description,
            amount: this.amount,
            category: this.category,
            date: this.date,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
