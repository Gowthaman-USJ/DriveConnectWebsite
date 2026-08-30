package com.driveconnect.DrivingSchoolManagement.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    @Column(name = "StuID")
    private int stuID;

    @Enumerated(EnumType.STRING)
    @Column(name="FeeStatus")
    private FeeStatus feeStatus;

    public enum FeeStatus{
        Paid,
        Pending
    }

    @Column(name = "Attendance")
    private int attendance;

    @Enumerated(EnumType.STRING)
    @Column(name="Status")
    private Status status;

    public enum Status{
        Training,
        TestReady,
        Completed,
        OnHold
    }

    @OneToOne
    @JoinColumn(name="userID")
    private User user;

    @OneToOne
    @JoinColumn(name = "dsID")
    private DrivingSchool drivingSchool;

    @ManyToOne
    @JoinColumn(name = "InsID", nullable = true)
    private Instructor instructor;

    @OneToOne
    @JoinColumn(name = "courseID")
    private Courses courses;

}
