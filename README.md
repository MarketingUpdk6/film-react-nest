# FILM!

## Установка

### MongoDB

Установите MongoDB скачав дистрибутив с официального сайта или с помощью пакетного менеджера вашей ОС. Для работы с базой данных можно использовать MongoDB Compass.

Создайте базу данных `prac` и коллекцию `films`.

Импортируйте фильмы из файла `backend/test/mongodb_initial_stub.json` с помощью MongoDB Compass: откройте коллекцию `films`, выберите **Add Data → Import JSON or CSV file** и укажите файл с тестовыми данными.

### Бэкенд

Перейдите в папку с исходным кодом бэкенда

`cd backend`

Установите зависимости (точно такие же, как в package-lock.json) помощью команд

`npm ci` или `yarn install --frozen-lockfile`

Создайте `.env` файл из примера `.env.example`, в нём укажите:

* `DATABASE_DRIVER` - тип драйвера СУБД - в нашем случае это `mongodb` 
* `DATABASE_URL` - адрес СУБД MongoDB, например `mongodb://localhost:27017/prac`.

MongoDB должна быть установлена и запущена.

Запустите бэкенд:

`npm run start:debug`

Для проверки отправьте тестовый запрос с помощью Postman или `curl`.




