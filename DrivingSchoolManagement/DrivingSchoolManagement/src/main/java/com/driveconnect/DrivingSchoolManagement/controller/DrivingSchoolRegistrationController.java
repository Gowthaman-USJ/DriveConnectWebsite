package com.driveconnect.DrivingSchoolManagement.controller;


import com.driveconnect.DrivingSchoolManagement.dto.DrivingSchoolRegistration;
import com.driveconnect.DrivingSchoolManagement.service.DrivingSchoolRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dsregister")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class DrivingSchoolRegistrationController {

    @Autowired
    DrivingSchoolRegistrationService drivingSchoolRegistrationService;

    @PostMapping
    public void setNewRequest(@RequestBody DrivingSchoolRegistration newRequest){
        drivingSchoolRegistrationService.registerDrivingSchool(newRequest);
    }
}
