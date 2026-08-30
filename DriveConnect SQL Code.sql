-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: driveconnect_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `CourseID` int NOT NULL AUTO_INCREMENT,
  `DsID` int NOT NULL,
  `Type` enum('Course','Package') DEFAULT NULL,
  `Name` varchar(50) NOT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `TotalSessions` int NOT NULL,
  `Price` int NOT NULL,
  PRIMARY KEY (`CourseID`),
  KEY `DsID` (`DsID`),
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`DsID`) REFERENCES `drivingschool` (`DsID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,1,'Course','Beginner Car Course','Full beginner package for a light vehicle license.',20,25000),(2,1,'Package','Beginner + Highway Package','Beginner course plus 5 highway sessions.',25,32000),(3,2,'Course','Manual Transmission Basics','Learn manual gear driving from scratch.',18,22000),(4,2,'Course','Heavy Vehicle License','Training for heavy vehicle licensing.',30,55000),(5,3,'Course','Motorcycle Basics','Two-wheeler riding and licensing course.',10,12000),(6,3,'Package','Coastal Auto Package','Automatic transmission course with coastal routes.',20,28000),(7,4,'Course','Beach Town Beginner Course','Introductory course for first-time drivers.',20,24000),(8,4,'Course','Motorcycle Licence Course','Two-wheeler riding and licensing course.',10,11000),(9,3,'Course','Beginner Driving Course','',30,40000),(11,5,'Course','Beginner Driving Package','Includes Exam Preparation',20,50000);
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `drivingschool`
--

DROP TABLE IF EXISTS `drivingschool`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `drivingschool` (
  `DsID` int NOT NULL AUTO_INCREMENT,
  `LoginID` int NOT NULL,
  `SchoolName` varchar(50) NOT NULL,
  `DS_LicenseNo` varchar(25) NOT NULL,
  `Established_Year` int NOT NULL,
  `PhoneNo` varchar(50) DEFAULT NULL,
  `Description` tinytext,
  `ManagerName` varchar(50) NOT NULL,
  `DirectPhone` varchar(50) DEFAULT NULL,
  `S_Address` varchar(255) NOT NULL,
  `City` varchar(50) NOT NULL,
  `State` varchar(50) NOT NULL,
  `P_Code` int NOT NULL,
  `Trans_Offer` enum('Auto','Manual','Both') NOT NULL,
  `Operation_Time` enum('Weekday','Weekend','Both','Flex') NOT NULL,
  `InsuranceName` varchar(50) NOT NULL,
  `InsuranceNo` varchar(25) NOT NULL,
  PRIMARY KEY (`DsID`),
  UNIQUE KEY `SchoolName` (`SchoolName`),
  UNIQUE KEY `DS_LicenseNo` (`DS_LicenseNo`),
  UNIQUE KEY `InsuranceNo` (`InsuranceNo`),
  KEY `LoginID` (`LoginID`),
  CONSTRAINT `drivingschool_ibfk_1` FOREIGN KEY (`LoginID`) REFERENCES `login` (`LoginID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drivingschool`
--

LOCK TABLES `drivingschool` WRITE;
/*!40000 ALTER TABLE `drivingschool` DISABLE KEYS */;
INSERT INTO `drivingschool` VALUES (1,2,'Colombo Safe Drive Academy','DSL-COL-2010',2010,'0112233445','Full-service driving school in the heart of Colombo.','W.A. Perera','0771122334','45 Galle Road','Colombo','Western',10100,'Both','Both','Ceylinco Insurance','INS-CSL-0001'),(2,3,'Kandy Hill Drivers Institute','DSL-KAN-2015',2015,'0812233445','Specialists in hill-country and manual transmission training.','S. Bandaranayake','0772233445','12 Peradeniya Road','Kandy','Central',20000,'Manual','Weekday','Sri Lanka Insurance','INS-KHD-0002'),(3,4,'Galle Coastal Driving School','DSL-GAL-2018',2018,'0912233445','Coastal-route driving lessons for all license classes.','N. Fernando','0773344556','78 Matara Road','Galle','Southern',80000,'Auto','Weekend','Allianz Insurance','INS-GCD-0003'),(4,20,'Negombo Beach Drivers Academy','DSL-NEG-2019',2019,'0312233445','Beginner-friendly driving school near the coast.','T.M. Rodrigo','0774455667','30 Lewis Place','Negombo','Western',11500,'Both','Flex','Union Assurance','INS-NBD-0004'),(5,39,'SafeDrive Driving Academy','DSL-458921',2010,'DSL-458921','','Gowthaman Navarathnarajah','+94760403533','16 Vanderwart Place,Dehiwala,undefined','Dehiwala','Western',10350,'Auto','Weekday','Ceylinco Insurance PLC','POL-2025-785412');
/*!40000 ALTER TABLE `drivingschool` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instructor`
--

DROP TABLE IF EXISTS `instructor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instructor` (
  `InsID` int NOT NULL AUTO_INCREMENT,
  `DsID` int NOT NULL,
  `LoginID` int NOT NULL,
  `Fname` varchar(50) DEFAULT NULL,
  `PhoneNo` varchar(15) NOT NULL,
  `NIC` varchar(20) NOT NULL,
  `DOB` date NOT NULL,
  `Gender` varchar(10) NOT NULL,
  `Address` varchar(255) NOT NULL,
  `Drive_Exp` int NOT NULL,
  `Availability` enum('FullTime','PartTime','Weekend') NOT NULL,
  `Status` enum('Available','InLesson') DEFAULT NULL,
  `VehID` int DEFAULT NULL,
  `Lname` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`InsID`),
  UNIQUE KEY `NIC` (`NIC`),
  KEY `DsID` (`DsID`),
  KEY `LoginID` (`LoginID`),
  KEY `fk_instructor_vehicle` (`VehID`),
  CONSTRAINT `fk_instructor_vehicle` FOREIGN KEY (`VehID`) REFERENCES `vehicle` (`VehID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `instructor_ibfk_1` FOREIGN KEY (`DsID`) REFERENCES `drivingschool` (`DsID`),
  CONSTRAINT `instructor_ibfk_2` FOREIGN KEY (`LoginID`) REFERENCES `login` (`LoginID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instructor`
--

LOCK TABLES `instructor` WRITE;
/*!40000 ALTER TABLE `instructor` DISABLE KEYS */;
INSERT INTO `instructor` VALUES (1,1,15,'Sunil','0771112233','198012345670','1980-02-10','Male','4 Bauddhaloka Mawatha, Colombo',15,'FullTime','Available',2,'Rajapaksha'),(3,2,17,'Malini','0771334455','198334567892','1983-09-03','Female','7 Katugastota Road, Kandy',13,'PartTime','Available',4,'Abeysekara'),(4,2,18,'Ajith','0771445566','197845678903','1978-12-25','Male','22 Digana Road, Kandy',20,'FullTime','Available',6,'Senanayake'),(5,3,19,'Rohana','0771556677','199056789014','1990-04-07','Male','11 Wakwella Road, Galle',8,'Weekend','Available',8,'Wickramasinghe'),(6,4,27,'Gayan','0771667788','198967890125','1989-07-17','Male','5 Colombo Road, Negombo',14,'FullTime','Available',10,'Mendis'),(7,4,28,'Shanika','0771778899','199178901236','1991-11-11','Female','17 Rajapaksha Road, Negombo',9,'PartTime','Available',12,'Peiris');
/*!40000 ALTER TABLE `instructor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `licensetype`
--

DROP TABLE IF EXISTS `licensetype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `licensetype` (
  `LicenseID` int NOT NULL AUTO_INCREMENT,
  `LoginID` int DEFAULT NULL,
  `License_Type` enum('Motorcycle','Light Vehicle','Heavy Vehicle') DEFAULT NULL,
  PRIMARY KEY (`LicenseID`),
  KEY `LoginID` (`LoginID`),
  CONSTRAINT `licensetype_ibfk_1` FOREIGN KEY (`LoginID`) REFERENCES `login` (`LoginID`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `licensetype`
--

LOCK TABLES `licensetype` WRITE;
/*!40000 ALTER TABLE `licensetype` DISABLE KEYS */;
INSERT INTO `licensetype` VALUES (2,6,'Light Vehicle'),(3,7,'Motorcycle'),(4,8,'Light Vehicle'),(5,9,'Heavy Vehicle'),(6,10,'Light Vehicle'),(7,11,'Motorcycle'),(8,12,'Light Vehicle'),(9,13,'Heavy Vehicle'),(11,21,'Light Vehicle'),(12,22,'Motorcycle'),(13,23,'Heavy Vehicle'),(14,24,'Light Vehicle'),(15,25,'Light Vehicle'),(16,26,'Motorcycle'),(17,5,'Light Vehicle'),(20,31,'Motorcycle'),(21,31,'Light Vehicle'),(22,14,'Light Vehicle'),(28,38,'Light Vehicle'),(29,41,'Heavy Vehicle');
/*!40000 ALTER TABLE `licensetype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login`
--

DROP TABLE IF EXISTS `login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login` (
  `LoginID` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `UserRole` enum('Admin','DrivingSchool','Student','Instructor') DEFAULT NULL,
  PRIMARY KEY (`LoginID`),
  UNIQUE KEY `Email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login`
--

LOCK TABLES `login` WRITE;
/*!40000 ALTER TABLE `login` DISABLE KEYS */;
INSERT INTO `login` VALUES (1,'admin@dsms.lk','admin01','Admin'),(2,'colomboschool@dsms.lk','colscl01','DrivingSchool'),(3,'kandyschool@dsms.lk','kdyscl01','DrivingSchool'),(4,'galleschool@dsms.lk','galscl01','DrivingSchool'),(5,'nimalperera@gmail.com','nimal@01','Student'),(6,'kamalasilva@gmail.com','kamal@01','Student'),(7,'sureshfernando@gmail.com','suresh@01','Student'),(8,'anushajayasuriya@gmail.com','anush@01','Student'),(9,'ruwandias@gmail.com','ruwan@01','Student'),(10,'chamarirathnayake@gmail.com','chama@01','Student'),(11,'kasunwijesinghe@gmail.com','kasun@01','Student'),(12,'dilanigunawardena@gmail.com','dil@01','Student'),(13,'harshabandara@gmail.com','harsh@01','Student'),(14,'sandunikarunaratne@gmail.com','sandun@01','Student'),(15,'sunilrajapaksha@gmail.com','sunil@01','Instructor'),(17,'maliniabeysekara@gmail.com','malini@01','Instructor'),(18,'ajithsenanayake@gmail.com','ajith@01','Instructor'),(19,'rohanawickramasinghe@gmail.com','rohan@1','Instructor'),(20,'negomboschool@dsms.lk','ngmscl01','DrivingSchool'),(21,'tharindusamarasinghe@gmail.com','tharindu@01','Student'),(22,'isharawickramaratne@gmail.com','ishara@01','Student'),(23,'lakmalgunasekara@gmail.com','lakmal@01','Student'),(24,'nayomirodrigo@gmail.com','nayomi@01','Student'),(25,'chathuradesilva@gmail.com','chathu@01','Student'),(26,'vindyaamarasuriya@gmail.com','vindyaa@01','Student'),(27,'gayanmendis@gmail.com','gayan@01','Instructor'),(28,'shanikapeiris@gmail.com','shanika@01','Instructor'),(31,'iqgowthaman@gmail.com','Vesta@2709','Student'),(38,'iqgowthaman9@gmail.com','Vesta@4878','Student'),(39,'info@safedriveacademy.lk','Vesta@1234','DrivingSchool'),(41,'iqgowthaman999@gmail.com','Vesta@2709','Student');
/*!40000 ALTER TABLE `login` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `PayID` int NOT NULL AUTO_INCREMENT,
  `DsID` int NOT NULL,
  `StuID` int NOT NULL,
  `Payment_Date` date NOT NULL,
  `Amount` int NOT NULL,
  `Method` enum('Cash','Card') NOT NULL,
  PRIMARY KEY (`PayID`),
  KEY `DsID` (`DsID`),
  KEY `fk_payment_student` (`StuID`),
  CONSTRAINT `fk_payment_student` FOREIGN KEY (`StuID`) REFERENCES `student` (`StuID`),
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`DsID`) REFERENCES `drivingschool` (`DsID`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,1,'2026-06-15',25000,'Card'),(2,1,2,'2026-06-16',16000,'Cash'),(3,2,3,'2026-06-18',11000,'Cash'),(4,2,4,'2026-06-20',22000,'Card'),(5,2,5,'2026-06-21',27500,'Card'),(7,3,7,'2026-06-10',12000,'Card'),(9,2,9,'2026-06-26',55000,'Card'),(10,3,10,'2026-06-27',14000,'Cash'),(11,4,11,'2026-06-28',24000,'Card'),(12,4,12,'2026-06-29',6000,'Cash'),(13,4,13,'2026-06-30',24000,'Card'),(14,4,14,'2026-07-01',10000,'Cash'),(15,4,15,'2026-07-02',24000,'Card'),(16,4,16,'2026-07-03',5500,'Cash'),(20,3,19,'2026-07-27',12000,'Card'),(21,3,19,'2026-07-27',10000,'Cash'),(22,3,20,'2026-07-27',40000,'Card'),(23,2,21,'2026-07-27',22000,'Cash');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule`
--

DROP TABLE IF EXISTS `schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedule` (
  `LessonID` int NOT NULL AUTO_INCREMENT,
  `StuID` int NOT NULL,
  `InsID` int NOT NULL,
  `Lesson_Date` date NOT NULL,
  `Lesson_Time` time NOT NULL,
  `Status` enum('Completed','InProgress','Scheduled') DEFAULT NULL,
  `Attendance` enum('Present','Absent','Pending') DEFAULT 'Pending',
  `DsID` int DEFAULT NULL,
  `LessonNumber` int NOT NULL,
  PRIMARY KEY (`LessonID`),
  KEY `InsID` (`InsID`),
  KEY `DsID` (`DsID`),
  KEY `fk_schedule_student` (`StuID`),
  CONSTRAINT `fk_schedule_student` FOREIGN KEY (`StuID`) REFERENCES `student` (`StuID`),
  CONSTRAINT `schedule_ibfk_1` FOREIGN KEY (`InsID`) REFERENCES `instructor` (`InsID`),
  CONSTRAINT `schedule_ibfk_3` FOREIGN KEY (`DsID`) REFERENCES `drivingschool` (`DsID`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule`
--

LOCK TABLES `schedule` WRITE;
/*!40000 ALTER TABLE `schedule` DISABLE KEYS */;
INSERT INTO `schedule` VALUES (1,1,1,'2026-07-01','08:00:00','Completed','Present',1,12),(2,1,1,'2026-07-03','08:00:00','Completed','Present',1,13),(4,3,3,'2026-07-05','09:00:00','Completed','Present',2,5),(5,4,4,'2026-07-04','14:00:00','Completed','Present',2,18),(6,5,4,'2026-07-06','15:00:00','Completed','Present',2,26),(8,7,5,'2026-07-01','16:00:00','Completed','Present',3,11),(10,9,3,'2026-07-09','11:00:00','Completed','Present',2,29),(11,10,5,'2026-07-10','09:30:00','Completed','Present',3,3),(12,3,3,'2026-07-11','09:00:00','Completed','Absent',2,6),(13,5,4,'2026-07-12','15:00:00','Completed','Present',2,27),(15,9,3,'2026-07-14','11:00:00','Completed','Present',2,30),(16,11,6,'2026-07-15','08:00:00','Completed','Absent',4,9),(17,11,6,'2026-07-17','08:00:00','Completed','Absent',4,10),(18,12,7,'2026-07-16','13:00:00','Completed','Present',4,4),(19,13,6,'2026-07-18','09:00:00','Completed','Present',4,21),(20,14,6,'2026-07-19','10:00:00','Completed','Present',4,3),(21,15,7,'2026-07-20','16:00:00','Completed','Present',4,16),(22,16,6,'2026-07-21','15:00:00','Completed','Present',4,6),(35,11,6,'2026-07-26','16:00:00','Completed','Pending',1,11),(44,19,5,'2026-07-26','10:00:00','Completed','Present',3,2),(45,2,1,'2026-07-28','17:30:00','Scheduled','Pending',1,1);
/*!40000 ALTER TABLE `schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `StuID` int NOT NULL AUTO_INCREMENT,
  `UserID` int NOT NULL,
  `DsID` int NOT NULL,
  `CourseID` int NOT NULL,
  `InsID` int DEFAULT NULL,
  `FeeStatus` enum('Paid','Pending') DEFAULT NULL,
  `Attendance` int NOT NULL,
  `Status` enum('Training','TestReady','Completed','OnHold') DEFAULT NULL,
  PRIMARY KEY (`StuID`),
  KEY `DsID` (`DsID`),
  KEY `InsID` (`InsID`),
  KEY `UserID` (`UserID`),
  KEY `CourseID` (`CourseID`),
  CONSTRAINT `student_ibfk_1` FOREIGN KEY (`DsID`) REFERENCES `drivingschool` (`DsID`),
  CONSTRAINT `student_ibfk_2` FOREIGN KEY (`InsID`) REFERENCES `instructor` (`InsID`),
  CONSTRAINT `student_ibfk_3` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`),
  CONSTRAINT `student_ibfk_4` FOREIGN KEY (`CourseID`) REFERENCES `courses` (`CourseID`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES (1,1,1,1,1,'Paid',12,'Training'),(2,2,1,2,1,'Pending',8,'Training'),(3,3,2,3,3,'Paid',5,'OnHold'),(4,4,2,3,4,'Paid',18,'TestReady'),(5,5,2,4,4,'Paid',25,'Training'),(7,7,3,5,5,'Paid',10,'Completed'),(9,9,2,4,3,'Paid',28,'TestReady'),(10,10,3,6,5,'Paid',2,'OnHold'),(11,11,4,7,6,'Paid',9,'Training'),(12,12,4,8,7,'Paid',4,'Training'),(13,13,4,7,6,'Paid',20,'TestReady'),(14,14,4,7,6,'Paid',2,'Training'),(15,15,4,7,7,'Paid',15,'Training'),(16,16,4,8,7,'Paid',6,'Training'),(19,18,3,5,5,'Paid',1,'Training'),(20,24,3,9,NULL,'Pending',0,'Training'),(21,25,2,3,NULL,'Pending',0,'Training');
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `LoginID` int NOT NULL,
  `Fname` varchar(100) NOT NULL,
  `Lname` varchar(100) NOT NULL,
  `NIC` varchar(20) NOT NULL,
  `PhoneNo` varchar(15) NOT NULL,
  `DOB` date DEFAULT NULL,
  `Gender` varchar(10) NOT NULL,
  `S_Address` varchar(255) NOT NULL,
  `City` varchar(50) NOT NULL,
  `State` varchar(50) NOT NULL,
  `P_Code` int NOT NULL,
  `Trans_Prefer` enum('Automatic','Manual') NOT NULL,
  `Drive_Exp` enum('C_Beginner','S_Experience','Intermediate','Advanced') NOT NULL,
  `Pref_LessonTime` enum('AnyTime','Mrng','Afternoon','Evening','Weekends') NOT NULL,
  `Notes` varchar(255) NOT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `NIC` (`NIC`),
  KEY `LoginID` (`LoginID`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`LoginID`) REFERENCES `login` (`LoginID`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,5,'Nimal','Perera','199512345678','0711234566','1995-03-12','Male','10 Union Place','Colombo','Western',10100,'Manual','C_Beginner','Evening','Prefers weekday evening slots'),(2,6,'Kamala','Silva','199823456789','0712345678','1998-07-25','Female','22 Havelock Road','Colombo','Western',10500,'Automatic','C_Beginner','Mrng','Nervous first-time driver'),(3,7,'Suresh','Fernando','199234567890','0713456789','1992-01-05','Male','5 Temple Road','Kandy','Central',20000,'Manual','S_Experience','AnyTime','Wants heavy vehicle later'),(4,8,'Anusha','Jayasuriya','200045678901','0714567890','2000-11-30','Female','31 Lake Drive','Kandy','Central',20000,'Automatic','C_Beginner','Afternoon','None'),(5,9,'Ruwan','Dias','199056789012','0715678901','1990-05-18','Male','9 Beach Road','Galle','Southern',80000,'Manual','Intermediate','Weekends','Needs heavy vehicle license'),(6,10,'Chamari','Rathnayake','199967890123','0716789012','1999-09-09','Female','17 Fort Lane','Galle','Southern',80000,'Automatic','C_Beginner','Mrng','None'),(7,11,'Kasun','Wijesinghe','199378901234','0717890123','1993-02-22','Male','3 Kandy Road','Colombo','Western',10250,'Manual','S_Experience','Evening','Training for motorcycle license'),(8,12,'Dilani','Gunawardena','199689012345','0718901234','1996-12-01','Female','14 Station Road','Colombo','Western',10300,'Automatic','C_Beginner','Afternoon','None'),(9,13,'Harsha','Bandara','198790123456','0719012345','1987-04-14','Male','8 Hill Street','Kandy','Central',20100,'Manual','Advanced','AnyTime','Upgrading to heavy vehicle'),(10,14,'Sanduni','Karunaratne','200101234567','0710123456','2001-06-27','Female','26 Marine Drive','Galle','Southern',80100,'Manual','C_Beginner','Weekends','None'),(11,21,'Tharindu','Samarasinghe','199411223344','0721234567','1994-08-14','Male','6 Poruthota Road','Negombo','Western',11500,'Manual','C_Beginner','Weekends','None'),(12,22,'Ishara','Wickramaratne','200122334455','0722345678','2001-02-28','Female','18 Sea Street','Negombo','Western',11500,'Automatic','C_Beginner','Afternoon','Training for motorcycle licence'),(13,23,'Lakmal','Gunasekara','198833445566','0723456789','1988-10-09','Male','9 St Joseph Street','Negombo','Western',11500,'Manual','Advanced','Mrng','Upgrading to heavy vehicle'),(14,24,'Nayomi','Rodrigo','199744556677','0724567890','1997-05-03','Female','2 Old Chilaw Road','Negombo','Western',11500,'Automatic','C_Beginner','AnyTime','None'),(15,25,'Chathura','De Silva','199555667788','0725678901','1995-12-19','Male','14 Kurana Road','Negombo','Western',11500,'Manual','S_Experience','Evening','None'),(16,26,'Vindya','Amarasuriya','200366778899','0726789012','2003-03-22','Female','21 Grand Street','Negombo','Western',11500,'Automatic','C_Beginner','Weekends','Training for motorcycle licence'),(18,31,'Gowthaman','Navarathnarajah','200416100340','+94760403533','2004-06-09','male','16 Vanderwart Place','Dehiwala','Western',10350,'Automatic','C_Beginner','Evening',''),(24,38,'Gowthaman','Navarathnarajah','200112345678','+94760403533','2004-06-09','male','16 Vanderwart Place','Dehiwala','Western Province',10350,'Automatic','C_Beginner','Mrng',''),(25,41,'Gowthaman','Navarathnarajah','200112345680','+94760403533','2026-07-09','female','16 Vanderwart Place,Dehiwala,undefined','Dehiwala','Western Province',10350,'Automatic','C_Beginner','Afternoon','acdsvrwvr');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicle`
--

DROP TABLE IF EXISTS `vehicle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicle` (
  `VehID` int NOT NULL AUTO_INCREMENT,
  `DsID` int NOT NULL,
  `VehNo` varchar(15) NOT NULL,
  `Brand` varchar(10) NOT NULL,
  `Model` varchar(10) NOT NULL,
  `FuelType` enum('Petrol','Diesel','Hybrid','Electric') NOT NULL,
  `Mileage` int NOT NULL,
  `Transmission` enum('Automatic','Manual') NOT NULL,
  `Make_Year` int NOT NULL,
  `Status` enum('Available','Maintenance') NOT NULL DEFAULT 'Available',
  `Remarks` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`VehID`),
  UNIQUE KEY `VehNo` (`VehNo`),
  KEY `DsID` (`DsID`),
  CONSTRAINT `vehicle_ibfk_1` FOREIGN KEY (`DsID`) REFERENCES `drivingschool` (`DsID`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicle`
--

LOCK TABLES `vehicle` WRITE;
/*!40000 ALTER TABLE `vehicle` DISABLE KEYS */;
INSERT INTO `vehicle` VALUES (1,1,'WP-CAB-1001','Toyota','Aqua','Hybrid',45000,'Automatic',2019,'Available','Dual controls installed'),(2,1,'WP-CAB-1002','Suzuki','Alto','Petrol',62000,'Manual',2017,'Available',NULL),(4,2,'CP-CAB-2001','Toyota','Corolla','Petrol',70000,'Manual',2015,'Available',NULL),(5,2,'CP-CAB-2002','Perodua','Axia','Petrol',25000,'Automatic',2021,'Available','Newest fleet vehicle'),(6,2,'CP-CAB-2003','Toyota','Hilux','Diesel',90000,'Manual',2016,'Available','Heavy vehicle training'),(7,3,'SP-CAB-3001','Honda','Fit','Hybrid',30000,'Automatic',2020,'Available',NULL),(8,3,'SP-CAB-3002','Suzuki','Swift','Petrol',40000,'Manual',2018,'Available',NULL),(10,4,'WP-CAB-4001','Toyota','Vitz','Petrol',33000,'Automatic',2020,'Available',NULL),(11,4,'WP-CAB-4002','Suzuki','Alto','Petrol',50000,'Manual',2018,'Available','Dual controls installed'),(12,4,'WP-CAB-4003','Bajaj','Pulsar','Petrol',15000,'Manual',2021,'Available','Motorcycle for licence class');
/*!40000 ALTER TABLE `vehicle` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-27  3:23:48
