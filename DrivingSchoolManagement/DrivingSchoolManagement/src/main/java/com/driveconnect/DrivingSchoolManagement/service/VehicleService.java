package com.driveconnect.DrivingSchoolManagement.service;


import com.driveconnect.DrivingSchoolManagement.entity.LicenseType;
import com.driveconnect.DrivingSchoolManagement.entity.Vehicle;
import com.driveconnect.DrivingSchoolManagement.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService {

    @Autowired
    VehicleRepository vehicleRepository;



}
