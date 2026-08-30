package com.driveconnect.DrivingSchoolManagement.repository;

import com.driveconnect.DrivingSchoolManagement.entity.Student;
import com.driveconnect.DrivingSchoolManagement.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle,Integer> {
    List<Vehicle> findByDrivingSchoolDsID(
            int dsID
    );
    int countByDrivingSchoolDsID(
            int dsID
    );

}
