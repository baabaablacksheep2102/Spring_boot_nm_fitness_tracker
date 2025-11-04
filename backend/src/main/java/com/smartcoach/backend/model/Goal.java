package com.smartcoach.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Goal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long goalId;

    private Long userId;
    
    @Enumerated(EnumType.STRING)
    private GoalType type;
    
    private String title;
    private String description;
    private Double targetValue;
    private Double currentValue;
    private LocalDate targetDate;
    
    @Enumerated(EnumType.STRING)
    private GoalStatus status;

    public enum GoalType {
        WEIGHT, CALORIES_BURN, CALORIES_INTAKE, WORKOUT_FREQUENCY, DISTANCE
    }

    public enum GoalStatus {
        ACTIVE, COMPLETED, PAUSED
    }

    // Constructors
    public Goal() {
        this.currentValue = 0.0;
        this.status = GoalStatus.ACTIVE;
    }

    // Getters and Setters
    public Long getGoalId() { return goalId; }
    public void setGoalId(Long goalId) { this.goalId = goalId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public GoalType getType() { return type; }
    public void setType(GoalType type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getTargetValue() { return targetValue; }
    public void setTargetValue(Double targetValue) { this.targetValue = targetValue; }

    public Double getCurrentValue() { return currentValue; }
    public void setCurrentValue(Double currentValue) { this.currentValue = currentValue; }

    public LocalDate getTargetDate() { return targetDate; }
    public void setTargetDate(LocalDate targetDate) { this.targetDate = targetDate; }

    public GoalStatus getStatus() { return status; }
    public void setStatus(GoalStatus status) { this.status = status; }
}