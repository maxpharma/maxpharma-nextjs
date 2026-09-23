-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: database:3306
-- Generation Time: Sep 23, 2026 at 07:47 AM
-- Server version: 8.0.46
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `maxpharma`
--

-- --------------------------------------------------------

--
-- Table structure for table `about_us`
--

CREATE TABLE `about_us` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `files` json DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `infos` json DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `about_us`
--

INSERT INTO `about_us` (`id`, `title`, `description`, `files`, `type`, `infos`, `createdAt`, `updatedAt`) VALUES
(1, 'About Max Pharma', '<p><strong>Max Pharma Pvt. Ltd.</strong> is a trusted pharmaceutical company based in Sundhara, Kathmandu, Nepal, with over 22 years of experience in importing and distributing quality medicines and healthcare products across Nepal. We are committed to providing safe, effective, and high-quality pharmaceutical products through trusted international partnerships, reliable distribution, and a strong focus on healthcare excellence.</p>', '[null, null]', 'Overview', NULL, '2026-09-03 03:58:33', '2026-09-03 03:58:33'),
(2, 'Building a Healthier Nepal, Together', 'To become one of Nepal’s most trusted and progressive pharmaceutical companies, improving access to safe, effective, and high-quality healthcare products while contributing to a healthier and stronger society.', NULL, 'Our Vision', '{\"goal\": \"<p>Our goal is to continuously strengthen our pharmaceutical portfolio, expand nationwide accessibility, build lasting partnerships, embrace innovation, and maintain the highest standards of quality, safety, and integrity in everything we do.</p><p></p>\", \"ourMission\": \"<p>Our mission is to provide reliable pharmaceutical and healthcare products through uncompromising quality standards, trusted global partnerships, efficient distribution, continuous innovation, and a deep commitment to the health and wellbeing of communities across Nepal.</p>\"}', '2026-09-03 16:46:03', '2026-09-03 16:46:03');

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `deviceToken` json DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `username`, `password`, `isActive`, `deviceToken`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Admin', 'admin@gmail.com', 'admin', '$2b$10$P85GuASDA6sDqk60pC3j2.rfT2Ir8opiJYXLAMkHrSitjMCas2euO', 1, NULL, '2026-09-03 02:04:22', '2026-09-03 02:04:22', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `applies`
--

