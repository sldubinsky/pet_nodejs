CREATE TABLE `base_owners` (
  `base_name` varchar(30) NOT NULL,
  `user_ID` varchar(60) NOT NULL,
  `expired_data` date DEFAULT NULL,
  `prototype` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`base_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `bases` (
  `base_name` varchar(30) NOT NULL,
  `server_app` varchar(30) DEFAULT NULL,
  `server_bd` varchar(30) DEFAULT NULL,
  `base_type` varchar(15) DEFAULT NULL COMMENT '0 - yesterday copy\n1 - common test bases\n2 - personal bases',
  PRIMARY KEY (`base_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `prototypes` (
  `base_name` varchar(30) NOT NULL,
  `project` varchar(45) DEFAULT NULL,
  `server_bd` varchar(45) DEFAULT NULL,
  `size` int(11) DEFAULT NULL,
  PRIMARY KEY (`base_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `servers` (
  `server_name` varchar(30) NOT NULL,
  `server_description` longtext,
  `server_type` tinyint(1) DEFAULT NULL COMMENT '0 - app; 1 - bd',
  PRIMARY KEY (`server_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `users` (
  `user_ID` varchar(60) NOT NULL,
  `user_name` varchar(100) NOT NULL,
  `IsAdmin` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`user_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8