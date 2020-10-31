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
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `permission` varchar(100) NOT NULL DEFAULT 'student'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `permission`) VALUES
(11, 'keat', '$2a$08$Npj2URp4iWTMjvUObSZ5YuSngGQOKbeuchOtArdEv/1GwTdbhE36y', 'teacher'),
(13, 's1', '$2a$08$G5fSrRVgkLZ3zYP4t1G3g.nbFv2zB61FwrBZZXp90Xy27qwXASuom', 'student'),
(14, 's2', '$2a$08$dYoeIu0CL8lcSQIM37EKh./czl3R3RekBA2dkGUbkLdEz9tUMRumO', 'student'),
(15, 's3', '$2a$08$IyO3V7awFmxfx..Chk4KGuKaWdcWHVCj1nhqGLsYsmb4t/KSnuDYm', 'student'),
(16, 's4', '$2a$08$3RoWHwnNtldIaEBRULwNWePtidX65neSdv3fd2Ps6OaG5jybVTy/a', 'student'),
(17, 's5', '$2a$08$kwkGzKX3CVB/l6bk0ujDTOUwBmz0YImto/6LdLUj8xxScjzDLZaLi', 'student'),
(18, 's6', '$2a$08$kDbG0mDuzs6DnGfbh0dIieEEDiILDef1hrMH8JdaK5yE/olfvCKlC', 'student'),
(19, 's7', '$2a$08$0bH87DarhnUT2gyhLq0tsephRJLVYABigRK4iN0/ZubOWJEJfXVSi', 'student'),
(21, 's9', '$2a$08$iGnZ.nxCcm.EXL5BFLBtguMmQVYOnDke7SC.ShFtjikc8jOWuyFei', 'student'),
(22, 's10', '$2a$08$GV7vqxV/6ROvr/.jYzHyZuOjRD19h1dOqsXk5nPKxwqNM97KrM.DC', 'student');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
