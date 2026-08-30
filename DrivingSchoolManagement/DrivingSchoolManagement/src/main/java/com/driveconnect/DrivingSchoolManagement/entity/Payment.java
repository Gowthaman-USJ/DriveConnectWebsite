package com.driveconnect.DrivingSchoolManagement.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name="payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PayID")
    private int payID;

    @Column(name = "Payment_Date")
    private LocalDate paymentDate;

    @Column(name = "Amount")
    private Integer amount;

    @Enumerated(EnumType.STRING)
    @Column(name="Method")
    private Method method;

    public enum Method{
        Card,
        Cash,
    }

    @OneToOne
    @JoinColumn(name = "stuID")
    private Student student;

    @OneToOne
    @JoinColumn(name = "dsID")
    private DrivingSchool drivingSchool;


}
