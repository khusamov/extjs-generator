Генератор Sencha ExtJS кода (6.х.х)
====================================

Генератор предназначен для создания ограниченной объектной модели JavaScript-кода 
в оперативной памяти и его выгрузке в виде текста кода с форматированием.

Инсталяция
-----------

```bash
npm i khusamov-extjs-generator --save
```



Пример кода
------------

```typescript

import { Ext, Formatter } from 'khusamov-extjs-generator';

// Менеджер классов.
const manager1 = new Ext.Manager;

// Пространство имен классов.
const namespace1 = new Ext.Namespace('Namespace1.sample', manager1);

// Создание класса. Два способа.
const class1 = new Ext.Class('Class1', namespace1);
namespace1.add(new Ext.Class('ClassName'));

// Вывод кода объекта.
const class1Code = new Ext.ClassCode(class1);
console.log(Formatter.prettyFormat(class1Code.toString()));

// Вывод всего кода в директорию.
const manager1Code = new Ext.ManagerCode(manager1);
manager1Code.formatter = Formatter;
manager1Code.saveTo('path/to/dir');

```

