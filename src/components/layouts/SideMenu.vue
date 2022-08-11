<template>
  <v-navigation-drawer v-model="drawer" app>
    <v-sheet color="grey lighten-4" class="pa-4">
      <div class="user">
        <v-avatar color="indigo">
          <v-icon dark
                  v-if="!photoUrl">
            mdi-account-circle
          </v-icon>
          <img :src="photoUrl"
               v-if="photoUrl">
        </v-avatar>

        <div class="username">{{ auth && auth.displayName }}</div>
      </div>
    </v-sheet>

    <v-divider></v-divider>

    <v-list>
      <v-list-item v-for="[icon, text, to] in links" :key="icon" :to="to" link>
        <v-list-item-icon>
          <v-icon>{{ icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="logout">
        <v-list-item-icon>
          <v-icon>
            mdi-logout
          </v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

    </v-list>
  </v-navigation-drawer>
</template>
<script>
import firebase from "@/firebase/firebase"
export default {
  mounted() {
    this.auth = JSON.parse(sessionStorage.getItem('user'))

    this.photoUrl = this.auth.photoURL
  },
  data: () => ({
    drawer: null,
    links: [
      ['mdi-home', 'Home', '/'],
      ['mdi-pound', 'HashTag', '/about'],
      ['mdi-bell', 'Notification', '/about'],
      ['mdi-account-circle', 'Profile', '/profilepage'],
    ],
    auth: null,
    photoUrl: ""
  }),
  methods: {
    logout() {
      firebase.auth()
        .signOut()
        .then(() => {
          localStorage.message = "ログアウトしました。"
          this.$router.push('/login')
        })
    },
    getAuth() {
      return firebase.auth().onAuthStateChanged((user) => {
        return user
      })
    }
  }
}
</script>
<style>
.user {
  text-align: center;
}
</style>