package com.driveconnect.DrivingSchoolManagement.repository;

import com.driveconnect.DrivingSchoolManagement.entity.Instructor;
import com.driveconnect.DrivingSchoolManagement.entity.Schedule;
import com.driveconnect.DrivingSchoolManagement.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface StudentRepository extends JpaRepository<Student,Integer>{

    Student findByUser_UserID(Integer userID);

    int countByInstructorInsID(
            int insID
    );

    List<Student> findByInstructor_InsID(int insID);

    int countByDrivingSchoolDsID(
            int dsID
    );

    List<Student> findByDrivingSchoolDsID(
            int dsID
    );

    @Modifying
    @Query("""
    UPDATE Student s
    SET s.instructor = NULL
    WHERE s.instructor.insID = :insID
""")
    void removeInstructorFromStudents(@Param("insID") int insID);


}
