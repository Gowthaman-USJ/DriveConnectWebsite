package com.driveconnect.DrivingSchoolManagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DrivingSchoolManagementApplication {

	static void main(String[] args) {
		SpringApplication.run(DrivingSchoolManagementApplication.class, args);
	}

}
