package com.driveconnect.DrivingSchoolManagement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class LicenseType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int licenseID;

    @Column(name = "License_Type")
    private String licenseType;

    @ManyToOne
    @JoinColumn(name="loginID")
    private Login login;
}
