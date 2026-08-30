package com.driveconnect.DrivingSchoolManagement.repository;

import com.driveconnect.DrivingSchoolManagement.entity.LicenseType;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LicenseTypeRepository extends JpaRepository<LicenseType,Integer> {
    List<LicenseType> findByLogin_LoginID(int loginID);

    @Modifying
    @Transactional
    @Query("""
        DELETE FROM LicenseType l
        WHERE l.login.loginID =
        (
            SELECT i.login.loginID
            FROM Instructor i
            WHERE i.insID = :insID
        )
    """)
    void deleteByInstructorId(
            @Param("insID") int insID
    );

}
