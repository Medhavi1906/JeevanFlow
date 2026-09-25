package com.jeevanflow.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jeevanflow.model.FinancialProfile;
import com.jeevanflow.repository.FinancialProfileRepository;
import com.jeevanflow.service.WhatIfService;

@RestController
@RequestMapping("/api/what-if")
public class WhatIfController {

    private final WhatIfService whatIfService;
    private final FinancialProfileRepository repository;

    public WhatIfController(
            WhatIfService whatIfService,
            FinancialProfileRepository repository) {
        this.whatIfService = whatIfService;
        this.repository = repository;
    }

    @GetMapping("/income-drop/{id}")
    public Map<String, Object> simulateIncomeDrop(
            @PathVariable Long id,
            @RequestParam double dropPercentage) {

        FinancialProfile profile = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        return whatIfService.simulateIncomeDrop(profile, dropPercentage);
    }
}