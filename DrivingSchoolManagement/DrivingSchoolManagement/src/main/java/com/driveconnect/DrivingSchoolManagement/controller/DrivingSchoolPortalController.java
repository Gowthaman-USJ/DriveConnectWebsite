package com.driveconnect.DrivingSchoolManagement.controller;

import com.driveconnect.DrivingSchoolManagement.dto.*;
import com.driveconnect.DrivingSchoolManagement.entity.*;
import com.driveconnect.DrivingSchoolManagement.service.DrivingSchoolPortalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dsportal")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class DrivingSchoolPortalController {

    @Autowired
    DrivingSchoolPortalService drivingSchoolPortalService;

    @GetMapping("/{id}")
    public DrivingSchool getDrivingSchool(@PathVariable int id) {
        return drivingSchoolPortalService.findDs(id);
    }

    @GetMapping("/students/{id}")
    public int studentCount(@PathVariable int id){

        return drivingSchoolPortalService.getStudentCount(id);
    }

    @GetMapping("/instructors/{id}")
    public int instructorCount(@PathVariable int id){

        return drivingSchoolPortalService.getInstructorCount(id);
    }

    @GetMapping("/today-lessons/{id}")
    public int todayLessons(@PathVariable int id){

        return drivingSchoolPortalService.getTodayLessonsCount(id);

    }
    @GetMapping("/vehicles/{id}")
    public int vehicleCount(@PathVariable int id){

        return drivingSchoolPortalService.getVehicleCount(id);
    }

    @GetMapping("/scheduletable/{id}")
    public List<Schedule> getScheduleTable(@PathVariable int id){
        return drivingSchoolPortalService.getSchedule(id);
    }

    @PostMapping("/booklesson")
    public void setNewRequest(@RequestBody Schedule newRequest){
        drivingSchoolPortalService.booklesson(newRequest);
    }

    @DeleteMapping("/deleteLesson/{id}")
    public void deleteLesson(@PathVariable int id){

        drivingSchoolPortalService.deletelesson(id);

    }
    @GetMapping("/getstudents/{dsID}")
    public List<Student> getStudents(
            @PathVariable int dsID
    ){

        return drivingSchoolPortalService.getStudents(dsID);

    }
    @GetMapping("/studenttable/{id}")
    public List<Student> getStudentTable(@PathVariable int id){
        return drivingSchoolPortalService.getStudents(id);
    }

    @PutMapping("/updatestudent/{id}")
    public void updatestudent( @PathVariable int id,
                               @RequestBody StudentRegistration student){
    drivingSchoolPortalService.updateStudent(student,id);

    }

    @DeleteMapping("/deletestudent/{id}")
    public void deleteStudent(@PathVariable int id){

        drivingSchoolPortalService.deletestudent(id);

    }
    @PutMapping("/assignInstructor/{stuID}")
    public void assignInstructor(
            @PathVariable int stuID,
            @RequestBody AssignInstructor request
    ){

        drivingSchoolPortalService.assignInstructor(stuID, request);

    }
    @GetMapping("/getinstructors/{dsID}")
    public List<Instructor> getInstructors(
            @PathVariable int dsID
    ){

        return drivingSchoolPortalService.getInstructors(dsID);

    }

    @PostMapping("/addinstructor/{dsID}")
    public void addInstructor(
            @RequestBody InstructorRegistration request,
            @PathVariable int dsID) {

        drivingSchoolPortalService.addInstructor(request, dsID);
    }

    @PutMapping("/updateinstructor/{id}")
    public void addInstructor( @PathVariable int id,
                               @RequestBody InstructorRegistration instructor){
        drivingSchoolPortalService.updateInstructor(instructor,id);

    }



    @DeleteMapping("/deleteInstructor/{id}")
    public void deleteInstructor(@PathVariable int id){

        drivingSchoolPortalService.deleteinstructor(id);

    }
    @PutMapping("/assignVehicle/{insID}")
    public void assignVehicle(
            @PathVariable int insID,
            @RequestBody AssignVehicle request
    ){

        drivingSchoolPortalService.assignVehicle(insID, request);

    }

    @GetMapping("/getvehicle/{dsID}")
    public List<Vehicle> getVehicles(
            @PathVariable int dsID
    ){

        return drivingSchoolPortalService.getVehicles(dsID);

    }

    @PostMapping("/addvehicle/{dsID}")
    public Vehicle addVehicle(
            @RequestBody Vehicle request,
            @PathVariable int dsID) {

        return drivingSchoolPortalService.addVehicle(request, dsID);
    }

    @PutMapping("/updatevehicle/{dsID}")
    public void updatevehicle( @PathVariable int dsID,
                               @RequestBody Vehicle vehicle){
        drivingSchoolPortalService.updateVehicle(vehicle,dsID);

    }
    @DeleteMapping("/deletevehicle/{id}")
    public void deleteVehicle(@PathVariable int id){

        drivingSchoolPortalService.deletevehicle(id);
    }

    @GetMapping("/paymenttable/{id}")
    public List<Payment> getPaymentTable(@PathVariable int id){
        return drivingSchoolPortalService.getPayment(id);
    }

    @PostMapping("/addpayment/{dsID}")
    public void addPayment(
            @PathVariable("dsID") int dsID,
            @RequestBody Payment request) {

        drivingSchoolPortalService.addPayment(
                request,
                dsID
        );
    }

    @GetMapping("/profile/{dsID}")
    public DrivingSchool getSchoolProfile(
            @PathVariable int dsID) {

        return drivingSchoolPortalService
                .getSchoolProfile(dsID);
    }
    @GetMapping("/courses/{dsID}")
    public List<Courses> getCoursesBySchool(
            @PathVariable int dsID) {

        return drivingSchoolPortalService.getCoursesBySchool(dsID);

    }
    @PutMapping("/updateprofile/{dsID}")
    public void updateSchoolProfile( @PathVariable int dsID,
                               @RequestBody DrivingSchoolRegistration request){
        drivingSchoolPortalService.updateSchoolProfile(dsID,request);

    }

    @DeleteMapping("/deleteCourse/{courseID}")
    public void deleteCourse(@PathVariable int courseID) {
        drivingSchoolPortalService.deleteCourse(courseID);
    }



}
