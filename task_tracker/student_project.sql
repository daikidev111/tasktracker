-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 26, 2020 at 10:09 AM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `task_tracker`
--

-- --------------------------------------------------------

--
-- Table structure for table `student_project`
--

CREATE TABLE `student_project` (
  `id` int(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `project_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `student_project`
--

INSERT INTO `student_project` (`id`, `username`, `project_name`) VALUES
(1, '', ''),
(2, 's1', 'Keat test'),
(3, 's2', 'Keat test'),
(4, 's3', 'Keat test'),
(5, 's4', 'Keat test'),
(6, 's5', 'Keat test'),
(7, 's6', 'Keat test'),
(8, 's7', 'Keat test'),
(9, '', ''),
(10, 's9', ''),
(11, 's10', ''),
(12, '', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `student_project`
--
ALTER TABLE `student_project`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `student_project`
--
ALTER TABLE `student_project`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
