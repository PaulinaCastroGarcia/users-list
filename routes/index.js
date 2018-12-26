var express = require('express');
var path = require('path');
var fs = require('fs');
var router = express.Router();

/* GET htmls */
router.get('/users/new', function(req,res) {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'new-user.html'))
})

router.get('/users', function(req,res) {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'users.html'))
})

router.get('/users/edit', function(req,res) {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'edit-user.html'))
})

///API
const users = JSON.parse(fs.readFileSync('users.json'))

//ping pong
router.get('/ping', function(req, res, next) {
 res.send('pong')
})

//get user
router.get(`/api/user/:id`, function(req, res, next) {
  const id = req.params.id
  for (var i = 0; i <users.length; i++) {
    if (users[i].id == id) {
      return res.json(users[i]);
    }
  }
})

//get users
router.get('/api/users', function(req, res, next) {
  let search = req.query.q

  if (search == undefined) {
    res.json(users)
  } else {
    search = search.toLowerCase()

    const userKeys = Object.keys(users[0])
    const idIndex = userKeys.indexOf('id')
    userKeys.splice(idIndex, 1)

    const searchMatchUsers = users.filter(function(u) {
      return u.name.toLowerCase().indexOf(search) >= 0 ||
      u.surname.toLowerCase().indexOf(search) >= 0 ||
      u.phone.toLowerCase().indexOf(search) >= 0 ||
      u.email.toLowerCase().indexOf(search) >= 0 
    })

    res.json(searchMatchUsers)
  }  
})

//add user
router.post('/api/users', function(req, res, next) {
  const user = req.body
  user.id = users.length == 0 ? 1 : users[users.length - 1].id + 1
 
  users.push(user)
  fs.writeFileSync('users.json', JSON.stringify(users))

  res.json(users)
})

//delete user
router.delete('/api/users/:id', function(req, res, next) {
  const id = req.params.id

  for (let i = 0; i < users.length; i++) {
    if (id == users[i].id) {
      users.splice(i,1)
    }
  }

  fs.writeFileSync('users.json', JSON.stringify(users))
  res.json(users)
})

//edit user
router.put('/api/users/:id', function(req, res, next) {
  const id = req.params.id

  for (let i = 0; i <users.length; i++) {
    if (users[i].id == id) {
      const currentUser = users[i]
      changeUserKeysValues(currentUser)
      fs.writeFileSync('users.json', JSON.stringify(users))
      res.json(users[i])
    }
  }

  function changeUserKeysValues(currentUser) {
    const body = req.body
    const userKeys = Object.keys(currentUser)
    const bodyKeys = Object.keys(body)

    for (let i = 0; i < bodyKeys.length; i++) {
      const currentBodyKey = bodyKeys[i];
      if (userKeys.indexOf(currentBodyKey) != -1) {
        currentUser[currentBodyKey] = body[currentBodyKey]
      } 
    }
  }  
})

module.exports = router;