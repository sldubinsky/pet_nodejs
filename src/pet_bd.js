const mysql = require('mysql2');
const mysql_p = require('mysql2/promise');
const srv_settings = {
    host     : '192.168.99.100',
    user     : 'jazon',
    password : 'vbybcnhg',
    database : 'test_bases' 
};

exports.getUserArray = function(callback){
    var connection = mysql.createConnection({
        host     : '192.168.99.100',
        user     : 'jazon',
        password : 'vbybcnhg',
        database : 'test_bases' 
    });
    connection.connect();
    connection.query('SELECT user_ID as user_id, user_name as user_name, IsAdmin as isAdmin FROM test_bases.users;', function(err, rows, fields){
        if (err) {
            callback(err, null)
        }else{
            callback(null, rows)
        };
    });
    connection.end();
}

exports.getUser = function(user_id, callback){
    var connection = mysql.createConnection({
        host     : '192.168.99.100',
        user     : 'jazon',
        password : 'vbybcnhg',
        database : 'test_bases' 
    });
    connection.connect();
    var sql_stat = 'SELECT user_ID as user_id, user_name as user_name, IsAdmin as isAdmin FROM test_bases.users where user_id = ?';
    connection.query(sql_stat, [user_id], function(err, rows, fields){
        if (err) {
            callback(err, null)
        }else{
            callback(null, rows)
        };
    });
    connection.end();
}

exports.getUserBases = function(user_id, callback){
    var connection = mysql.createConnection({
        host     : '192.168.99.100',
        user     : 'jazon',
        password : 'vbybcnhg',
        database : 'test_bases' 
    });
    connection.connect();
    var sql_stat = 'select ' + 
    ' base_owners.user_ID,' +
    ' base_owners.base_name,' +
    ' bases.server_app,' +
    ' base_owners.prototype ' +
    'from base_owners ' +
    '  join bases as bases on base_owners.base_name = bases.base_name ';
    if (user_id != null){
       sql_stat = sql_stat + 'where base_owners.user_ID = ?';
    }
    connection.query(sql_stat, user_id, function(err, rows, fields){
        if (err) {
            callback(err, null)
        }else{
            callback(null, rows)
        };
    });
    connection.end();
}

exports.getServersList = function(server_type, callback){
    var connection = mysql.createConnection({
        host     : '192.168.99.100',
        user     : 'jazon',
        password : 'vbybcnhg',
        database : 'test_bases' 
    });
    connection.connect();
    var sql_stat = 'select server_name, server_description, server_type from servers where server_type = ? ';
    // check server type
    if (server_type == null){
        server_type = 0;
        sql_stat = sql_stat + 'or true';
    }
    connection.query(sql_stat, [server_type], function(err, rows, fields){
        if (err) {
            callback(err, null)
        }else{
            callback(null, rows)
        };
    });
    connection.end();
}

exports.addServer = function(server_name, server_description, server_type, callback){
    var connection = mysql.createConnection({
        host     : '192.168.99.100',
        user     : 'jazon',
        password : 'vbybcnhg',
        database : 'test_bases' 
    });
    connection.connect();
    var sql_stat = 'insert into servers values(?, ?, ?)';
    connection.query(sql_stat, [server_name.toUpperCase(), server_description, server_type], function(err){
        if (err){
            callback(err)
        }else{
            callback(null)
        }
    })
}

exports.addBase = function(base_name, app_server, bd_server, user_id, callback){
    var connection = mysql.createConnection({
        host     : '192.168.99.100',
        user     : 'jazon',
        password : 'vbybcnhg',
        database : 'test_bases' 
    });
    if (bd_server == 'BD_DEFAULT'){
        // пока жестко переопределим как SDBS15
        bd_server = 'UKM-SDBS15';
    };
    connection.connect();
    var end_of_time = '3000-12-31'; //new Date(3000, 11, 31); //;
    var sql_stat = 'insert into base_owners values(?, ?, ?, ?);';
    connection.execute(sql_stat, [base_name.toUpperCase(), user_id, end_of_time, ''], function(err){
        if (err){
            callback(err);
        }else{
            var sql_stat = 'insert into bases values(?, ?, ?, 2);';
            connection.execute(sql_stat, [base_name.toUpperCase(), app_server, bd_server], function(err){
                if (err){
                    callback(err);
                }else{
                    callback(null);
                };
            });
        };
    });
}

exports.editBase = function(base_name, app_server, bd_server, prototype, callback){
    var connection = mysql.createConnection(srv_settings);
    if (bd_server == 'BD_DEFAULT'){
        // пока жестко переопределим как SDBS15
        bd_server = 'UKM-SDBS15';
    };
    connection.connect();
    var sql_stat = 'update base_owners set prototype = ? where base_name = ?';
    connection.execute(sql_stat, [prototype, base_name], function(err){
        if (err){
            callback(err);
        }else{
            var sql_stat = 'update bases set server_app = ?, server_bd = ? where base_name = ?';
            connection.execute(sql_stat, [app_server, bd_server, base_name], function(err){
                if(err){
                    callback(err);
                }else{
                    callback(null);
                };
            });
        }
    });
}