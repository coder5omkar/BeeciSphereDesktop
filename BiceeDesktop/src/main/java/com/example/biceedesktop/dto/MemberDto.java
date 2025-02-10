package com.example.biceedesktop.dto;

import com.example.biceedesktop.entity.MemberStatus;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

public class MemberDto {
    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private String address;
    private BigDecimal amountReceived;
    private BigDecimal maturityAmount;
    private MemberStatus status;
    private Date dateJoined;
    private Date maturityDate;
    private Long todoId; // Instead of List<Todo>, we store the ID
    private List<ContryDto> contributions; // To include country details

    public MemberDto() {
    }

    public MemberDto(Long id, String name, String email, String phoneNumber, String address, BigDecimal amountReceived, BigDecimal maturityAmount, MemberStatus status, Date dateJoined, Date maturityDate, Long todoId, List<ContryDto> contributions) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.amountReceived = amountReceived;
        this.maturityAmount = maturityAmount;
        this.status = status;
        this.dateJoined = dateJoined;
        this.maturityDate = maturityDate;
        this.todoId = todoId;
        this.contributions = contributions;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setAmountReceived(BigDecimal amountReceived) {
        this.amountReceived = amountReceived;
    }

    public void setMaturityAmount(BigDecimal maturityAmount) {
        this.maturityAmount = maturityAmount;
    }

    public void setStatus(MemberStatus status) {
        this.status = status;
    }

    public void setDateJoined(Date dateJoined) {
        this.dateJoined = dateJoined;
    }

    public void setMaturityDate(Date maturityDate) {
        this.maturityDate = maturityDate;
    }

    public void setTodoId(Long todoId) {
        this.todoId = todoId;
    }

    public void setContributions(List<ContryDto> contributions) {
        this.contributions = contributions;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public BigDecimal getAmountReceived() {
        return amountReceived;
    }

    public BigDecimal getMaturityAmount() {
        return maturityAmount;
    }

    public MemberStatus getStatus() {
        return status;
    }

    public Date getDateJoined() {
        return dateJoined;
    }

    public Date getMaturityDate() {
        return maturityDate;
    }

    public Long getTodoId() {
        return todoId;
    }

    public List<ContryDto> getContributions() {
        return contributions;
    }
}
