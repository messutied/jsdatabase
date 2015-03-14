# jsDatabase

La forma mas básica de base de datos para javascript guardada en un objeto JSON... guardar en local storage, etc

![](https://raw.githubusercontent.com/messuti-edd/jsdatabase/master/img/splash.png)

## Uso básico

```javascript
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
