package com.driveconnect.DrivingSchoolManagement.entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name="login")
public class Login {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="LoginID")
    private int loginID;

    @Column(name = "email",unique = true, nullable = false)
    private String email;

    @Column(name = "password")
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "UserRole")
    private UserRole  userRole;

    public enum UserRole {
        Admin,
        DrivingSchool,
        Student,
        Instructor
    }


}
