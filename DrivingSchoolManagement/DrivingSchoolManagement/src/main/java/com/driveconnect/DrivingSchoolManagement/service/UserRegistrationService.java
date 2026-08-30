package com.driveconnect.DrivingSchoolManagement.service;

import com.driveconnect.DrivingSchoolManagement.entity.LicenseType;
import com.driveconnect.DrivingSchoolManagement.entity.Login;
import com.driveconnect.DrivingSchoolManagement.dto.StudentRegistration;
import com.driveconnect.DrivingSchoolManagement.entity.User;
import com.driveconnect.DrivingSchoolManagement.repository.LicenseTypeRepository;
import com.driveconnect.DrivingSchoolManagement.repository.LoginRepository;
import com.driveconnect.DrivingSchoolManagement.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class UserRegistrationService {

    @Autowired
    private LoginRepository loginRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LicenseTypeRepository licenseTypeRepository;

    public void registerStudent(StudentRegistration newRequest){

        Login newUser = new Login();
        User newUser2 = new User();

        newUser.setEmail(newRequest.getEmail());
        newUser.setPassword(newRequest.getPassword());
        newUser.setUserRole(Login.UserRole.valueOf("Student"));

        Login savedUser = loginRepository.save(newUser);

        newUser2.setLogin(savedUser);
        newUser2.setFName(newRequest.getFName());
        newUser2.setLName(newRequest.getLName());
        newUser2.setNic(newRequest.getNic());
        newUser2.setPhoneNo(newRequest.getPhoneNo());
        newUser2.setDob(newRequest.getDob());
        newUser2.setGender(newRequest.getGender());
        newUser2.setStreet(newRequest.getStreet());
        newUser2.setState(newRequest.getState());
        newUser2.setCity(newRequest.getCity());
        newUser2.setCode(newRequest.getCode());
        newUser2.setTransPrefer(newRequest.getTransPrefer());
        newUser2.setDriveExp(newRequest.getDriveExp());
        newUser2.setPref_time(newRequest.getPref_time());
        newUser2.setNotes(newRequest.getNotes());

        userRepository.save(newUser2);

        for(String license : (newRequest.getLicenseTypes())){

            LicenseType newLicense = new LicenseType();

            newLicense.setLogin(savedUser);
            newLicense.setLicenseType(license);

            licenseTypeRepository.save(newLicense);
        }
    }
}
