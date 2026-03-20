CREATE DATABASE  IF NOT EXISTS `insure_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `insure_db`;
-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: insure_db
-- ------------------------------------------------------
-- Server version	8.0.45

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
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ROLE_CUSTOMER'),(2,'ROLE_AGENT'),(3,'ROLE_ADMIN');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `role_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKp56c1712k691lhsyewcssf40f` (`role_id`),
  CONSTRAINT `FKp56c1712k691lhsyewcssf40f` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'aniket@insureai.com','password123','Aniket',2);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-20 16:50:44
CREATE DATABASE  IF NOT EXISTS `insureai_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `insureai_db`;
-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: insureai_db
-- ------------------------------------------------------
-- Server version	8.0.45

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
-- Table structure for table `application_documents`
--

DROP TABLE IF EXISTS `application_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `application_documents` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `admin_remarks` varchar(255) DEFAULT NULL,
  `application_id` bigint NOT NULL,
  `category` enum('ID_PROOF','INSURANCE_SPECIFIC') NOT NULL,
  `document_type` varchar(255) NOT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `file_size` bigint DEFAULT NULL,
  `file_type` varchar(255) DEFAULT NULL,
  `original_file_name` varchar(255) DEFAULT NULL,
  `status` enum('PENDING_REVIEW','REJECTED','VERIFIED') DEFAULT NULL,
  `stored_file_name` varchar(255) DEFAULT NULL,
  `uploaded_at` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  `verified_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_documents`
--

LOCK TABLES `application_documents` WRITE;
/*!40000 ALTER TABLE `application_documents` DISABLE KEYS */;
INSERT INTO `application_documents` VALUES (1,NULL,4,'ID_PROOF','AADHAAR','uploads\\documents\\4\\60e10792-e655-4207-9427-e8299b3cd43a.pdf',121410,'application/pdf','manoj.pdf','PENDING_REVIEW','60e10792-e655-4207-9427-e8299b3cd43a.pdf','2026-03-10 22:35:50.961896',11,NULL),(2,NULL,4,'INSURANCE_SPECIFIC','MEDICAL_REPORT','uploads\\documents\\4\\bba6d7d4-f54b-41ec-8a84-76ced6e799a3.pdf',129034,'application/pdf','Marksheet.pdf','PENDING_REVIEW','bba6d7d4-f54b-41ec-8a84-76ced6e799a3.pdf','2026-03-10 22:36:04.026857',11,NULL),(3,NULL,4,'INSURANCE_SPECIFIC','BLOOD_TEST','uploads\\documents\\4\\c6c0f92b-e8d7-426b-b91b-1c466fefb48d.pdf',129034,'application/pdf','Marksheet.pdf','PENDING_REVIEW','c6c0f92b-e8d7-426b-b91b-1c466fefb48d.pdf','2026-03-10 22:36:53.499268',11,NULL),(4,NULL,4,'INSURANCE_SPECIFIC','ECG','uploads\\documents\\4\\321402fe-2d7e-48df-a149-a5a76017dc2f.pdf',129034,'application/pdf','Marksheet.pdf','PENDING_REVIEW','321402fe-2d7e-48df-a149-a5a76017dc2f.pdf','2026-03-10 22:37:11.056232',11,NULL),(5,NULL,4,'INSURANCE_SPECIFIC','INCOME_PROOF','uploads\\documents\\4\\dd276217-2bf9-40df-b3ee-a0299bfb3f1e.pdf',129034,'application/pdf','Marksheet.pdf','PENDING_REVIEW','dd276217-2bf9-40df-b3ee-a0299bfb3f1e.pdf','2026-03-10 22:37:22.607961',11,NULL),(6,'',1,'INSURANCE_SPECIFIC','FIR_REPORT','uploads\\documents\\1\\c38d1447-8766-4deb-8763-af1e1cee5d0a.pdf',129034,'application/pdf','Marksheet.pdf','VERIFIED','c38d1447-8766-4deb-8763-af1e1cee5d0a.pdf','2026-03-18 15:10:13.816628',11,'2026-03-18 16:44:49.316249'),(7,'',1,'INSURANCE_SPECIFIC','MEDICAL_BILLS','uploads\\documents\\1\\da076da0-9d59-4db0-bf63-bb7d56532407.pdf',129034,'application/pdf','Marksheet.pdf','VERIFIED','da076da0-9d59-4db0-bf63-bb7d56532407.pdf','2026-03-18 15:10:25.457591',11,'2026-03-18 16:44:51.176533');
/*!40000 ALTER TABLE `application_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `claims`
--

