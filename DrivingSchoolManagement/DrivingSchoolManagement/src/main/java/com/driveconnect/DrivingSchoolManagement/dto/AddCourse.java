package com.driveconnect.DrivingSchoolManagement.dto;

import com.driveconnect.DrivingSchoolManagement.entity.Courses;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddCourse {
    private int courseID;
    private Courses.Type type;
    private String name;
    private String description;
    private int totalSessions;
    private int price;
}
