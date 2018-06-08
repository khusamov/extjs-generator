Инструкции для разработчика
===========================

Подготовка
----------

Перед разработкой следует подготовить окружение.

Требуется установить следующие инструменты:

- [Node JS](nodejs) не ниже версии 8.11.2
- [Git](git) не ниже 2.17.1

А также установить зависимости и инициализировать Git Flow:

```bash
npm i
git flow init
```

Скрипты package.json
--------------------

> Внимание, скрипты рассчитаны на работу в среде OS Windows.

Перед запуском скриптов обязательно установите все зависимости командой
и инициализируйте Git Flow.

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





[nodejs]: https://nodejs.org/en/
[git]: https://github.com/khusamov/leading/tree/master/git