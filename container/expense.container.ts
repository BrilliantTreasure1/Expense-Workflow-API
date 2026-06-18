import { CreateExpense } from "../application/expense/expense-create-usecase"
import { GetAllExpenses } from "../application/expense/expense-getAll-usecase"
import { UpdateExpense } from "../application/expense/expense-update-usecase"
import { DeleteExpense } from "../application/expense/expense-delete-usecase"
import { CreateExpenseController } from "../controller/expense/expense-create-controller"
import { GetAllExpensesController } from "../controller/expense/expense-getAll-controller"
import { UpdateExpenseController } from "../controller/expense/expense-update-controller"
import { DeleteExpenseController } from "../controller/expense/expense-delete-controller"
import { ExpenseRepositoryPostgresql } from "../repository/expense/expense-repository.postgre"
import { WorkflowRepositoryPostgresql } from "../repository/workflow/workflow-repository.postgre"


const expenseRepo = new ExpenseRepositoryPostgresql()
const workflowRepo = new WorkflowRepositoryPostgresql()

const createExpenseUsecase = new CreateExpense(expenseRepo, workflowRepo)
export const createExpense = new CreateExpenseController(createExpenseUsecase)

const getAllExpensesUsecase = new GetAllExpenses(expenseRepo, workflowRepo)
export const getAllExpenses = new GetAllExpensesController(getAllExpensesUsecase)

const updateExpenseUsecase = new UpdateExpense(expenseRepo, workflowRepo)
export const updateExpense = new UpdateExpenseController(updateExpenseUsecase)

const deleteExpenseUsecase = new DeleteExpense(expenseRepo, workflowRepo)
export const deleteExpense = new DeleteExpenseController(deleteExpenseUsecase)
