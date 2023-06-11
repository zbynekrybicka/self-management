<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">Registrace</div>
  
            <div class="card-body">
                <div class="form-group">
                  <label for="email">E-mail</label>
                  <input type="email" name="email" id="email" class="form-control" v-model="email" required autofocus @keyup.enter="login">
                </div>
  
                <div class="form-group">
                  <label for="password">Heslo</label>
                  <input type="password" :name="showPassword ? 'text' : 'password'" id="password" class="form-control" v-model="password" @keyup.enter="login" required>
                </div>

                <div id="html_element"></div>
  
                <button class="btn btn-primary mt-2" @click="register">Registrovat</button>
            </div>
          </div>
          <a href="#" @click="$emit('goto', 'registrationForm')">Přihlásit se</a>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: '',
        password: '',
        showPassword: false
      }
    },
    methods: {
      register() {
        this.$store.dispatch('register', {
            email: this.email,
            password: this.password,
            token: this.token
        })
      }
    },
    mounted() {
        grecaptcha.render('html_element', {
          'sitekey' : '6LfUmIomAAAAAMKIoSIFpVdp8KWsvZLzyhm9I_Gp',
          'callback': token => this.token = token
        });        
    }
  }
  </script>