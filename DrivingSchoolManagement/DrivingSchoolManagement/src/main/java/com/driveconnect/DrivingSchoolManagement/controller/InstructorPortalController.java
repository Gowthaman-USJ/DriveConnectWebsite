package com.driveconnect.DrivingSchoolManagement.controller;


import com.driveconnect.DrivingSchoolManagement.entity.*;
import com.driveconnect.DrivingSchoolManagement.service.InstructorPortalService;
import com.driveconnect.DrivingSchoolManagement.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/insportal")
@CrossOrigin(origins = "http://127.0.0.1:5500")

public class InstructorPortalController {

    @Autowired
    InstructorPortalService instructorPortalService;

    @Autowired
    ScheduleService scheduleService;


    @GetMapping("/{id}")
    public Instructor getInstructor(@PathVariable int id) {
        return instructorPortalService.findIns(id);
    }

    @GetMapping("/today-lessons/{id}")
    public int todayLessons(@PathVariable int id){

        return instructorPortalService.getTodayLessons(id);

    }

    @GetMapping("getVehicle/{insID}")
    public Vehicle vehicledetails(@PathVariable int insID){

        return instructorPortalService.getInstructorVehicle(insID);
    }

    @GetMapping("/students/{id}")
    public int studentCount(@PathVariable int id){

        return instructorPortalService.getStudent(id);
    }

    @GetMapping("/studenttable/{id}")
    public List<Student> getStudentTable(@PathVariable int id){
        return instructorPortalService.studentDetails(id);

    }

    @GetMapping("/scheduletable/{id}")
    public List<Schedule> getScheduleTable(@PathVariable int id){
        return scheduleService.getSchedule(id);
    }

    @PutMapping("/attendance/{id}")
    public ResponseEntity<?> updateAttendance(
            @PathVariable int id,
            @RequestBody Map<String, String> request
    ) {

        String attendance = request.get("attendance");
        scheduleService.updateAttendance(id, attendance);
        return ResponseEntity.ok("Attendance Updated");
    }



}
