import { Request, Response } from "express";
import { IGetAllExpenses } from "../../application/expense/interface/expense-getAll-usecase.interface";

export class GetAllExpensesController {
    constructor(private expenseUsecase: IGetAllExpenses) {}

    getAll = async (req: Request, res: Response) => {
        const userId = req.user!.userId;
        const workflowId = Number(req.params.workflowId);

        if (!workflowId || isNaN(workflowId)) {
            return res.status(400).json({ error: "Invalid workflow id" });
        }

        const from = req.query.from as string | undefined;
        const to = req.query.to as string | undefined;

        const result = await this.expenseUsecase.getAll(workflowId, userId, from, to);

        return res.status(200).json({ workflow: result.workflow.toJSON(), expenses: result.expenses.map(e => e.toJSON()) });
    }
}