CREATE TABLE `applies` (
  `id` int NOT NULL,
  `noticeId` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message` varchar(255) NOT NULL,
  `file` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `galleries`
--

CREATE TABLE `galleries` (
  `id` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `files` json DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `general_settings`
--

CREATE TABLE `general_settings` (
  `id` int NOT NULL,
  `group` varchar(255) DEFAULT NULL,
  `key` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `value` longtext,
  `title` varchar(255) DEFAULT NULL,
  `file` varchar(255) DEFAULT NULL,
  `infos` json DEFAULT NULL,
  `isShow` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `general_settings`
--

INSERT INTO `general_settings` (`id`, `group`, `key`, `type`, `value`, `title`, `file`, `infos`, `isShow`, `createdAt`, `updatedAt`) VALUES
(1, 'max-pharma-settings', 'max-pharma-settings', NULL, 'settings', 'Settings', NULL, '{\"mail\": \"info@maxpharma.com.np\", \"location\": \"Chinatown, Sundhara, Kathmandu, Nepal\", \"tiktokLink\": \"\", \"phoneNumber\": \"01-5912883\", \"twitterLink\": \"\", \"youtubeLink\": \"\", \"facebookLink\": \"https://www.facebook.com/p/Max-Pharma-Pvt-Ltd-100090709211080/\", \"linkedinLink\": \"\", \"copyrightText\": \"All Rights Reserved by Max Pharma Pvt Ltd\", \"instagramLink\": \"\", \"phoneNumberII\": \"\", \"whatsAppNumber\": \"\"}', 1, '2026-09-03 03:43:30', '2026-09-03 03:43:30'),
(2, 'seo', 'homeSeo', NULL, 'seo', 'seo', NULL, '{\"title\": \"Max Pharma Pvt. Ltd. | Pharmaceutical Company in Nepal\", \"keywords\": \"Max Pharma, Max Pharma Pvt Ltd, pharmaceutical company Nepal, pharmaceutical company in Kathmandu, medicine importer Nepal, medicine distributor Nepal, pharmaceutical distributor Nepal, pharmaceutical products Nepal, medicines in Nepal, healthcare products Nepal, pharmaceutical manufacturing Nepal, medicine import company Nepal\", \"description\": \"Max Pharma Pvt. Ltd. is a leading pharmaceutical company in Kathmandu, Nepal, specializing in medicine imports, distribution, and quality healthcare products across Nepal.\"}', 1, '2026-09-03 03:45:32', '2026-09-03 03:45:32'),
(3, 'seo', 'overviewSeo', NULL, 'seo', 'seo', NULL, '{\"title\": \"About Max Pharma Pvt. Ltd. | Pharmaceutical Company Nepal\", \"keywords\": \"Max Pharma, Max Pharma Pvt Ltd, pharmaceutical company Nepal, pharmaceutical company in Kathmandu, medicine importer Nepal, medicine distributor Nepal, pharmaceutical distributor Nepal, pharmaceutical products Nepal, medicines in Nepal, healthcare products Nepal, pharmaceutical manufacturing Nepal, medicine import company Nepal\", \"description\": \"Learn about Max Pharma Pvt. Ltd., a Kathmandu-based pharmaceutical company with over 22 years of experience in importing and distributing medicines across Nepal.\"}', 1, '2026-09-03 03:46:13', '2026-09-03 03:46:13'),
(4, 'seo', 'messageFromChairmanSeo', NULL, 'seo', 'seo', NULL, '{\"title\": \"Chairman\'s Message | Max Pharma Pvt. Ltd.\", \"keywords\": \"Max Pharma, Max Pharma Pvt Ltd, pharmaceutical company Nepal, pharmaceutical company in Kathmandu, medicine importer Nepal, medicine distributor Nepal, pharmaceutical distributor Nepal, pharmaceutical products Nepal, medicines in Nepal, healthcare products Nepal, pharmaceutical manufacturing Nepal, medicine import company Nepal\", \"description\": \"Read the Chairman\'s message from Max Pharma Pvt. Ltd. and learn about our commitment to quality, innovation, healthcare, and pharmaceutical excellence in Nepal.\"}', 1, '2026-09-03 03:46:31', '2026-09-03 03:46:31'),
(5, 'banner', 'banner-1788386617714', NULL, 'https://maxpharma.com.np', 'Empowering Healthcare with High-Quality Pharmaceuticals', 'maxpharma/generalSettings/1788386617849.webp', NULL, 1, '2026-09-03 03:48:39', '2026-09-03 03:48:39');

-- --------------------------------------------------------

--
-- Table structure for table `inquiries`
--

CREATE TABLE `inquiries` (
  `id` int NOT NULL,
  `productId` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `message` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notices`
--

CREATE TABLE `notices` (
  `id` int NOT NULL,
  `documentType` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `file` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `popups`
--

CREATE TABLE `popups` (
  `id` int NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '0',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `type` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` longtext,
  `categoryId` int NOT NULL,
  `files` json DEFAULT NULL,
  `additionalInfo` json DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` longtext,
  `categoryId` int NOT NULL,
  `files` json DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `themes`
--

CREATE TABLE `themes` (
  `id` int NOT NULL,
  `header` varchar(255) DEFAULT NULL,
  `footer` varchar(255) DEFAULT NULL,
  `footerText` longtext,
  `primaryColor` varchar(255) DEFAULT NULL,
  `primaryLightcolor` varchar(255) DEFAULT NULL,
  `secondaryColor` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `themes`
--

INSERT INTO `themes` (`id`, `header`, `footer`, `footerText`, `primaryColor`, `primaryLightcolor`, `secondaryColor`, `createdAt`, `updatedAt`) VALUES
(1, 'maxpharma/themes/1788386249774-header.webp', 'maxpharma/themes/1788386250447-footer.webp', 'Max Pharma is a premier pharmaceutical company committed to delivering safe, effective, and high-quality healthcare products across Nepal. We focus on modern manufacturing excellence, continuous innovation, and trusted partnerships.', '#7C8E22', NULL, '#7C8E22', '2026-09-03 03:42:30', '2026-09-03 03:42:30');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `about_us`
--
ALTER TABLE `about_us`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `type` (`type`),
  ADD KEY `idx_about_us_type` (`type`),
  ADD KEY `idx_about_us_created` (`createdAt`);

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `idx_admins_email` (`email`),
  ADD KEY `idx_admins_username` (`username`);

--
-- Indexes for table `applies`
--
ALTER TABLE `applies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `noticeId` (`noticeId`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_contacts_created` (`createdAt`);

--
-- Indexes for table `galleries`
--
ALTER TABLE `galleries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_galleries_created` (`createdAt`);

--
-- Indexes for table `general_settings`
--
ALTER TABLE `general_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `key` (`key`),
  ADD KEY `idx_general_settings_type` (`type`);

--
-- Indexes for table `inquiries`
--
ALTER TABLE `inquiries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `productId` (`productId`),
  ADD KEY `idx_inquiries_created` (`createdAt`);

--
-- Indexes for table `notices`
--
ALTER TABLE `notices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_notices_created` (`createdAt`);

--
-- Indexes for table `popups`
--
ALTER TABLE `popups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_popups_status` (`status`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_products_type_created` (`type`,`createdAt`),
  ADD KEY `idx_products_cat_created` (`categoryId`,`createdAt`),
  ADD KEY `idx_products_created` (`createdAt`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_services_category` (`categoryId`),
  ADD KEY `idx_services_created` (`createdAt`);

--
-- Indexes for table `themes`
--
ALTER TABLE `themes`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `about_us`
--
ALTER TABLE `about_us`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `applies`
--
ALTER TABLE `applies`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `galleries`
--
ALTER TABLE `galleries`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `general_settings`
--
ALTER TABLE `general_settings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `inquiries`
--
ALTER TABLE `inquiries`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notices`
--
ALTER TABLE `notices`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `popups`
--
ALTER TABLE `popups`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `themes`
--
ALTER TABLE `themes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `applies`
--
ALTER TABLE `applies`
  ADD CONSTRAINT `applies_ibfk_1` FOREIGN KEY (`noticeId`) REFERENCES `notices` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `inquiries`
--
ALTER TABLE `inquiries`
  ADD CONSTRAINT `inquiries_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
