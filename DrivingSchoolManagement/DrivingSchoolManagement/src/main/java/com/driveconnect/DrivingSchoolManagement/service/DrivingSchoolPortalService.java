package com.driveconnect.DrivingSchoolManagement.service;


import com.driveconnect.DrivingSchoolManagement.dto.*;
import com.driveconnect.DrivingSchoolManagement.entity.*;
import com.driveconnect.DrivingSchoolManagement.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.util.List;

@Service
public class DrivingSchoolPortalService {

    @Autowired
    DrivingSchoolRepository drivingSchoolRepository;

    @Autowired
    ScheduleRepository scheduleRepository;

    @Autowired
    StudentRepository studentRepository;

    @Autowired
    InstructorRepository instructorRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    LicenseTypeRepository licenseTypeRepository;

    @Autowired
    LoginRepository loginRepository;

    @Autowired
    VehicleRepository vehicleRepository;

    @Autowired
    PaymentRepository paymentRepository;

    @Autowired
    CoursesRepository coursesRepository;

    public DrivingSchool findDs(int id) {
        return drivingSchoolRepository.findById(id).orElse(null);
    }

    public int getStudentCount(int dsID) {
        return studentRepository.countByDrivingSchoolDsID(dsID);
    }

    public int getInstructorCount(int dsID) {
        return instructorRepository.countByDrivingSchoolDsID(dsID);
    }

    public int getTodayLessonsCount(int dsID) {
        return scheduleRepository.countByDrivingSchoolDsIDAndDate(dsID, LocalDate.now());
    }
    public int getVehicleCount(int dsID) {
        return vehicleRepository.countByDrivingSchoolDsID(dsID);
    }

    public List<Schedule> getSchedule(int id) {
        return scheduleRepository.findByDrivingSchool_DsIDOrderByTimeAsc(id);
    }


    public void booklesson(Schedule newRequest) {

        Student requestStudent = newRequest.getStudent();

        Student student = studentRepository.findById(requestStudent.getStuID())
                .orElseThrow(() ->
                        new RuntimeException("Student not found")
                );
        Schedule newlesson = new Schedule();

        newlesson.setStudent(student);
        newlesson.setInstructor(newRequest.getInstructor());
        newlesson.setDrivingSchool(newRequest.getDrivingSchool());
        newlesson.setDate(newRequest.getDate());
        newlesson.setTime(newRequest.getTime());
        newlesson.setStatus(Schedule.Status.Scheduled);
        newlesson.setAttendance(Schedule.Attendance.Pending);
        int lastLessonNumber =
                scheduleRepository.findMaxLessonNumberByStudent(
                        student.getStuID()
                );
        newlesson.setLessonNumber(lastLessonNumber + 1);

        scheduleRepository.save(newlesson);
        scheduleRepository.save(newlesson);
    }

    public void deletelesson(int id) {
        scheduleRepository.deleteById(id);
    }

    public List<Student> getStudents(int dsID) {
        return studentRepository.findByDrivingSchoolDsID(dsID);
    }

    public void updateStudent(StudentRegistration request, int id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Student not found")
                );


        User user = student.getUser();
        Login login = user.getLogin();

        login.setEmail(request.getEmail());

        loginRepository.save(login);

        user.setFName(request.getFName());
        user.setLName(request.getLName());
        user.setPhoneNo(request.getPhoneNo());
        user.setDob(request.getDob());
        user.setGender(request.getGender());
        user.setStreet(request.getStreet());
        user.setCity(request.getCity());
        user.setState(request.getState());
        user.setCode(request.getCode());
        user.setTransPrefer(request.getTransPrefer());
        user.setDriveExp(request.getDriveExp());
        user.setPref_time(request.getPref_time());
        user.setNotes(request.getNotes());


        userRepository.save(user);

        List<LicenseType> oldLicenses =
                licenseTypeRepository.findByLogin_LoginID(
                        login.getLoginID()
                );


        licenseTypeRepository.deleteAll(oldLicenses);


