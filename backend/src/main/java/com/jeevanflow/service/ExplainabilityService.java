package com.jeevanflow.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.jeevanflow.model.FinancialProfile;

@Service
public class ExplainabilityService {

    public Map<String, Object> explain(FinancialProfile profile) {

        double income = profile.getMonthlyIncome();
        double expenses = profile.getMonthlyExpenses();
        double emi = profile.getExistingEmi();
        double savings = profile.getSavings();

        double disposableIncome = income - expenses - emi;

        double dti = 0;

        if (income > 0) {
            dti = (emi / income) * 100;
        }

        double monthlyNeed = expenses + emi;

        double emergencyRunway = 0;

        if (monthlyNeed > 0) {
            emergencyRunway = savings / monthlyNeed;
        }

        List<String> factors = new ArrayList<>();

        if (dti > 40) {
            factors.add(
                "Your EMI burden is high compared with your monthly income."
            );
        } else if (dti > 30) {
            factors.add(
                "Your EMI burden is moderately high compared with your monthly income."
            );
        } else {
            factors.add(
                "Your current EMI burden is within a manageable range."
            );
        }

        if (emergencyRunway < 3) {
            factors.add(
                "Your emergency savings cover less than 3 months of essential needs."
            );
        } else if (emergencyRunway < 6) {
            factors.add(
                "Your emergency savings provide a moderate safety buffer."
            );
        } else {
            factors.add(
                "Your emergency savings provide a strong safety buffer."
            );
        }

        if (disposableIncome <= 0) {
            factors.add(
                "Your current income does not fully cover expenses and EMI."
            );
        } else {
            factors.add(
                "You currently have positive disposable income after expenses and EMI."
            );
        }

        String riskLevel;

        if (dti > 40 || emergencyRunway < 1 || disposableIncome <= 0) {
            riskLevel = "HIGH";
        } else if (dti > 30 || emergencyRunway < 3) {
            riskLevel = "MODERATE";
        } else {
            riskLevel = "LOW";
        }

        List<String> assumptions = new ArrayList<>();

        assumptions.add(
            "The analysis uses your current monthly income, expenses, EMI and savings."
        );

        assumptions.add(
            "Expenses are assumed to remain relatively stable during the analysis."
        );

        assumptions.add(
            "The calculation does not predict future market returns or unexpected income."
        );

        Map<String, Object> result = new HashMap<>();

        result.put("riskLevel", riskLevel);
        result.put("debtToIncomeRatio", dti);
        result.put("emergencyRunwayMonths", emergencyRunway);
        result.put("disposableIncome", disposableIncome);
        result.put("keyFactors", factors);
        result.put("assumptions", assumptions);

        return result;
    }
}