<template>
    <v-app id="inspire">
        <SideMenu />
        <v-main>
            <h2>プロフィール画像を変更する</h2>
            <v-sheet color="grey lighten-4" class="pa-4">
                <div class="user">
                    <v-avatar color="indigo">
                        <input type="file" ref="fileInput" accept="image/jpeg,image/jpg, image/png"
                            style="display: none" @change="updateIcon">
                        <v-icon dark v-if="!photoUrl" @click="changeIcon">
                            mdi-account-circle
                        </v-icon>
                        <img :src="photoUrl" @click="changeIcon" v-if="photoUrl">
                    </v-avatar>

                    <div class="username">{{ auth && auth.displayName }}</div>
                </div>
            </v-sheet>
            <v-container class="py-8 px-6" fluid>
                <v-row>
                    <v-col v-for="card in cards" :key="card" cols="12">
                        <v-card>
                            <!-- <v-subheader>{{ card }}</v-subheader> -->

                            <v-list two-line>
                                <template v-for="(data, index) in messages">
                                    <v-list-item :key="index">
                                        <v-list-item-avatar color="grey darken-1">
                                            <v-img :src="data.photoURL"></v-img>
                                        </v-list-item-avatar>

                                        <v-list-item-content>
                                            <v-list-item-subtitle class="message blue--text text--darken-1">
                                                {{ data.name }}
                                                <!-- {{ data.createdAt }} -->
                                            </v-list-item-subtitle>
                                            <v-list-item-subtitle class="message black--text text--darken-1">
                                                {{ data.message }}
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>

                                    <v-divider v-if="index !== 6" :key="`divider-${index}`" inset></v-divider>
                                </template>
                            </v-list>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import firebase from "@/firebase/firebase"
import SideMenu from '@/components/layouts/SideMenu'
export default {
    components: {
        SideMenu
    },
    created() {
        this.user_id = this.$route.query.user_id;
        console.log(this.user_id)

        /* const chatRef = firebase.firestore().collection("chats").orderBy("createdAt", "desc")
         const snapshot = await chatRef.get()
        snapshot.forEach(doc => {
            console.log(doc.data())
            this.messages.push(doc.data())
        }) */
    },
  mounted() {
    this.auth = JSON.parse(sessionStorage.getItem('user'))
    this.photoUrl = this.auth.photoURL

    console.log(this.$refs.preview)
    this.auth = JSON.parse(sessionStorage.getItem('user'))
    const chatRef = firebase.firestore().collection("chats")
    chatRef.orderBy("createdAt", "desc")
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                this.messages.push(change.doc.data())
            })
        })
  },
  data: () => ({
    messages: [],
    body: '',
    user_id: '',
    cards: ['Today'],
    name: '',
    createdAt: '',
    url: '',
    drawer: null,
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
    changeIcon() {
      this.$refs.fileInput.click()
    },
    updateIcon() {
      const user = this.getAuth()
      if (!user) {
        sessionStorage.removeItem('user')
        this.$router.push('/login')
      }

      const file = this.$refs.fileInput.files[0]
      const filePath = `/user/${file.name}`
      //console.log("URL", filePath)
      firebase.storage().ref()
        .child(filePath)
        .put(file)
        .then(async snapshot => {

          const photoUrl = await snapshot.ref.getDownloadURL()
          firebase.auth().onAuthStateChanged((user) => {
            if(user) {
              user.updateProfile({
                photoURL: photoUrl
              })
              this.auth.photoURL = photoUrl
              sessionStorage.setItem('user', (JSON.stringify(this.auth)))
              this.photoUrl = photoUrl
            }
          })
        });
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
.message {
    text-align: left;
}

.image-up {
    margin-right: 20%;
}
</style>