        for (String license : request.getLicenseTypes()) {

            LicenseType newLicense = new LicenseType();

            newLicense.setLicenseType(license);
            newLicense.setLogin(login);

            licenseTypeRepository.save(newLicense);
        }
        studentRepository.save(student);
    }

    @Transactional
    public void deletestudent(int stuID) {
        scheduleRepository.deleteByStudent_StuID(stuID);
        paymentRepository.deleteByStudent_StuID(stuID);
        studentRepository.deleteById(stuID);
    }
    public List<Instructor> getInstructors(int dsID){

        return instructorRepository.findByDrivingSchool_DsID(dsID);

    }

    public void assignInstructor(
            int stuID,
            AssignInstructor request
    ){

        Student student =
                studentRepository.findById(stuID)
                        .orElseThrow(() ->
                                new RuntimeException("Student not found")
                        );


        if(request.getInsID() == null){

            student.setInstructor(null);

        }
        else{

            Instructor instructor =
                    instructorRepository.findById(request.getInsID())
                            .orElseThrow(() ->
                                    new RuntimeException("Instructor not found")
                            );


            student.setInstructor(instructor);

        }


        studentRepository.save(student);

    }

    public void addInstructor(
            InstructorRegistration request,
            int dsID) {

        DrivingSchool drivingSchool =
                drivingSchoolRepository.findById(dsID)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Driving School not found"
                                )
                        );
        Login login = new Login();

        login.setEmail(
                request.getEmail()
        );

        login.setPassword(
                request.getPassword()
        );
        login.setUserRole(Login.UserRole.valueOf("Instructor"));

        loginRepository.save(login);

        Instructor instructor = new Instructor();

        instructor.setFName(request.getFName());
        instructor.setLName(request.getLName());
        instructor.setPhoneNo(request.getPhoneNo());
        instructor.setNic(request.getNic());
        instructor.setDob((request.getDob()));
        instructor.setGender(request.getGender());
        instructor.setAddress(request.getAddress());
        instructor.setAvailability(request.getAvailability());
        instructor.setDrive_Exp(request.getDrive_Exp());
        instructor.setStatus(request.getStatus());
        instructor.setDrivingSchool(drivingSchool);
        instructor.setLogin(login);

        instructorRepository.save(instructor);

        for (String license : request.getLicenseTypes()) {

            LicenseType licenseType = new LicenseType();

            licenseType.setLicenseType(license);
            licenseType.setLogin(login);
            licenseTypeRepository.save(licenseType);
        }
    }

    @Transactional
    public void updateInstructor(InstructorRegistration request, int id) {

        Instructor instructor = instructorRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Instructor not found")
                );

        Login login = instructor.getLogin();

        login.setEmail(request.getEmail());

        loginRepository.save(login);

        instructor.setFName(request.getFName());
        instructor.setLName(request.getLName());
        instructor.setPhoneNo(request.getPhoneNo());
        instructor.setGender(request.getGender());
        instructor.setAddress(request.getAddress());
        instructor.setAvailability(request.getAvailability());
        instructor.setDrive_Exp(request.getDrive_Exp());
        instructor.setStatus(request.getStatus());

        instructorRepository.save(instructor);

        List<LicenseType> oldLicenses =
                licenseTypeRepository.findByLogin_LoginID(
                        login.getLoginID()
                );


        licenseTypeRepository.deleteAll(oldLicenses);


        for (String license : request.getLicenseTypes()) {

            LicenseType newLicense = new LicenseType();

            newLicense.setLicenseType(license);
            newLicense.setLogin(login);

            licenseTypeRepository.save(newLicense);
        }
        instructorRepository.save(instructor);
    }

    @Transactional
    public void deleteinstructor(int id) {
        studentRepository.removeInstructorFromStudents(id);
        scheduleRepository.deleteByInstructor_InsID(id);
        licenseTypeRepository.deleteByInstructorId(id);
        instructorRepository.deleteById(id);
    }
    public void assignVehicle(
            int insID,
            AssignVehicle request
    ) {

        Instructor instructor =
                instructorRepository.findById(insID)
                        .orElseThrow(() ->
                                new RuntimeException("Instructor not found")
                        );

        if (request.getVehicleID() == null) {
            instructor.setVehicle(null);

        } else {

            Vehicle vehicle =
                    vehicleRepository.findById(request.getVehicleID())
                            .orElseThrow(() ->
                                    new RuntimeException("Vehicle not found")
                            );

            instructor.setVehicle(vehicle);
        }

        instructorRepository.save(instructor);
    }

    public List<Vehicle> getVehicles(int dsID){

        return vehicleRepository.findByDrivingSchoolDsID(dsID);
    }

    public Vehicle addVehicle(Vehicle vehicle, int dsID) {

        DrivingSchool drivingSchool =
                drivingSchoolRepository.findById(dsID)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Driving School not found"
                                )
                        );
        Vehicle vehicle1 = new Vehicle();
        vehicle1.setDrivingSchool(drivingSchool);
        vehicle1.setVehNo(vehicle.getVehNo());
        vehicle1.setBrand(vehicle.getBrand());
        vehicle1.setModel(vehicle.getModel());
        vehicle1.setFuelType(vehicle.getFuelType());
        vehicle1.setMileage(vehicle.getMileage());
        vehicle1.setTransmission(vehicle.getTransmission());
        vehicle1.setMakeYear(vehicle.getMakeYear());
        vehicle1.setStatus(vehicle.getStatus());
        vehicle1.setRemarks(vehicle.getRemarks());

        return vehicleRepository.save(vehicle);
    }


    public void updateVehicle(Vehicle request, int id) {

        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        int dsID = request.getDrivingSchool().getDsID();

        DrivingSchool drivingSchool = drivingSchoolRepository.findById(dsID)
                .orElseThrow(() -> new RuntimeException("Driving school not found"));

        vehicle.setBrand(request.getBrand());
        vehicle.setModel(request.getModel());
        vehicle.setMakeYear(request.getMakeYear());
        vehicle.setVehNo(request.getVehNo());
        vehicle.setFuelType(request.getFuelType());
        vehicle.setMileage(request.getMileage());
        vehicle.setTransmission(request.getTransmission());
        vehicle.setStatus(request.getStatus());
        vehicle.setRemarks(request.getRemarks());
        vehicle.setDrivingSchool(drivingSchool);
        vehicleRepository.save(vehicle);
    }
    @Transactional
    public void deletevehicle(int vehID) {
        instructorRepository.clearVehicleFromInstructors(vehID);
        vehicleRepository.deleteById(vehID);
    }

    public List<Payment> getPayment(int dsID){

        return paymentRepository.findByDrivingSchool_DsID(dsID);
    }

    @Transactional
    public void addPayment(
            Payment request,
            int dsID) {

        DrivingSchool drivingSchool =
                drivingSchoolRepository.findById(dsID)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Driving School not found"
                                )
                        );

        Student student =
                studentRepository.findById(
                                request.getStudent().getStuID()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student not found"
                                )
                        );

        Payment payment = new Payment();

        payment.setStudent(student);

        payment.setDrivingSchool(
                drivingSchool
        );

        payment.setPaymentDate(
                LocalDate.now()
        );

        payment.setAmount(
                request.getAmount()
        );
        payment.setMethod(
                Payment.Method.Cash
        );

        paymentRepository.save(payment);
        student.setFeeStatus(Student.FeeStatus.valueOf("Paid"));
    }

    public DrivingSchool getSchoolProfile(int dsID) {

        return drivingSchoolRepository.findById(dsID)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Driving School not found"
                        )
                );

    }
    public List<Courses> getCoursesBySchool(int dsID) {

        return coursesRepository.findByDrivingSchool_DsID(dsID);

    }

