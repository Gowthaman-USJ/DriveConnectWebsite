package com.driveconnect.DrivingSchoolManagement.controller;


import com.driveconnect.DrivingSchoolManagement.entity.LicenseType;
import com.driveconnect.DrivingSchoolManagement.repository.LicenseTypeRepository;
import com.driveconnect.DrivingSchoolManagement.service.LicenseTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/licenseType")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class LicenseTypeController {

    @Autowired
    LicenseTypeService licenseTypeService;

    @GetMapping("/license/{loginID}")
    public List<LicenseType> getLicenseType(@PathVariable int loginID) {
        return licenseTypeService.getLicenseTypes(loginID);
    }
}
