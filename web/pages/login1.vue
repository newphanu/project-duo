<template>
    <v-app>
        <v-main class="login-background">
            <v-container fluid fill-height>
                <v-row align="center" justify="center">
                    <v-col cols="12" sm="10" md="6" lg="4">
                        <v-card class="login-card elevation-24 rounded-xl" color="white">
                            <v-card-title class="text-center pt-8 pb-4">
                                <div class="logo-container mb-4">
                                    <v-img src="/img/ctc.png" max-height="120" max-width="120" contain
                                        class="mx-auto"></v-img>
                                </div>
                                <div class="text-h4 font-weight-bold primary-text">
                                    ระบบเช็คชื่อนักศึกษา
                                </div>
                                <div class="text-subtitle-1 text-medium-emphasis mt-2">
                                    วิทยาลัยเทคนิคชัยภูมิ
                                </div>
                            </v-card-title>

                            <v-card-text class="px-8 pb-6">
                                <v-form @submit.prevent="Login">
                                    <v-text-field v-model="email" label="อีเมล" variant="outlined"
                                        prepend-inner-icon="mdi-account-circle" class="mb-4" color="primary"
                                        rounded="xl"></v-text-field>

                                    <v-text-field v-model="password" label="รหัสผ่าน" type="password" variant="outlined"
                                        prepend-inner-icon="mdi-lock" color="primary" rounded="xl"></v-text-field>

                                    <div class="text-right mb-4">
                                        <router-link to="/forgot-password"
                                            class="text-subtitle-2 text-primary text-decoration-none">
                                            ลืมรหัสผ่าน?
                                        </router-link>
                                    </div>

                                    <v-btn type="submit" color="primary" size="x-large" block rounded="xl"
                                        class="login-button" elevation="6">
                                        เข้าสู่ระบบ
                                    </v-btn>
                                </v-form>

                                <div class="text-center mt-6">
                                    
                                    <v-divider class="my-4"></v-divider>
                                    <router-link to="/account">
                                    <div class="text-subtitle-2 text-medium-emphasis mb-4">
                                        สมัครสมาชิก
                                    </div>
                                </router-link>
                                    <div class="d-flex justify-center">
                                        <v-btn icon variant="outlined" color="blue-darken-1" class="mx-2">
                                            <v-icon>mdi-facebook</v-icon>
                                        </v-btn>
                                        <v-btn icon variant="outlined" color="red-darken-1" class="mx-2">
                                            <v-icon>mdi-google</v-icon>
                                        </v-btn>
                                    </div>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup>
definePageMeta({
    layout: "empty",
});
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from "axios"

const router = useRouter()
const email = ref('')
const password = ref('')

const Login = async () => {
    console.log('email=', email.value)
    let forms = {
        username: email.value,
        password: password.value
    }
    const response = await axios.post("http://localhost:7000/login", forms);

    const token = response.data.token
    const fullname = response.data.fullname
    const username = response.data.username

    localStorage.setItem("token", token)
    localStorage.setItem("fullname", fullname)
    localStorage.setItem("username", username)

    console.log(response.data)

    if (response.data.status === 1) {
        router.push('/student_list2');
    }
}
</script>

<style scoped>
.login-background {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    height: 100vh;
}

.login-card {
    background: white !important;
    border-radius: 24px !important;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
    overflow: hidden;
}

.logo-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

.primary-text {
    color: #2c3e50;
    letter-spacing: -0.5px;
}

.login-button {
    text-transform: none !important;
    font-weight: 600;
    letter-spacing: 0.5px;
}
</style>