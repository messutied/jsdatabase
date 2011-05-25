<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>Test jsDatabase</title>
		<script type="text/javascript" src="js/jsDataBase.js"></script>

		<script type="text/javascript">
		jDB.createDB('dbTest');
		jDB.selDB = 'dbTest';
		jDB.createTable('usuarios', {cols: ['nombre', 'apellido'], rel: {oneToMany: 'telefonos'}});
		jDB.createTable('telefonos', {cols: ['descr', 'numero'], rel: {manyToOne: 'usuarios'}});

		jDB.insert('usuarios', {nombre: 'Pepe', apellido: 'Duran'});
		
		jDB.insert('telefonos', {descr: 'casa', numero: 213212, id_usuarios: 1});
		jDB.insert('telefonos', {descr: 'trabajo', numero: 2112666, id_usuarios: 1});

		var rows = jDB.select('usuarios').where(function(row) { return row.nombre == 'Pepe' });
		var pepe = rows.Row(0);
		//pepe.apellido = "suarez";
		//pepe.Save();

		</script>
	</head>
	<body></body>
</html>
