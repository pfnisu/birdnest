-- Create tables for birdnest database
create table drones (
    sn character varying(13) primary key,
    x decimal not null,
    y decimal not null,
    radius decimal not null,
    dt timestamp not null
);
create table pilots (
    id character varying(12) primary key,
    name character varying(100) not null,
    phone character varying(100) not null,
    email character varying(100) not null,
    sn character varying(13) not null,
    foreign key(sn) references drones(sn)
        on delete cascade on update cascade
);
