package com.driveconnect.DrivingSchoolManagement.controller;

import com.driveconnect.DrivingSchoolManagement.dto.EnrollmentRequest;
import com.driveconnect.DrivingSchoolManagement.entity.Courses;
import com.driveconnect.DrivingSchoolManagement.entity.DrivingSchool;
import com.driveconnect.DrivingSchoolManagement.entity.Student;
import com.driveconnect.DrivingSchoolManagement.entity.User;
import com.driveconnect.DrivingSchoolManagement.repository.CoursesRepository;
import com.driveconnect.DrivingSchoolManagement.repository.DrivingSchoolRepository;
import com.driveconnect.DrivingSchoolManagement.repository.UserRepository;
import com.driveconnect.DrivingSchoolManagement.service.CompareSchoolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/compareschool")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class CompareSchoolController {

    @Autowired
    private DrivingSchoolRepository drivingSchoolRepository;

    @Autowired
    private CoursesRepository coursesRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompareSchoolService compareSchoolService;


    @GetMapping("/schools")
    public List<DrivingSchool> getSchools() {

        return drivingSchoolRepository.findAll();

    }

    @GetMapping("/courses/{dsID}")
    public List<Courses> getCoursesBySchool(
            @PathVariable int dsID
    ) {

        return coursesRepository.findByDrivingSchool_DsID(dsID);

    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable int id) {
        return userRepository.findById(id).orElse(null);
    }

    @PostMapping("/enroll")
    public ResponseEntity<?> enrollStudent(
            @RequestBody EnrollmentRequest request) {

        Student student = compareSchoolService.enrollStudent(request);

        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "message", "Enrollment successful",
                        "stuID", student.getStuID()
                )
        );

    }
}

