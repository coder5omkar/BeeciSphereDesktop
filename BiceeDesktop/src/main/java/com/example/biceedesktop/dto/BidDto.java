package com.example.biceedesktop.dto;

import java.util.Date;

public class BidDto {

    private Long id;
    private Double bidAmount;
    private Date bidDate;
    private Long todoId;
    private Long bidWinner;

    public BidDto() {
    }

    public BidDto(Long id, Double amount, Date bidDate, Long todo, Long member) {
        this.id = id;
        this.bidAmount = amount;
        this.bidDate = bidDate;
        this.todoId = todo;
        this.bidWinner = member;
    }

    public java.lang.Long getId() {
        return id;
    }

    public void setId(java.lang.Long id) {
        this.id = id;
    }

    public Double getBidAmount() {
        return bidAmount;
    }

    public void setBidAmount(Double bidAmount) {
        this.bidAmount = bidAmount;
    }

    public Date getBidDate() {
        return bidDate;
    }

    public void setBidDate(Date bidDate) {
        this.bidDate = bidDate;
    }

    public Long getTodoId() {
        return todoId;
    }

    public void setTodoId(Long todoId) {
        this.todoId = todoId;
    }

    public Long getBidWinner() {
        return bidWinner;
    }

    public void setBidWinner(Long bidWinner) {
        this.bidWinner = bidWinner;
    }
}
