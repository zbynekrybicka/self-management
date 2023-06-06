<template>
  <div class="fixed font-weight-bold" v-if="preloader">***</div>
  <div class="fixed font-weight-bold text-success" v-if="success">{{ success }}</div>
  <div class="fixed font-weight-bold text-danger" v-if="error">{{ error }}</div>
  <nav v-if="isLoggedIn">
    <router-link to="/">Nástěnka</router-link> |
    <router-link to="/ukoly">Úkoly</router-link> |
    <router-link to="/planovani">Plánování</router-link> |
    <router-link to="/dokoncene">Dokončené</router-link> |
    <a href="#" @click.prevent="logout">Odhlásit se</a>
  </nav>
  <div class="container" v-if="isLoggedIn">    
    <RozpracovanyUkol v-if="rozpracovanyUkol" />
    <FiltracePodleCasu />
    <router-view/>
    <h4 v-if="prvniCas" class="text-center cursor-arrow mt-5">Již od <b>{{ prvniCas }}</b></h4>
  </div>
  <div class="container" v-if="!isLoggedIn">
    <LoginView />
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
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
  color: #42b983;
}
.fixed {
  position: fixed;
  left: 15px;
  top: 15px;
}
</style>
