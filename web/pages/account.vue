<template>
  <v-app class="app-container">

    <v-main class="main-content mt-8">
      <v-container fill-height>
        <v-row justify="center" align="start">
          <v-col cols="12" sm="8" md="6">
            <v-form ref="form" v-model="valid">
              <v-text-field variant="underlined" v-model="FullName" :rules="FullNameRules" label="FullName" required
                class="custom-textfield">
                <template v-slot:prepend-inner>
                  <v-icon color="#2b524a">mdi-office-building</v-icon>
                </template>
              </v-text-field>

              <v-text-field variant="underlined" v-model="StudentId" :rules="StudentIdRules" label="Student ID" required
                class="custom-textfield">
                <template v-slot:prepend-inner>
                  <v-icon color="#2b524a">mdi-account</v-icon>
                </template>
              </v-text-field>

              <v-text-field variant="underlined" v-model="Email" :rules="emailRules" label="Email" required class="custom-textfield">
                <template v-slot:prepend-inner>
                  <v-icon color="#2b524a">mdi-email</v-icon>
                </template>
              </v-text-field>


              <v-text-field variant="underlined" v-model="password" :rules="passwordRules" label="Password"
                :type="showPassword ? 'text' : 'password'" required class="custom-textfield">
                <template v-slot:prepend-inner>
                  <v-icon color="#2b524a">mdi-lock</v-icon>
                </template>
                <template v-slot:append>
                  <v-icon @click="showPassword = !showPassword" color="#2b524a">
                    {{ showPassword ? 'mdi-eye' : 'mdi-eye-off' }}
                  </v-icon>
                </template>
              </v-text-field>

              <v-text-field variant="underlined" v-model="retypePassword" :rules="[...passwordRules, passwordMatch]" label="Retype Password"
                :type="showRetypePassword ? 'text' : 'password'" required class="custom-textfield">
                <template v-slot:prepend-inner>
                  <v-icon color="#2b524a">mdi-lock-check</v-icon>
                </template>
                <template v-slot:append>
                  <v-icon @click="showRetypePassword = !showRetypePassword" color="#2b524a">
                    {{ showRetypePassword ? 'mdi-eye' : 'mdi-eye-off' }}
                  </v-icon>
                </template>
              </v-text-field>

              <v-checkbox v-model="agreeTerms" :rules="[v => !!v || 'คุณจะต้องยอมรับที่จะดำเนินการต่อ!']"
                label="ฉันยอมรับข้อกำหนดและนโยบายของวิทยาลัย" required class="custom-checkbox"></v-checkbox>

              <v-btn block @click="signUp" class="gradient-btn mt-4" height="50">
                สร้างบัญชี
              </v-btn>

              <div class="text-center mt-4">
                มีบัญชีอยู่แล้ว?
                <router-link to="/login1" class="font-weight-bold white--text">
                  ลงชื่อเข้าใช้
                </router-link>
              </div>
            </v-form>
          </v-col>
        </v-row>

        <v-dialog v-model="dialog" width="auto">
          <v-card max-width="400" prepend-icon="mdi mdi-check-bold" :text="signupStatus"
            title="สมัครสมาชิกล้มเหลว">
            <template v-slot:actions>
              <v-btn class="ms-auto" text="Ok" @click="dialog = false"></v-btn>
            </template>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'
definePageMeta({
  layout: "empty",
});
export default {
  name: 'CorporateSignUp',
  data: () => ({
    signupStatus: '',
    dialog: false,
    valid: true,
    FullName: '',
    StudentId: '',
    Email: '',
    password: '',
    retypePassword: '',
    agreeTerms: false,
    showPassword: false,
    showRetypePassword: false,
    FullNameRules: [
      v => !!v || 'ชื่อจำเป็นต้องระบุ',
      v => v.length <= 100 || 'Company name must be less than 100 characters',
    ],
    StudentIdRules: [
      v => !!v || 'รหัสนักศึกษาจำเป็นต้องระบุ',
      v => v.length <= 50 || 'Name must be less than 50 characters',
    ],
    emailRules: [
      v => !!v || 'จำเป็นต้องระบุอีเมล',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
    passwordRules: [
      v => !!v || 'จำเป็นต้องมีรหัสผ่าน',
      v => v.length >= 8 || 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร',
      v => /[A-Z]/.test(v) || 'รหัสผ่านต้องประกอบด้วยตัวอักษรพิมพ์ใหญ่อย่างน้อยหนึ่งตัว',
      v => /[0-9]/.test(v) || 'รหัสผ่านจะต้องมีตัวเลขอย่างน้อยหนึ่งตัว',
    ],
  }),
  methods: {
    async signUp() {
      if (this.$refs.form.validate()) {
        try {
          const payload = {
            fullname: this.FullName,
            student_id: this.StudentId,
            username: this.Email,
            password: this.password,
          };

          // ส่งคำขอไปยัง API
          const response = await axios.post('http://localhost:7000/register', payload);

          if (response.data.status === 1) {
            this.signupStatus = 'สมัครสมาชิกสำเร็จ! ยินดีต้อนรับสู่ระบบ';
            this.dialog = true;

            // ล้างฟอร์มหลังสมัครสำเร็จ
            this.$refs.form.reset();
            // ตั้งค่าเวลาหน่วง 3 วินาที
            setTimeout(() => {
              this.$router.push('/login1'); // นำไปยังหน้า Login
            }, 3000);
          } else {
            this.signupStatus = response.data.message || 'เกิดข้อผิดพลาด กรุณาลองอีกครั้ง';
            this.dialog = true;
          }
        } catch (error) {
          // แสดงข้อผิดพลาดจากเซิร์ฟเวอร์
          this.signupStatus =
            error.response?.data?.message || 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้';
          this.dialog = true;
        }
      }
    },
    passwordMatch() {
      // ตรวจสอบว่ารหัสผ่านและการยืนยันรหัสผ่านตรงกัน
      return this.password === this.retypePassword || 'รหัสผ่านไม่ตรงกัน';
    },
  },

}
</script>

<style scoped>
/* Reuse styles from the original registration form */
/* Add any additional corporate-specific styles here */
</style>