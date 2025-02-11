package com.example.biceedesktop.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "members")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Unique identifier for each member

    @Column(nullable = false)
    private String name; // Member's name

    @Column(nullable = false, unique = true)
    private String email; // Member's email

    @Column(nullable = false)
    private String phoneNumber; // Member's phone number

    @Column
    private String address; // Member's address

    @Column
    private BigDecimal amountReceived; // Amount received from the business collection process

    @Column
    private BigDecimal maturityAmount; // Expected maturity amount at the end of the collection process

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MemberStatus status; // Status of the member (e.g., Active, Inactive)

    @Temporal(TemporalType.DATE)
    private Date dateJoined; // Date when the member joined the business collection process

    @Temporal(TemporalType.DATE)
    private Date maturityDate; // Expected date of maturity for the collection

    @ManyToOne
    @JoinColumn(name = "TODO_ID", nullable = true)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JsonIgnore // Prevent recursion
    private Todo todo;

    @OneToOne(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonIgnore // Prevent recursion
    private Bid bid;

    public Member() {
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Bid getBid() {
        return bid;
    }

    public void setBid(Bid bid) {
        this.bid = bid;
    }

    public Member(Long id, String name, String email, String phoneNumber, String address, BigDecimal amountReceived, BigDecimal maturityAmount, MemberStatus status, Date dateJoined, Date maturityDate, Todo todo, Bid bid, List<Contry> countrys) {
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
        this.todo = todo;
        this.bid = bid;
        this.countrys = countrys;
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

    public Todo getTodo() {
        return todo;
    }

    public List<Contry> getCountrys() {
        return countrys;
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

    public void setTodo(Todo todo) {
        this.todo = todo;
    }

    public void setCountrys(List<Contry> countrys) {
        this.countrys = countrys;
    }

    @OneToMany(mappedBy = "member", cascade = CascadeType.PERSIST, orphanRemoval = false, fetch = FetchType.EAGER)
    private List<Contry> countrys;
}

