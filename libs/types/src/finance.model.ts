import { TenantEntity } from './base.model';

export interface Transaction extends TenantEntity {
    type: TransactionType,
    amount: number,
    date: Date,
    category: TransactionIncomeCategory|TransactionExpenseCategory,
    description: string,
    source
}

export enum TransactionType {
    Income = "Income",
    Expense = "Expense"
}

export enum TransactionIncomeCategory {
    Salary = "Salary",
    Residuals = "Residuals",
    Promotional = "Promotional Fee",
}

export enum TransactionExpenseCategory {
    Fuel = "Fuel",
    Marketing = "Marketing",
    Education = "Education",
}