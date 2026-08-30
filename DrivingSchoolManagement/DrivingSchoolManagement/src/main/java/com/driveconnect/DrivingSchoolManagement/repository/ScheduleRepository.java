package com.driveconnect.DrivingSchoolManagement.repository;

import com.driveconnect.DrivingSchoolManagement.entity.Schedule;
import com.driveconnect.DrivingSchoolManagement.entity.Student;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ScheduleRepository extends JpaRepository<Schedule,Integer> {

    int countByInstructorInsIDAndDate(
            int insID,
            LocalDate date
    );

    int countByDrivingSchoolDsIDAndDate(
            int dsID,
            LocalDate date
    );

    List<Schedule> findByDrivingSchool_DsIDOrderByTimeAsc(
            int dsID
    );

    @Transactional
    void deleteByInstructor_InsID(int insID);

    void deleteByStudent_StuID(int stuID);

    List<Schedule> findByInstructor_InsIDOrderByTimeAsc(int insID);

    Optional<Schedule> findFirstByStudent_StuID(int studentID);

    List<Schedule> findByInstructor_InsIDAndDate(
                int instructorID,
                LocalDate date
        );

    List<Schedule> findByStudent_StuID(
            int studentID
    );
    @Query("""
        SELECT COALESCE(MAX(s.lessonNumber), 0)
        FROM Schedule s
        WHERE s.student.stuID = :studentID
    """)
    int findMaxLessonNumberByStudent(@Param("studentID") int studentID);
}
