package com.jeevanflow.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.jeevanflow.model.FinancialProfile;

@Service
public class FinancialHealthService {

    public Map<String, Object> calculateHealth(FinancialProfile profile) {

        double income = profile.getMonthlyIncome();
        double expenses = profile.getMonthlyExpenses();
        double emi = profile.getExistingEmi();
        double savings = profile.getSavings();

        // Debt-to-Income Ratio
        double dti = 0;
        if (income > 0) {
            dti = (emi / income) * 100;
        }

        // Money left after expenses and EMI
        double disposableIncome = income - expenses - emi;

        // How many months savings can cover expenses
        double emergencyRunway = 0;
        if (expenses > 0) {
            emergencyRunway = savings / expenses;
        }

        // Start with a score of 100
        double score = 100;

        // Debt penalty
        if (dti > 40) {
            score -= 25;
        } else if (dti > 30) {
            score -= 15;
        } else if (dti > 20) {
            score -= 5;
        }

        // Emergency savings penalty
        if (emergencyRunway < 3) {
            score -= 25;
        } else if (emergencyRunway < 6) {
            score -= 10;
        }

        // Disposable income penalty
        if (disposableIncome <= 0) {
            score -= 25;
        }

        // Keep score between 0 and 100
        score = Math.max(0, Math.min(100, score));

        String riskLevel;

        if (score >= 80) {
            riskLevel = "LOW";
        } else if (score >= 60) {
            riskLevel = "MODERATE";
        } else {
            riskLevel = "HIGH";
        }

        Map<String, Object> result = new HashMap<>();

        result.put("financialHealthScore", score);
        result.put("riskLevel", riskLevel);
        result.put("debtToIncomeRatio", dti);
        result.put("disposableIncome", disposableIncome);
        result.put("emergencyRunwayMonths", emergencyRunway);

        return result;
    }
}