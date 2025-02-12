package com.example.biceedesktop.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Bid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double amount;

    @Temporal(TemporalType.DATE)
    private Date bidDate;

    @ManyToOne
    @JoinColumn(name = "todo_id", nullable = true)
    @JsonIgnore   // Prevent recursion
    private Todo todo;

    @OneToOne
    @JoinColumn(name = "member_id", unique = true, nullable = true)
    @JsonIgnore   // Prevent recursion
    private Member member;

    public Bid() {
    }

    public Bid(Long id, Double amount, Date bidDate, Todo todo, Member member) {
        this.id = id;
        this.amount = amount;
        this.bidDate = bidDate;
        this.todo = todo;
        this.member = member;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Date getBidDate() {
        return bidDate;
    }

    public void setBidDate(Date bidDate) {
        this.bidDate = bidDate;
    }

    public Todo getTodo() {
        return todo;
    }

    public void setTodo(Todo todo) {
        this.todo = todo;
    }

    public Member getMember() {
        return member;
    }

    public void setMember(Member member) {
        this.member = member;
    }
}
