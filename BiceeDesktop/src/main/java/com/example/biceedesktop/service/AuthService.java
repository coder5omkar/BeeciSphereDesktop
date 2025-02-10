package com.example.biceedesktop.service;


import com.example.biceedesktop.dto.LoginDto;
import com.example.biceedesktop.dto.RegisterDto;

public interface AuthService {
    String register(RegisterDto registerDto);

    String login(LoginDto loginDto);
}
