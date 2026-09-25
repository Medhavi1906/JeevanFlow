package com.jeevanflow.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.jeevanflow.model.FinancialProfile;

@Service
public class LoanWhatIfService {

    public Map<String, Object> simulateLoan(
            FinancialProfile profile,
            double loanAmount,
            double annualInterestRate,
            int tenureYears) {

        double income = profile.getMonthlyIncome();
        double existingEmi = profile.getExistingEmi();
        double expenses = profile.getMonthlyExpenses();

        // Convert annual interest rate to monthly rate
        double monthlyRate = annualInterestRate / 12 / 100;

        // Convert years to months
        int months = tenureYears * 12;

        // Calculate new loan EMI
        double newEmi;

        if (monthlyRate == 0) {
            newEmi = loanAmount / months;
        } else {
            newEmi = loanAmount * monthlyRate
                    * Math.pow(1 + monthlyRate, months)
                    / (Math.pow(1 + monthlyRate, months) - 1);
        }

        // Total EMI after taking the new loan
        double totalEmi = existingEmi + newEmi;

        // New disposable income
        double disposableIncome = income - expenses - totalEmi;

        // New debt-to-income ratio
        double dti = 0;

        if (income > 0) {
            dti = (totalEmi / income) * 100;
        }

        String riskLevel;

        if (disposableIncome <= 0 || dti > 40) {
            riskLevel = "HIGH";
        } else if (dti > 30 || disposableIncome < income * 0.10) {
            riskLevel = "MODERATE";
        } else {
            riskLevel = "LOW";
        }

        Map<String, Object> result = new HashMap<>();

        result.put("loanAmount", loanAmount);
        result.put("annualInterestRate", annualInterestRate);
        result.put("tenureYears", tenureYears);
        result.put("newLoanEmi", newEmi);
        result.put("totalEmi", totalEmi);
        result.put("disposableIncome", disposableIncome);
        result.put("debtToIncomeRatio", dti);
        result.put("riskLevel", riskLevel);

        return result;
    }
}