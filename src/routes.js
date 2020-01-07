
const express = require('express')
const pet_bd = require('./pet_bd')
const router = express.Router()
const { check, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')

function user_check(req, res, next){
  if (req.session.authorized){
    next();
  }else{
    res.redirect('/signin');
  }
}

function admin_check(req, res, next){
  if (req.session.isAdmin){
    next();
  }else{
    res.redirect('/signin');
  }
}

router.get('/', user_check, (req, res) => {
  var l_user_id = req.session.user_id;
  if (req.session.isAdmin){l_user_id = null};
  pet_bd.getUserBases(l_user_id, function(err, bases_list){
    if(err) throw err;
    res.render('index', {
      username : req.session.username,
      isAdmin : req.session.isAdmin,
      bases_list : bases_list
    })
    //console.log(bases_list);
  });
})

router.get('/signin', (req, res) => {
  pet_bd.getUserArray(function(err, users_array){
    if (err) throw err;
    res.render('signin', {
      users: users_array,
      errors: [],
      csrfToken: req.csrfToken()
    })
  })
})

router.post('/signin', [
  check('user_id')
    .isLength({ min: 1 })
    .withMessage('Укажите пользователя')
    .trim()
  ], (req, res) =>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    pet_bd.getUserArray(function(err, users_array){
      if (err) throw err;
      res.render('signin', {
        users: users_array,
        errors: errors.array(),
        csrfToken: req.csrfToken()
      })
    })
  } else {
    // записать в глобальную переменную выбранного пользователя? Или как тут у них авторизация работает?
    const data = matchedData(req);
    console.log(data.user_id);
    pet_bd.getUser(data.user_id, function(err, user_info){
      if (err){
        throw err;
      }else{
        req.session.authorized = true;
        req.session.user_id = data.user_id;
        req.session.username = user_info[0].user_name;
        req.session.isAdmin = user_info[0].isAdmin;
        //console.log(req.session);
        res.redirect('/');
      } 
    })
  }
})

router.get('/contact', (req, res) => {
  res.render('contact', {
    data: {},
    errors: [],
    errorMap: {},
    csrfToken: req.csrfToken()
  })
})

router.post('/contact', [
  check('message')
    .isLength({ min: 1 })
    .withMessage('Message is required')
    .trim(),
  check('email')
    .isEmail()
    .withMessage('That email doesn‘t look right')
    .trim()
    .normalizeEmail()
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.render('contact', {
      data: req.body,
      errors: errors.array(),
      errorMap: errors.mapped(),
      csrfToken: req.csrfToken()
    })
  }

  const data = matchedData(req)
  console.log('Sanitized: ', data)
  // Homework: send sanitized data in an email or persist in a db

  req.flash('success', 'Thanks for the message! I‘ll be in touch :)')
  res.redirect('/')
})

router.get('/newbase', user_check, (req, res) => {
  // получить список баз, построить 2 списка
  var app_srv = [];
  var bd_srv = [];
  pet_bd.getServersList(null, function(err, servers_list){
    if (err) throw err;
    servers_list.forEach(server => {
      if (server.server_type == 0){
        app_srv.push(server.server_name);
      }else{
        bd_srv.push(server.server_name);
      }
    });
    console.log(app_srv);
    console.log(bd_srv);
    res.render('newbase', {
      app_srv: app_srv,
      bd_srv: bd_srv,
      isAdmin: req.session.isAdmin,
      data: {},
      errors: [],
      errorMap: {},
      csrfToken: req.csrfToken()
    });
  });
})

router.post('/newbase', [
  check('base_name')
    .isLength({ min: 1 })
    .withMessage('Укажите имя базы')
    .trim(),
  check('appserver_name')
    .isLength({ min: 1 })
    .withMessage('Укажите имя сервера приложений')
    .trim(),
  check('bdserver_name')
    .isLength({ min: 1 })
    .withMessage('Укажите имя сервера БД')
    .trim(),
], (req, res) => {
  const errors = validationResult(req);
  var app_srv = [];
  var bd_srv = [];
  pet_bd.getServersList(null, function(err, servers_list){
    if (err) throw err;
    servers_list.forEach(server => {
      if (server.server_type == 0){
        app_srv.push(server.server_name);
      }else{
        bd_srv.push(server.server_name);
      }
    });
    //console.log(app_srv);
    //console.log(bd_srv);
    if (!errors.isEmpty()) {
      return res.render('newbase', {
        app_srv: app_srv,
        bd_srv: bd_srv,
        isAdmin: req.session.isAdmin,
        data: req.body,
        errors: errors.array(),
        errorMap: errors.mapped(),
        csrfToken: req.csrfToken()
      });
    }else{
      const data = matchedData(req);
      pet_bd.addBase(data.base_name, data.appserver_name, data.bdserver_name, req.session.user_id, function(err){
        if (err) throw err;
        req.flash('success', 'База добавлена');
        res.redirect('/');
      });
    };
  /*
  const data = matchedData(req)
  console.log('Sanitized: ', data)
  var fs = require('fs');
  var base_list = [];
  if (fs.existsSync("bases.json")){
    // читаем из файла
    base_list = JSON.parse(fs.readFileSync("bases.json", "UTF-8"));
  }
  // добавим в массив новые данные
  base_list.push(data);
  fs.writeFileSync("bases.json", JSON.stringify(base_list));

  req.flash('success', 'База добавлена в список')
  res.redirect('/')*/
  });
})

router.get('/servers', admin_check, (req, res) => {
  pet_bd.getServersList(null, function(err, servers_list){
    if (err) throw err;
    res.render('servers', {
      username : req.session.username,
      servers_list : servers_list
    });
  });
})

module.exports = router
