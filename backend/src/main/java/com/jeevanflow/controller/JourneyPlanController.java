package com.jeevanflow.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jeevanflow.service.JourneyPlanService;

@RestController
@RequestMapping("/api/journey")
@CrossOrigin(origins = "http://localhost:5173")
public class JourneyPlanController {

    private final JourneyPlanService journeyPlanService;

    public JourneyPlanController(
            JourneyPlanService journeyPlanService
    ) {
        this.journeyPlanService = journeyPlanService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<Map<String, Object>> analyze(
            @RequestBody Map<String, Object> request
    ) {

        double journeyAmount =
                getDouble(request, "journeyAmount");

        double monthlyIncome =
                getDouble(request, "monthlyIncome");

        double monthlyExpenses =
                getDouble(request, "monthlyExpenses");

        double monthlySavings =
                getDouble(request, "monthlySavings");

        double existingEmi =
                getDouble(request, "existingEmi");

        String intent =
                String.valueOf(
                        request.getOrDefault(
                                "intent",
                                "EXPENSE"
                        )
                );

        Map<String, Object> result =
                journeyPlanService.analyze(
                        journeyAmount,
                        monthlyIncome,
                        monthlyExpenses,
                        monthlySavings,
                        existingEmi,
                        intent
                );

        return ResponseEntity.ok(result);
    }

    private double getDouble(
            Map<String, Object> request,
            String key
    ) {

        Object value = request.get(key);

        if (value == null) {
            return 0;
        }

        try {
            return Double.parseDouble(
                    value.toString()
            );
        } catch (NumberFormatException e) {
            return 0;
        }
    }
}