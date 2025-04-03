<script lang="ts">
import { RouterLink, RouterView } from "vue-router"
import LoginView from "./views/login/LoginView.vue"
import { mapState } from "vuex"
import { ref } from "vue"

export default {
   setup() {
       const theme = ref("dark")
       function changeTheme() {
           theme.value = theme.value === "light" ? "dark" : "light"
       }
       return { theme, changeTheme }
   },
   name: "App",
   components: {
       LoginView,
       RouterLink,
       RouterView
   },

   computed: mapState({
       authUser() {
           return this.$store.state.auth.user
       },
       isAuthenticated() {
           return (
               this.$store.state.auth.status.loggedIn &&
               this.authUser.token !== undefined
           )
       },
       title() {
           return "Welcome " + this.authUser.name + "!"
       }
   }),
   updated() {
       if (this.isAuthenticated) {
           this.$router.push({ name: "home" })
       }
   },
   methods: {
       logout() {
           this.$store.dispatch("auth/logout")
       },
       checkAuth(auth) {
           console.log("Authenticated!", auth)
       }
   }
}
</script>
<template>
   <v-app :theme="theme">
       <v-app-bar
           :title="authUser.name === undefined ? '' : title"
           v-if="isAuthenticated"
       >
           <v-spacer></v-spacer>
           <v-btn to="/home" default>Home</v-btn>
           <v-btn to="about">About</v-btn>
           <v-btn
               :prepend-icon="
                   theme === 'light'
                       ? 'mdi-weather-sunny'
                       : 'mdi-weather-night'
               "
               @click="changeTheme"
               >Toggle Theme</v-btn
           >
           <v-btn @click="logout()">Logout</v-btn>
       </v-app-bar>

       <v-main>
           <v-container>
               <div v-if="isAuthenticated">
                   <RouterView />
               </div>
               <LoginView
                   v-else
                   :is-authenticated="isAuthenticated"
                   @authenticate="checkAuth($event)"
               />
           </v-container>
       </v-main>
   </v-app>
</template>