DROP TABLE IF EXISTS `claims`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `claims` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `admin_remarks` varchar(255) DEFAULT NULL,
  `applicant_email` varchar(255) DEFAULT NULL,
  `applicant_name` varchar(255) DEFAULT NULL,
  `applicant_phone` varchar(255) DEFAULT NULL,
  `application_id` bigint NOT NULL,
  `approved_amount` double DEFAULT NULL,
  `claim_amount` double NOT NULL,
  `claim_number` varchar(255) NOT NULL,
  `claim_type` varchar(255) NOT NULL,
  `company` varchar(255) DEFAULT NULL,
  `filed_at` datetime(6) DEFAULT NULL,
  `incident_date` varchar(255) NOT NULL,
  `incident_description` varchar(1000) DEFAULT NULL,
  `incident_location` varchar(255) DEFAULT NULL,
  `policy_name` varchar(255) DEFAULT NULL,
  `policy_number` varchar(255) DEFAULT NULL,
  `policy_type` varchar(255) DEFAULT NULL,
  `status` enum('APPROVED','PENDING','REJECTED','UNDER_REVIEW') DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK8prfn2h4t4bpdy5s6lonblk7m` (`claim_number`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `claims`
--

LOCK TABLES `claims` WRITE;
/*!40000 ALTER TABLE `claims` DISABLE KEYS */;
INSERT INTO `claims` VALUES (1,'Your claim is approved','Shriramjayabhaye@gmail.com','Shriram Jaybhaye','9472657816',4,100000000,10000000,'CLM-2026-00001','ACCIDENT','HDFC Life Insurance','2026-03-18 15:09:27.521638','14-03-2026','acciident','Sinhgad road , pune','HDFC Life Click 2 Protect Super','INS-LIFE-010','LIFE','APPROVED','2026-03-18 16:45:34.622124',11);
/*!40000 ALTER TABLE `claims` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `policies`
--

DROP TABLE IF EXISTS `policies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `policies` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `claim_settlement_ratio` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `coverage_amount` double DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `key_features` varchar(255) DEFAULT NULL,
  `max_age` int DEFAULT NULL,
  `min_age` int DEFAULT NULL,
  `policy_name` varchar(255) NOT NULL,
  `policy_type` varchar(255) NOT NULL,
  `premium_amount` double DEFAULT NULL,
  `premium_frequency` varchar(255) DEFAULT NULL,
  `riders` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVE','DRAFT','INACTIVE') DEFAULT NULL,
  `tax_benefit` bit(1) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `policy_number` varchar(255) NOT NULL,
  `policy_term` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKoa74bk3bbln2o1hgik4b93rp9` (`policy_number`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `policies`
--

LOCK TABLES `policies` WRITE;
/*!40000 ALTER TABLE `policies` DISABLE KEYS */;
INSERT INTO `policies` VALUES (2,'98.5%','Star Health Insurance',1000000,'2026-03-07 13:00:51.983408','Comprehensive health cover for family','Cashless treatment,14000+ hospitals,No claim bonus',65,18,'Star Health Premier','HEALTH',1800,'MONTHLY','OPD Cover,Hospital Cash','ACTIVE',_binary '','2026-03-07 13:04:32.154772','',NULL),(3,'98.5%','Star Health Insurance',1000000,'2026-03-07 13:28:43.983004','Complete family health coverage','Cashless,No claim bonus,Free checkup',NULL,NULL,'Star Health Family Premier','HEALTH',1200,'MONTHLY',NULL,'ACTIVE',_binary '','2026-03-07 13:28:43.983004','INS-HLTH-001',NULL),(4,'99.1%','HDFC Life',10000000,'2026-03-07 13:30:00.756092','Pure term life insurance',NULL,NULL,NULL,'HDFC Click 2 Protect','LIFE',850,'MONTHLY',NULL,'ACTIVE',_binary '','2026-03-07 13:30:00.756092','INS-LIFE-001','30 years'),(6,'97.2%','ICICI Lombard',500000,'2026-03-07 13:31:19.044924','Complete car protection',NULL,NULL,NULL,'ICICI Comprehensive Car','MOTOR',650,'YEARLY',NULL,'ACTIVE',_binary '\0','2026-03-07 13:31:19.044924','INS-MOTR-001',NULL),(7,'96.0%','Digit Insurance',100000,'2026-03-07 13:32:52.302532','Complete two wheeler protection',NULL,NULL,NULL,'Digit Bike Shield','TWO_WHEELER',450,'YEARLY',NULL,'ACTIVE',_binary '\0','2026-03-07 13:32:52.303618','INS-BIKE-001',NULL),(9,'95.0%','Bajaj Allianz',5000000,'2026-03-07 13:33:30.619607','Worldwide travel protection',NULL,NULL,NULL,'Bajaj Allianz Travel Elite','TRAVEL',500,'YEARLY',NULL,'ACTIVE',_binary '\0','2026-03-07 13:33:30.619607','INS-TRVL-001',NULL),(10,'94.5%','HDFC Ergo',5000000,'2026-03-07 13:33:58.872278','Complete home protection',NULL,NULL,NULL,'HDFC Home Shield','HOME',2500,'YEARLY',NULL,'ACTIVE',_binary '\0','2026-03-07 13:33:58.872278','INS-HOME-001',NULL),(18,'98.5%','Star Health Insurance',1000000,'2026-03-09 14:13:14.564774','Comprehensive family floater health plan covering hospitalization, day care procedures, and pre/post hospitalization expenses. Ideal for families of 2-6 members with cashless treatment at 14,000+ network hospitals across India.','Cashless Treatment, No Claim Bonus, Free Annual Checkup, Ambulance Cover, Organ Donor Cover',NULL,NULL,'Star Health Family Premier','HEALTH',1200,'MONTHLY','OPD Cover, Hospital Cash, Critical Illness Rider','ACTIVE',_binary '','2026-03-09 14:13:14.564774','INS-HLTH-002','1 Year'),(21,'98.5%','Star Health Insurance',1000000,'2026-03-09 14:14:03.041641','Comprehensive family floater health plan covering hospitalization, day care procedures, and pre/post hospitalization expenses. Ideal for families of 2-6 members with cashless treatment at 14,000+ network hospitals across India.\"','Cashless Treatment, No Claim Bonus, Free Annual Checkup, Ambulance Cover, Organ Donor Cover\",',NULL,NULL,'Star Health Family Premier','HEALTH',1200,'MONTHLY','OPD Cover, Hospital Cash, Critical Illness Rider','ACTIVE',_binary '','2026-03-09 14:14:03.041641','INS-HLTH-005','1 Year'),(22,'99.2%','HDFC Life Insurance',10000000,'2026-03-09 14:21:12.327541','A pure term life insurance plan offering high sum assured at affordable premiums. Provides financial security to your family in case of the policyholder\'s unfortunate demise. Includes optional critical illness and accidental death riders.','High Sum Assured, Tax Saving 80C, Spouse Cover Option, Return of Premium Option, Whole Life Cover till 99',NULL,NULL,'HDFC Life Click 2 Protect Super','LIFE',850,'MONTHLY','Critical Illness Rider, Accidental Death Benefit, Waiver of Premium','ACTIVE',_binary '','2026-03-09 14:21:12.327541','INS-LIFE-010','30 Years');
/*!40000 ALTER TABLE `policies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `policy_applications`
--

