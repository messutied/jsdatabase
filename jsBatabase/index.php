<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>Test jsDatabase</title>
		<script type="text/javascript" src="js/jsDataBase.js"></script>

		<script type="text/javascript">
		jDB.createDB('dbTest');
		jDB.selDB = 'dbTest';
		jDB.createTable('usuarios', {cols: ['nombre', 'apellido', 'telefono']});

		jDB.insert('usuarios', {nombre: 'Pepe', apellido: 'Duran', telefono: 23123});
		jDB.insert('usuarios', {nombre: 'Maria', apellido: 'Melgar', telefono: 233123});

		var a = jDB.select('usuarios').where(function(row) { if (row.nombre == 'Pepe') return true; });
		var pepe = a.Row(0);
		pepe.apellido = "suarez";
		pepe.Save();

		</script>
	</head>
	<body></body>
</html>
