-- InventoryDB Supabase-Compatible SQL (PostgreSQL)
-- All tables and data converted from MySQL dump
-- Ready for Supabase SQL Editor import

-- Drop existing tables (optional, safe reset)
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS userlogs;
DROP TABLE IF EXISTS currentstock;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS purchaseinfo;
DROP TABLE IF EXISTS salesinfo;

-- Table: users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(45) NOT NULL,
  location VARCHAR(45) NOT NULL,
  phone VARCHAR(10) NOT NULL,
  username VARCHAR(20) NOT NULL,
  password VARCHAR(200) NOT NULL,
  usertype VARCHAR(45) NOT NULL
);

INSERT INTO users (id, name, location, phone, username, password, usertype) VALUES
(17,'Asjad Iqbal','Chandigarh','9650786717','aduser1','dbadpass','ADMINISTRATOR'),
(18,'Ahan Jaiswal','Delhi','9660654785','stduser1','dbstdpass','EMPLOYEE'),
(20,'Trial Admin','Local','9876543210','root','root','ADMINISTRATOR'),
(29,'Trial Employee','Local','1122334455','emp1','emp1','EMPLOYEE');


-- Table: userlogs
CREATE TABLE userlogs (
  username VARCHAR(45) NOT NULL,
  in_time VARCHAR(45) NOT NULL,
  out_time VARCHAR(45) NOT NULL
);

INSERT INTO userlogs (username, in_time, out_time) VALUES
('aduser1','2021-09-01T04:46:55.125709800','2021-09-01T04:47:01.801381'),
('root','2021-09-01T05:02:43.010014','2021-09-01T05:02:50.224787400'),
('stduser1','2021-09-01T05:04:57.690182100','2021-09-01T05:05:04.294274300'),
('root','2021-09-01T05:05:12.269897600','2021-09-01T05:05:16.866792500'),
('root','2021-09-01T05:10:08.728527600','2021-09-01T05:10:16.926883100'),
('root','2021-09-01T06:19:09.326477200','2021-09-01T06:19:21.641620900'),
('emp1','2021-09-01T06:19:34.536411800','2021-09-01T06:19:43.517392100'),
('root','2021-09-01T06:19:46.811400900','2021-09-01T06:20:10.879660700'),
('root','2021-09-01T14:59:48.661066400','2021-09-01T15:02:09.761864900'),
('root','2021-09-01T15:09:02.964317400','2021-09-01T15:09:14.141324800');


-- Table: currentstock
CREATE TABLE currentstock (
  productcode VARCHAR(45) PRIMARY KEY,
  quantity INT NOT NULL
);

INSERT INTO currentstock (productcode, quantity) VALUES
('prod1',146),('prod2',100),('prod3',202),('prod4',172),
('prod5',500),('prod6',500),('prod7',10),('prod8',20);


-- Table: products
CREATE TABLE products (
  pid SERIAL PRIMARY KEY,
  productcode VARCHAR(45) UNIQUE NOT NULL,
  productname VARCHAR(45) NOT NULL,
  costprice NUMERIC NOT NULL,
  sellprice NUMERIC NOT NULL,
  brand VARCHAR(45) NOT NULL
);

INSERT INTO products (pid, productcode, productname, costprice, sellprice, brand) VALUES
(111,'prod1','Laptop',85000,90000,'Dell'),
(112,'prod2','Laptop',70000,72000,'HP'),
(113,'prod3','Mobile',60000,64000,'Apple'),
(114,'prod4','Mobile',50000,51000,'Samsung'),
(121,'prod5','Charger',2000,2100,'Apple'),
(122,'prod6','Mouse',1700,1900,'Dell'),
(128,'prod7','Power Adapter',3000,3500,'Dell'),
(129,'prod8','Smart Watch',15000,17000,'Apple');


-- Table: customers
CREATE TABLE customers (
  cid SERIAL PRIMARY KEY,
  customercode VARCHAR(45) NOT NULL,
  fullname VARCHAR(45) NOT NULL,
  location VARCHAR(45) NOT NULL,
  phone VARCHAR(45) NOT NULL
);

