package com.driveconnect.DrivingSchoolManagement.controller;

import com.driveconnect.DrivingSchoolManagement.dto.BookingLesson;
import com.driveconnect.DrivingSchoolManagement.entity.Schedule;
import com.driveconnect.DrivingSchoolManagement.entity.Student;
import com.driveconnect.DrivingSchoolManagement.service.StudentPortalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/stuportal")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class StudentPortalController {

    @Autowired
    StudentPortalService studentPortalService;

    @GetMapping("/student/{studentID}")
    public Student getUser(@PathVariable int studentID) {
        return studentPortalService.getStudent(studentID);
    }

    @GetMapping("/upcoming-lessons/{studentID}")
    public List<Schedule> getUpcomingLessons(
            @PathVariable int studentID
    ) {
        return studentPortalService.getUpcomingLessons(studentID);
    }
    @GetMapping("/booking-info/{studentID}")
    public BookingLesson getBookingInfo(
            @PathVariable int studentID
    ) {

        return studentPortalService.getBookingData(studentID);
    }

    @PutMapping("/newlesson/{studentID}")
    public void bookLesson(
            @RequestBody Schedule lesson, @PathVariable int studentID){
        studentPortalService.booklesson(lesson,studentID);
    }

    @GetMapping("/instructorschedule/{instructorID}/{date}")
    public List<Schedule> getSchedule(
            @PathVariable int instructorID,
            @PathVariable LocalDate date
    ) {
        return studentPortalService.getSchedule(instructorID, date);
    }

    @GetMapping("/studentlessons/{studentID}")
    public List<Schedule> getStudentSchedule(
            @PathVariable int studentID
    ) {
        return studentPortalService.getDates(studentID);
    }

    @DeleteMapping("/deletelesson/{lessonID}")
    public void deleteLesson(@PathVariable int lessonID) {

        studentPortalService.deleteLesson(lessonID);

    }

}
