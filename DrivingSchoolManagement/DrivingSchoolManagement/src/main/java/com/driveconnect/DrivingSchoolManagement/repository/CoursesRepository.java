package com.driveconnect.DrivingSchoolManagement.repository;

import com.driveconnect.DrivingSchoolManagement.entity.Courses;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CoursesRepository extends JpaRepository<Courses,Integer> {

    List<Courses> findByDrivingSchool_DsID(int dsID);
    void deleteByDrivingSchoolDsID(int dsID);
}
