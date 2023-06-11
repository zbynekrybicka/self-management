<template>
    <div>
        <div v-if="form === 'loginForm'">
            <Login v-if="!userId" @goto="form=$event" />
            <Autenticate v-if="userId" />
        </div>

        <div v-if="form === 'registrationForm'">
            <Registration @goto="form=$event" />
        </div>
    </div>
  </template>
  
  <script>
import Autenticate from '@/components/Autenticate.vue';
import Login from '@/components/Login.vue';
import Registration from '@/components/Registration.vue';

export default {
    name: "LoginView",
    data: () => ({
        form: "loginForm"
    }),
    computed: {
        userId() {
            return this.$store.getters.authenticationData?.id
        }
    },
    components: { Login, Autenticate, Registration }
}
</script>
