История изменений
=================

1.5.2
-----

Значения (по умолчанию) скалярных узлов класса BaseClass изменены с пустых значений на undefined.
В классе DataModelClass исправлены свойства proxy и fields.  
Исправлено конструирование экземпляра класса BaseClass. Значения полей из первого экземпляра появлялись во втором экземпляре.

1.5.1
-----

Имена классов вида 'Namespace.path1.path2.path3.ClNAME' сделаны валидными.

1.5.0
-----

Удалено свойство Namespace.text (вместо него используйте name).
Добавлена генерация ошибки, если приложение из workspace.json не найдено.
Добавлена генерация ошибки, если директория приложения не найдена.

1.4.0
-----

Изменен API пакета.
Объекты Ext, Code и JavaScript удалены из экспорта.
Вместо них добавлены непосредственно все классы:
Workspace, Application, Package, Manager, Namespace,
ClassName, IClassName, BaseClass, DataModelClass,
BaseClassCode, ManagerCode

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