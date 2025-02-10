package com.example.biceedesktop.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

public class TodoAPIException extends RuntimeException{
    private HttpStatus status;
    private String message;

    public TodoAPIException(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }

    public TodoAPIException(String message, HttpStatus status, String message1) {
        super(message);
        this.status = status;
        this.message = message1;
    }

    public HttpStatus getStatus() {
        return status;
    }

    @Override
    public String getMessage() {
        return message;
    }

    public void setStatus(HttpStatus status) {
        this.status = status;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
