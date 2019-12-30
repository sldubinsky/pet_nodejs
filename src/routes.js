
const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')

router.get('/', (req, res) => {
  res.render('index')
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

router.get('/newbase', (req, res) => {
  res.render('newbase', {
    data: {},
    errors: [],
    errorMap: {},
    csrfToken: req.csrfToken()
  })
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
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    //var er = errors.mapped();
    //console.log(er);
    return res.render('newbase', {
      data: req.body,
      errors: errors.array(),
      errorMap: errors.mapped(),
      csrfToken: req.csrfToken()
    })
  }

  const data = matchedData(req)
  console.log('Sanitized: ', data)
  console.log(process.env.USERNAME);
  // Homework: send sanitized data in an email or persist in a db

  req.flash('success', 'Thanks for the message! I‘ll be in touch :)')
  res.redirect('/')
})

module.exports = router
