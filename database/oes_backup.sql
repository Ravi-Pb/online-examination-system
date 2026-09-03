-- MySQL dump 10.13  Distrib 26.7.0, for Win64 (x86_64)
--
-- Host: localhost    Database: online_examination_system_2
-- ------------------------------------------------------
-- Server version	26.7.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '96f1b9bc-a2c7-11f1-86f2-c8a3e875521e:1-169';

--
-- Table structure for table `answers`
--

DROP TABLE IF EXISTS `answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `answers` (
  `answer_id` bigint NOT NULL AUTO_INCREMENT,
  `attempt_id` bigint NOT NULL,
  `question_id` bigint NOT NULL,
  `selected_option_id` bigint DEFAULT NULL,
  `is_correct` tinyint(1) DEFAULT NULL,
  `marks_obtained` decimal(5,2) DEFAULT NULL,
  `answered_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`answer_id`),
  UNIQUE KEY `uq_answers_attempt_question` (`attempt_id`,`question_id`),
  KEY `fk_answers_question` (`question_id`),
  KEY `fk_answers_selected_option` (`selected_option_id`,`question_id`),
  CONSTRAINT `fk_answers_attempt` FOREIGN KEY (`attempt_id`) REFERENCES `exam_attempts` (`attempt_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `fk_answers_question` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_answers_selected_option` FOREIGN KEY (`selected_option_id`, `question_id`) REFERENCES `options` (`option_id`, `question_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answers`
--

LOCK TABLES `answers` WRITE;
/*!40000 ALTER TABLE `answers` DISABLE KEYS */;
INSERT INTO `answers` VALUES (1,1,1,2,1,2.00,'2026-09-01 15:11:44','2026-09-01 15:11:44'),(2,1,2,7,1,2.00,'2026-09-01 15:11:44','2026-09-01 15:11:44'),(4,6,1,3,0,0.00,'2026-09-02 18:20:48','2026-09-02 18:20:46'),(5,6,2,6,0,0.00,'2026-09-02 18:20:58','2026-09-02 18:20:58'),(6,7,1,2,1,2.00,'2026-09-02 18:33:29','2026-09-02 18:33:29'),(7,7,2,6,0,0.00,'2026-09-02 18:33:36','2026-09-02 18:33:36'),(8,8,1,2,1,2.00,'2026-09-02 18:40:54','2026-09-02 18:40:54'),(9,9,1,2,1,2.00,'2026-09-02 18:54:04','2026-09-02 18:54:04'),(10,9,2,7,1,2.00,'2026-09-02 18:54:10','2026-09-02 18:54:10'),(11,10,4,10,1,2.00,'2026-09-02 23:07:15','2026-09-02 23:07:15'),(12,13,4,12,0,0.00,'2026-09-03 09:42:23','2026-09-03 09:42:21'),(13,14,4,10,1,2.00,'2026-09-03 09:42:48','2026-09-03 09:42:48');
/*!40000 ALTER TABLE `answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam_attempts`
--

DROP TABLE IF EXISTS `exam_attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_attempts` (
  `attempt_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `exam_id` bigint NOT NULL,
  `attempt_number` int NOT NULL,
  `started_at` datetime NOT NULL,
  `submitted_at` datetime DEFAULT NULL,
  `attempt_status` varchar(20) NOT NULL DEFAULT 'IN_PROGRESS',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`attempt_id`),
  UNIQUE KEY `uq_attempt_user_exam_number` (`user_id`,`exam_id`,`attempt_number`),
  KEY `fk_attempts_exam` (`exam_id`),
  CONSTRAINT `fk_attempts_exam` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`exam_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_attempts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_attempts`
--

LOCK TABLES `exam_attempts` WRITE;
/*!40000 ALTER TABLE `exam_attempts` DISABLE KEYS */;
INSERT INTO `exam_attempts` VALUES (1,2,1,1,'2026-09-01 15:10:53','2026-09-01 15:13:22','SUBMITTED','2026-09-01 15:10:53','2026-09-01 15:13:22'),(3,16,4,1,'2026-09-02 14:13:30','2026-09-02 23:04:21','SUBMITTED','2026-09-02 14:13:30','2026-09-02 23:04:21'),(4,17,4,1,'2026-09-02 16:09:43','2026-09-02 23:04:21','SUBMITTED','2026-09-02 16:09:43','2026-09-02 23:04:21'),(5,18,4,1,'2026-09-02 16:40:14','2026-09-02 23:04:21','SUBMITTED','2026-09-02 16:40:14','2026-09-02 23:04:21'),(6,17,1,1,'2026-09-02 17:26:53','2026-09-02 18:21:04','SUBMITTED','2026-09-02 17:26:53','2026-09-02 18:21:04'),(7,17,1,2,'2026-09-02 18:33:24','2026-09-02 18:33:41','SUBMITTED','2026-09-02 18:33:24','2026-09-02 18:33:41'),(8,17,1,3,'2026-09-02 18:40:49','2026-09-02 18:41:08','SUBMITTED','2026-09-02 18:40:49','2026-09-02 18:41:08'),(9,17,1,4,'2026-09-02 18:54:01','2026-09-02 18:54:15','SUBMITTED','2026-09-02 18:54:01','2026-09-02 18:54:15'),(10,17,4,2,'2026-09-02 23:06:47','2026-09-02 23:07:20','SUBMITTED','2026-09-02 23:06:47','2026-09-02 23:07:20'),(11,17,4,3,'2026-09-02 23:24:48','2026-09-02 23:52:57','SUBMITTED','2026-09-02 23:24:48','2026-09-02 23:52:57'),(12,17,4,4,'2026-09-02 23:53:13','2026-09-03 00:23:20','SUBMITTED','2026-09-02 23:53:13','2026-09-03 00:23:20'),(13,17,4,5,'2026-09-03 09:42:17','2026-09-03 09:42:27','SUBMITTED','2026-09-03 09:42:17','2026-09-03 09:42:27'),(14,17,4,6,'2026-09-03 09:42:41','2026-09-03 09:42:51','SUBMITTED','2026-09-03 09:42:41','2026-09-03 09:42:51'),(15,17,4,7,'2026-09-03 09:43:06',NULL,'IN_PROGRESS','2026-09-03 09:43:06','2026-09-03 09:43:06');
/*!40000 ALTER TABLE `exam_attempts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exams`
--

DROP TABLE IF EXISTS `exams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exams` (
  `exam_id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `subject_id` bigint NOT NULL,
  `exam_description` text,
  `duration_minutes` int NOT NULL,
  `start_at` datetime DEFAULT NULL,
  `end_at` datetime DEFAULT NULL,
  `exam_status` varchar(20) NOT NULL DEFAULT 'DRAFT',
  `created_by` bigint NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`exam_id`),
  KEY `fk_exams_subject` (`subject_id`),
  KEY `fk_exams_created_by` (`created_by`),
  CONSTRAINT `fk_exams_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_exams_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exams`
--

LOCK TABLES `exams` WRITE;
/*!40000 ALTER TABLE `exams` DISABLE KEYS */;
INSERT INTO `exams` VALUES (1,'Advanced Java Fundamentals',1,'Updated 2 Java examination',90,'2026-09-02 17:15:34','2026-09-02 19:25:34','PUBLISHED',1,'2026-09-01 15:07:43','2026-09-02 11:32:22'),(2,'Java Fundamentals',1,'Basic Java examination',60,'2026-09-05 10:00:00','2026-09-05 11:00:00','DRAFT',13,'2026-09-01 21:09:35','2026-09-01 21:09:35'),(3,'Java Fundamentals',1,'Basic Java examination',60,'2026-09-05 10:00:00','2026-09-05 11:00:00','DRAFT',13,'2026-09-01 21:19:13','2026-09-01 21:19:13'),(4,'Java Programming Test',1,NULL,30,NULL,NULL,'PUBLISHED',13,'2026-09-02 13:57:12','2026-09-02 14:09:13');
/*!40000 ALTER TABLE `exams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `options`
--

DROP TABLE IF EXISTS `options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `options` (
  `option_id` bigint NOT NULL AUTO_INCREMENT,
  `question_id` bigint NOT NULL,
  `option_label` varchar(10) NOT NULL,
  `option_text` varchar(500) NOT NULL,
  `is_correct` tinyint(1) NOT NULL DEFAULT '0',
  `option_order` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`option_id`),
  UNIQUE KEY `uq_options_question_order` (`question_id`,`option_order`),
  UNIQUE KEY `uq_options_id_question` (`option_id`,`question_id`),
  CONSTRAINT `fk_options_question` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `options`
--

LOCK TABLES `options` WRITE;
/*!40000 ALTER TABLE `options` DISABLE KEYS */;
INSERT INTO `options` VALUES (1,1,'A','1NF',0,1,'2026-09-01 15:09:26'),(2,1,'B','2NF',1,2,'2026-09-01 15:09:26'),(3,1,'C','3NF',0,3,'2026-09-01 15:09:26'),(4,1,'D','BCNF',0,4,'2026-09-01 15:09:26'),(5,2,'A','INSERT',0,1,'2026-09-01 15:09:26'),(6,2,'B','UPDATE',0,2,'2026-09-01 15:09:26'),(7,2,'C','SELECT',1,3,'2026-09-01 15:09:26'),(8,2,'D','DELETE',0,4,'2026-09-01 15:09:26'),(9,4,'A','implements',0,1,'2026-09-02 14:04:11'),(10,4,'B','extends',1,2,'2026-09-02 14:04:11'),(11,4,'C','inherits',0,3,'2026-09-02 14:04:11'),(12,4,'D','super',0,4,'2026-09-02 14:04:11');
/*!40000 ALTER TABLE `options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `question_id` bigint NOT NULL AUTO_INCREMENT,
  `exam_id` bigint NOT NULL,
  `question_text` text NOT NULL,
  `marks` decimal(5,2) NOT NULL,
  `question_order` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`question_id`),
  UNIQUE KEY `uq_questions_exam_order` (`exam_id`,`question_order`),
  CONSTRAINT `fk_questions_exam` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`exam_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (1,1,'Which normal form removes partial dependency?',2.00,1,'2026-09-01 15:08:28','2026-09-01 15:08:28'),(2,1,'Which SQL command is used to retrieve data?',2.00,2,'2026-09-01 15:08:28','2026-09-01 15:08:28'),(4,4,'Which keyword is used to inherit a class in Java?',2.00,1,'2026-09-02 14:04:11','2026-09-02 14:04:11');
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `results`
--

DROP TABLE IF EXISTS `results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `results` (
  `result_id` bigint NOT NULL AUTO_INCREMENT,
  `attempt_id` bigint NOT NULL,
  `total_marks` decimal(7,2) NOT NULL,
  `obtained_marks` decimal(7,2) NOT NULL,
  `grade` varchar(5) DEFAULT NULL,
  `result_status` varchar(20) NOT NULL DEFAULT 'PUBLISHED',
  `evaluated_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`result_id`),
  UNIQUE KEY `attempt_id` (`attempt_id`),
  CONSTRAINT `fk_results_attempt` FOREIGN KEY (`attempt_id`) REFERENCES `exam_attempts` (`attempt_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `results`
--

LOCK TABLES `results` WRITE;
/*!40000 ALTER TABLE `results` DISABLE KEYS */;
INSERT INTO `results` VALUES (1,1,4.00,4.00,'A','PUBLISHED','2026-09-01 15:14:09','2026-09-01 15:14:09','2026-09-01 15:14:09');
/*!40000 ALTER TABLE `results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subjects` (
  `subject_id` bigint NOT NULL AUTO_INCREMENT,
  `subject_code` varchar(20) NOT NULL,
  `subject_name` varchar(150) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`subject_id`),
  UNIQUE KEY `subject_code` (`subject_code`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
INSERT INTO `subjects` VALUES (1,'CS301','Database Management Systems','2026-09-01 15:06:48','2026-09-01 15:06:48');
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `user_role` varchar(20) NOT NULL,
  `account_status` varchar(20) NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Test Teacher','teacher@test.com','TEMP_HASH','TEACHER','ACTIVE','2026-09-01 15:05:53','2026-09-01 15:05:53'),(2,'Test Student','student@test.com','TEMP_HASH','STUDENT','ACTIVE','2026-09-01 15:10:24','2026-09-01 15:10:24'),(4,'New Student','newstudent@test.com','password123','STUDENT','ACTIVE','2026-09-01 17:25:06','2026-09-01 17:25:06'),(6,'New Student','student2@test.com','password123','STUDENT','ACTIVE','2026-09-01 17:30:57','2026-09-01 17:30:57'),(7,'','abc','123','','ACTIVE','2026-09-01 17:31:10','2026-09-01 17:31:10'),(9,'','abcd','123','','ACTIVE','2026-09-01 17:32:01','2026-09-01 17:32:01'),(10,'BCrypt Student','bcrypt@test.com','$2a$10$G7SetW.peUzJuQOJ1EEDGuDTKylztQ9Upf29iiXMD/i9STpxyr6wG','STUDENT','ACTIVE','2026-09-01 17:49:42','2026-09-01 17:49:42'),(11,'Fresh Student','freshstudent@test.com','$2a$10$NNA5viAxk8qSyDEG4RkvVussk7wW8EZyKKX5mYRxitZv59Tfai0DO','STUDENT','ACTIVE','2026-09-01 20:11:04','2026-09-01 20:11:04'),(12,'Duplicate Test','duplicate@test.com','$2a$10$E3F9/LCUlcClqg.WNHessuJvSK5ilESH2iopphAT/4ixguYy5fhjW','STUDENT','ACTIVE','2026-09-01 20:18:35','2026-09-01 20:18:35'),(13,'Test Teacher Two','teacher2@test.com','$2a$10$cYvLnRmHiygEDiQTw9R2A.f5XejfSsgss6uRH2Dy2rLRJs28k/r2S','TEACHER','ACTIVE','2026-09-01 21:00:42','2026-09-01 21:00:42'),(15,'Test Student','student1@test.com','$2a$10$rpPOPhi6nhZUORTAbUwsI.NoYPnULs2zu1rJGbGkufkJuEP2PodSG','STUDENT','ACTIVE','2026-09-02 11:30:17','2026-09-02 11:30:17'),(16,'Test Student','student1@gmail.com','$2a$10$eBw7uEWfiim6EE/7isuAQ.KZqFK.qpuaw30dswe7Fctt.B8dOnRiS','STUDENT','ACTIVE','2026-09-02 14:10:40','2026-09-02 14:10:40'),(17,'Avinash Anand','avinash@gmail.com','$2a$10$l0wwQk.i9xMMM8zuFV5t3.37q/Y5F06IKr.4Xj6x3WWsNkTAowZte','STUDENT','ACTIVE','2026-09-02 15:11:32','2026-09-02 15:11:32'),(18,'Nitish Kr','nitishkr@gmail.com','$2a$10$7v7iXn2pa9atFYX6xHoPi.mrLb6zu1gFRH/A4Uky4E3fj4sE82azq','STUDENT','ACTIVE','2026-09-02 15:51:00','2026-09-02 15:51:00');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-03  9:47:29
