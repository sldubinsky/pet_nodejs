fs = require("fs");
pet_bd = require('./pet_bd');

var base_list_raw = fs.readFileSync("bases.json", "utf-8");
base_list = JSON.parse(base_list_raw);
//console.log(base_list);

pet_bd.getUserBases('DubinskySL', function(err, bases_list){
    if(err) throw err;
    console.log(bases_list);
})

/*
pet_bd.addServer('ukm-sapp110', 'Сервер проекта Казначейство', 0, function(err){
    if (err) throw err;
    console.log('Сервер добавлен!')
})
*/

pet_bd.getServersList(null, function(err, servers_list){
    if (err) throw err;
    console.log(servers_list);
    servers_list.forEach(server => {
        console.log('name: ' + server.server_name);
        console.log('description: ' + server.server_description);
    })
})

pet_bd.getUser('KobelevAV', function(err, user_info){
    if (err) throw err;
    console.log(user_info);
})

/*
pet_bd.addBase('ZUP_DUBINSKY', 'UKM-SAPP107', 'UKM-SDBS15', 'DubinskySL', function(err){
    if (err) throw err;
})

pet_bd.editBase('ZUP_DUBINSKY', 'UKM-SAPP08', 'UKM-SDBS15', 'ZUP_PAO', function(err){
    if (err) throw err;
})
*/