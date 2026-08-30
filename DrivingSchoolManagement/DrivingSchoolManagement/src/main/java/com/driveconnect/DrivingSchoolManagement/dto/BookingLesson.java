package com.driveconnect.DrivingSchoolManagement.dto;

import com.driveconnect.DrivingSchoolManagement.entity.Instructor;
import com.driveconnect.DrivingSchoolManagement.entity.Schedule;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class BookingLesson {
    private LocalDate date;
    private LocalTime time;

    private int insID;
    private String fName;
    private String lName;
    private String phoneNo;
    private Instructor.Availability availability;

    private String name;
    private int totalSessions;

    private int stuID;
    private int attendance;

    private String schoolName;


    public BookingLesson(
            LocalDate date,
            LocalTime time,
            Integer  insID,
            String fName,
            String lName,
            String phoneNo,
            Instructor.Availability availability,
            String name,
            int totalSessions,
            int stuID,
            int attendance,
            String schoolName
    ) {
        this.date = date;
        this.time = time;
        this.insID = insID;
        this.fName = fName;
        this.lName = lName;
        this.phoneNo = phoneNo;
        this.availability = availability;
        this.name = name;
        this.totalSessions = totalSessions;
        this.stuID = stuID;
        this.attendance = attendance;
        this.schoolName = schoolName;
    }
}

