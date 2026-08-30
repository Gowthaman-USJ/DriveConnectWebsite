package com.driveconnect.DrivingSchoolManagement.service;


import com.driveconnect.DrivingSchoolManagement.dto.LoginResponse;
import com.driveconnect.DrivingSchoolManagement.entity.*;
import com.driveconnect.DrivingSchoolManagement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

    @Autowired
    private LoginRepository loginRepository;

    @Autowired
    private InstructorRepository instructorPortalRepository;

    @Autowired
    private DrivingSchoolRepository drivingSchoolRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    public LoginResponse login(String email, String password){

        Login user = loginRepository.findByEmail(email);


        if(user != null && user.getPassword().equals(password)){

            LoginResponse response = new LoginResponse();

            response.setLoginID(user.getLoginID());
            response.setEmail(user.getEmail());
            response.setUserRole(String.valueOf(user.getUserRole()));


            if(user.getUserRole() == Login.UserRole.Instructor){

                Instructor instructor =
                        instructorPortalRepository.findByLogin_LoginID(user.getLoginID());

                response.setInsID(
                        instructor.getInsID()
                );
            }

            else if(user.getUserRole() == Login.UserRole.DrivingSchool){

                DrivingSchool drivingSchool =
                        drivingSchoolRepository.findByLogin_LoginID(user.getLoginID());

                response.setDsID(
                        drivingSchool.getDsID()
                );
            }
            else if (user.getUserRole() == Login.UserRole.Student) {

                User loguser = userRepository.findByLogin_LoginID(user.getLoginID());

                if (loguser != null) {
                    Student student = studentRepository.findByUser_UserID(loguser.getUserID());

                    if (student != null) {
                        response.setStuID(student.getStuID());
                        response.setUserID(loguser.getUserID());
                        response.setStudentRegistered(true);

                    } else {
                        response.setUserID(loguser.getUserID());
                        response.setStudentRegistered(false);
                    }
                }
            }
            return response;
        }
        return null;
    }
}

