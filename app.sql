CREATE TABLE parkCache (
  permalink TEXT,
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