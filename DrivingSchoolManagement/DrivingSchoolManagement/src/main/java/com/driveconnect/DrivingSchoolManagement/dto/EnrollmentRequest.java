package com.driveconnect.DrivingSchoolManagement.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EnrollmentRequest {
    private int userID;
    private int dsID;
    private int packageID;
    private int amount;
    private String method;
}
