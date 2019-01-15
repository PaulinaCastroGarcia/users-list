$(document).ready(function(){
  $("header").css({'width':($("form").outerWidth()+'px')})
})

const url_string = window.location.href
const url = new URL(url_string)
const id = url.searchParams.get("id")

$.ajax(`/api/user/${id}`)
.done(function(data) {
  $('#name').val(data.name)
  $('#surname').val(data.surname)
  $('#phone').val(data.phone) 
  $('#email').val(data.email) 
})

$.validator.addMethod('customphone', function (value, element) {
  const internationalNumber = /([0-9\s\-]{7,})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/
  return this.optional(element) || internationalNumber.test(value)
}, "Please enter a valid phone number")

$('#edit-user-form').validate({
  onfocusout: function (element) {
    $(element).valid()
  },
  onkeyup: false,
  rules: {
    name: {
      required: true,
      maxlength: 30
    },
    surname: {
      required: true,
      maxlength: 30
    },
    phone: {
      required: true,
      customphone: true
    },
    email: {
      required: true,
      email: true
    }
  },
  messages: {
    phone: {
      customphone: 'Please enter a valid phone number'
    }
  },
  submitHandler: function (form) {
    $.ajax({
        type: "PUT",
        url: `/api/users/${id}`,
        data: $(form).serialize(),
        success: function () {
          $('#modal-save-edited-user').modal('show')
          setTimeout(function() {
            location.href = '/users'
          }, 1500)
        },
        error: function() {
          $('#modal-error').modal('show')
        }
    })
  }
})

$('#btn-cancel-edit').on('click', function(e) {
  location.href = '/users'
})