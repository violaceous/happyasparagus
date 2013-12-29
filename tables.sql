CREATE  TABLE happyasparagus.standard_ingredient (
  id INT NOT NULL ,
  name VARCHAR(128) NULL ,
  lasts INT NULL ,
  PRIMARY KEY (id) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;

CREATE  TABLE happyasparagus.user_ingredient (
  id INT NOT NULL ,
  user_id INT NULL ,
  name VARCHAR(128) NULL ,
  lasts INT NULL ,
  PRIMARY KEY (id) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;

CREATE  TABLE happyasparagus.purchase (
  id INT NOT NULL ,
  standard_ingredient_id INT NULL ,
  user_ingredient_id INT NULL ,
  amount VARCHAR(45) NULL ,
  purchased DATE NULL ,
  lasts INT NULL ,
  expires DATE NULL ,
  deleted DATETIME NULL ,
  PRIMARY KEY (id) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;
