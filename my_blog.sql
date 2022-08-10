/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50723
Source Host           : localhost:3306
Source Database       : my_blog

Target Server Type    : MYSQL
Target Server Version : 50723
File Encoding         : 65001

Date: 2022-08-09 22:56:07
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for comment
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `comment_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `answer_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `content` text CHARACTER SET utf8,
  `state` int(4) DEFAULT NULL,
  `createtime` datetime DEFAULT NULL,
  PRIMARY KEY (`comment_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `ev_users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of comment
-- ----------------------------
INSERT INTO `comment` VALUES ('10', null, '19', '2022-8-9 22:00:00 完工', null, '2022-08-09 22:02:13');

-- ----------------------------
-- Table structure for comment_reply
-- ----------------------------
DROP TABLE IF EXISTS `comment_reply`;
CREATE TABLE `comment_reply` (
  `comment_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `replyuser_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `content` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `createtime` datetime DEFAULT NULL,
  PRIMARY KEY (`replyuser_id`),
  KEY `id` (`comment_id`),
  KEY `repuser_id` (`user_id`),
  CONSTRAINT `id` FOREIGN KEY (`comment_id`) REFERENCES `comment` (`comment_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `repuser_id` FOREIGN KEY (`user_id`) REFERENCES `ev_users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of comment_reply
-- ----------------------------
INSERT INTO `comment_reply` VALUES ('10', '19', '8', '爽啊', '2022-08-09 22:02:30');

-- ----------------------------
-- Table structure for ev_users
-- ----------------------------
DROP TABLE IF EXISTS `ev_users`;
CREATE TABLE `ev_users` (
  `user_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8 NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 NOT NULL,
  `user_pic` varchar(255) CHARACTER SET utf8 DEFAULT 'http://127.0.0.1/newuser.jpg',
  `email` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `cell_phone` char(11) CHARACTER SET utf8 NOT NULL,
  `createtime` datetime NOT NULL,
  `status` tinyint(5) NOT NULL DEFAULT '0',
  `nickname` varchar(255) CHARACTER SET utf8 DEFAULT '新用户',
  `sex` char(3) CHARACTER SET utf8 DEFAULT '女',
  `per_sig` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id` (`user_id`) USING BTREE,
  UNIQUE KEY `username` (`username`) USING BTREE,
  UNIQUE KEY `cell-phone` (`cell_phone`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of ev_users
-- ----------------------------
INSERT INTO `ev_users` VALUES ('19', 'czl', '$2a$10$bRBOovw3KEMoYwJaZBoRb.CUcBUp6uCX0PqAA2vXHxpiN7VomiNmq', 'http://127.0.0.1/avatar-1660009927880.jpg', '1964116717@qq.com', '13205965892', '2022-08-08 18:23:40', '0', 'czl', '男', 'nb');
