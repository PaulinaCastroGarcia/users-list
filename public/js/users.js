$(document).ready(function(){
  $("header").css({'width':($("table").outerWidth()+'px')})
})

let users
let sortOrder = 'asc'

function sortUsers(key) {
  users.sort(function(a, b) {
    a = a[key].toLowerCase()
    b = b[key].toLowerCase()
    
    let comparison = 0
    if (a > b) {
      comparison = 1
    } else if (a < b) {
      comparison = -1 
    }
    return (sortOrder == 'desc') ? (comparison * -1) : comparison
  })
  sortOrder = (sortOrder == 'desc') ? 'asc' : 'desc'
}

function appendUsers(users) {
  for(let i = 0; i < users.length; i++) {
    $('table').append(`
    <tr class="user" id="${users[i].id}">
      <td>${users[i].name}</td>
      <td>${users[i].surname}</td>
      <td>${users[i].phone}</td>
      <td>${users[i].email}</td>
      <td class="center"><button class="edit-btn btn btn-outline-dark btn-sm border-0"><i class="far fa-edit"></i></button></td>
      <td><button class="delete-btn btn btn-outline-danger btn-sm border-0" data-toggle="modal" data-target="#modal-delete">X</button></td>
    </tr>
    `)
  }
}

function filter() {
  const search = $('#search-input').val()
  $.ajax({
    url: `http://localhost:3000/api/users/?q=${search}`,
    success: function(data) {
      users = data
  
      $('.user').remove()
      $('#search-input').val('')
  
      appendUsers(users)
      $("header").css({'width':($("table").outerWidth()+'px')})
    }
  })
}

$.ajax({
  url: 'http://localhost:3000/api/users',
  success: function(data) {
    users = data
    appendUsers(users)
  }
})

$('#filter-btn').on('click', filter)
$('#search-input').on('keypress', function(e) {
  const key = e.keyCode
  if (key == 13) {
    filter()
  }
})

$('#btn-new-user').on('click', function() {
  location.href = '/users/new'
})

$('.table-header').on('click', function() {
  $('.user').remove()
  const key = $(this)[0].id

  sortUsers(key, sortOrder)
  appendUsers(users)
})

$(document).ajaxComplete(function() {
  $('.edit-btn').on('click', function() {
    const id = $(this).parent().parent()[0].id
    location.href = `/users/edit?id=${id}`
  })

  $('.delete-btn').on('click', function() {
   const id = $(this).parent().parent()[0].id
   $('#modal-delete').data('id', id)
  })

  $('#btn-delete-user').on('click', function() {
    const id = $('#modal-delete').data('id')
    $.ajax({
      url: `http://localhost:3000/api/users/${id}`,
      type: "DELETE",
      success: function() {
        $(`#${id}`).remove()
        $("header").css({'width':($("table").outerWidth()+'px')})
        $('#modal-delete').modal('hide')
      }
    })
  })
})