# zm2gspread
Примеры экспорта данных из ZenMoney в Google SpreadSheets

1. [Базовый шаблон](/templates/base)
2. [Базовый шаблон с настройками](/templates/base_with_params)
3. [Экспорт данных как в вебе](/templates/export_like_web_csv)
4. [Экспорт данных постранично](/templates/all_data)
4. [Редактирование категорий](/templates/setup_categories)

## Token

Для работы с АПИ нужно получить токен. Самый простой способ - авторизоваться в https://zerro.app/ и перейти на страницу https://zerro.app/token
Токен нужно указать в ячейке _B1_ листа _Settings_

## Загрузка данных

Основной скрипт добавляет меню "ZenMoney"

...
