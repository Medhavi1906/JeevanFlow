package com.jeevanflow.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.jeevanflow.model.FinancialProfile;

@Service
public class WhatIfService {

    public Map<String, Object> simulateIncomeDrop(
            FinancialProfile profile, double dropPercentage) {

        double currentIncome = profile.getMonthlyIncome();
        double expenses = profile.getMonthlyExpenses();
        double emi = profile.getExistingEmi();

        // Calculate new income after the drop
        double newIncome = currentIncome * (1 - dropPercentage / 100);

        // Calculate remaining money
        double newDisposableIncome = newIncome - expenses - emi;

        // Calculate new debt-to-income ratio
        double newDti = 0;

        if (newIncome > 0) {
            newDti = (emi / newIncome) * 100;
        }

        String riskLevel;

        if (newDisposableIncome <= 0 || newDti > 40) {
            riskLevel = "HIGH";
        } else if (newDti > 30 || newDisposableIncome < currentIncome * 0.1) {
            riskLevel = "MODERATE";
        } else {
            riskLevel = "LOW";
        }

        Map<String, Object> result = new HashMap<>();

        result.put("originalIncome", currentIncome);
        result.put("incomeDropPercentage", dropPercentage);
        result.put("simulatedIncome", newIncome);
        result.put("simulatedDisposableIncome", newDisposableIncome);
        result.put("simulatedDebtToIncomeRatio", newDti);
        result.put("riskLevel", riskLevel);

        return result;
    }
}