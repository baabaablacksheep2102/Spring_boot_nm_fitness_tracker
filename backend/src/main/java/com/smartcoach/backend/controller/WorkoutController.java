package com.smartcoach.backend.controller;

import com.smartcoach.backend.model.Workout;
import com.smartcoach.backend.repository.WorkoutRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/workouts")
public class WorkoutController {
    private final WorkoutRepository workoutRepository;

    public WorkoutController(WorkoutRepository workoutRepository) {
        this.workoutRepository = workoutRepository;
    }

    @PostMapping("/{userId}/upload")
    public ResponseEntity<?> uploadWorkout(@PathVariable Long userId,
                                           @RequestParam("file") MultipartFile file,
                                           @RequestParam Map<String,String> params) throws IOException {
        // minimal validation
        if (!params.containsKey("date") || !params.containsKey("location")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing date or location", "status",400));
        }

        Workout w = new Workout();
        w.setUserId(userId);
        w.setDate(LocalDate.parse(params.get("date")));
        w.setLocation(params.get("location"));
        w.setDistance(Math.round((Math.random() * 10 + 2) * 100.0) / 100.0);
        w.setAvgHeartRate((int)(Math.random() * 50 + 120));
        w.setCalories((int)(Math.random() * 200 + 200));
        w.setWeatherTemp((int)(Math.random() * 15 + 10));
        w.setWeatherHumidity((int)(Math.random() * 30 + 50));

        // Optionally save file under uploads (not used by frontend directly)
        String uploadsDir = System.getProperty("user.dir") + File.separator + "backend" + File.separator + "uploads";
        new File(uploadsDir).mkdirs();
        String fileName = "workout_" + userId + "_" + System.currentTimeMillis() + ".upload";
        File dest = new File(uploadsDir + File.separator + fileName);
        file.transferTo(dest);

    Workout saved = workoutRepository.save(w);
    Map<String,Object> resp = new HashMap<>();
    resp.put("data", saved);
    resp.put("status", 201);
    return ResponseEntity.status(201).body(resp);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getWorkouts(@PathVariable Long userId) {
        List<Workout> list = workoutRepository.findByUserId(userId);
    Map<String,Object> resp = new HashMap<>();
    resp.put("data", list);
    resp.put("status", 200);
    return ResponseEntity.ok(resp);
    }

    @GetMapping("/{userId}/{workoutId}")
    public ResponseEntity<?> getWorkoutById(@PathVariable Long userId, @PathVariable Long workoutId) {
        return workoutRepository.findById(workoutId).filter(w -> w.getUserId().equals(userId))
                .map(w -> {
                    Map<String,Object> r = new HashMap<>();
                    r.put("data", w);
                    r.put("status", 200);
                    return ResponseEntity.ok(r);
                })
                .orElseGet(() -> {
                    Map<String,Object> r = new HashMap<>();
                    r.put("error", "Workout not found");
                    r.put("status", 404);
                    return ResponseEntity.status(404).body(r);
                });
    }

    @DeleteMapping("/{userId}/{workoutId}")
    public ResponseEntity<?> deleteWorkout(@PathVariable Long userId, @PathVariable Long workoutId) {
        return workoutRepository.findById(workoutId).filter(w -> w.getUserId().equals(userId))
                .map(w -> {
                    workoutRepository.delete(w);
                    Map<String,Object> r = new HashMap<>();
                    r.put("status", 200);
                    return ResponseEntity.ok(r);
                }).orElseGet(() -> {
                    Map<String,Object> r = new HashMap<>();
                    r.put("error", "Workout not found");
                    r.put("status", 404);
                    return ResponseEntity.status(404).body(r);
                });
    }
}
