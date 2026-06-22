import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { registerController , loginController } from "./container/user.container";
import { createWorkflow, getAllWorkflow, updateWorkflow, deleteWorkflow, archiveWorkflow, unarchiveWorkflow } from "./container/workflow.container";
import { createExpense, getAllExpenses, updateExpense, deleteExpense } from "./container/expense.container";
import { reportOverview, reportWorkflow } from "./container/report.container";
import { authMiddleware } from "./middleware/auth";
import { errorHandler } from "./middleware/error-handler";


const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json({ limit: "1mb" }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many requests" },
});

app.post("/register", authLimiter, registerController.register);
app.post("/login", authLimiter, loginController.login);

app.post("/workflow", authMiddleware, createWorkflow.create);
app.get("/workflows", authMiddleware, getAllWorkflow.getAll);
app.put("/workflow/:id", authMiddleware, updateWorkflow.update);
app.delete("/workflow/:id", authMiddleware, deleteWorkflow.delete);
app.patch("/workflow/:id/archive", authMiddleware, archiveWorkflow.archive);
app.patch("/workflow/:id/unarchive", authMiddleware, unarchiveWorkflow.unarchive);

app.post("/workflow/:workflowId/expense", authMiddleware, createExpense.create);
app.get("/workflow/:workflowId/expenses", authMiddleware, getAllExpenses.getAll);
app.put("/workflow/:workflowId/expense/:id", authMiddleware, updateExpense.update);
app.delete("/workflow/:workflowId/expense/:id", authMiddleware, deleteExpense.delete);

app.get("/reports/overview", authMiddleware, reportOverview.getOverview);
app.get("/workflow/:workflowId/report", authMiddleware, reportWorkflow.getReport);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
