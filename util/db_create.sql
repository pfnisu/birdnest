-- Create table for birdnest database
create table pilots (
    id character varying(12) primary key,
    name character varying(100) not null,
    phone character varying(100) not null,
    email character varying(100) not null,
    radius decimal not null,
    dt timestamp not null
);
