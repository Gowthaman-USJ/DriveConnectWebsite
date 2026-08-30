package com.driveconnect.DrivingSchoolManagement.repository;

import com.driveconnect.DrivingSchoolManagement.entity.DrivingSchool;
import com.driveconnect.DrivingSchoolManagement.entity.Instructor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DrivingSchoolRepository extends JpaRepository<DrivingSchool,Integer> {
    DrivingSchool findByLogin_LoginID(int loginID);

}
