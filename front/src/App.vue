<template>
  <div class="container pb-3">
    <div class="fixed font-weight-bold" v-if="preloader">***</div>
    <div class="fixed font-weight-bold text-success" v-if="success">{{ success }}</div>
    <div class="fixed font-weight-bold text-danger" v-if="error">{{ error }}</div>
    <nav v-if="isLoggedIn" class="row">
      <div class="col-12">
        <router-link to="/">Úkoly</router-link>
        <router-link to="/dokoncene">Dokončené</router-link>
        <router-link to="/widgety">Widgety</router-link>
        <a href="#" @click.prevent="logout">Odhlásit se</a>
      </div>
    </nav>
    <div v-if="isLoggedIn" class="mt-3">    
      <RozpracovanyUkol v-if="rozpracovanyUkol && muzeEvidovatCasy" />
      <FiltracePodleCasu v-if="muzeFiltrovatCasy" />
      <router-view/>
      <h4 v-if="prvniCas" class="text-center cursor-arrow mt-5">Již od <b>{{ prvniCas }}</b></h4>
    </div>
    <div v-if="!isLoggedIn">
      <LoginView />
    </div>  
  </div>
</template>
<script>
import LoginView from './views/LoginView.vue'
import RozpracovanyUkol from '@/components/RozpracovanyUkol.vue' 
import FiltracePodleCasu from '@/components/FiltracePodleCasu.vue' 

export default {
  name: "App",
  components: { LoginView, RozpracovanyUkol, FiltracePodleCasu },
  computed: {
    muzeEvidovatCasy() {
      return this.$store.getters.isAdmin
    },
    muzeFiltrovatCasy() {
      return this.$store.getters.isAdmin
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn
    },
    preloader() {
      return this.$store.state.preloader
    },
    success() {
      return this.$store.state.success
    },
    error() {
      return this.$store.state.error
    },
    rozpracovanyUkol() {
      return this.$store.getters.rozpracovanyUkol
    },
    prvniCas() {
      let prvniCas = this.$store.getters.prvniCas
      if (prvniCas) {
        let zacatek = new Date(prvniCas.zacatek * 1000)
        return zacatek.getDate() + ". " + (zacatek.getMonth() + 1) + ". " + zacatek.getFullYear()
      } else {
        return false
      }
    }
  },
  methods: {
    logout() {
      this.$store.commit('logout')
    }
  },
  created() {
    this.$store.dispatch("loadAuthToken")
    setInterval(() => this.$store.dispatch('sync'), 3000)
  }
}
</script>
<style>
.cursor-arrow {
  cursor: arrow;
}

body {
  background-color: #CCC;
}


#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#app .container {
  background-color: #F2F2F2;
}

nav {
  padding: 30px;
  text-align: center;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  background-color: #090;
  color: #FF0;
}
.fixed {
  position: fixed;
  left: 15px;
  top: 15px;
}
.badge-primary {
  background-color: #090;
  color: #FF0;
}

.btn {
  border-width: 0;
  border-radius: 0;
}

.btn.btn-primary {
  background-color: #090b97;;
  color: #FFF;
}

.btn.btn-success {
  background-color: #090;
  color: #FF0;
}

.btn.btn-warning {
  background-color: #FFC;
  color: #950;
}

.list-group-item-warning {
  background-color: #FFC;
  color: #950;
}
.list-group-item-action.list-group-item-warning:hover {
  background-color: #FF5;
}

.list-group-item-primary {
  background-color: #090b97;
  color: #FFF;
}
.list-group-item-primary.list-group-item-action:hover {
  background-color: #090;
  color: #FF0;
}

nav {
  padding: 0;
  background-color: #090b97;
  text-align: center;
}
nav a {
  padding: 15px 50px;
  color: #FFF;
  display: inline-block;
}
nav a:hover {
  background-color: #090;
  color: #FF0;
  text-decoration:none;
}
</style>
