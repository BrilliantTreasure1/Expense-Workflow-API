import { Request, Response } from "express";
import { ICreateExpense } from "../../application/expense/interface/expense-create-usecase.interface";

export class CreateExpenseController {
    constructor(private expenseUsecase: ICreateExpense) {}

    create = async (req: Request, res: Response) => {

        try {

            const userId = req.user!.userId;
            const workflowId = Number(req.params.workflowId);

            if (!workflowId || isNaN(workflowId)) {
                return res.status(400).json({ error: "Invalid workflow id" });
            }

            const { title, description, amount, category, date } = req.body;

            const expense = await this.expenseUsecase.create(workflowId, userId, title, description || "", Number(amount), category || null, date);

            return res.status(201).json(expense);

        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }
}
