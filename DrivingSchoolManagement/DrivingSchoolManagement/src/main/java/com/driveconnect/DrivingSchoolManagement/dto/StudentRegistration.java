package com.driveconnect.DrivingSchoolManagement.dto;


import com.driveconnect.DrivingSchoolManagement.entity.User;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter

public class StudentRegistration {
    private String fName;
    private String lName;
    private String nic;
    private String phoneNo;
    private LocalDate dob;
    private String gender;
    private String street;
    private String city;
    private String state;
    private int code;
    private List<String> licenseTypes;
    private User.Trans_Prefer transPrefer;
    private User.Drive_Exp driveExp;
    private User.Pref_LessonTime pref_time;
    private String notes;
    private String email;
    private String password;


}
