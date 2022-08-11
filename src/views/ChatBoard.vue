<template>
    <v-app id="inspire">
        <SideMenu />
        <v-main>
            <v-textarea v-model="body" append-icon="mdi-comment" class="mx-2" label="つぶやく" rows="3" auto-grow
                maxlength="140">
            </v-textarea>
            <div>
                <img v-if="photoPath" :src="photoPath" class="chat-img">
                <video controls v-if="videoPath" class="chat-img">
                    <source v-if="videoPath" :src="videoPath" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'>
                </video>
            </div>
            <!-- 画像投稿 -->
            <input type="file" ref="preview" prepend-icon="mdi-image" accept="image/*" style="display: none"
                @change="uploadFile" multiple>
            <v-icon class="image-up" @click="changeFile">mdi-image</v-icon>
            <!-- 動画投稿 -->
            <input type="file" ref="videoRef" prepend-icon="mdi-video" accept="video/mp4,video/x-m4v"
                style="display: none" @change="uploadVideo">
            <v-icon class="image-up" @click="changeVideo">mdi-video</v-icon>
            <v-container>
                <v-layout>
                    <v-flex>
                        <v-btn class="mr-4" type="submit" :disabled="invalid" @click="submit">
                            submit
                        </v-btn>
                        <v-btn @click="clear">
                            clear
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-container>
            <v-container class="py-8 px-6" fluid>
                <v-row>
                    <v-col v-for="card in cards" :key="card" cols="12">
                        <v-card>
                            <!-- <v-subheader>{{ card }}</v-subheader> -->

                            <v-list two-line>
                                <template v-for="(data, index) in messages" >
                                    <v-list-item :key="index"  v-scroll="handleScroll">
                                        <v-list-item-avatar color="grey darken-1">
                                            <v-img :src="data.photoURL"></v-img>
                                        </v-list-item-avatar>

                                        <v-list-item-content>
                                            <v-list-item-subtitle class="message blue--text text--darken-1">
                                                {{ data.name }}
                                                <!-- {{ data.createdAt }} -->
                                            </v-list-item-subtitle>
                                            <v-list-item-subtitle class="message black--text text--darken-1"
                                                style="white-space:pre-wrap; word-wrap:break-word;">
                                                {{ data.message }}
                                            </v-list-item-subtitle>
                                            <v-list-item v-if="data.photoPath">
                                                <img :src="data.photoPath" v-if="data.photoPath" class="chat-img">
                                            </v-list-item>
                                            <v-list-item v-if="data.videoPath">
                                                <video controls v-if="data.videoPath">
                                                    <source v-if="data.videoPath" :src="data.videoPath" class="chat-img"
                                                        type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'>
                                                </video>
                                            </v-list-item>
                                            <v-col cols="12" sm="3">
                                                <v-btn fab small @click="likes(data.id)">
                                                    <v-icon :color="color">
                                                        mdi-heart
                                                    </v-icon>
                                                </v-btn>
                                                {{ data.count }}
                                            </v-col>
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
//import axios from 'axios';

export default {

    components: {
        SideMenu,
    },
    created() {
        this.user_id = this.$route.query.user_id;
        console.log(this.user_id)
    },
    mounted() {
        this.auth = JSON.parse(sessionStorage.getItem('user'))
        const chatRef = firebase.firestore().collection("chats")
        chatRef.orderBy("createdAt", "desc")
            .onSnapshot(snapshot => {
                snapshot.docs.map(doc => {
                    this.messages.push({ ...doc.data(), id: doc.id });
                    this.id = doc.id
                    console.log(this.id)
                })
            })
    },
    data: () => ({
        messages: [],
        body: '',
        user_id: '',
        id: '',
        cards: ['Today'],
        drawer: null,
        auth: null,
        name: '',
        createdAt: '',
        photoPath: "",
        videoPath: "",
        color: "gray",
        count: 0,

    }),
    
    computed: {
        invalid() {
            if (this.body || this.photoPath || this.videoPath) {
                return false;
            }
            return true;
        }
    },
    methods: {
        clear() {
            this.body = "";
            this.photoPath = "";
            this.videoPath = "";
        },
        submit() {
            this.messages.unshift({
                message: this.body,
                name: this.auth.displayName,
                photoURL: this.auth.photoURL,
                createdAt: firebase.firestore.Timestamp.now(),
                photoPath: this.photoPath,
                videoPath: this.videoPath,
                count: 0
            });
            const chatRef = firebase.firestore().collection('chats')
            chatRef.add({
                message: this.body,
                name: this.auth.displayName,
                photoURL: this.auth.photoURL,
                createdAt: firebase.firestore.Timestamp.now(),
                photoPath: this.photoPath,
                videoPath: this.videoPath,
                count: 0
            })
                .then(result => {
                    console.log('success', result)
                    this.body = "";
                    this.photoPath = "";
                    this.videoPath = "";
                })
                .catch(error => {
                    console.log('fail', error)
                    alert('つぶやきに失敗しました')
                })
        },
        //画像保存関連
        changeFile() {
            this.$refs.preview.click()
        },
        uploadFile() {
            const url = this.$refs.preview.files[0]
            const urlPath = `/chats/${url.name}`
            //Storageにアップロード
            firebase.storage().ref()
                .child(urlPath)
                .put(url)
                .then(async snapshot => {
                    const photoPath = await snapshot.ref.getDownloadURL()
                    console.log("photo", photoPath)
                    this.photoPath = photoPath
                });
        },
        //動画保存関連
        changeVideo() {
            this.$refs.videoRef.click()
        },
        uploadVideo() {
            const video = this.$refs.videoRef.files[0]
            const videoUrl = `/chats/${video.name}`
            //Storageにアップロード
            firebase.storage().ref()
                .child(videoUrl)
                .put(video)
                .then(async snapshot => {
                    const videoPath = await snapshot.ref.getDownloadURL()
                    console.log("video", videoPath)
                    this.videoPath = videoPath
                });
        },
        //いいね機能
        likes(dataid) {
            //既存のドキュメント内の一部をupdate
            console.log('いいねを押した',dataid)
             const chatRef = firebase.firestore().collection('chats')
             chatRef.doc(dataid).update({
                 count: firebase.firestore.FieldValue.increment(1),
                 like_id : this.user_id
             })
                 .then(async result => {
                     console.log('success', result)
                     //いいねした呟きのみに対応させる
                 })
                 .catch(error => {
                     console.log('fail', error)
                     alert('いいねに失敗しました')
                 }) 
        },
        handleScroll() {
       if (window.scrollY > 2500) {
         console.log('スクロール検知')

       }
       return window.scrollY > 5000
        }
    }
}
</script>
<style>
.message {
    text-align: left;
}

.image-up {
    margin-right: 20px;
}

.chat-img {
    max-width: 500px;
    max-height: 500px;
}
</style>