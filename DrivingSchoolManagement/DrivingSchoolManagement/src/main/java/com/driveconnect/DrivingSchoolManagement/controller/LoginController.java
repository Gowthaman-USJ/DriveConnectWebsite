package com.driveconnect.DrivingSchoolManagement.controller;

import com.driveconnect.DrivingSchoolManagement.dto.LoginResponse;
import com.driveconnect.DrivingSchoolManagement.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.driveconnect.DrivingSchoolManagement.entity.Login;

@RestController
@RequestMapping("/api/login")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class LoginController {

    @Autowired
    private LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Login request){

        LoginResponse response =
                loginService.login(
                        request.getEmail(),
                        request.getPassword()
                );


        if(response != null){
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401).body("Invalid Login");
    }
}