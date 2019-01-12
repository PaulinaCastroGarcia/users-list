$(document).ready(function(){
  $("header").css({'width':($("form").outerWidth()+'px')})
})

$.validator.addMethod('customphone', function (value, element) {
  return this.optional(element) || /^\d{10}$/.test(value)
}, "Please enter a valid phone number")

$('#new-user-form').validate({
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
        type: "POST",
        url: "/api/users",
        data: $(form).serialize(),
        success: function () {
          $('#modal-save-new-user').modal('show')
          setTimeout(function() {
            location.href = '/users'
          }, 1500)
        }
    })
  }
})

$('#btn-cancel-new-user').on('click', function() {
  location.href = '/users'
})