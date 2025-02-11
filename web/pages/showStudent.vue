<template>
  <v-container fluid class="pa-0">
    <v-toolbar color="primary" flat>
      <v-toolbar-title class="text-subtitle-1 font-weight-bold text-white">
        รายชื่อนักศึกษา
      </v-toolbar-title>
      <v-spacer />

      <v-btn icon color="white" @click="dialog = true">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="students"
      :items-per-page="10"
      class="elevation-1"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.id }}</td>
          <td>{{ item.fullname }}</td>
          <td>{{ item.username }}</td>
          <td>{{ item.student_id }}</td>
          <td>
            <div class="d-flex justify-center">
              <v-icon class="me-2" size="small" @click="editItem(item)">
                mdi-pencil
              </v-icon>
              <v-icon size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
            </div>
          </td>
        </tr>
      </template>

      <template v-slot:no-data>
        <v-alert type="info" class="ma-4"> ไม่มีข้อมูลนักศึกษา </v-alert>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pa-4">
          <v-form ref="form" v-model="valid" @submit.prevent="save">
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="editedItem.id"
                  label="ID"
                  :rules="[(v) => !!v || 'กรุณากรอก ID']"
                  required
                ></v-text-field>
              </v-col>
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
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-lighten-1" variant="text" @click="dialog = false">
            ยกเลิก
          </v-btn>
          <v-btn color="primary" variant="elevated" @click="save"> บันทึก </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" max-width="400">
      <v-card>
        <v-card-title>ยืนยันการลบ</v-card-title>
        <v-card-text> คุณต้องการลบข้อมูลนักศึกษานี้ใช่หรือไม่? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-lighten-1" variant="text" @click="dialogDelete = false">
            ยกเลิก
          </v-btn>
          <v-btn color="error" variant="elevated" @click="deleteItemConfirm"> ลบ </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const dialog = ref(false);
const dialogDelete = ref(false);
const valid = ref(true);
const form = ref(null);
const students = ref([]);

const headers = [
  { title: "ID", align: "start", key: "id" },
  { title: "ชื่อ-นามสกุล", key: "fullname" },
  { title: "อีเมล", key: "username" },
  { title: "รหัสนักศึกษา", key: "student_id" },
  { title: "การดำเนินการ", key: "actions", sortable: false },
];

const emailRules = [
  (v) => !!v || "กรุณากรอกอีเมล",
  (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || "อีเมลไม่ถูกต้อง",
];

const editedIndex = ref(-1);
const editedItem = ref({
  id: "",
  fullname: "",
  username: "",
  student_id: "",
});

const defaultItem = {
  id: "",
  fullname: "",
  username: "",
  student_id: "",
};

const formTitle = computed(() => {
  return editedIndex.value === -1 ? "เพิ่มสมาชิกใหม่" : "แก้ไขสมาชิก";
});

onMounted(async () => {
  await initialize();
});

async function initialize() {
  try {
    const { data } = await useFetch("http://localhost:7000/listStudent");
    students.value = data.value.datas;
  } catch (error) {
    console.error("Error fetching students:", error);
  }
}

function editItem(item) {
  editedIndex.value = students.value.indexOf(item);
  editedItem.value = { ...item };
  dialog.value = true;
}

function deleteItem(item) {
  editedIndex.value = students.value.indexOf(item);
  editedItem.value = { ...item };
  dialogDelete.value = true;
}

function deleteItemConfirm() {
  students.value.splice(editedIndex.value, 1);
  dialogDelete.value = false;
}

function save() {
  if (editedIndex.value > -1) {
    Object.assign(students.value[editedIndex.value], editedItem.value);
  } else {
    students.value.push(editedItem.value);
  }
  dialog.value = false;
}
</script>
