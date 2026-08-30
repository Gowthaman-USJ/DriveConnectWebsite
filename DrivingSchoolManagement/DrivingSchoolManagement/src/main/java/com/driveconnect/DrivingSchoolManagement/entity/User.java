package com.driveconnect.DrivingSchoolManagement.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name="User")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="UserID")
    private int userID;

    @Column(name = "Fname")
    private String fName;

    @Column(name = "Lname")
    private String lName;

    @Column(name = "NIC",unique = true)
    private String nic;

    @Column(name = "PhoneNo")
    private String phoneNo;

    @Column(name = "DOB")
    private LocalDate dob;

    @Column(name = "Gender")
    private String gender;

    @Column(name = "S_Address")
    private String street;

    @Column(name = "City")
    private String city;

    @Column(name = "State")
    private String state;

    @Column(name = "P_Code")
    private int code;

    @Enumerated(EnumType.STRING)
    @Column(name = "Trans_Prefer")
    private Trans_Prefer transPrefer;

    public enum Trans_Prefer{
        Automatic,
        Manual,
        Both
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "Drive_Exp")
    private Drive_Exp driveExp;

    public enum Drive_Exp{
        C_Beginner,
        S_Experience,
        Intermediate,
        Advanced
    }
    @Enumerated(EnumType.STRING)
    @Column(name="Pref_LessonTime")
    private Pref_LessonTime pref_time;

    public enum Pref_LessonTime{
        AnyTime,
        Mrng,
        Afternoon,
        Evening,
        Weekends
    }
    @Column(name = "Notes")
    private String notes;


    @OneToOne
    @JoinColumn(name="loginID")
    private Login login;
}
