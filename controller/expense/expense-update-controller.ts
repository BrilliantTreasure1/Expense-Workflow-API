import { Request, Response } from "express";
import { IUpdateExpense } from "../../application/expense/interface/expense-update-usecase.interface";

export class UpdateExpenseController {
    constructor(private expenseUsecase: IUpdateExpense) {}

    update = async (req: Request, res: Response) => {

        try {

            const userId = req.user!.userId;
            const workflowId = Number(req.params.workflowId);
            const expenseId = Number(req.params.id);

            if (!workflowId || isNaN(workflowId)) {
                return res.status(400).json({ error: "Invalid workflow id" });
            }

            if (!expenseId || isNaN(expenseId)) {
                return res.status(400).json({ error: "Invalid expense id" });
            }

            const { title, description, amount, category, date } = req.body;

            const expense = await this.expenseUsecase.update(workflowId, userId, expenseId, title, description || "", Number(amount), category || null, date);

            return res.status(200).json(expense);

        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }
}
