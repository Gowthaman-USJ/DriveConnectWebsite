package com.driveconnect.DrivingSchoolManagement.controller;

import com.driveconnect.DrivingSchoolManagement.dto.StudentRegistration;
import com.driveconnect.DrivingSchoolManagement.service.UserRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/userregister")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class UserRegistrationController {

    @Autowired
    UserRegistrationService userRegistrationService;

    @PostMapping
    public void setNewRequest(@RequestBody StudentRegistration newRequest){

        userRegistrationService.registerStudent(newRequest);

    }



}
