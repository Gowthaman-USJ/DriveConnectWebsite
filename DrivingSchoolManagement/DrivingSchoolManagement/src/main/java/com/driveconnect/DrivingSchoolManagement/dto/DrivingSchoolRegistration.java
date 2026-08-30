package com.driveconnect.DrivingSchoolManagement.dto;

import com.driveconnect.DrivingSchoolManagement.entity.DrivingSchool;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DrivingSchoolRegistration {

    private String schoolName;
    private String dsLicenseNo;
    private int estYear;
    private String phoneNo;
    private String description;
    private String manager;
    private String directPhone;
    private String address;
    private String city;
    private String state;
    private int code;
    private List<AddCourse> courses;
    private DrivingSchool.Trans_Offer transmission;
    private DrivingSchool.Operation_Time time;
    private String insName;
    private String insNo;
    private String email;
    private String password;

}
