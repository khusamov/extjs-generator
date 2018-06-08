Инструкции для разработчика
===========================

Скрипты package.json
--------------------

Перед запуском скриптов обязательно установите все зависимости командой
и инициализируйте `git flow`:

```bash
npm i
git flow init
```

### test

Запуск всех тестов. Без создания директории `dist`.

### release:start:*

Запуск команды `git flow release start`.

При этом прозводится:  
- запуск тестов (если не проходят, то команда отменяется)
- переход на ветку `develop` (если не проходит, то команда отменяется)
- команда `git flow release start` с именем ветки `v<новая версия>` (если не проходит, то команда отменяется)
- команда version изменяет файл `package.json` (изменение номера версии)
- фиксация изменений с описанием 'Изменение версии на...'


    npm test
    git checkout develop
    git flow release start v%npm_package_version%"
    Изменяется файл package.json (новая версия)
    git add .
    git commit -m \"Изменение версии на %npm_package_version%\"

### release:finish:npm-publish

Запуск двух команд `git flow release finish` и `npm publish`.

При этом производится:  
- команда `git flow release finish` с именем ветки `v<новая версия>`
- запуск тестов
- компиляция TypeScript-файлов в директорию `dist`
- удаление директории `dist`
- отправка изменений в удаленный репозиторий


    git flow release finish v%npm_package_version% -m \"Версия %npm_package_version%\"
    npm test
    tsc
    rmdir /S /Q dist
    git push
    git push --tags

### release:npm-publish:*

Специальная команда для создания и публикации релиза без внесения правок в релизной ветке.
Следует использовать, если код в develop уже готов для публикации.
Вместо двух команд можно таким образом воспользоваться одной. 

Команда `release:npm-publish:major` убрана из соображений безопасности,
так как она не обратима.