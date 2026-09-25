package com.jeevanflow.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jeevanflow.model.FinancialProfile;
import com.jeevanflow.repository.FinancialProfileRepository;
import com.jeevanflow.service.FinancialHealthService;

@RestController
@RequestMapping("/api/health")
public class FinancialHealthController {

    private final FinancialHealthService healthService;
    private final FinancialProfileRepository repository;

    public FinancialHealthController(
            FinancialHealthService healthService,
            FinancialProfileRepository repository) {
        this.healthService = healthService;
        this.repository = repository;
    }

    @GetMapping("/{id}")
    public Map<String, Object> getFinancialHealth(@PathVariable Long id) {

        FinancialProfile profile = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        return healthService.calculateHealth(profile);
    }
}