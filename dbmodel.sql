CREATE TABLE IF NOT EXISTS `board` (
  `board_x` smallint unsigned NOT NULL,
  `board_y` smallint unsigned NOT NULL,
  `board_player` int unsigned DEFAULT NULL,
  PRIMARY KEY (`board_x`,`board_y`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;