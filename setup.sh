#!/bin/bash

#run this script with the name of the new project and mysql root password. 
#ex: ./setup.sh moviewalrus p@55w0rd
echo "changing baseproject to $1"

grep -rl "baseproject" ./Server | xargs sed -i "s/baseproject/$1/g"
grep -rl "baseproject" ./Client | xargs sed -i "s/baseproject/$1/g"
grep -rl "dbpassword" ./Server | xargs sed -i "s/dbpassword/$2/g"

mysql -u root -p $2 -e "CREATE DATABASE $1 /*!40100 DEFAULT CHARACTER SET utf8 */;
USE $2;
CREATE TABLE 'user'(
  'id' int(11) NOT NULL AUTO_INCREMENT,
  'first' varchar(45) DEFAULT NULL,
  'last' varchar(45) DEFAULT NULL,
  'email' varchar(255) DEFAULT NULL,
  'password' varchar(255) DEFAULT NULL,
  PRIMARY KEY ('id')
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;"

