Clarifai Image - Face Detection
https://clarifai.com/clarifai/main/models/face-detection

New Clarifai with gRPC: Not implemented
https://www.imaginarycloud.com/blog/grpc-vs-rest

Note:
HEADS UP! Sometimes the Clarifai Models can be down or not working as they are constantly getting updated. A good way to check if the model you are using is up, is to check them on the Clarifai website. For example, for the Face Detect Mode: https://www.clarifai.com/models/face-detection. If that isn't working, then that means you will have to wait until their servers are back up.

Create Tables

CREATE TABLE users (
ID serial PRIMARY KEY,
name VARCHAR(100),
email text UNIQUE NOT NULL,
entries BIGINT DEFAULT 0,
joined TIMESTAMP NOT NULL
);

CREATE TABLE login (
ID serial PRIMARY KEY,
hash VARCHAR (100) NOT NULL,
email text UNIQUE NOT NULL
);
