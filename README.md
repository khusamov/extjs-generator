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

import { Ext, Code, Formatter } from 'khusamov-extjs-generator';

// Менеджер классов.
const manager1 = new Ext.Manager;

// Пространство имен классов.
const namespace1 = new Ext.Namespace('Namespace1.sample', manager1);

// Создание класса.
const class1 = new Ext.Class('Class1', namespace1);

// Вывод кода объекта.
const class1Code = new Code.ClassCode(class1);
console.log(Formatter.prettyFormat(class1Code.toString()));

// Вывод всего кода в директорию.
const manager1Code = new Code.ManagerCode(manager1);
manager1Code.formatter = Formatter;
manager1Code.saveTo('path/to/dir').then(() => {
	console.log('Файлы сохранены.');
});

// Сохранение классов из нескольких пространств имен.
manager1Code.saveTo('path/to/dir', {
    Namespace1: 'ns1',
    Namespace2: 'ns1'
}).then(() => {
    console.log('Файлы сохранены.');
});

```

