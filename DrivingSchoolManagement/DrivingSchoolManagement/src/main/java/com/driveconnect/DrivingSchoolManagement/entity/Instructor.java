package com.driveconnect.DrivingSchoolManagement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class Instructor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "InsID")
    private int insID;

    @Column(name = "Fname")
    private String fName;

    @Column(name = "Lname")
    private String lName;

    @Column(name = "PhoneNo")
    private String phoneNo;

    @Column(name = "NIC")
    private String nic;

    @Column(name = "DOB")
    private LocalDate dob;

    @Column(name = "Gender")
    private String gender;

    @Column(name = "Address")
    private String address;

    @Column(name = "Drive_Exp")
    private int drive_Exp;

    @Enumerated(EnumType.STRING)
    @Column(name = "Availability")
    private Availability availability;

    public enum Availability{
        FullTime,
        PartTime,
        Weekend
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "Status")
    private Status status;

    public enum Status{
        Available,
        InLesson,
    }

   @OneToOne
   @JoinColumn(name = "dsID")
   private DrivingSchool drivingSchool;

    @OneToOne
    @JoinColumn(name="loginID")
    private Login login;

    @OneToOne
    @JoinColumn(name="vehID")
    private Vehicle vehicle;

}
