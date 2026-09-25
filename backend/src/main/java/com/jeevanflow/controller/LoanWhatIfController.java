package com.jeevanflow.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jeevanflow.model.FinancialProfile;
import com.jeevanflow.repository.FinancialProfileRepository;
import com.jeevanflow.service.LoanWhatIfService;

@RestController
@RequestMapping("/api/what-if")
public class LoanWhatIfController {

    private final LoanWhatIfService loanWhatIfService;
    private final FinancialProfileRepository repository;

    public LoanWhatIfController(
            LoanWhatIfService loanWhatIfService,
            FinancialProfileRepository repository) {
        this.loanWhatIfService = loanWhatIfService;
        this.repository = repository;
    }

    @GetMapping("/loan/{id}")
    public Map<String, Object> simulateLoan(
            @PathVariable Long id,
            @RequestParam double loanAmount,
            @RequestParam double interestRate,
            @RequestParam int tenureYears) {

        FinancialProfile profile = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        return loanWhatIfService.simulateLoan(
                profile,
                loanAmount,
                interestRate,
                tenureYears
        );
    }
}