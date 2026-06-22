import { Request, Response } from "express";
import { IDeleteExpense } from "../../application/expense/interface/expense-delete-usecase.interface";

export class DeleteExpenseController {
    constructor(private expenseUsecase: IDeleteExpense) {}

    delete = async (req: Request, res: Response) => {
        const userId = req.user!.userId;
        const workflowId = Number(req.params.workflowId);
        const expenseId = Number(req.params.id);

        if (!workflowId || isNaN(workflowId)) {
            return res.status(400).json({ error: "Invalid workflow id" });
        }

        if (!expenseId || isNaN(expenseId)) {
            return res.status(400).json({ error: "Invalid expense id" });
        }

        const expense = await this.expenseUsecase.delete(workflowId, userId, expenseId);

        return res.status(200).json(expense);
    }
}
