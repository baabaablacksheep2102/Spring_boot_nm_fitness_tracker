package com.smartcoach.backend.controller;

import com.smartcoach.backend.model.Goal;
import com.smartcoach.backend.repository.GoalRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/goals")
public class GoalController {
    private final GoalRepository goalRepository;

    public GoalController(GoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<?> createGoal(@PathVariable Long userId, @RequestBody Map<String, Object> body) {
        Goal goal = new Goal();
        goal.setUserId(userId);
        goal.setType(Goal.GoalType.valueOf((String) body.get("type")));
        goal.setTitle((String) body.get("title"));
        goal.setDescription((String) body.get("description"));
        goal.setTargetValue(Double.parseDouble(body.get("targetValue").toString()));
        goal.setTargetDate(LocalDate.parse((String) body.get("targetDate")));

        Goal saved = goalRepository.save(goal);
        Map<String, Object> resp = new HashMap<>();
        resp.put("data", saved);
        resp.put("status", 201);
        return ResponseEntity.status(201).body(resp);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getGoals(@PathVariable Long userId) {
        List<Goal> goals = goalRepository.findByUserId(userId);
        Map<String, Object> resp = new HashMap<>();
        resp.put("data", goals);
        resp.put("status", 200);
        return ResponseEntity.ok(resp);
    }

    @PutMapping("/{userId}/{goalId}")
    public ResponseEntity<?> updateGoal(@PathVariable Long userId, @PathVariable Long goalId, @RequestBody Map<String, Object> body) {
        return goalRepository.findById(goalId).filter(g -> g.getUserId().equals(userId))
                .map(goal -> {
                    if (body.containsKey("currentValue")) {
                        goal.setCurrentValue(Double.parseDouble(body.get("currentValue").toString()));
                    }
                    if (body.containsKey("status")) {
                        goal.setStatus(Goal.GoalStatus.valueOf((String) body.get("status")));
                    }
                    Goal saved = goalRepository.save(goal);
                    Map<String, Object> r = new HashMap<>();
                    r.put("data", saved);
                    r.put("status", 200);
                    return ResponseEntity.ok(r);
                })
                .orElseGet(() -> {
                    Map<String, Object> r = new HashMap<>();
                    r.put("error", "Goal not found");
                    r.put("status", 404);
                    return ResponseEntity.status(404).body(r);
                });
    }

    @DeleteMapping("/{userId}/{goalId}")
    public ResponseEntity<?> deleteGoal(@PathVariable Long userId, @PathVariable Long goalId) {
        return goalRepository.findById(goalId).filter(g -> g.getUserId().equals(userId))
                .map(goal -> {
                    goalRepository.delete(goal);
                    Map<String, Object> r = new HashMap<>();
                    r.put("status", 200);
                    return ResponseEntity.ok(r);
                })
                .orElseGet(() -> {
                    Map<String, Object> r = new HashMap<>();
                    r.put("error", "Goal not found");
                    r.put("status", 404);
                    return ResponseEntity.status(404).body(r);
                });
    }
}