@Transactional
    public void updateSchoolProfile(
            int dsID,
            DrivingSchoolRegistration request
    ) {

        DrivingSchool school =
                drivingSchoolRepository.findById(dsID)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Driving School not found"
                                )
                        );

        school.setSchoolName(request.getSchoolName());
        school.setDsLicenseNo(request.getDsLicenseNo());
        school.setEstYear(request.getEstYear());
        school.setPhoneNo(request.getPhoneNo());
        school.setDescription(request.getDescription());
        school.setManager(request.getManager());
        school.setDirectPhone(request.getDirectPhone());
        school.setAddress(request.getAddress());
        school.setCity(request.getCity());
        school.setState(request.getState());
        school.setCode(request.getCode());
        school.setTransmission(request.getTransmission());
        school.setTime(request.getTime());
        school.setInsName(request.getInsName());
        school.setInsNo(request.getInsNo());

        if (school.getLogin() != null) {

            school.getLogin().setEmail(
                    request.getEmail()
            );

            if (request.getPassword() != null &&
                    !request.getPassword().isBlank()) {

                school.getLogin().setPassword(
                        request.getPassword()
                );
            }
        }

        drivingSchoolRepository.save(school);

        if (request.getCourses() != null) {
            for (AddCourse courseRequest : request.getCourses()) {
                if (courseRequest.getCourseID() > 0) {

                    Courses course =
                            coursesRepository.findById(
                                    courseRequest.getCourseID()
                            ).orElseThrow(() ->
                                    new RuntimeException(
                                            "Course not found: "
                                                    + courseRequest.getCourseID()
                                    )
                            );
                    course.setName(courseRequest.getName());
                    course.setDescription(courseRequest.getDescription());
                    course.setTotalSessions(courseRequest.getTotalSessions());
                    course.setPrice(courseRequest.getPrice());
                    course.setType(courseRequest.getType());

                    coursesRepository.save(course);

                } else {
                    Courses newCourse = new Courses();
                    newCourse.setName(courseRequest.getName());
                    newCourse.setDescription(courseRequest.getDescription());
                    newCourse.setTotalSessions(courseRequest.getTotalSessions());
                    newCourse.setPrice(courseRequest.getPrice());
                    newCourse.setType(courseRequest.getType());
                    newCourse.setDrivingSchool(school);

                    coursesRepository.save(newCourse);
                }
            }
        }
        drivingSchoolRepository.save(school);
    }

    public void deleteCourse(int courseID) {
        coursesRepository.deleteById(courseID);
    }



}


