package com.smartcoach.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Workout {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long workoutId;

    private Long userId;
    private LocalDate date;
    private Double distance;
    private Integer avgHeartRate;
    private Integer calories;
    private String location;
    private Integer weatherTemp;
    private Integer weatherHumidity;

    // getters/setters
    public Long getWorkoutId() { return workoutId; }
    public void setWorkoutId(Long workoutId) { this.workoutId = workoutId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public Double getDistance() { return distance; }
    public void setDistance(Double distance) { this.distance = distance; }

    public Integer getAvgHeartRate() { return avgHeartRate; }
    public void setAvgHeartRate(Integer avgHeartRate) { this.avgHeartRate = avgHeartRate; }

    public Integer getCalories() { return calories; }
    public void setCalories(Integer calories) { this.calories = calories; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Integer getWeatherTemp() { return weatherTemp; }
    public void setWeatherTemp(Integer weatherTemp) { this.weatherTemp = weatherTemp; }

    public Integer getWeatherHumidity() { return weatherHumidity; }
    public void setWeatherHumidity(Integer weatherHumidity) { this.weatherHumidity = weatherHumidity; }
}
