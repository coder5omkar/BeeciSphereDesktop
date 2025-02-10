package com.example.biceedesktop.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {
    @GetMapping({"/", "/{path:[^\\.]*}"})
    public String forwardToReact() {
        return "forward:/index.html";
    }
}
