# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table block (
  id                        bigint auto_increment not null,
  cong                      varchar(255),
  block                     varchar(255),
  number                    varchar(255),
  coord                     varchar(255),
  constraint pk_block primary key (id))
;




# --- !Downs

SET FOREIGN_KEY_CHECKS=0;

drop table block;

SET FOREIGN_KEY_CHECKS=1;

