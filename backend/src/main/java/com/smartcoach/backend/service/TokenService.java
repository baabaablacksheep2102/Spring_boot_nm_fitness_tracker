package com.smartcoach.backend.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenService {
    private final Map<String, Long> tokenToUser = new ConcurrentHashMap<>();

    public String createToken(Long userId) {
        String token = UUID.randomUUID().toString();
        tokenToUser.put(token, userId);
        return token;
    }

    public Long getUserIdFromToken(String token) {
        return tokenToUser.get(token);
    }

    public void invalidateToken(String token) {
        tokenToUser.remove(token);
    }
}
