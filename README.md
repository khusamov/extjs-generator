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
import { 
	Manager, 
	Namespace, 
	BaseClass, 
	BaseClassCode,
	ManagerCode
} from 'khusamov-extjs-generator';

const manager = new Manager;
manager.add(new Namespace('Namespace1'));
manager.get('Namespace1').add(new BaseClass('Namespace1.Class1'));

(async () => {
	// Вывод кода класса 'Namespace1.Class1'.
    console.log(new BaseClassCode(manager.get('Namespace1').get('Class1')).toString());

	// Сохранение всего кода, классов находящихся в менеджере, в директорию.
	// Имена файлов определяются автоматически на основании имени классов.
	await (new ManagerCode(manager)).saveTo('path/to/dir');
	console.log('Файлы сохранены.');

    // Распределение классов из нескольких пространств имен в различные директории.
    await (new ManagerCode(manager)).saveTo('path/to/dir', {
        'Namespace1.override': 'overrides',
        'Namespace1': 'src/Namespace1',
        'Namespace2': 'src/Namespace2'
    });
    console.log('Файлы сохранены.');
})();
```



Пример кода с созданием пакета
------------------------------

```typescript

import {
	Manager,
	Workspace,
	Package
} from 'khusamov-extjs-generator';

(async () => {
    const workspace = Workspace.load('path/to/workspace');
    workspace.add(new Package('package1'));
    
    // Создание и наполнение менеджера см. в предыдущем примере кода.
    // Все классы менеджера попадут в пакет package1.
    workspace.get('package1').manager = new Manager;
    
    await workspace.save();
})();

```
