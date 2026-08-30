package com.driveconnect.DrivingSchoolManagement.service;


import com.driveconnect.DrivingSchoolManagement.dto.AddCourse;
import com.driveconnect.DrivingSchoolManagement.dto.DrivingSchoolRegistration;
import com.driveconnect.DrivingSchoolManagement.entity.*;
import com.driveconnect.DrivingSchoolManagement.repository.CoursesRepository;
import com.driveconnect.DrivingSchoolManagement.repository.DrivingSchoolRepository;
import com.driveconnect.DrivingSchoolManagement.repository.LoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DrivingSchoolRegistrationService {

    @Autowired
    LoginRepository loginRepository;

    @Autowired
    DrivingSchoolRepository drivingSchoolRepository;

    @Autowired
    CoursesRepository coursesRepository;

    public void registerDrivingSchool(DrivingSchoolRegistration newRequest){

        Login newSchool = new Login();
        DrivingSchool newSchool2 = new DrivingSchool();

        newSchool.setEmail(newRequest.getEmail());
        newSchool.setPassword(newRequest.getPassword());
        newSchool.setUserRole(Login.UserRole.valueOf("DrivingSchool"));

        Login savedSchool = loginRepository.save(newSchool);

        newSchool2.setLogin(savedSchool);
        newSchool2.setSchoolName(newRequest.getSchoolName());
        newSchool2.setDsLicenseNo(newRequest.getDsLicenseNo());
        newSchool2.setEstYear(newRequest.getEstYear());
        newSchool2.setPhoneNo(newRequest.getDsLicenseNo());
        newSchool2.setDescription(newRequest.getDescription());
        newSchool2.setManager(newRequest.getManager());
        newSchool2.setDirectPhone(newRequest.getDirectPhone());
        newSchool2.setAddress(newRequest.getDirectPhone());
        newSchool2.setAddress(newRequest.getAddress());
        newSchool2.setCity(newRequest.getCity());
        newSchool2.setState(newRequest.getState());
        newSchool2.setCode(newRequest.getCode());
        newSchool2.setTransmission(newRequest.getTransmission());
        newSchool2.setTime(newRequest.getTime());
        newSchool2.setInsName(newRequest.getInsName());
        newSchool2.setInsNo(newRequest.getInsNo());

        DrivingSchool savedSchool2 = drivingSchoolRepository.save(newSchool2);

        for(AddCourse course : newRequest.getCourses()){

            Courses newCourse = new Courses();

            newCourse.setDrivingSchool(savedSchool2);
            newCourse.setType(course.getType());
            newCourse.setName(course.getName());
            newCourse.setDescription(course.getDescription());
            newCourse.setTotalSessions(course.getTotalSessions());
            newCourse.setPrice(course.getPrice());

            coursesRepository.save(newCourse);

        }
    }

}
