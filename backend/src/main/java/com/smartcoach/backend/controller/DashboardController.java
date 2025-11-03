package com.smartcoach.backend.controller;

import com.smartcoach.backend.model.Meal;
import com.smartcoach.backend.model.Workout;
import com.smartcoach.backend.repository.MealRepository;
import com.smartcoach.backend.repository.WorkoutRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final MealRepository mealRepository;
    private final WorkoutRepository workoutRepository;

    public DashboardController(MealRepository mealRepository, WorkoutRepository workoutRepository) {
        this.mealRepository = mealRepository;
        this.workoutRepository = workoutRepository;
    }

    @GetMapping("/{userId}/stats")
    public ResponseEntity<?> getStats(@PathVariable Long userId) {
        String todayStr = LocalDate.now().toString();
        LocalDate today = LocalDate.now();
        List<Meal> todayMeals = mealRepository.findByUserIdAndDate(userId, today);
        List<Workout> todayWorkouts = workoutRepository.findByUserId(userId).stream().filter(w -> today.equals(w.getDate())).toList();

        int totalCaloriesIn = todayMeals.stream().mapToInt(m -> m.getCalories() == null ? 0 : m.getCalories()).sum();
        int totalCaloriesOut = todayWorkouts.stream().mapToInt(w -> w.getCalories() == null ? 0 : w.getCalories()).sum();
        int steps = todayWorkouts.stream().mapToInt(w -> (int)Math.floor((w.getDistance() == null ? 0.0 : w.getDistance()) * 1300)).sum();

        Map<String,Object> data = new HashMap<>();
        data.put("date", todayStr);
        data.put("steps", steps);
        data.put("caloriesIn", totalCaloriesIn);
        data.put("caloriesOut", totalCaloriesOut);
        data.put("netCalories", totalCaloriesIn - totalCaloriesOut);
        data.put("workoutCount", todayWorkouts.size());
        data.put("mealCount", todayMeals.size());

    Map<String,Object> resp = new HashMap<>();
    resp.put("data", data);
    resp.put("status", 200);
    return ResponseEntity.ok(resp);
    }

    @GetMapping("/{userId}/weekly")
    public ResponseEntity<?> getWeekly(@PathVariable Long userId) {
        List<Map<String,Object>> trends = new ArrayList<>();
        LocalDate today = LocalDate.now();
        for (int i = 6; i >= 0; i--) {
            LocalDate day = today.minusDays(i);
            List<Meal> dayMeals = mealRepository.findByUserIdAndDate(userId, day);
            List<Workout> dayWorkouts = workoutRepository.findByUserId(userId).stream().filter(w -> day.equals(w.getDate())).toList();
            int caloriesIn = dayMeals.stream().mapToInt(m -> m.getCalories() == null ? 0 : m.getCalories()).sum();
            int caloriesOut = dayWorkouts.stream().mapToInt(w -> w.getCalories() == null ? 0 : w.getCalories()).sum();
            int steps = dayWorkouts.stream().mapToInt(w -> (int)Math.floor((w.getDistance() == null ? 0.0 : w.getDistance()) * 1300)).sum();
            Map<String,Object> row = new HashMap<>();
            row.put("date", day.toString());
            row.put("caloriesIn", caloriesIn);
            row.put("caloriesOut", caloriesOut);
            row.put("steps", steps);
            trends.add(row);
        }
    Map<String,Object> resp = new HashMap<>();
    resp.put("data", trends);
    resp.put("status", 200);
    return ResponseEntity.ok(resp);
    }
}
