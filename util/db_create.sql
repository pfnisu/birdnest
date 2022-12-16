-- Create table for birdnest database
create table pilots (
    id character varying(12) primary key,
    name character varying(100) not null,
    sn character varying(13) not null,
    radius decimal not null,
    dt date not null
);
