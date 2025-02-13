<template>
  <v-container fluid class="pa-0">
    <!-- Toolbar -->
    <v-toolbar color="primary" flat>
      <v-toolbar-title class="text-subtitle-1 font-weight-bold text-white">
        รายชื่อนักศึกษา
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon color="white" @click="openDialogForNew">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-toolbar>

    <!-- Data Table -->
    <v-data-table
      :headers="headers"
      :items="students"
      :items-per-page="20"
      class="elevation-1"
    >
      <template v-slot:item="{ item }">
        <tr>
          <!-- <td>{{ item.id }}</td> -->
          <td>{{ item.fullname }}</td>
          <td>{{ item.username }}</td>
          <!-- <td>{{ item.student_id }}</td> -->
          <td>
            <div class="d-flex justify-center">
              <v-icon class="me-2" size="small" @click="editItem(item)">
                mdi-pencil
              </v-icon>
              <v-icon size="small" @click="deleteItem(item)">
                mdi-delete
              </v-icon>
            </div>
          </td>
        </tr>
      </template>
      <template v-slot:no-data>
        <v-alert type="info" class="ma-4">
          ไม่มีข้อมูลนักศึกษา
        </v-alert>
      </template>
    </v-data-table>

    <!-- Dialog สำหรับเพิ่ม/แก้ไขสมาชิก -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pa-4">
          <v-form ref="form" v-model="valid" @submit.prevent="save">
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="editedItem.fullname"
                  label="ชื่อ-นามสกุล"
                  :rules="[(v) => !!v || 'กรุณากรอกชื่อ']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="editedItem.username"
                  label="อีเมล"
                  :rules="emailRules"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="editedItem.student_id"
                  label="รหัสนักศึกษา"
                  :rules="[(v) => !!v || 'กรุณากรอกรหัสนักศึกษา']"
                  required
                ></v-text-field>
              </v-col>
              <!-- เพิ่ม File Input สำหรับอัปโหลดรูปโปรไฟล์ -->
              <v-col cols="12" sm="6" md="4">
                <v-file-input
                  v-model="selectedFile"
                  label="อัปโหลดรูปโปรไฟล์"
                  accept="image/*"
                  prepend-icon="mdi-camera"
                ></v-file-input>
              </v-col>
              <!-- ถ้าต้องการเพิ่ม password -->
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="editedItem.password"
                  label="รหัสผ่าน"
                  type="password"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey lighten-1" variant="text" @click="closeDialog">
            ยกเลิก
          </v-btn>
          <v-btn color="primary" variant="elevated" @click="save">
            บันทึก
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog ยืนยันการลบ -->
    <v-dialog v-model="dialogDelete" max-width="400">
      <v-card>
        <v-card-title class="headline">ยืนยันการลบ</v-card-title>
        <v-card-text>
          คุณต้องการลบข้อมูลนักศึกษานี้ใช่หรือไม่?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey lighten-1" variant="text" @click="dialogDelete = false">
            ยกเลิก
          </v-btn>
          <v-btn color="error" variant="elevated" @click="deleteItemConfirm">
            ลบ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Dialog สำหรับแจ้งข้อความเมื่อการทำงานสำเร็จ -->
    <v-dialog v-model="successDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">สำเร็จ</v-card-title>
        <v-card-text>{{ successMessage }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="successDialog = false">
            ตกลง
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

// state สำหรับ dialog และไฟล์อัปโหลด
const dialog = ref(false);
const dialogDelete = ref(false);
const successDialog = ref(false);
const successMessage = ref("");
const valid = ref(true);
const form = ref(null);

// ตัวแปรสำหรับเก็บข้อมูลนักศึกษา
const students = ref([]);
const headers = [
  // { title: "ID", align: "start", key: "id" },
  { title: "ชื่อ-นามสกุล", key: "fullname" },
  { title: "อีเมล", key: "username" },
  // { title: "รหัสนักศึกษา", key: "student_id" },
  { title: "การดำเนินการ", key: "actions", sortable: false },
];

const emailRules = [
  (v) => !!v || "กรุณากรอกอีเมล",
  (v) =>
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
    "อีเมลไม่ถูกต้อง",
];

const editedIndex = ref(-1);
const editedItem = ref({
  id: "",
  fullname: "",
  username: "",
  student_id: "",
  password: ""
});
const defaultItem = {
  id: "",
  fullname: "",
  username: "",
  student_id: "",
  password: ""
};

// ตัวแปรสำหรับเก็บไฟล์ที่เลือก (รูปโปรไฟล์)
const selectedFile = ref(null);

const formTitle = computed(() => {
  return editedIndex.value === -1 ? "เพิ่มสมาชิกใหม่" : "แก้ไขสมาชิก";
});

// โหลดข้อมูลนักศึกษา (ปรับเปลี่ยน URL ตาม API ของคุณ)
onMounted(async () => {
  await initialize();
});

const initialize = async () => {
  try {
    const response = await axios.get("http://localhost:7000/listStudent");
    // สมมุติว่า API ส่งกลับข้อมูลในรูปแบบ { datas: [...] }
    students.value = response.data.datas;
  } catch (error) {
    console.error("Error fetching students:", error);
  }
};

// เปิด dialog สำหรับเพิ่มสมาชิกใหม่
const openDialogForNew = () => {
  editedIndex.value = -1;
  editedItem.value = { ...defaultItem };
  // รีเซ็ตไฟล์ที่เลือก
  selectedFile.value = null;
  dialog.value = true;
};

// ฟังก์ชันแก้ไขสมาชิก
const editItem = (item) => {
  editedIndex.value = students.value.indexOf(item);
  editedItem.value = { ...item };
  // ในกรณีแก้ไข อาจให้ผู้ใช้เลือกอัปโหลดไฟล์ใหม่ได้
  selectedFile.value = null;
  dialog.value = true;
};

// ฟังก์ชันเปิด dialog ยืนยันการลบ
const deleteItem = (item) => {
  editedIndex.value = students.value.indexOf(item);
  editedItem.value = { ...item };
  dialogDelete.value = true;
};

// ฟังก์ชันยืนยันการลบ (เรียก API สำหรับลบข้อมูล)
const deleteItemConfirm = async () => {
  try {
    const response = await axios.post("http://localhost:7000/deleteMember", {
      student_id: editedItem.value.student_id,
    });
    if (response.data && response.data.message === "ลบสมาชิกสำเร็จ") {
      students.value.splice(editedIndex.value, 1);
      successMessage.value = "ลบข้อมูลนักศึกษาสำเร็จ!";
      successDialog.value = true;
    } else {
      console.error("Error deleting student:", response.data.message);
    }
  } catch (error) {
    console.error("Error deleting student:", error);
  } finally {
    dialogDelete.value = false;
  }
};

/* 
  ฟังก์ชัน save() จะส่งข้อมูลไปยัง API โดยใช้ FormData
  ในกรณีที่มีไฟล์ที่เลือก (selectedFile) จะถูกแนบไปด้วย
*/
const save = async () => {
  if (editedIndex.value > -1) {
    // กรณีแก้ไขสมาชิก
    try {
      const formData = new FormData();
      formData.append("student_id", editedItem.value.student_id);
      formData.append("fullname", editedItem.value.fullname);
      formData.append("username", editedItem.value.username);
      formData.append("password", editedItem.value.password);
      if (selectedFile.value) {
        formData.append("picture", selectedFile.value);
      }
      const response = await axios.post("http://localhost:7000/updateMember", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data && response.data.message === "อัปเดตข้อมูลสำเร็จ") {
        Object.assign(students.value[editedIndex.value], editedItem.value);
        successMessage.value = "แก้ไขข้อมูลนักศึกษาสำเร็จ!";
      } else {
        successMessage.value = "ไม่สามารถแก้ไขข้อมูลนักศึกษาได้!";
      }
    } catch (error) {
      console.error("Error updating member:", error);
      successMessage.value = "Error updating member!";
    }
  } else {
    // กรณีเพิ่มสมาชิกใหม่
    try {
      const formData = new FormData();
      formData.append("fullname", editedItem.value.fullname);
      formData.append("username", editedItem.value.username);
      formData.append("student_id", editedItem.value.student_id);
      formData.append("password", editedItem.value.password);
      if (selectedFile.value) {
        formData.append("picture", selectedFile.value);
      }
      const response = await axios.post("http://localhost:7000/insertMember", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data && response.data.message === "อัปโหลดไฟล์สำเร็จ") {
        // สมมุติว่า backend ส่งกลับข้อมูลสมาชิกใหม่ให้ (หรือคุณอาจกำหนด id ใหม่เอง)
        students.value.push({ ...editedItem.value, id: students.value.length + 1 });
        successMessage.value = "เพิ่มข้อมูลนักศึกษาสำเร็จ!";
      } else {
        successMessage.value = "ไม่สามารถเพิ่มข้อมูลนักศึกษาได้!";
      }
    } catch (error) {
      console.error("Error inserting member:", error);
      successMessage.value = "Error inserting member!";
    }
  }
  dialog.value = false;
  successDialog.value = true;
};

// ปิด dialog แก้ไข/เพิ่ม
const closeDialog = () => {
  dialog.value = false;
};
</script>

<style scoped>
.v-toolbar-title {
  font-size: 1.2rem;
}
.v-data-table {
  margin-top: 16px;
}
</style>
