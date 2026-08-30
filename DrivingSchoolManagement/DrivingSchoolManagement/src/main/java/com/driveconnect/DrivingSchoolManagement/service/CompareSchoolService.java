package com.driveconnect.DrivingSchoolManagement.service;

import com.driveconnect.DrivingSchoolManagement.dto.EnrollmentRequest;
import com.driveconnect.DrivingSchoolManagement.entity.*;
import com.driveconnect.DrivingSchoolManagement.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class CompareSchoolService {


    @Autowired
    DrivingSchoolRepository drivingSchoolRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    StudentRepository studentRepository;

    @Autowired
    PaymentRepository paymentRepository;

    @Autowired
    CoursesRepository coursesRepository;


    @Transactional
    public Student enrollStudent(EnrollmentRequest request) {

        User user = userRepository
                .findById(request.getUserID())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        DrivingSchool school = drivingSchoolRepository
                .findById(request.getDsID())
                .orElseThrow(() ->
                        new RuntimeException("Driving school not found"));

        Courses course = coursesRepository
                .findById(request.getPackageID())
                .orElseThrow(() ->
                        new RuntimeException("Course not found"));

        Student student = new Student();

        student.setUser(user);
        student.setDrivingSchool(school);
        student.setCourses(course);
        student.setFeeStatus(Student.FeeStatus.Pending);
        student.setAttendance(0);
        student.setStatus(Student.Status.Training);

        Student savedStudent =
                studentRepository.save(student);
        Payment payment = new Payment();

        payment.setStudent(savedStudent);
        payment.setDrivingSchool(school);
        payment.setAmount(request.getAmount());
        payment.setMethod(Payment.Method.valueOf(request.getMethod()));
        payment.setPaymentDate(
                LocalDate.now()
        );
        paymentRepository.save(payment);

        return savedStudent;
    }
}


