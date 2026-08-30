package com.driveconnect.DrivingSchoolManagement.service;

import com.driveconnect.DrivingSchoolManagement.entity.Student;
import com.driveconnect.DrivingSchoolManagement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentService {

    @Autowired
    StudentRepository studentRepository;

    public void updateStatus(int stuID, String status) {

        Student student = studentRepository.findById(stuID)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        student.setStatus(Student.Status.valueOf(status));

        studentRepository.save(student);
    }
}