INSERT INTO customers (cid, customercode, fullname, location, phone) VALUES
(301,'vip1','John Seed','New York','9818562354'),
(302,'vip2','Jacob Seed','Texas','9650245489'),
(303,'std1','Ajay Kumar','Mumbai','9236215622'),
(304,'std2','Astha Walia','Chandigarh','8854612478'),
(306,'vip3','Madhu Chitkara','Chandigarh','9826546182');


-- Table: suppliers
CREATE TABLE suppliers (
  sid SERIAL PRIMARY KEY,
  suppliercode VARCHAR(45) NOT NULL,
  fullname VARCHAR(45) NOT NULL,
  location VARCHAR(45) NOT NULL,
  mobile VARCHAR(10) NOT NULL
);

INSERT INTO suppliers (sid, suppliercode, fullname, location, mobile) VALUES
(401,'sup1','Dell Inc.','Gurugram','1800560001'),
(402,'sup2','iWorld Stores','New Delhi','1800560041'),
(403,'sup3','Samsung Appliances','New Delhi','6546521234'),
(404,'sup4','Hewlett-Packard','Mumbai','8555202215'),
(407,'sup5','Hewlett-Packard Ltd.','Mumbai','8555203300'),
(408,'sup6','Shelby Company Ltd.','Birmingham','9696969696');


-- Table: purchaseinfo
CREATE TABLE purchaseinfo (
  purchaseid SERIAL PRIMARY KEY,
  suppliercode VARCHAR(45) NOT NULL,
  productcode VARCHAR(45) NOT NULL,
  date VARCHAR(45) NOT NULL,
  quantity INT NOT NULL,
  totalcost NUMERIC NOT NULL
);

INSERT INTO purchaseinfo (purchaseid, suppliercode, productcode, date, quantity, totalcost) VALUES
(1001,'sup1','prod1','Wed Jan 14 00:15:19 IST 2021',10,850000),
(1002,'sup1','prod6','Wed Jan 14 00:15:19 IST 2021',20,34000),
(1003,'sup2','prod3','Wed Jan 14 00:15:19 IST 2021',5,300000),
(1004,'sup2','prod5','Wed Jan 14 00:15:19 IST 2021',5,10000),
(1005,'sup3','prod2','Wed Jan 14 00:15:19 IST 2021',2,140000),
(1006,'sup4','prod4','Wed Jan 14 00:15:19 IST 2021',2,100000),
(1009,'sup2','prod3','Wed Sep 01 04:11:13 IST 2021',2,120000),
(1010,'sup1','prod7','Wed Sep 01 04:25:06 IST 2021',10,30000),
(1011,'sup2','prod8','Fri Sep 03 00:00:00 IST 2021',20,300000);


-- Table: salesinfo
CREATE TABLE salesinfo (
  salesid SERIAL PRIMARY KEY,
  date VARCHAR(45) NOT NULL,
  productcode VARCHAR(45) NOT NULL,
  customercode VARCHAR(45) NOT NULL,
  quantity INT NOT NULL,
  revenue NUMERIC NOT NULL,
  soldby VARCHAR(45) NOT NULL
);

INSERT INTO salesinfo (salesid, date, productcode, customercode, quantity, revenue, soldby) VALUES
(2001,'Fri Jan 16 23:12:40 IST 2021','prod1','vip1',3,270000,'stduser1'),
(2002,'Fri Jan 16 23:12:40 IST 2021','prod2','vip2',2,144000,'stduser1'),
(2003,'Fri Jan 16 23:12:40 IST 2021','prod3','std1',1,64000,'aduser1'),
(2004,'Fri Jan 16 23:12:40 IST 2021','prod4','std2',5,255000,'aduser1'),
(2006,'Thu Aug 05 17:29:36 IST 2021','prod1','vip1',2,180000,'root'),
(2007,'Fri Aug 06 00:00:00 IST 2021','prod4','std1',1,51000,'aduser1'),
(2008,'Fri Aug 06 02:41:28 IST 2021','prod7','std1',1,3500,'aduser1'),
(2009,'Sat Aug 07 00:00:00 IST 2021','prod7','std1',5,17500,'aduser1'),
(2010,'Thu Aug 12 00:00:00 IST 2021','prod4','vip3',2,102000,'root'),
(2011,'Sun Aug 15 23:08:51 IST 2021','prod7','vip2',10,35000,'root'),
(2012,'Thu Aug 26 15:17:48 IST 2021','prod4','vip3',5,255000,'aduser1');
