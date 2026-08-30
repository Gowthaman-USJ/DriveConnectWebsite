package com.driveconnect.DrivingSchoolManagement.service;

import com.driveconnect.DrivingSchoolManagement.entity.Instructor;
import com.driveconnect.DrivingSchoolManagement.entity.Student;
import com.driveconnect.DrivingSchoolManagement.entity.Vehicle;
import com.driveconnect.DrivingSchoolManagement.repository.InstructorRepository;
import com.driveconnect.DrivingSchoolManagement.repository.ScheduleRepository;
import com.driveconnect.DrivingSchoolManagement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class InstructorPortalService {

    @Autowired
    private InstructorRepository instructorPortalRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private StudentRepository studentRepository;

    public Instructor findIns(int id){
        return instructorPortalRepository.findById(id).orElse(null);
    }

    public int getTodayLessons(int insID){
        return scheduleRepository.countByInstructorInsIDAndDate(insID, LocalDate.now());
    }
    public int getStudent(int insID){
        return studentRepository.countByInstructorInsID(insID);
    }

    public List<Student> studentDetails(int insID){
        return studentRepository.findByInstructor_InsID(insID);
    }

    public Vehicle getInstructorVehicle(int insID) {

        Instructor instructor = instructorPortalRepository.findById(insID)
                .orElseThrow(() ->
                        new RuntimeException("Instructor not found")
                );

        if (instructor.getVehicle() == null) {
            throw new RuntimeException("No vehicle assigned to this instructor");
        }

        return instructor.getVehicle();
    }
}
