package com.driveconnect.DrivingSchoolManagement.service;


import com.driveconnect.DrivingSchoolManagement.entity.Schedule;
import com.driveconnect.DrivingSchoolManagement.entity.Student;
import com.driveconnect.DrivingSchoolManagement.repository.ScheduleRepository;
import com.driveconnect.DrivingSchoolManagement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
@Service
public class ScheduleService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    public List<Schedule> getSchedule(int id) {
        return scheduleRepository.findByInstructor_InsIDOrderByTimeAsc(id);
    }

    public void updateAttendance(int lessonID, String attendance) {

        Schedule schedule = scheduleRepository.findById(lessonID)
                .orElseThrow(() ->
                        new RuntimeException("Schedule not found")
                );


        schedule.setAttendance(Schedule.Attendance.valueOf(attendance));
        Student student = schedule.getStudent();

        if (student != null) {
            if (schedule.getAttendance() == Schedule.Attendance.Present) {
            student.setAttendance(student.getAttendance() + 1);
            studentRepository.save(student);
        }
        scheduleRepository.save(schedule);
    }
        }

    @Scheduled(fixedRate = 60000)
    public void updateScheduleStatuses() {

        LocalDateTime now = LocalDateTime.now();
        List<Schedule> schedules = scheduleRepository.findAll();

        for (Schedule schedule : schedules) {

            if (schedule.getStatus() == Schedule.Status.Scheduled ||
                    schedule.getStatus() == Schedule.Status.InProgress) {

                LocalDateTime lessonStart = LocalDateTime.of(
                        schedule.getDate(),
                        schedule.getTime()
                );

                LocalDateTime lessonEnd = lessonStart.plusHours(1);
                if (!now.isBefore(lessonStart) &&
                        now.isBefore(lessonEnd)) {

                    schedule.setStatus(Schedule.Status.InProgress);

                    scheduleRepository.save(schedule);
                }
                else if (!now.isBefore(lessonEnd)) {

                    schedule.setStatus(Schedule.Status.Completed);

                    scheduleRepository.save(schedule);
                }
            }
        }
    }


}
