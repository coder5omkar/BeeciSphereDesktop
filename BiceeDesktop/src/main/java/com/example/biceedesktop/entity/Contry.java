package com.example.biceedesktop.entity;

import jakarta.persistence.*;
import java.math.BigInteger;
import java.util.Date;

@Entity
@Table(name = "contry")
public class Contry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private BigInteger amount;

    @Temporal(TemporalType.DATE)
    private Date countryDate;

    public Contry(Long id, BigInteger amount, Date countryDate, Short numberOfInst, Member member) {
        this.id = id;
        this.amount = amount;
        this.countryDate = countryDate;
        this.numberOfInst = numberOfInst;
        this.member = member;
    }

    public Contry() {
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

    public void setMember(Member member) {
        this.member = member;
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

    public Member getMember() {
        return member;
    }

    @Column(nullable = false)
    private Short numberOfInst;

    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "member_id",foreignKey = @ForeignKey(name = "FK_COUNTRY_MEMBER"), nullable = true)
    private Member member;


}
