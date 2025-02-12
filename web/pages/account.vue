<template>
  <v-app class="signup-app">
    <!-- พื้นหลังแบบ gradient -->
    <v-main class="signup-main">
      <v-container fill-height>
        <v-row justify="center" align="center">
          <!-- Card สำหรับฟอร์มสมัครสมาชิก -->
          <v-col cols="12" sm="8" md="6" lg="5">
            <v-card class="pa-6 elevation-12 signup-card">
              <v-card-title class="justify-center">
                <span class="headline">สมัครสมาชิก</span>
              </v-card-title>
              <v-card-text>
                <v-form ref="form" v-model="valid">
                  <v-text-field
                    variant="underlined"
                    v-model="FullName"
                    :rules="FullNameRules"
                    label="ชื่อ-นามสกุล"
                    required
                    class="custom-textfield"
                    hide-details="auto"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon color="primary">mdi-account-box</v-icon>
                    </template>
                  </v-text-field>

                  <v-text-field
                    variant="underlined"
                    v-model="StudentId"
                    :rules="StudentIdRules"
                    label="รหัสนักศึกษา"
                    required
                    class="custom-textfield"
                    hide-details="auto"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon color="primary">mdi-card-account-details</v-icon>
                    </template>
                  </v-text-field>

                  <!-- <v-text-field
                    variant="underlined"
                    v-model="Email"
                    :rules="emailRules"
                    label=""
                    required
                    class="custom-textfield"
                    hide-details="auto"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon color="primary">mdi-email</v-icon>
                    </template>
                  </v-text-field> -->

                  <v-select
                    variant="underlined"
                    v-model="selectedRoomGroup"
                    :items="roomGroups"
                    
                    label="กลุ่มห้อง"
                    required
                    class="custom-textfield"
                    hide-details="auto"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon color="primary">mdi mdi-google-classroom</v-icon>
                    </template>
                  </v-select>

                  <v-select
                    variant="underlined"
                    v-model="selectedGrade"
                    :items="grades"
                    
                    label="ระดับชั้น"
                    required
                    class="custom-textfield"
                    hide-details="auto"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon color="primary">mdi mdi-car-coolant-level</v-icon>
                    </template>
                  </v-select>

                  <v-text-field
                    variant="underlined"
                    v-model="password"
                    :rules="passwordRules"
                    label="รหัสผ่าน"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    class="custom-textfield"
                    hide-details="auto"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon color="primary">mdi-lock</v-icon>
                    </template>
                    <template v-slot:append>
                      <v-icon
                        @click="showPassword = !showPassword"
                        color="primary"
                        class="cursor-pointer"
                      >
                        {{ showPassword ? "mdi-eye" : "mdi-eye-off" }}
                      </v-icon>
                    </template>
                  </v-text-field>

                  <v-text-field
                    variant="underlined"
                    v-model="retypePassword"
                    :rules="[...passwordRules, passwordMatch]"
                    label="ยืนยัน รหัสผ่าน"
                    :type="showRetypePassword ? 'text' : 'password'"
                    required
                    class="custom-textfield"
                    hide-details="auto"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon color="primary">mdi-lock-check</v-icon>
                    </template>
                    <template v-slot:append>
                      <v-icon
                        @click="showRetypePassword = !showRetypePassword"
                        color="primary"
                        class="cursor-pointer"
                      >
                        {{ showRetypePassword ? "mdi-eye" : "mdi-eye-off" }}
                      </v-icon>
                    </template>
                  </v-text-field>

                  <v-checkbox
                    v-model="agreeTerms"
                    :rules="[(v) => !!v || 'คุณจะต้องยอมรับที่จะดำเนินการต่อ!']"
                    label="ฉันยอมรับข้อกำหนดและนโยบายของวิทยาลัย"
                    required
                    class="custom-checkbox"
                  ></v-checkbox>

                  <v-btn block @click="signUp" class="gradient-btn mt-6" height="50">
                    สร้างบัญชี
                  </v-btn>
                </v-form>
              </v-card-text>
              <v-card-actions class="justify-center">
                <span>มีบัญชีอยู่แล้ว?</span>
                <router-link to="/login1" class="ml-2 font-weight-bold">
                  ลงชื่อเข้าใช้
                </router-link>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Dialog แจ้งสถานะ -->
        <v-dialog v-model="dialog" max-width="400">
          <v-card>
            <v-card-title class="headline">{{ signupStatus }}</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="dialog = false">Ok</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  name: "CorporateSignUp",
  data: () => ({
    // ตัวแปรสำหรับเก็บค่าที่เลือก
    selectedRoomGroup: null,
    selectedGrade: null,
    // ตัวเลือกสำหรับกลุ่มห้อง (ปรับตามความต้องการ)
    roomGroups: ["Ag", "Aw", "Bg", "Bw", "Cg", "Cw", "D1", "D5", "E1", "E5"],
    // ตัวเลือกสำหรับระดับชั้น (ปรับตามความต้องการ)
    grades: ["ปวช 1", "ปวช 2", "ปวช 3", "ปวส 1" , "ปวส 2"],
    signupStatus: "",
    dialog: false,
    valid: true,
    FullName: "",
    StudentId: "",
    password: "",
    retypePassword: "",
    agreeTerms: false,
    showPassword: false,
    showRetypePassword: false,
    FullNameRules: [
      (v) => !!v || "ชื่อจำเป็นต้องระบุ",
      (v) => v.length <= 100 || "ชื่อจะต้องมีไม่เกิน 100 ตัวอักษร",
    ],
    StudentIdRules: [
      (v) => !!v || "รหัสนักศึกษาจำเป็นต้องระบุ",
      (v) => v.length <= 50 || "รหัสนักศึกษาจะต้องมีไม่เกิน 50 ตัวอักษร",
    ],
    emailRules: [
      (v) => !!v || "จำเป็นต้องระบุอีเมล",
      (v) => /.+@.+\..+/.test(v) || "รูปแบบอีเมลไม่ถูกต้อง",
    ],
    passwordRules: [
      (v) => !!v || "จำเป็นต้องมีรหัสผ่าน",
      (v) => v.length >= 8 || "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",
      (v) => /[A-Z]/.test(v) || "รหัสผ่านต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อยหนึ่งตัว",
      (v) => /[0-9]/.test(v) || "รหัสผ่านต้องมีตัวเลขอย่างน้อยหนึ่งตัว",
    ],
  }),
  methods: {
    async signUp() {
      if (this.$refs.form.validate()) {
        try {
          const payload = {
            fullname: this.FullName,
            student_id: this.StudentId,
            // username: this.Email,
            password: this.password,
            room: this.selectedRoomGroup,
            level: this.selectedGrade,
          };

          // ส่งคำขอไปยัง API สมัครสมาชิก
          const response = await axios.post("http://localhost:7000/register", payload);

          if (response.data.status === 1) {
            this.signupStatus = "สมัครสมาชิกสำเร็จ! ยินดีต้อนรับสู่ระบบ";
            this.dialog = true;

            // ล้างฟอร์มหลังสมัครสำเร็จ
            this.$refs.form.reset();
            // หน่วงเวลาแล้วเปลี่ยนหน้าไปยัง Login
            setTimeout(() => {
              this.$router.push("/login1");
            }, 3000);
          } else {
            this.signupStatus =
              response.data.message || "เกิดข้อผิดพลาด กรุณาลองอีกครั้ง";
            this.dialog = true;
          }
        } catch (error) {
          this.signupStatus =
            error.response?.data?.message || "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้";
          this.dialog = true;
        }
      }
    },
    passwordMatch() {
      return this.password === this.retypePassword || "รหัสผ่านไม่ตรงกัน";
    },
  },
};
</script>

<style scoped>
/* พื้นหลังและ container หลัก */
.signup-app {
  background: linear-gradient(135deg, #e0f7fa, #80deea);
}

.signup-main {
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.signup-card {
  border-radius: 12px;
}

/* ปรับแต่ง text-field */
.custom-textfield {
  margin-bottom: 16px;
}

/* ปรับแต่ง checkbox */
.custom-checkbox {
  margin: 12px 0;
}

/* ปรับแต่งปุ่มให้มี gradient และสไตล์โมเดิร์น */
.gradient-btn {
  background: linear-gradient(to right, #2b524a, #4caf50);
  color: white;
  font-weight: bold;
  text-transform: uppercase;
}

/* ตัวช่วยปรับแต่งข้อความ */
.headline {
  font-weight: bold;
  color: #2b524a;
}

/* ปรับแต่งลิงก์ */
.router-link-active,
a {
  color: #4caf50;
  text-decoration: none;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
