package com.smartcoach.backend.controller;

import com.smartcoach.backend.model.User;
import com.smartcoach.backend.repository.UserRepository;
import com.smartcoach.backend.service.TokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDate;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final TokenService tokenService;

    public AuthController(UserRepository userRepository, TokenService tokenService) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> body) {
        String email = (String) body.get("email");
        if (email == null) return ResponseEntity.badRequest().body(Map.of("error", "Missing email"));

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(409).body(Map.of("error", "Email already registered"));
        }

        User u = new User();
        u.setFullName((String) body.get("fullName"));
        u.setEmail(email);
        u.setPassword((String) body.get("password"));
        String dob = (String) body.get("dateOfBirth");
        if (dob != null) u.setDateOfBirth(LocalDate.parse(dob));
        u.setHeight(body.get("height") == null ? 0 : Integer.parseInt(body.get("height").toString()));
        u.setWeight(body.get("weight") == null ? 0 : Integer.parseInt(body.get("weight").toString()));
        u.setProfilePictureUrl("/uploads/default.png");

    u = userRepository.save(u);
    String token = tokenService.createToken(u.getUserId());
    Map<String,Object> resp = new HashMap<>();
    resp.put("token", token);
    resp.put("userId", u.getUserId());
    Map<String,Object> inner = new HashMap<>();
    inner.put("userId", u.getUserId());
    inner.put("fullName", u.getFullName());
    inner.put("email", u.getEmail());
    resp.put("user", inner);
    return ResponseEntity.created(URI.create("/api/users/" + u.getUserId())).body(resp);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        if (email == null || password == null) return ResponseEntity.badRequest().body(Map.of("error", "Missing credentials"));

        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return ResponseEntity.status(404).body(Map.of("error", "User not found"));

        User u = userOpt.get();
        if (!u.getPassword().equals(password)) return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));

    String token = tokenService.createToken(u.getUserId());
    Map<String,Object> resp = new HashMap<>();
    resp.put("token", token);
    resp.put("userId", u.getUserId());
    Map<String,Object> inner = new HashMap<>();
    inner.put("userId", u.getUserId());
    inner.put("fullName", u.getFullName());
    inner.put("email", u.getEmail());
    resp.put("user", inner);
    return ResponseEntity.ok(resp);
    }
}
