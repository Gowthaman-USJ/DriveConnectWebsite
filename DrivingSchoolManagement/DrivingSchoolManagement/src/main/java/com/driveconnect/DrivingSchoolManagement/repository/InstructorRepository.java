package com.driveconnect.DrivingSchoolManagement.repository;

import com.driveconnect.DrivingSchoolManagement.entity.Instructor;
import com.driveconnect.DrivingSchoolManagement.entity.Student;
import com.driveconnect.DrivingSchoolManagement.entity.Vehicle;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InstructorRepository extends JpaRepository<Instructor,Integer> {
    Instructor findByLogin_LoginID(int loginID);

    int countByDrivingSchoolDsID(
            int dsID
    );

    List<Instructor> findByDrivingSchool_DsID(int dsID);

    @Modifying
    @Transactional
    @Query(value = "UPDATE instructor SET VehID = NULL WHERE VehID = :vehID", nativeQuery = true)
    int clearVehicleFromInstructors(@Param("vehID") int vehID);

}
