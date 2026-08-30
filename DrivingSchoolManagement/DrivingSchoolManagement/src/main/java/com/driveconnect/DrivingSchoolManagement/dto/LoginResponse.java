package com.driveconnect.DrivingSchoolManagement.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {

    private int loginID;
    private String email;
    private String userRole;
    private Integer insID;
    private Integer dsID;
    private Integer userID;
    private Integer stuID;
    private boolean studentRegistered;
}
