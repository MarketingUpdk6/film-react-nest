# FILM!

## Установка

### Подготовка PostgreSQL

Установите и запустите PostgreSQL.

Создайте пользователя prac и базу данных prac, назначив пользователя владельцем базы. Затем последовательно выполните SQL-запросы из файлов:

`backend/test/prac.init.sql` — создание таблиц films и schedules;
`backend/test/prac.films.sql` — заполнение таблицы фильмов;
`backend/test/prac.shedules.sql` — заполнение таблицы сеансов.

SQL-запросы можно выполнить через Query Tool в pgAdmin, подключившись к базе prac.

### Бэкенд

Перейдите в папку с исходным кодом бэкенда

`cd backend`

Установите зависимости

`npm ci`

Создайте `.env` файл из примера `.env.example`, в нём укажите:

* `DATABASE_DRIVER` - тип драйвера СУБД - в нашем случае это `postgres`
* `DATABASE_URL` - адрес СУБД PostgreSQL, например `postgres://localhost:5432/prac`.
Значения `DATABASE_USERNAME` и `DATABASE_PASSWORD` должны соответствовать данным пользователя

PostgreSQL должна быть установлена и запущена.

Запустите бэкенд:

`npm run start:dev`

Для проверки отправьте тестовый запрос с помощью Postman или `curl`.