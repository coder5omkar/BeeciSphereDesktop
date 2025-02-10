package com.example.biceedesktop.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    @Column(nullable = false)
    private Frequency frequency;

    @Column(nullable = false)
    private Short numberOfInstallments;

    @Column(nullable = false)
    private BigDecimal bcAmount;

    @Column(nullable = true)
    private LocalDate startDate;

    @Column(nullable = true)
    private LocalDate endDate;

    private boolean completed;

    @OneToMany(mappedBy = "todo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Member> members;

    public Todo() {
    }

    public Todo(Long id, String title, String description, Frequency frequency, Short numberOfInstallments,
                BigDecimal bcAmount, LocalDate startDate, LocalDate endDate, boolean completed, List<Member> members) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.frequency = frequency;
        this.numberOfInstallments = numberOfInstallments;
        this.bcAmount = bcAmount;
        this.startDate = startDate;
        this.endDate = endDate;
        this.completed = completed;
        this.members = members;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public Frequency getFrequency() { return frequency; }
    public Short getNumberOfInstallments() { return numberOfInstallments; }
    public BigDecimal getBcAmount() { return bcAmount; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public boolean isCompleted() { return completed; }
    public List<Member> getMembers() { return members; }

    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setFrequency(Frequency frequency) { this.frequency = frequency; }
    public void setNumberOfInstallments(Short numberOfInstallments) { this.numberOfInstallments = numberOfInstallments; }
    public void setBcAmount(BigDecimal bcAmount) { this.bcAmount = bcAmount; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    public void setMembers(List<Member> members) { this.members = members; }
}
