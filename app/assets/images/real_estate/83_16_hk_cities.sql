-- phpMyAdmin SQL Dump
-- version 4.2.7.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Mar 31, 2015 at 09:42 AM
-- Server version: 5.6.20
-- PHP Version: 5.5.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `muanhaonline`
--

-- --------------------------------------------------------

--
-- Table structure for table `hk_cities`
--

CREATE TABLE IF NOT EXISTS `hk_cities` (
`id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `alias` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=67 ;

--
-- Dumping data for table `hk_cities`
--

INSERT INTO `hk_cities` (`id`, `name`, `alias`, `ordering`) VALUES
(1, 'TP Hồ Chí Minh', 'ho-chi-minh', 1),
(2, 'Đà Nẵng', 'da-nang', 2),
(3, 'Quảng Nam', 'quang-nam', 3),
(4, 'Quảng Ngãi', 'quang-ngai', 4),
(5, 'Bình Định', 'binh-dinh', 5),
(6, 'Phú Yên', 'phu-yen', 6),
(7, 'Khánh Hòa', 'khanh-hoa', 7),
(8, 'Ninh Thuận', 'ninh-thuan', 8),
(9, 'Bình Thuận', 'binh-thuan', 9),
(10, 'Kon Tum', 'kon-tum', 10),
(11, 'Gia Lai', 'gia-lai', 11),
(12, 'Đắk Lắk', 'dak-lak', 12),
(13, 'Đắk Nông', 'dak-nong', 13),
(14, 'Lâm Đồng', 'lam-dong', 14),
(15, 'Bình Phước', 'binh-phuoc', 15),
(16, 'Tây Ninh', 'tay-ninh', 16),
(17, 'Bình Dương', 'binh-duong', 17),
(18, 'Đồng Nai', 'dong-nai', 18),
(19, 'Bà Rịa - Vũng Tàu', 'ba-ria-vung-tau', 19),
(20, 'Long An', 'long-an', 20),
(21, 'Tiền Giang', 'tien-giang', 21),
(22, 'Bến Tre', 'ben-tre', 22),
(23, 'Trà Vinh', 'tra-vinh', 23),
(24, 'Vĩnh Long', 'vinh-long', 24),
(25, 'Đồng Tháp', 'dong-thap', 25),
(26, 'An Giang', 'an-giang', 26),
(27, 'Kiên Giang', 'kien-giang', 27),
(28, 'Cần Thơ', 'can-tho', 28),
(29, 'Hậu Giang', 'hau-giang', 29),
(30, 'Sóc Trăng', 'soc-trang', 30),
(31, 'Bạc Liêu', 'bac-lieu', 31),
(32, 'Cà Mau', 'ca-mau', 32),
(34, 'Hà Nội', 'ha-noi', 33),
(35, 'Thừa Thiên Huế', 'thua-thien-hue', 34),
(36, 'Bắc Kạn', 'Bắc - Kạn', NULL),
(39, 'Bắc Ninh', 'Bắc- Ninh', NULL),
(38, 'Bắc Giang', 'Bắc - Giang', NULL),
(40, 'Cao Bằng', 'Cao - Bằng', NULL),
(41, 'Điện Biên', 'Điện - Biên', NULL),
(42, 'Hà Giang', 'Hà - Giang', NULL),
(43, 'Hà Nam', 'Hà - Nam', NULL),
(44, 'Hà Tây', 'Hà - Tây', NULL),
(45, 'Hà Tĩnh', 'Hà - Tĩnh', NULL),
(46, 'Hải Dương', 'Hải - Dương', NULL),
(47, 'Hải Phòng', 'Hải - Phòng', NULL),
(48, 'Hòa Bình', 'Hòa - Bình', NULL),
(49, 'Hưng Yên', 'Hưng - Yên', NULL),
(50, 'Lai Châu', 'Lai - Châu', NULL),
(51, 'Lào Cai', 'Lào - Cai', NULL),
(52, 'Lạng Sơn', 'Lạng - Sơn', NULL),
(53, 'Nam Định', 'Nam - Định', NULL),
(54, 'Nghệ An', 'Nghệ - An', NULL),
(55, 'Ninh Bình', 'Ninh - Bình', NULL),
(56, 'Phú Thọ', 'Phú - Thọ', NULL),
(57, 'Quảng Bình', 'Quảng - Bình', NULL),
(58, 'Quảng Ninh', 'Quảng - Ninh', NULL),
(59, 'Quảng Trị', 'Quảng - Trị', NULL),
(60, 'Sơn La', 'Sơn - La', NULL),
(61, 'Thái Bình', 'Thái - Bình', NULL),
(62, 'Thái Nguyên', 'Thái - Nguyên', NULL),
(63, 'Thanh Hóa', 'Thanh - Hóa', NULL),
(64, 'Tuyên Quang', 'Tuyên - Quang', NULL),
(65, 'Vĩnh Phúc', 'Vĩnh - Phúc', NULL),
(66, 'Yên Bái', 'Yên - Bái', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `hk_cities`
--
ALTER TABLE `hk_cities`
 ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `hk_cities`
--
ALTER TABLE `hk_cities`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=67;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
