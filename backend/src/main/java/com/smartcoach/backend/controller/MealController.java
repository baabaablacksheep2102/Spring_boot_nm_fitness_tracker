package com.smartcoach.backend.controller;

import com.smartcoach.backend.model.Meal;
import com.smartcoach.backend.repository.MealRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/meals")
public class MealController {
    private final MealRepository mealRepository;

    public MealController(MealRepository mealRepository) {
        this.mealRepository = mealRepository;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<?> logMeal(@PathVariable Long userId, @RequestBody Map<String, Object> body) {
        Meal m = new Meal();
        m.setUserId(userId);
        m.setType((String) body.get("type"));
        m.setDate(body.get("date") == null ? LocalDate.now() : LocalDate.parse((String) body.get("date")));
        m.setFood((String) body.get("food"));
        m.setCalories(body.get("calories") == null ? 0 : Integer.parseInt(body.get("calories").toString()));
        m.setProtein(body.get("protein") == null ? 0 : Integer.parseInt(body.get("protein").toString()));
        m.setCarbs(body.get("carbs") == null ? 0 : Integer.parseInt(body.get("carbs").toString()));
        m.setFat(body.get("fat") == null ? 0 : Integer.parseInt(body.get("fat").toString()));
    Meal saved = mealRepository.save(m);
    Map<String,Object> resp = new HashMap<>();
    resp.put("data", saved);
    resp.put("status", 201);
    return ResponseEntity.status(201).body(resp);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getMeals(@PathVariable Long userId, @RequestParam(required = false) String date) {
        List<Meal> list;
        if (date != null) {
            list = mealRepository.findByUserIdAndDate(userId, LocalDate.parse(date));
        } else {
            list = mealRepository.findByUserId(userId);
        }
    Map<String,Object> resp = new HashMap<>();
    resp.put("data", list);
    resp.put("status", 200);
    return ResponseEntity.ok(resp);
    }

    @DeleteMapping("/{userId}/{mealId}")
    public ResponseEntity<?> deleteMeal(@PathVariable Long userId, @PathVariable Long mealId) {
        return mealRepository.findById(mealId).filter(m -> m.getUserId().equals(userId))
                .map(m -> {
                    mealRepository.delete(m);
                    Map<String,Object> r = new HashMap<>();
                    r.put("status", 200);
                    return ResponseEntity.ok(r);
                }).orElseGet(() -> {
                    Map<String,Object> r = new HashMap<>();
                    r.put("error", "Meal not found");
                    r.put("status", 404);
                    return ResponseEntity.status(404).body(r);
                });
    }
}
