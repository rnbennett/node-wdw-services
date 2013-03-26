CREATE TABLE parkCache (
  parkPermalink TEXT,
  attractionPermalink TEXT,
  data TEXT
);

CREATE TABLE parkAttractionComments (
  id INTEGER PRIMARY KEY,
  parkPermalink TEXT,
  attractionPermalink TEXT,
  email TEXT,
  score INTEGER,
  details TEXT
);

CREATE TABLE hotelCache (
  hotelPermalink TEXT,
  data TEXT
);

CREATE TABLE hotelComments (
  id INTEGER PRIMARY KEY,
  hotelPermalink TEXT,
  email TEXT,
  score INTEGER,
  details TEXT
);