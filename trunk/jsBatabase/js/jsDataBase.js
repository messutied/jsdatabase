function jDB() {
	this.tableName = null;
	this.selRow = {};

	this.where = function() {
		
	}

	this.set = function(key, val) {

	}

	this.save = function() {
		
	}
}

jDB.dbNames = [];
jDB.databases = {};

jDB.selDB = null;

jDB.createDB = function(dbName) {
	if (jDB.dbNames.indexOf(dbName) == -1) {
		jDB.dbNames.push(dbName);
		jDB.databases[dbName] = {'tablesMetadata': [], 'tables': {}};
		return true;
	}
	return false;
}

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

jDB.createTable = function(tableName, data, databaseName) {
	databaseName = jDB.checkDBparam(databaseName);
	
	if (jDB.tableExist(tableName)) throw 'Table already in DB';
	
	var cols = data['cols'];
	cols.splice(0, 0, 'id');
	
	var metadata = {'tableName': tableName, 'cols': cols, 'nextID': 1};

	jDB.databases[databaseName]['tablesMetadata'].push(metadata);
	jDB.databases[databaseName]['tables'][tableName] = [];
	return true;
}

jDB.insert = function(tableName, data, databaseName) {
	databaseName = jDB.checkDBparam(databaseName);
	
	var metadata = jDB.getTableMetadata(tableName, databaseName);
	var id = metadata['nextID'];
	var rowData = {'id': id};
	
	for (var colName in data) {
		if (metadata['cols'].indexOf(colName) != -1) {
			rowData[colName] = data[colName];
		}
		else throw 'Unexpected column!!';
	}

	jDB.databases[databaseName]['tables'][tableName].push(rowData);
	
	metadata['nextID']++;
}

jDB.select = function(tableName) {
	
}