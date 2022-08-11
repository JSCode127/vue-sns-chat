<template>
    <v-app>
        <div class="login-box">
            <v-card class="login-form">
                <v-card-title class="login-title">Login</v-card-title>
                <v-card-subtitle>ユーザー情報をご入力ください</v-card-subtitle>
                <v-btn text color="light-blue" to="signup">新規登録はこちら</v-btn>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
                    <v-text-field v-model="password" type="password" label="password" required>
                    </v-text-field>

                    <div class="btn-box">
                        <v-btn
                         color="success"
                         class="login-btn"
                         @click="submit"
                         :disabled="isValid">
                            LOGIN
                        </v-btn>
                        <v-btn>
                            CLEAR
                        </v-btn>
                        <v-alert 
                         dense
                         text
                         type="success"
                         class="success-message"
                         v-if="message">
                        {{message}}
                        </v-alert>
                                                <v-alert 
                            dense 
                            outlined 
                            type="error"
                            class="error-message"
                            v-if="errorMessage">
                            {{ errorMessage}}
                        </v-alert>
                    </div>
                </v-form>
            </v-card>
        </div>
    </v-app>
</template>
<script>
import firebase from "@/firebase/firebase"
export default {
    data: () => ({
        valid: true,
        email: '',
        emailRules: [
            v => !!v || 'メールアドレスを入力してください',
            v => /.+@.+\..+/.test(v) || 'メールアドレスが不正です',
        ],
        password: '',
        message: '',
        errorMessage: ''
    }),
    //DOMが実行された後の処理
    mounted() {
        if (localStorage.message) {
            this.message = localStorage.message
            localStorage.message = ''
        }
    },
    computed: {
        isValid() {
            console.log("isValid", this.valid);
            return !this.valid;
        }
    },
    methods: {
        validate() {
            this.$refs.form.validate()
        },
        reset() {
            this.$refs.form.reset()
        },
        resetValidation() {
            this.$refs.form.resetValidation()
        },
        submit() {
            console.log("submit call")
            firebase.auth()
                .signInWithEmailAndPassword(this.email,this.password)
                .then((result) => {
                    console.log("success")
                    console.log("user", result.user)

                    const auth = {
                        displayName: result.user.displayName,
                        email: result.user.email,
                        uid: result.user.displayName,
                        refreshToken: result.user.refreshToken,
                        photoURL: result.user.photoURL
                    }

                    sessionStorage.setItem('user', JSON.stringify(auth))
                    //TOPにリダイレクト処理
                    this.$router.push('/')
                })
                .catch((error) => {
                    console.log("fali", error)
                    this.errorMessage = "ログインに失敗しました。"
                })
        }
    },
}
</script>
<style scoped>
.login-form {
    margin: 150px;
    padding: 30px;
}

.login-box {
    width: 70%;
    margin: 0 auto;
    padding: 30px;
}

.login-title {
    display: inline-block;
}

.login-btn {
    margin-right: 20px;
}

.btn-box {
    text-align: center;
}
.success-message {
    margin-top: 20px;
}
.error-message {
    margin-top: 20px;
}
</style>


