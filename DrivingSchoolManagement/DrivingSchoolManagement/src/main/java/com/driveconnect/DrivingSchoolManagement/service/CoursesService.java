package com.driveconnect.DrivingSchoolManagement.service;


import com.driveconnect.DrivingSchoolManagement.entity.Courses;
import com.driveconnect.DrivingSchoolManagement.repository.CoursesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CoursesService {

    @Autowired
    private CoursesRepository coursesRepository;

    public Courses findlessons(int id){
        return coursesRepository.findById(id).orElse(null);
    }
}
