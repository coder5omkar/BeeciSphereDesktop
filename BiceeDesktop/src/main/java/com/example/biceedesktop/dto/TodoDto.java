package com.example.biceedesktop.dto;

import com.example.biceedesktop.entity.Frequency;
import java.math.BigDecimal;
import java.time.LocalDate;

public class TodoDto {

    private Long id;
    private String title;
    private String description;
    private Frequency frequency;
    private Short numberOfInstallments;
    private BigDecimal bcAmount;
    private boolean completed;
    private LocalDate startDate;
    private LocalDate endDate;

    public TodoDto() {
    }

    public TodoDto(Long id, String title, String description, Frequency frequency, Short numberOfInstallments,
                   BigDecimal bcAmount, boolean completed, LocalDate startDate, LocalDate endDate) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.frequency = frequency;
        this.numberOfInstallments = numberOfInstallments;
        this.bcAmount = bcAmount;
        this.completed = completed;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Frequency getFrequency() {
        return frequency;
    }

    public Short getNumberOfInstallments() {
        return numberOfInstallments;
    }

    public BigDecimal getBcAmount() {
        return bcAmount;
    }

    public boolean isCompleted() {
        return completed;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setFrequency(Frequency frequency) {
        this.frequency = frequency;
    }

    public void setNumberOfInstallments(Short numberOfInstallments) {
        this.numberOfInstallments = numberOfInstallments;
    }

    public void setBcAmount(BigDecimal bcAmount) {
        this.bcAmount = bcAmount;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
}
