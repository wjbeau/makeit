import { TenantEntity } from './base.model';
import { HasAttachments } from './attachment.model';

export interface Transaction extends TenantEntity, HasAttachments {
    type: TransactionType;
    amount: number;
    date: Date;
    category: TransactionIncomeCategory|TransactionExpenseCategory;
    description: string;
    relatesTo;
    relatesToType: TransactionRelationType;
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

export enum TransactionRelationType {
    Project = "Project",
    Audition = "Audition",
}