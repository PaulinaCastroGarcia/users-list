$(document).ready(function(){
  $("header").css({'width':($("form").outerWidth()+'px')})
})

const url_string = window.location.href
const url = new URL(url_string)
const id = url.searchParams.get("id")

$.ajax(`http://localhost:3000/api/user/${id}`)
.done(function(data) {
  $('#name').val(data.name)
  $('#surname').val(data.surname)
  $('#phone').val(data.phone) 
  $('#email').val(data.email) 
})

$('#btn-save-edit').on('click', function(e) {
  e.preventDefault()
  const name =  $('#name').val()
  const surname =  $('#surname').val()
  const phone =  $('#phone').val()
  const email =  $('#email').val()

  $.ajax(`http://localhost:3000/api/users/${id}`, {
    method: "PUT",
    data: {
      name: name,
      surname: surname,
      phone: phone,
      email: email
    },
    success: function() {
      $('#modal-save-edited-user').modal('show')
      setTimeout(function() {
        location.href = '/users'
      }, 1500)
    }
  })  
})

$('#btn-cancel-edit').on('click', function(e) {
  location.href = '/users'
})