<template>
  <v-app>
    <v-main class="login-background">
      <v-container fluid fill-height class="mt-10">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="10" md="6" lg="4">
            <v-card class="login-card elevation-24 rounded-xl" color="white">
              <v-card-title class="text-center pt-8 pb-4">
                <div class="logo-container mb-4">
                  <v-img
                    src="/img/ctc.png"
                    max-height="120"
                    max-width="120"
                    contain
                    class="mx-auto"
                  ></v-img>
                </div>
                <div class="text-h5 font-weight-bold primary-text">
                  ระบบเช็คชื่อนักศึกษา
                </div>
                <div class="text-subtitle-1 text-medium-emphasis mt-2">
                  วิทยาลัยเทคนิคชัยภูมิ
                </div>
              </v-card-title>

              <v-card-text class="px-8 pb-6">
                <!-- เมื่อ submit form จะเรียกใช้ฟังก์ชัน Login -->
                <v-form @submit.prevent="Login">
                  <v-text-field
                    v-model="email"
                    label="อีเมล"
                    variant="outlined"
                    prepend-inner-icon="mdi-account-circle"
                    class="mb-4"
                    color="primary"
                    rounded="xl"
                  ></v-text-field>

                  <v-text-field
                    v-model="password"
                    label="รหัสผ่าน"
                    type="password"
                    variant="outlined"
                    prepend-inner-icon="mdi-lock"
                    color="primary"
                    rounded="xl"
                  ></v-text-field>

                  <v-btn
                    type="submit"
                    color="primary"
                    size="x-large"
                    block
                    rounded="xl"
                    class="login-button"
                    elevation="6"
                  >
                    เข้าสู่ระบบ
                  </v-btn>
                </v-form>

                <div class="text-center mt-6">
                  <v-divider class="my-4"></v-divider>
                  <!-- ลิงก์สมัครสมาชิก -->
                  <router-link to="/account">
                    <div class="text-subtitle-2 text-medium-emphasis mb-4">
                      สมัครสมาชิก
                    </div>
                  </router-link>
                  <div class="d-flex justify-center">
                    <!-- Social Login: เมื่อคลิกจะเรียกฟังก์ชัน socialLogin พร้อมส่งชื่อแพลตฟอร์ม -->
                    <v-btn
                      icon
                      variant="outlined"
                      color="blue-darken-1"
                      class="mx-2"
                      @click="socialLogin('Facebook')"
                    >
                      <v-icon>mdi-facebook</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      variant="outlined"
                      color="red-darken-1"
                      class="mx-2"
                      @click="socialLogin('Google')"
                    >
                      <v-icon>mdi-google</v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Dialog สำหรับแสดงข้อความจากทุกฟังก์ชันหรือปุ่ม -->
      <v-dialog v-model="dialogVisible" max-width="400">
        <v-card>
          <v-card-title class="headline">{{ dialogMessage }}</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialogVisible = false">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script setup>
definePageMeta({
  layout: "empty",
});
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

// ประกาศ reactive variables
const router = useRouter();
const email = ref("");
const password = ref("");

// สำหรับ Dialog
const dialogVisible = ref(false);
const dialogMessage = ref("");

// ฟังก์ชันสำหรับเข้าสู่ระบบ
const Login = async () => {
  console.log("email =", email.value);
  const forms = {
    username: email.value,
    password: password.value,
  };

  try {
    const response = await axios.post("http://localhost:7000/login", forms);
    // สมมติว่า response.data มีข้อมูล: { token, fullname, username, status, message }
    if (response.data.status === 1) {
      // เก็บข้อมูลใน localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("fullname", response.data.fullname);
      localStorage.setItem("username", response.data.username);

      // แสดง Dialog ยืนยันการเข้าสู่ระบบสำเร็จ
      dialogMessage.value = "เข้าสู่ระบบสำเร็จ! กำลังนำท่านไปหน้าแสดงข้อมูล...";
      dialogVisible.value = true;

      // หลังจากแสดง Dialog ชั่วคราวแล้วเปลี่ยนหน้า
      setTimeout(() => {
        router.push("/student_list2");
      }, 2000);
    } else {
      dialogMessage.value =
        response.data.message || "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
      dialogVisible.value = true;
    }
  } catch (error) {
    dialogMessage.value =
      error.response?.data?.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";
    dialogVisible.value = true;
  }
};

// ฟังก์ชันสำหรับ Social Login (ยังไม่ได้เปิดใช้งานจริง)
const socialLogin = (platform) => {
  dialogMessage.value = `${platform} login ยังไม่เปิดใช้งาน`;
  dialogVisible.value = true;
};
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
