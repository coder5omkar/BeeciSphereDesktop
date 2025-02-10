package com.example.biceedesktop.dto;

import java.math.BigInteger;
import java.util.Date;

public class ContryDto {

    private Long id;
    private BigInteger amount;

    public ContryDto() {
    }

    private Date countryDate;
    private Short numberOfInst;
    private Long memberId;

    public ContryDto(Long id, BigInteger amount, Date countryDate, Short numberOfInst, Long memberId) {
        this.id = id;
        this.amount = amount;
        this.countryDate = countryDate;
        this.numberOfInst = numberOfInst;
        this.memberId = memberId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setAmount(BigInteger amount) {
        this.amount = amount;
    }

    public void setCountryDate(Date countryDate) {
        this.countryDate = countryDate;
    }

    public void setNumberOfInst(Short numberOfInst) {
        this.numberOfInst = numberOfInst;
    }

    public void setMemberId(Long memberId) {
        this.memberId = memberId;
    }

    public BigInteger getAmount() {
        return amount;
    }

    public Date getCountryDate() {
        return countryDate;
    }

    public Short getNumberOfInst() {
        return numberOfInst;
    }

    public Long getMemberId() {
        return memberId;
    }
}
