<template>
  <v-app>
    <v-app-bar app color="transparent" elevation="0">
      <v-app-bar-nav-icon color="white">
        <v-img src="/img/ctc.png"></v-img>
      </v-app-bar-nav-icon>
    </v-app-bar>

    <v-main class="login-background d-flex flex-column">
      <v-container fluid fill-height class="pa-0 flex-grow-1">
        <v-row no-gutters class="fill-height flex-column justify-center">
          <v-col class="d-flex flex-column align-center">
            <div class="circular-image mb-4">
              <v-img
                src="/img/ctc.png"
                alt="Student"
                width="100%"
                height="100%"
                cover
              ></v-img>
            </div>
            <div class="text-wrapper mb-6">
              <div class="student-text font-weight-bold">เช็คชื่อนักศึกษา</div>
              <div class="check-app-text">วิทยาลัยเทคนิคชัยภูมิ</div>
            </div>
            <v-text-field
              v-model="email"
              label="อีเมล"
              variant="outlined"
              color="white"
              bg-color="transparent"
              class="custom-text-field rounded-textfield"
              rounded="lg"
              width="80%"
              max-width="500"
            >
              <template v-slot:prepend-inner>
                <v-icon icon="mdi-account" color="white"></v-icon>
              </template>
            </v-text-field>
            <v-text-field
              v-model="password"
              label="รหัสผ่าน"
              variant="outlined"
              color="white"
              bg-color="transparent"
              type="password"
              class="custom-text-field rounded-textfield"
              rounded="lg"
              width="80%"
              max-width="500"
            >
              <template v-slot:prepend-inner>
                <v-icon icon="mdi-lock" color="white"></v-icon>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </v-container>
      <v-card class="white-card custom-rounded-top" elevation="0" width="100%">
        <v-card-text class="custom-padding">
          <div class="text-center mb-4">
            <router-link to="/forgot_pass" class="forgot-password-link">ลืมรหัสผ่าน?</router-link>
          </div>
          <v-btn 
            color="#4c8479" 
            @click="Login" 
            rounded="pill" 
            class="login-btn mb-4"  
            block 
            size="x-large"
            max-width="500"
          >
            <span class="white--text" >เข้าสู่ระบบ</span>
          </v-btn>
          <div class="text-center mb-4">หรือ</div>
          <v-btn 
            color="#bed2d0" 
            rounded="pill" 
            class="create-account-btn mb-4" 
            block 
            size="x-large"
            @click="register"
          >
            <span class="create-account-text">ลงทะเบียน</span>
          </v-btn>
          <div class="d-flex justify-center">
            <v-avatar color="#1877F2" size="large" class="mx-2 clickable-avatar">
              <v-icon icon="mdi-facebook" color="white" size="large"></v-icon>
            </v-avatar>
            <v-avatar color="#DB4437" size="large" class="mx-2 clickable-avatar">
              <v-icon icon="mdi-google" color="white" size="large"></v-icon>
            </v-avatar>
          </div>
        </v-card-text>
      </v-card>
    </v-main>
  </v-app>
</template>

 
<script setup>
definePageMeta({
    layout: "empty",
});
import { ref } from 'vue'
import axios from "axios"
import { useRouter } from 'vue-router'

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

  localStorage.setItem("token",token)
  localStorage.setItem("fullname",fullname)
  localStorage.setItem("username",username)

  console.log(response.data)

  if (response.data.status === 1) {
    router.push('/student_list2');
  }
}

const register = () => {
  router.push('/account2')
}
</script>

<style scoped>
.login-background {
  background: linear-gradient(90deg, #4c8479, #2b5f56);
}
.circular-image {
  width: 240px;
  height: 240px;
  background: linear-gradient(180deg, #a9c7c3, #4c8479);
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  /* display: inline-flex; */
  align-items: center;
  justify-content: center;
  opacity: 1;
  
 
}
.text-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.student-text {
  font-size: 40px;
  color: #edb232;
  line-height: 1;
}
.check-app-text {
  font-size: 20px;
  color: white;
  margin-top: -5px;
}
.white-card {
  background-color: white !important;
}
.custom-rounded-top {
  border-top-left-radius: 40px !important;
  border-top-right-radius: 40px !important;
}
.forgot-password-link {
  color: #4c8479;
  text-decoration: none; 
}
.login-btn, .create-account-btn {
  text-transform: none;
  font-size: 1.2rem;
  border-radius: 50px !important;
}
.create-account-text {
  color: #2b524a;
}
.custom-padding {
  padding-left: 40px !important;
  padding-right: 40px !important;
}
.clickable-avatar {
  cursor: pointer;
  transition: opacity 0.3s;
}
.clickable-avatar:hover {
  opacity: 0.8;
}
:deep(.custom-text-field) {
  width: 80%;
  max-width: 400px;
}
:deep(.custom-text-field .v-field__outline) {
  --v-field-border-opacity: 1;
  color: white !important;
}
:deep(.custom-text-field .v-label) {
  color: white !important;
}
:deep(.custom-text-field input) {
  color: white !important;
}
:deep(.rounded-textfield .v-field__outline) {
  border-radius: 40px;
}
</style>