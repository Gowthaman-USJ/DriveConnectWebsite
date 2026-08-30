package com.driveconnect.DrivingSchoolManagement.controller;


import com.driveconnect.DrivingSchoolManagement.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "http://127.0.0.1:5500")

public class StudentController {

    @Autowired
    StudentService studentService;

    @PutMapping("/status/{stuID}")
    public void updateStatus(
            @PathVariable int stuID,
            @RequestBody Map<String,String> data){

        System.out.println("Student ID: " + stuID);
        System.out.println("New Status: " + data.get("status"));

        studentService.updateStatus(
                stuID,
                data.get("status")
        );
    }

}