DROP TABLE IF EXISTS `policy_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `policy_applications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `admin_remarks` varchar(255) DEFAULT NULL,
  `applicant_address` varchar(255) DEFAULT NULL,
  `applicant_dob` varchar(255) DEFAULT NULL,
  `applicant_email` varchar(255) NOT NULL,
  `applicant_name` varchar(255) NOT NULL,
  `applicant_phone` varchar(255) DEFAULT NULL,
  `application_number` varchar(255) DEFAULT NULL,
  `applied_at` datetime(6) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `coverage_amount` double DEFAULT NULL,
  `nominee_name` varchar(255) DEFAULT NULL,
  `nominee_relation` varchar(255) DEFAULT NULL,
  `policy_id` bigint NOT NULL,
  `policy_name` varchar(255) DEFAULT NULL,
  `policy_number` varchar(255) DEFAULT NULL,
  `policy_type` varchar(255) DEFAULT NULL,
  `premium_amount` double DEFAULT NULL,
  `premium_frequency` varchar(255) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `status` enum('APPROVED','PENDING','REJECTED','UNDER_REVIEW') DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `policy_applications`
--

LOCK TABLES `policy_applications` WRITE;
/*!40000 ALTER TABLE `policy_applications` DISABLE KEYS */;
INSERT INTO `policy_applications` VALUES (1,'Documents being verified','Flat 302, Sunrise Apartments, Borivali West, Mumbai - 400092','15-08-1995','arjun@insureai.in','Arjun Sharma','9876543210','APP-2026-00001','2026-03-10 19:17:34.408703','Star Health Insurance',1000000,'Priya Sharma','Spouse',18,'Star Health Family Premier','INS-HLTH-002','HEALTH',1200,'MONTHLY','Please process at earliest','REJECTED','2026-03-10 22:21:00.708058',1),(2,'Incomplete documents. Please reapply with valid ID proof.','Flat 302, Sunrise Apartments, Borivali West, Mumbai - 400092','15-08-1995','arjun@insureai.in','Arjun Sharma','9876543210','APP-2026-00002','2026-03-10 19:47:23.683067','Star Health Insurance',1000000,'Priya Sharma','Spouse',18,'Star Health Family Premier','INS-HLTH-002','HEALTH',1200,'MONTHLY','Please process at earliest','REJECTED','2026-03-10 19:48:01.452087',2),(3,'','room no. 40 , police colony , palaspe , panvel ,raigad','14-03-2007','aniket@insureai.com','Aniket Updated','9372657816','APP-2026-00003','2026-03-10 22:07:01.880917','Star Health Insurance',1000000,'Aniket Butepwad','',2,'Star Health Premier','','HEALTH',1800,'MONTHLY','','UNDER_REVIEW','2026-03-10 22:19:46.396183',1),(4,'','room no. 40 , police colony , palaspe , panvel ,raigad','14-03-2007','Shriramjayabhaye@gmail.com','Shriram Jaybhaye','9472657816','APP-2026-00004','2026-03-10 22:33:34.706222','HDFC Life Insurance',10000000,'Aniket Butepwad','Friend',22,'HDFC Life Click 2 Protect Super','INS-LIFE-010','LIFE',850,'MONTHLY','','APPROVED','2026-03-13 15:19:48.124093',11),(5,NULL,'room no. 40 , police colony , palaspe , panvel ,raigad','14-03-2007','aniket@gmail.com','aniket','9472657816','APP-2026-00005','2026-03-13 15:17:04.362678','Star Health Insurance',1000000,'Aniket Butepwad','Friend',2,'Star Health Premier','','HEALTH',1800,'MONTHLY','','PENDING','2026-03-13 15:17:04.362678',13);
/*!40000 ALTER TABLE `policy_applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `policy_health`
--

DROP TABLE IF EXISTS `policy_health`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `policy_health` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ayush_cover` bit(1) DEFAULT NULL,
  `cashless_hospitals` varchar(255) DEFAULT NULL,
  `copay_percentage` varchar(255) DEFAULT NULL,
  `covid_cover` bit(1) DEFAULT NULL,
  `day_care_procedures` varchar(255) DEFAULT NULL,
  `maternity_benefit` bit(1) DEFAULT NULL,
  `max_age` int DEFAULT NULL,
  `min_age` int DEFAULT NULL,
  `pre_existing_waiting` varchar(255) DEFAULT NULL,
  `room_rent_limit` varchar(255) DEFAULT NULL,
  `policy_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKbv2vnrr60wr7vku5prpfcq802` (`policy_id`),
  CONSTRAINT `FK8j29u2b7pw5xua0gy6n5g0ops` FOREIGN KEY (`policy_id`) REFERENCES `policies` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `policy_health`
--

LOCK TABLES `policy_health` WRITE;
/*!40000 ALTER TABLE `policy_health` DISABLE KEYS */;
INSERT INTO `policy_health` VALUES (1,_binary '','14000+','10%',_binary '','500+',_binary '',65,18,'2 years','Single AC Room',3),(2,_binary '','14,000+','10%',_binary '','500+',_binary '',65,18,'2 Years','Single AC Room',18),(3,_binary '','14,000+','10%',_binary '','500+',_binary '',65,18,'2 Years','Single AC Room',21);
/*!40000 ALTER TABLE `policy_health` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `policy_home`
--

DROP TABLE IF EXISTS `policy_home`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `policy_home` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `alternate_accommodation` bit(1) DEFAULT NULL,
  `burglary_protection` bit(1) DEFAULT NULL,
  `construction_type` varchar(255) DEFAULT NULL,
  `content_cover` bit(1) DEFAULT NULL,
  `natural_disaster` bit(1) DEFAULT NULL,
  `property_age` varchar(255) DEFAULT NULL,
  `property_type` varchar(255) DEFAULT NULL,
  `public_liability` bit(1) DEFAULT NULL,
  `structure_cover` bit(1) DEFAULT NULL,
  `sum_insured_property` double DEFAULT NULL,
  `valuables_cover` bit(1) DEFAULT NULL,
  `policy_id` bigint DEFAULT NULL,
  `valueables_cover` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKptpyjr7m9y6us8pvfa3htq2g7` (`policy_id`),
  CONSTRAINT `FKqp68cg9yygn6dtubhbdpfyw5t` FOREIGN KEY (`policy_id`) REFERENCES `policies` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `policy_home`
--

LOCK TABLES `policy_home` WRITE;
/*!40000 ALTER TABLE `policy_home` DISABLE KEYS */;
INSERT INTO `policy_home` VALUES (1,_binary '',_binary '','RCC',_binary '',_binary '','0-5 years','APARTMENT',_binary '',_binary '',5000000,NULL,10,_binary '');
/*!40000 ALTER TABLE `policy_home` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `policy_life`
--

DROP TABLE IF EXISTS `policy_life`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `policy_life` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `critical_illness_cover` bit(1) DEFAULT NULL,
  `death_benefit` bit(1) DEFAULT NULL,
  `maturity_benefit` bit(1) DEFAULT NULL,
  `max_age` int DEFAULT NULL,
  `min_age` int DEFAULT NULL,
  `policy_term` varchar(255) DEFAULT NULL,
  `premium_payment_term` varchar(255) DEFAULT NULL,
  `smoking_allowed` bit(1) DEFAULT NULL,
  `sum_assured` double DEFAULT NULL,
  `surrender_value` bit(1) DEFAULT NULL,
  `policy_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKq3ld131tl57rksdhh6t98elqw` (`policy_id`),
  CONSTRAINT `FK9t0x3rj113729itmax1v67idi` FOREIGN KEY (`policy_id`) REFERENCES `policies` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `policy_life`
--

LOCK TABLES `policy_life` WRITE;
/*!40000 ALTER TABLE `policy_life` DISABLE KEYS */;
INSERT INTO `policy_life` VALUES (1,_binary '',_binary '',_binary '\0',65,21,'30 years','Regular Pay',_binary '\0',10000000,_binary '\0',4),(2,_binary '',_binary '',_binary '\0',65,18,'30 Years','30 Years',_binary '\0',10000000,_binary '\0',22);
/*!40000 ALTER TABLE `policy_life` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `policy_motor`
--

DROP TABLE IF EXISTS `policy_motor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `policy_motor` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `consumables_cover` bit(1) DEFAULT NULL,
  `engine_protection` bit(1) DEFAULT NULL,
  `idv_amount` double DEFAULT NULL,
  `invoice_cover` bit(1) DEFAULT NULL,
  `key_replacement` bit(1) DEFAULT NULL,
  `ncb_protection` bit(1) DEFAULT NULL,
  `personal_accident` bit(1) DEFAULT NULL,
  `puc_compliance` bit(1) DEFAULT NULL,
  `roadside_assistance` bit(1) DEFAULT NULL,
  `vehicle_type` varchar(255) DEFAULT NULL,
  `zero_dep` bit(1) DEFAULT NULL,
  `policy_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKkk34qyy0b405x21mfshcfr8mc` (`policy_id`),
  CONSTRAINT `FKs212r5ickgxlqvvi5942gjgip` FOREIGN KEY (`policy_id`) REFERENCES `policies` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `policy_motor`
--

LOCK TABLES `policy_motor` WRITE;
/*!40000 ALTER TABLE `policy_motor` DISABLE KEYS */;
INSERT INTO `policy_motor` VALUES (1,_binary '',_binary '',800000,_binary '\0',_binary '',_binary '',_binary '',_binary '\0',_binary '','Car',_binary '',6),(2,_binary '\0',_binary '\0',150000,_binary '\0',_binary '\0',_binary '',_binary '',_binary '',_binary '','Bike',_binary '',7);
/*!40000 ALTER TABLE `policy_motor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `policy_travel`
--

DROP TABLE IF EXISTS `policy_travel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `policy_travel` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `adventure_sports` bit(1) DEFAULT NULL,
  `baggage_loss` bit(1) DEFAULT NULL,
  `flight_delay` bit(1) DEFAULT NULL,
  `max_age` int DEFAULT NULL,
  `medical_cover_amount` double DEFAULT NULL,
  `medical_emergency` bit(1) DEFAULT NULL,
  `min_age` int DEFAULT NULL,
  `passport_loss` bit(1) DEFAULT NULL,
  `travel_destination` varchar(255) DEFAULT NULL,
  `trip_cancellation` bit(1) DEFAULT NULL,
  `trip_duration` varchar(255) DEFAULT NULL,
  `policy_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKbscv4vw1mp801hc196uvimpyc` (`policy_id`),
  CONSTRAINT `FKlsgqt7gjkjog4e9mgutl5x4g2` FOREIGN KEY (`policy_id`) REFERENCES `policies` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `policy_travel`
--

LOCK TABLES `policy_travel` WRITE;
/*!40000 ALTER TABLE `policy_travel` DISABLE KEYS */;
INSERT INTO `policy_travel` VALUES (1,_binary '\0',_binary '',_binary '',70,500000,_binary '',1,_binary '','WORLDWIDE',_binary '','180 days',9);
/*!40000 ALTER TABLE `policy_travel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `phone` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'aniket@insureai.com','Aniket Updated','$2a$10$Q.97XeVE5t9QMekT8qMGkOUmR90aBSQceJUgG/90mPfzAnzwrGcma','CUSTOMER','2026-03-03 15:14:03.884755','1111111111'),(3,'butepwadaniket@gmail.com','Aniket Maroti Butepwad','$2a$10$CWK0YOfki2W6lP2Habl8D.C4XPvJf2liJatGbYh8Suz4P5fWKoKmC','Customer','2026-03-03 18:31:49.575998','9552751014'),(9,'aniketbutepwad2007@gmail.com','Aniket Butepwad','$2a$10$MUCz1PI7IOyU2LQGx2ZSNOCUzTUz6JB41rT1h9eP5gkBLYFi9e5la','AGENT','2026-03-04 14:24:03.570030','9372657816'),(10,'abc@gamil.com','abc','$2a$10$b6Gng3dAsZGZDD8Adr2Bkeb8aVLXcpTgW9DHd/8vZdKeyghVXaj8O','ADMIN','2026-03-04 15:18:02.442048','1234567890'),(11,'Shriramjayabhaye@gmail.com','Shriram Jaybhaye','$2a$10$cp4937KhAn.siYcQpbhOSe.T7L/hOAf8PZaqOtjjdABR3OEMIp7Yq','CUSTOMER','2026-03-10 22:31:34.373866','9472657816'),(12,'abc@gmail.com','abc','$2a$10$nGSGrQF3AcEYcCmgVkisrugvfX7rQevUg/H2fap5agtpftxzkgObm','ADMIN','2026-03-13 14:26:32.570328','9472657816'),(13,'aniket@gmail.com','aniket','$2a$10$azjhAVidkdV3.cXNf2J2Z.3IJ4bQIyeCStrPCyr/Qe3rZITEFkyCe','CUSTOMER','2026-03-13 15:13:38.964518','9472657816');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-20 16:50:45
