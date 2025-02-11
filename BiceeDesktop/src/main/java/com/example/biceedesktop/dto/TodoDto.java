package com.example.biceedesktop.dto;

import com.example.biceedesktop.entity.Frequency;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

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
    private LocalDate currentInstDate;
    private BigDecimal currentInstAmount;
    private BigDecimal nextInstAmount;
    private LocalDate nextInstDate;
    private List<Long> bids;
    private List<Long> members;

    public TodoDto() {}

    public TodoDto(Long id, String title, String description, Frequency frequency,
                   Short numberOfInstallments, BigDecimal bcAmount, boolean completed,
                   LocalDate startDate, LocalDate endDate, LocalDate currentInstDate,
                   BigDecimal currentInstAmount, BigDecimal nextInstAmount, LocalDate nextInstDate,
                   List<Long> bids, List<Long> members) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.frequency = frequency;
        this.numberOfInstallments = numberOfInstallments;
        this.bcAmount = bcAmount;
        this.completed = completed;
        this.startDate = startDate;
        this.endDate = endDate;
        this.currentInstDate = currentInstDate;
        this.currentInstAmount = currentInstAmount;
        this.nextInstAmount = nextInstAmount;
        this.nextInstDate = nextInstDate;
        this.bids = bids;
        this.members = members;
    }

    // Getters and Setters (Generated)

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Frequency getFrequency() {
        return frequency;
    }

    public void setFrequency(Frequency frequency) {
        this.frequency = frequency;
    }

    public Short getNumberOfInstallments() {
        return numberOfInstallments;
    }

    public void setNumberOfInstallments(Short numberOfInstallments) {
        this.numberOfInstallments = numberOfInstallments;
    }

    public BigDecimal getBcAmount() {
        return bcAmount;
    }

    public void setBcAmount(BigDecimal bcAmount) {
        this.bcAmount = bcAmount;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public LocalDate getCurrentInstDate() {
        return currentInstDate;
    }

    public void setCurrentInstDate(LocalDate currentInstDate) {
        this.currentInstDate = currentInstDate;
    }

    public BigDecimal getCurrentInstAmount() {
        return currentInstAmount;
    }

    public void setCurrentInstAmount(BigDecimal currentInstAmount) {
        this.currentInstAmount = currentInstAmount;
    }

    public BigDecimal getNextInstAmount() {
        return nextInstAmount;
    }

    public void setNextInstAmount(BigDecimal nextInstAmount) {
        this.nextInstAmount = nextInstAmount;
    }

    public LocalDate getNextInstDate() {
        return nextInstDate;
    }

    public void setNextInstDate(LocalDate nextInstDate) {
        this.nextInstDate = nextInstDate;
    }

    public List<Long> getBids() {
        return bids;
    }

    public void setBids(List<Long> bids) {
        this.bids = bids;
    }

    public List<Long> getMembers() {
        return members;
    }

    public void setMembers(List<Long> members) {
        this.members = members;
    }
}
