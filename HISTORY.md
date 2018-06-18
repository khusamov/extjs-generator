История изменений
=================

1.3.3
-----

Исправлена ошибка вида:

    no such file or directory, open 
    'node_modules\khusamov-extjs-generator\dist\lib\Ext\fileTpl\package.build.xml'

Теперь при компиляции файлы `*.json` и `*.xml` копируются и публикуются в NPM.

1.3.1
-----

Добавлен экспорт класса App.

1.3.0
-----

Добавлен класс App.
В класс Workspace добавлено свойство applications: App[].
При загрузке рабочего пространства также загружаются конфигурационные файлы приложений.

1.2.0
-----

В класс Workspace добавлен метод static async load(dir: string) как замена асинхронного конструктора.