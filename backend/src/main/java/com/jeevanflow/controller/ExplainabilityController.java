package com.jeevanflow.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jeevanflow.model.FinancialProfile;
import com.jeevanflow.repository.FinancialProfileRepository;
import com.jeevanflow.service.ExplainabilityService;

@RestController
@RequestMapping("/api/explain")
public class ExplainabilityController {

    private final ExplainabilityService service;
    private final FinancialProfileRepository repository;

    public ExplainabilityController(
            ExplainabilityService service,
            FinancialProfileRepository repository) {
        this.service = service;
        this.repository = repository;
    }

    @GetMapping("/{id}")
    public Map<String, Object> explainFinancialHealth(
            @PathVariable Long id) {

        FinancialProfile profile = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        return service.explain(profile);
    }
}