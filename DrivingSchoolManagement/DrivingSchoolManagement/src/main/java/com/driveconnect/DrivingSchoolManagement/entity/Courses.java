package com.driveconnect.DrivingSchoolManagement.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Courses{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="CourseID")
    private int courseID;

    @Enumerated(EnumType.STRING)
    @Column(name = "Type")
    private Type type;

    public enum Type{
        Course,
        Package
    }
    @Column(name = "Name")
    private String name;

    @Column(name = "Description")
    private String description;

    @Column(name = "TotalSessions")
    private int totalSessions;

    @Column(name = "Price")
    private int price;

    @ManyToOne
    @JoinColumn(name="dsID")
    private DrivingSchool drivingSchool;

}

