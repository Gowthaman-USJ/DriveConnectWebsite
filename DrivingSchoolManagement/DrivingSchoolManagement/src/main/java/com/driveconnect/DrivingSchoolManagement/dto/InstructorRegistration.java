package com.driveconnect.DrivingSchoolManagement.dto;


import com.driveconnect.DrivingSchoolManagement.entity.Instructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class InstructorRegistration {
    private String fName;
    private String lName;
    private String nic;
    private String phoneNo;
    private String gender;
    private LocalDate dob;
    private String address;
    private List<String> licenseTypes;
    private Instructor.Availability availability;
    private int drive_Exp;
    private Instructor.Status status;
    private String email;
    private String password;
}
