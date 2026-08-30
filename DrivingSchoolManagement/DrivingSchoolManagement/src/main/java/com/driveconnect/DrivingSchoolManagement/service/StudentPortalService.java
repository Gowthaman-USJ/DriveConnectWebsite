package com.driveconnect.DrivingSchoolManagement.service;

import com.driveconnect.DrivingSchoolManagement.dto.BookingLesson;
import com.driveconnect.DrivingSchoolManagement.entity.*;
import com.driveconnect.DrivingSchoolManagement.repository.ScheduleRepository;
import com.driveconnect.DrivingSchoolManagement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class StudentPortalService {

    @Autowired
    StudentRepository studentRepository;

    @Autowired
    ScheduleRepository scheduleRepository;

    public Student getStudent(int studentID) {

        return studentRepository.findById(studentID)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public List<Schedule> getUpcomingLessons(int studentID) {

        LocalDate today = LocalDate.now();
        LocalDate nextWeek = today.plusDays(7);

        return scheduleRepository
                .findByStudent_StuID(studentID)
                .stream()
                .filter(schedule ->
                        schedule.getDate() != null &&
                                !schedule.getDate().isBefore(today) &&
                                !schedule.getDate().isAfter(nextWeek)
                )
                .sorted(Comparator
                        .comparing(Schedule::getDate)
                        .thenComparing(Schedule::getTime))
                .collect(Collectors.toList());
    }

    public BookingLesson getBookingData(int studentID) {

            Student student = studentRepository.findById(studentID)
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            Instructor instructor = student.getInstructor();

        if (instructor == null) {
            return new BookingLesson(
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    0,
                    student.getStuID(),
                    student.getAttendance(),
                    student.getDrivingSchool().getSchoolName()
            );
        }

        Courses course = student.getCourses();

        if (course == null) {
            throw new RuntimeException("Course not assigned");
        }

        DrivingSchool drivingSchool = student.getDrivingSchool();

        if (drivingSchool == null) {
            throw new RuntimeException("Driving school not assigned");
        }

        return new BookingLesson(
                null,
                null,

                instructor.getInsID(),
                instructor.getFName(),
                instructor.getLName(),
                instructor.getPhoneNo(),
                instructor.getAvailability(),

                course.getName(),
                course.getTotalSessions(),

                student.getStuID(),
                student.getAttendance(),

                drivingSchool.getSchoolName()
        );
    }

    public void booklesson(Schedule lesson, int id) {

        Student student = studentRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Student not found")
                );

        Instructor instructor = student.getInstructor();
        DrivingSchool drivingSchool = student.getDrivingSchool();

        Schedule schedule = new Schedule();

        schedule.setDate(lesson.getDate());
        schedule.setTime(lesson.getTime());

        schedule.setStudent(student);
        schedule.setInstructor(instructor);
        schedule.setDrivingSchool(drivingSchool);

        schedule.setStatus(Schedule.Status.Scheduled);
        schedule.setAttendance(Schedule.Attendance.Pending);
        int lastLessonNumber =
                scheduleRepository.findMaxLessonNumberByStudent(
                        student.getStuID()
                );
        schedule.setLessonNumber(lastLessonNumber + 1);

        scheduleRepository.save(schedule);
    }

    public List<Schedule> getSchedule(int instructorID, LocalDate date) {

        return scheduleRepository.findByInstructor_InsIDAndDate(
                instructorID,
                date
        );
    }

    public List<Schedule> getDates(int studentID) {

        return scheduleRepository.findByStudent_StuID(
                studentID
        );
    }

    public void deleteLesson(int lessonID){
        scheduleRepository.deleteById(lessonID);
    }
}
