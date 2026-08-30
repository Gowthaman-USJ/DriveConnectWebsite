package com.driveconnect.DrivingSchoolManagement.service;

import com.driveconnect.DrivingSchoolManagement.entity.LicenseType;
import com.driveconnect.DrivingSchoolManagement.repository.LicenseTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LicenseTypeService {
    @Autowired
    private LicenseTypeRepository licenseTypeRepository;

    public List<LicenseType> getLicenseTypes(int loginID) {
        return licenseTypeRepository.findByLogin_LoginID(loginID);
    }

}
