<template>
  <v-app>
    <v-main class="profile-background">
      <v-container fluid class="fill-height">
        <v-row justify="center" align="center">
          <v-col cols="12" sm="10" md="8" lg="6">
            <div class="profile-header text-center mb-6">
              <v-avatar size="150" class="md-4">
                <v-img :src="selectedImage" alt="Profile Picture" cover>
                  <template v-slot:placeholder>
                    <v-layout fill-height align-center justify-center ma-0>
                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </v-layout>
                  </template>
                </v-img>

                <v-dialog v-model="isDialogOpen" max-width="500">
                  <template v-slot:activator="{ props: activatorProps }">
                    <v-btn 
                      v-bind="activatorProps"
                      icon smal color="grey-lighten-2" size="35" style="position: absolute;
                  bottom: -0px; /* ปรับขยับขึ้น */
                  right: 10px; /* ขยับซ้ายเล็กน้อย */
                  z-index: 10; /* ให้ปุ่มกล้องอยู่ด้านหน้าของ avatar */
                  "> <v-icon size="20">mdi mdi-camera</v-icon>
                  </v-btn>
                  </template>

                  <v-card title="แก้ไขรูปโปรไฟล์">
                    <v-container>
                      <v-form @submit.prevent="uploadSingleFile">
                        <v-file-input 
                          v-model="singleFile" 
                          label="อัพโหลด" 
                          accept="image/*" 
                          required
                          @change="previewSingleFile"
                        ></v-file-input>
                      </v-form>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" text @click="isDialogOpen = false">ปิด</v-btn>
                        <v-btn color="primary" text @click="save">บันทึก</v-btn>
                      </v-card-actions>
                    </v-container>
                  </v-card>
                </v-dialog>
              </v-avatar>

              <div class="profile-name">
                <div class="text-h5 font-weight-bold mb-1">Name: {{ fullname }}</div>
                <div class="text-subtitle-1 text-medium-emphasis">UserName: {{ username }}</div>
              </div>
            </div>

            <v-card class="elevation-6 rounded-xl">
              <v-list>
                <v-list-item title="General Settings" class="text-subtitle-1 font-weight-bold mb-2" disabled></v-list-item>
                
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-theme-light-dark</v-icon>
                  </template>
                  <v-list-item-title>Mode</v-list-item-title>
                  <template v-slot:append>
                    <v-switch color="primary" inset></v-switch>
                  </template>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-key</v-icon>
                  </template>
                  <v-list-item-title>Change Password</v-list-item-title>
                  <template v-slot:append>
                    <v-icon>mdi-chevron-right</v-icon>
                  </template>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-translate</v-icon>
                  </template>
                  <v-list-item-title>Language</v-list-item-title>
                  <template v-slot:append>
                    <v-icon>mdi-chevron-right</v-icon>
                  </template>
                </v-list-item>
              </v-list>

              <v-divider class="my-2"></v-divider>

              <v-list>
                <v-list-item title="Information" class="text-subtitle-1 font-weight-bold mb-2" disabled></v-list-item>
                
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-information</v-icon>
                  </template>
                  <v-list-item-title>About App</v-list-item-title>
                  <template v-slot:append>
                    <v-icon>mdi-chevron-right</v-icon>
                  </template>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-file-document</v-icon>
                  </template>
                  <v-list-item-title>Terms & Conditions</v-list-item-title>
                  <template v-slot:append>
                    <v-icon>mdi-chevron-right</v-icon>
                  </template>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-shield-check</v-icon>
                  </template>
                  <v-list-item-title>Privacy Policy</v-list-item-title>
                  <template v-slot:append>
                    <v-icon>mdi-chevron-right</v-icon>
                  </template>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-share-variant</v-icon>
                  </template>
                  <v-list-item-title>Share This App</v-list-item-title>
                  <template v-slot:append>
                    <v-icon>mdi-chevron-right</v-icon>
                  </template>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import defaultImage from '@/assets/images/profile1.png'
import { useRouter } from 'vue-router'

const router = useRouter()

const isDialogOpen = ref(false)
const fullname = ref('')
const username = ref('')
const singleFile = ref(null)
const singleFilePreview = ref(null)
const selectedImage = ref('')
const fileInput = ref(null)

const save = () => {
  uploadSingleFile()
  isDialogOpen.value = false
}

const uploadSingleFile = async () => {
  if (singleFile.value) {
    const formData = new FormData();
    formData.append('picture', singleFile.value);
    formData.append('username', username.value);

    try {
      const response = await axios.post('http://localhost:7000/upload-single', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response:', response.data);
      alert(response.data.message);

      if (response.data.status === 1) {
        selectedImage.value = `http://localhost:7000/uploads/profile/${response.data.file}`;
      }
    } catch (error) {
      console.error('Upload single file error:', error);
      alert('เกิดข้อผิดพลาดในการอัปโหลด');
    }
  }
};

const loadUsername = () => {
  const storedUsername = localStorage.getItem('username')
  username.value = storedUsername
}

const checkUser = async () => {
  try {
    const response = await axios.post('http://localhost:7000/checkUser', {
      username: username.value,
    });

    console.log(response.data)
    if (response.data.status === 1) {
      const user = response.data.user;
      fullname.value = user.fullname;
      username.value = user.username;
      selectedImage.value = user.picture
        ? `http://localhost:7000/uploads/profile/${user.picture}`
        : defaultImage;
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    alert('เกิดข้อผิดพลาดในการเรียกข้อมูล');
  }
};

const previewSingleFile = (event) => {
  singleFilePreview.value = URL.createObjectURL(event)
}

onMounted(() => {
  loadUsername();
  checkUser();
});

const onFileSelected = (event) => {
  const file = event.target.files[0];
  if (file) {
    singleFile.value = file;
    singleFilePreview.value = URL.createObjectURL(file);
  }
};

const goBack = () => {
  router.push('/student_list2')
}
</script>

<style scoped>
.profile-background {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.profile-header {
  margin-bottom: 20px;
}

.profile-avatar {
  border: 4px solid white;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.avatar-edit-btn {
  position: absolute;
  right: -5px;
  bottom: 0;
  background-color: #0158c8 !important;
  border: 2px solid white !important;
  cursor: pointer;
  z-index: 1;
}

.profile-name {
  color: #2c3e50;
}

.v-list-item {
  transition: background-color 0.3s ease;
}

.v-list-item:hover {
  background-color: rgba(0,0,0,0.05);
}
</style>