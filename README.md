# Как запустить?
### Сценарий 1 - IDEA
После выгрузки проекта необходимо создать конфигурацию запуска.
В поле Environment variables вставляется шаблон и редактируется в соответствии с текущими реалиями:

`dbLogin=<ЛОГИН_ПОЛЬЗОВАТЕЛЯ_БД>;dbPassword=<ПАРОЛЬ_ПОЛЬЗОВАТЕЛЯ_БД>;dbURL=jdbc:postgresql://localhost:5432/<ИМЯ_БАЗЫ_СОЗДАННОЙ_ДЛЯ_ПРИЛОЖЕНИЯ>;adminName=admin;adminPassword=admin`

***В шаблоне указан порт для постгреса по умолчанию***

На данный момент, при желании, можно использовать любые другие БД, если под них имеются драйвера для спринга.
Создать нужно базу и таблицы пользователей и ролей. Скрипт для создания таблиц содержится в проекте - 
_src/main/resources/SQL/users-scheme.sql_.

А так же приведён здесь с:

`
create table users(
username character varying(50) not null primary key,
password character varying(50) not null,
enabled boolean not null
);
create table authorities (
username character varying(50) not null,
authority character varying(50) not null,
constraint fk_authorities_users foreign key(username) references users(username)
);
create unique index ix_auth_username on authorities (username,authority);
`

Затем нужно занести хотя бы одного пользователя с ролью **ROLE_ADMIN**. На данный момент все страницы доступны только с такой ролью. 
В дальнейшем будут добавлены зоны для роли **ROLE_USER**.


Далее следует запуск и если всё было сделано правильно, то приложение запустится на порте 8080.
