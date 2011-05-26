/**
 * @class jDB:
 * Clase estatica usada para las funciones de jsDatabase
 *
 * Objeto Devuelto por la funcion jDB.select(tableName), contiene las funciones para
 * armar una consulta a la base de datos
 *
 * @param tableName nombre de la tabla
 */
function jDB(tableName) {
	this._tableName = tableName;
	this._rows = null;

	this.getRows = function() {return this._rows};
	this.getRow = function(index) {return this._rows[index]};

	this.withID = function(_id) {
		return this.where(function(row) {return row.id==_id});
	}

	this.all = function() {
		return this.where('all');
	}

	this.where = function(queryFunct, queryJoinFuncts) {
		this._rows = jDB.databases[jDB.selDB]['tables'][this._tableName];
		var all = (typeof queryFunct == 'string' && queryFunct == 'all');
		var newRows = [];

		for (var i=0; i<this._rows.length; i++) {
			var row = new jDB.Row(this._rows[i], this._tableName);

			var rowOK = true;
			
			if ((typeof queryFunct == 'function' && queryFunct(row)) || all) {
				if (queryJoinFuncts != undefined) {
					var newSubRows = [];
					
					for (var key in queryJoinFuncts) {
						var subRows = row[key]['_rows'];
						for (var j=0; j<subRows.length; j++) {
							if (queryJoinFuncts[key](subRows[j])) {
								newSubRows.push(subRows[j]);
							}
						}
						row[key]['_rows'] = newSubRows;
					}
				}
			}
			else rowOK = false;
			
			if (rowOK) {
				newRows.push(row);
			}
		}

		this._rows = newRows;
		return this;
	}
}

jDB.select = function(tableName) {
	var o = new jDB(tableName);
	return o;
}

/**
 * @class jDB.Row:
 *
 * Devuelto por la funcion jDB.Row(index)
 * Representa una fila en una tabla de la base de datos
 *
 * @param row la fila, _tableName es agregado para poder crear un objeto jDB.Row
 * a partir de cualquie row
 * @param tableName nombre de la tabla (opcional)
 */
jDB.Row = function(row, tableName) {
	if (tableName == null) this._tableName = row._tableName;
	else this._tableName = tableName;
	
	this._table = null;

	// Copiamos los valores
	for (key in row) {
		this[key] = row[key];
	}

	// info de esta tabla
	var metadata = jDB.getTableMetadata(this._tableName);

	// relaciones
	var rel = metadata['rel'];
	
	if (rel != undefined) {
		for (var key in rel) {

			// si tiene relacion oneToMany se crean los "hijos" de este record
			if (key == 'oneToMany') {
				var refTable = rel[key];
				var $this = this;
				this[refTable] = jDB.select(refTable)
					.where(function(row) {return row['id_'+$this._tableName] == $this.id});
			}
		}
	}

	/** Guarda los cambios a la base de datos */
	this.Save = function() {
		this._table = jDB.databases[jDB.selDB]['tables'][this._tableName];
		var metadata = jDB.getTableMetadata(this._tableName);
		
		for (var i=0; i<this._table.length; i++) {
			if (this._table[i]['id'] == this.id) {
				for (var j=0; j<metadata['cols'].length; j++) {
					var key = metadata['cols'][j];
					this._table[i][key] = this[key];
				}
				break;
			}
		}
	}
}

/** Lista con los nombres de las bases de datos */
jDB.dbNames = [];

/**
 * Guarda la estructura de las bases de datos
 *
 * jDB.databases = {
 *		nombreDB: {
 *			tablesMetadata: [{tableName: 'tableName', cols: [id, col1, col2], nextID: 1}]
 *			tables: {tableName: [id: 1, col1: 'blah', col2: 'blah']}
 *		}
 *	}
 */
jDB.databases = {};

/** Base de datos en uso */
jDB.selDB = null;

jDB.createDB = function(dbName) {
	if (jDB.dbNames.indexOf(dbName) == -1) {
		jDB.dbNames.push(dbName);
		jDB.databases[dbName] = {'tablesMetadata': [], 'tables': {}};
		return true;
	}
	return false;
}

/**
 * Crea la informacion relacionada a la tabla en la base de datos
 *
 * @param tableName nombre de la tabla
 * @param data informacion relacionada a la tabla: columnas, relaciones
 *	Ej: data = {
 *		cols: ['col1', 'col2', 'col3'],
 *		rel: {oneToMany: 'otherTableName'}
 *	}
 * @param databaseName nombre de la base de datos en uso (opcional)
 */
jDB.createTable = function(tableName, data, databaseName) {
	databaseName = jDB.checkDBparam(databaseName);
	
	if (jDB.tableExist(tableName)) throw 'Table "'+tableName+'" already in DB';
	
	var cols = data['cols'];
	var metadata = {'tableName': tableName, 'nextID': 1};
	cols.splice(0, 0, 'id');

	if (data['rel'] != undefined) {
		metadata['rel'] = data['rel'];

		for (var key in data['rel']) {
			// Si es manyToOne, crear columna extra para relacionar
			if (key == 'manyToOne') {
				cols.push('id_'+data['rel'][key]);
			}
		}
	}

	metadata['cols'] = cols;

	jDB.databases[databaseName]['tablesMetadata'].push(metadata);
	jDB.databases[databaseName]['tables'][tableName] = [];
	return true;
}

/**
 * Inserta un record en la base de datos
 *
 * @param tableName El nombre de la tabla
 * @param data Los valores a ser insertados en formato {colName1: 'data', colName2: 'moreData'}
 * @param databaseName El nombre de la base de daros (opcional)
 *
 * @return jDB.Row con el objeto insertado
 */
jDB.insert = function(tableName, data, databaseName) {
	databaseName = jDB.checkDBparam(databaseName);
	
	var metadata = jDB.getTableMetadata(tableName, databaseName);
	var id = metadata['nextID'];
	var rowData = {'id': id};
	
	for (var colName in data) {
		if (metadata['cols'].indexOf(colName) != -1) {
			rowData[colName] = data[colName];
		}
		else throw 'Unexpected column: "'+colName+'"';
	}

	jDB.databases[databaseName]['tables'][tableName].push(rowData);
	
	metadata['nextID']++;

	return new jDB.Row(rowData, tableName);
}



/*****************	Extra functions	*******************************************/

jDB.checkDBparam = function(db) {
	if (db == null) {
		if (jDB.selDB == null) throw 'No databse selected';
		else
			db = jDB.selDB;
	}
	else jDB.selDB = db;

	if (jDB.dbNames.indexOf(db) == -1) {
		jDB.createDB(db);
	}

	return db;
}

jDB.tableExist = function(table) {
	var exist = false;
	for (var key in jDB.databases[jDB.selDB]['tables']) {
		if (key == table) {
			exist = true;
		}
	}
	return exist;
}

jDB.getTableMetadata = function(tableName, databaseName) {
	databaseName = jDB.checkDBparam(databaseName);

	var metadatas = jDB.databases[databaseName]['tablesMetadata'];
	for(var i=0; i< metadatas.length; i++) {
		if (metadatas[i]['tableName'] == tableName)
			return metadatas[i];
	}
	return null;
}