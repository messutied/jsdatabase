# jsDatabase #

La forma mas básica de base de datos para **javascript** guardada en un objeto **JSON**... guardar en local storage, etc

![http://jsdatabase.googlecode.com/svn/wiki/splash.png](http://jsdatabase.googlecode.com/svn/wiki/splash.png)


### Uso básico ###
```
jDB.createDB('dbTest');
jDB.selDB = 'dbTest';
jDB.createTable('usuarios', {cols: ['nombre', 'apellido', 'telefono']});

jDB.insert('usuarios', {nombre: 'Pepe', apellido: 'Duran', telefono: 23123});
jDB.insert('usuarios', {nombre: 'Maria', apellido: 'Melgar', telefono: 233123});

var rows = jDB.select('usuarios').where(function(row) { if (row.nombre == 'Pepe') return true; });
var pepe = rows.Row(0);
pepe.apellido = "suarez";

pepe.Save();
```



**[Descargar jsDatabase 0.2](http://jsdatabase.googlecode.com/svn/trunk/jsBatabase/js/jsDataBase.js)**