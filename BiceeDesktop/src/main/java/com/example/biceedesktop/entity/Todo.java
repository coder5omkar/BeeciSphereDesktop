package com.example.biceedesktop.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "todos")
public class Todo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false)
    private Frequency frequency;

    @Column(nullable = false)
    private Short numberOfInstallments;

    @Column(nullable = false)
    private BigDecimal bcAmount;

    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate currentInstDate;
    private BigDecimal currentInstAmount;
    private BigDecimal nextInstAmount;
    private LocalDate nextInstDate;
    private boolean completed;


    @OneToMany(mappedBy = "todo", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Member> members;

    @OneToMany(mappedBy = "todo", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonIgnore
    private List<Bid> bids;
    private Double biceeBalance;

    public Todo() {}

    public Todo(Long id, String title, String description, Frequency frequency, Short numberOfInstallments, BigDecimal bcAmount, LocalDate startDate, LocalDate endDate, LocalDate currentInstDate, BigDecimal currentInstAmount, BigDecimal nextInstAmount, LocalDate nextInstDate, boolean completed, List<Member> members, List<Bid> bids, Double biceeBalance) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.frequency = frequency;
        this.numberOfInstallments = numberOfInstallments;
        this.bcAmount = bcAmount;
        this.startDate = startDate;
        this.endDate = endDate;
        this.currentInstDate = currentInstDate;
        this.currentInstAmount = currentInstAmount;
        this.nextInstAmount = nextInstAmount;
        this.nextInstDate = nextInstDate;
        this.completed = completed;
        this.members = members;
        this.bids = bids;
        this.biceeBalance = biceeBalance;
    }

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

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public List<Member> getMembers() {
        return members;
    }

    public void setMembers(List<Member> members) {
        this.members = members;
    }

    public List<Bid> getBids() {
        return bids;
    }

    public void setBids(List<Bid> bids) {
        this.bids = bids;
    }

    public Double getBiceeBalance() {
        return biceeBalance;
    }

    public void setBiceeBalance(Double biceeBalance) {
        this.biceeBalance = biceeBalance;
    }
}
