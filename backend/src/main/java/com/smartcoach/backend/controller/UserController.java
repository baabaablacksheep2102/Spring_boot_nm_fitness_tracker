package com.smartcoach.backend.controller;

import com.smartcoach.backend.model.User;
import com.smartcoach.backend.repository.UserRepository;
import com.smartcoach.backend.service.TokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;
    private final TokenService tokenService;

    public UserController(UserRepository userRepository, TokenService tokenService) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable Long userId) {
        return userRepository.findById(userId)
                .map(u -> {
                    Map<String,Object> inner = new HashMap<>();
                    inner.put("userId", u.getUserId());
                    inner.put("fullName", u.getFullName());
                    inner.put("email", u.getEmail());
                    inner.put("dateOfBirth", u.getDateOfBirth());
                    inner.put("height", u.getHeight());
                    inner.put("weight", u.getWeight());
                    inner.put("profilePictureUrl", u.getProfilePictureUrl());
                    Map<String,Object> resp = new HashMap<>();
                    resp.put("data", inner);
                    return ResponseEntity.ok(resp);
                })
                .orElseGet(() -> {
                    Map<String,Object> r = new HashMap<>();
                    r.put("error", "User not found");
                    return ResponseEntity.status(404).body(r);
                });
    }

    @PostMapping("/{userId}")
    public ResponseEntity<?> updateProfile(@PathVariable Long userId, @RequestBody Map<String, Object> body) {
        return userRepository.findById(userId).map(u -> {
            if (body.containsKey("fullName")) u.setFullName((String) body.get("fullName"));
            if (body.containsKey("height")) u.setHeight(Integer.parseInt(body.get("height").toString()));
            if (body.containsKey("weight")) u.setWeight(Integer.parseInt(body.get("weight").toString()));
            userRepository.save(u);
        Map<String,Object> inner = new HashMap<>();
        inner.put("userId", u.getUserId());
        inner.put("fullName", u.getFullName());
        inner.put("email", u.getEmail());
        inner.put("dateOfBirth", u.getDateOfBirth());
        inner.put("height", u.getHeight());
        inner.put("weight", u.getWeight());
        inner.put("profilePictureUrl", u.getProfilePictureUrl());
        Map<String,Object> resp = new HashMap<>();
        resp.put("data", inner);
        return ResponseEntity.ok(resp);
        }).orElse(ResponseEntity.status(404).body(Map.of("error", "User not found")));
    }

    @PostMapping("/{userId}/uploadProfilePicture")
    public ResponseEntity<?> uploadProfilePicture(@PathVariable Long userId, @RequestParam("file") MultipartFile file) throws IOException {
        return userRepository.findById(userId).map(u -> {
            try {
                String uploadsDir = System.getProperty("user.dir") + File.separator + "backend" + File.separator + "uploads";
                new File(uploadsDir).mkdirs();
                String fileName = "avatar_" + userId + "_" + System.currentTimeMillis() + ".png";
                File dest = new File(uploadsDir + File.separator + fileName);
                file.transferTo(dest);
                String url = "/uploads/" + fileName;
                u.setProfilePictureUrl(url);
                userRepository.save(u);
                return ResponseEntity.ok(Map.of("data", Map.of("profilePictureUrl", url)));
            } catch (IOException e) {
                return ResponseEntity.status(500).body(Map.of("error", "Failed to save file"));
            }
        }).orElse(ResponseEntity.status(404).body(Map.of("error", "User not found")));
    }
}
