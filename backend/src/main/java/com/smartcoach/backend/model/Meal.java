package com.smartcoach.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Meal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long mealId;

    private Long userId;
    private String type;
    private LocalDate date;
    private String food;
    private Integer calories;
    private Integer protein;
    private Integer carbs;
    private Integer fat;

    // getters/setters
    public Long getMealId() { return mealId; }
    public void setMealId(Long mealId) { this.mealId = mealId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getFood() { return food; }
    public void setFood(String food) { this.food = food; }

    public Integer getCalories() { return calories; }
    public void setCalories(Integer calories) { this.calories = calories; }

    public Integer getProtein() { return protein; }
    public void setProtein(Integer protein) { this.protein = protein; }

    public Integer getCarbs() { return carbs; }
    public void setCarbs(Integer carbs) { this.carbs = carbs; }

    public Integer getFat() { return fat; }
    public void setFat(Integer fat) { this.fat = fat; }
}
