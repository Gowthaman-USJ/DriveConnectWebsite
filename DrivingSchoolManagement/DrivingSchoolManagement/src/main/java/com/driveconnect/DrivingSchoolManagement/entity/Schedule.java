package com.driveconnect.DrivingSchoolManagement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@Entity
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LessonID")
    private int lessonID;

    @Column(name="Lesson_Date")
    private LocalDate date;

    @Column(name="Lesson_Time")
    private LocalTime time;

    @Enumerated(EnumType.STRING)
    @Column(name="Status")
    private Status status;

    public enum Status{
        Completed,
        InProgress,
        Scheduled
    }

    @Enumerated(EnumType.STRING)
    @Column(name="Attendance")
    private Attendance attendance;

    public enum Attendance{
        Present,
        Absent,
        Pending
    }

    @Column(name = "LessonNumber")
    private int lessonNumber;

    @OneToOne
    @JoinColumn(name="insID")
    private Instructor instructor;

    @OneToOne
    @JoinColumn(name="stuID")
    private Student student;

    @OneToOne
    @JoinColumn(name="dsID")
    private DrivingSchool drivingSchool;
}
