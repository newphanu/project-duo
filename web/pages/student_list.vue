<template>
    <v-app>
        <!-- App Bar -->
        <v-app-bar color="teal-darken-2" elevation="2">
            <template v-slot:prepend>
                <div class="rounded-circle d-flex justify-center align-center"
                    style="background-color: white; width: 40px; height: 40px;" @click="goBack">
                    <v-icon color="teal-darken-2" size="24">mdi-arrow-left</v-icon>
                </div>
            </template>
        <v-app-bar-title>Student List</v-app-bar-title>
        <v-spacer></v-spacer>
        
        <v-dialog
            v-model="dialog"
            max-width="600"
        >
            <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                class="text-none font-weight-regular"
                prepend-icon="mdi-account"
                text="เพิ่ม"
                variant="tonal"
                v-bind="activatorProps"
                ></v-btn>
            </template>

            <v-card
                prepend-icon="mdi-account"
                title="เพิ่มสมาชิก"
            >
                <v-card-text>
                <v-row dense>
                    <v-col
                    cols="12"
                    md="4"
                    sm="6"
                    >
                    <v-text-field
                        label="รหัสนักศึกษา"
                        v-model="studentid"
                        required
                    ></v-text-field>
                    </v-col>

                    <v-col
                    cols="12"
                    md="4"
                    sm="6"
                    >
                    <v-text-field
                        label="ชื่อ - นามสกุล"
                        v-model="name"
                        required
                    ></v-text-field>
                    </v-col>

                    <v-col
                    cols="12"
                    md="4"
                    sm="6"
                    >
                    <v-text-field
                        label="อีเมล"
                        v-model="username"
                        required
                    ></v-text-field>
                    </v-col>

                    <v-col
                    cols="12"
                    md="4"
                    sm="6"
                    >
                    <v-text-field
                        label="รหัสผ่าน"
                        type="password"
                        v-model="password"
                        required
                    ></v-text-field>
                    </v-col>

                    <v-col
                    cols="12"
                    sm="6"
                    >
                    <v-file-input 
                        v-model="singleFile" 
                        label="รูปโปรไฟล์" 
                        accept="image/*" 
                        @change="previewSingleFile"></v-file-input>
                    </v-col>
                    <!-- <v-img 
                        v-if="singleFilePreview" 
                        :src="singleFilePreview" 
                        max-width="200" 
                        max-height="200"
                        class="my-4"
                    ></v-img> -->
                </v-row>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                    text="Close"
                    variant="plain"
                    @click="dialog = false"
                ></v-btn>

                <v-btn
                    color="primary"
                    text="Save"
                    variant="tonal"
                    @click="handleSave"
                ></v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        </v-app-bar>

        <!-- Main Content -->
        <v-main class="bg-grey-lighten-3"> <!-- เพิ่มสีพื้นหลังหลัก -->
            <v-container class="px-2">
                <div class="text-subtitle-2 text-grey-darken-1 mb-4">
                    {{ fullname }}<br>
                    E1 เทคโนโลยีสารสนเทศ<br>
                    ครูที่ปรึกษา : ครูกฤษณุา แนววิเศษ
                </div>

                <v-list bg-color="#f5f5f5" class="custom-list"> <!-- กำหนดสีพื้นหลังเริ่มต้น -->
                    <v-list-item
                        v-for="(item, index) in activities"
                        :key="index"
                        :class="{ 'border-b': index !== activities.length - 1 }"
                        class="activity-item"
                    >
                    
                    <template v-slot:prepend>
                        <v-avatar size="48" color="info" class="mr-3">
                        <v-img :src="`http://localhost:7000/uploads/profile/${item.picture}`"></v-img>
                        </v-avatar>
                    </template>

                    <div class="d-flex align-center">
                        <div class="flex-column">
                            <v-list-item-title class="font-weight-medium">{{ item.fullname }}</v-list-item-title>
                            <v-list-item-subtitle class="text-grey-darken-1">{{ item.username }}</v-list-item-subtitle>
                        </div>
                        <v-spacer></v-spacer>
                        
                        <div class="d-flex align-center justify-center">
                            <v-dialog v-model="item.dialog" max-width="600">
                                <template v-slot:activator="{ props }">
                                    <v-icon icon="mdi-pencil" variant="text" v-bind="props"></v-icon>
                                </template>

                                <v-card prepend-icon="mdi-account" title="แก้ไข">
                                    <v-card-text>
                                        <v-row dense>
                                            <v-col cols="12" md="4" sm="6">
                                                <v-text-field disabled="" label="รหัสนักศึกษา" v-model="item.student_id" required></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="4" sm="6">
                                                <v-text-field label="ชื่อ - นามสกุล" v-model="item.fullname" required></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="4" sm="6">
                                                <v-text-field label="อีเมล" v-model="item.username" required></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="4" sm="6">
                                                <v-text-field label="รหัสผ่าน" type="password" v-model="item.password" required></v-text-field>
                                            </v-col>
                                            <!-- <v-col cols="12" sm="6">
                                                <v-file-input v-model="item.singleFile" label="รูปโปรไฟล์" accept="image/*"></v-file-input>
                                            </v-col> -->
                                        </v-row>
                                    </v-card-text>

                                    <v-divider></v-divider>

                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn text="Close" variant="plain" @click="closeEdit"></v-btn>
                                        <v-btn color="primary" text="Edit" variant="tonal" @click="handleEdit(item)"></v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>

                            <v-icon
                                icon="mdi-delete"
                                variant="text"
                                @click="handleDelete(item)"
                            ></v-icon>
                        </div>
                    </div>

                    </v-list-item>
                </v-list>
            </v-container>
        </v-main>

        <!-- Bottom Navigation -->
        <v-bottom-navigation grow color="teal-darken-2">
            <v-btn value="home" @click="goCheck">
                <v-icon>mdi-home</v-icon>
                Home
            </v-btn>
            <v-btn value="chat">
                <v-icon>mdi-chat</v-icon>
                Chat
            </v-btn>
            <v-btn value="mail">
                <v-icon>mdi-email</v-icon>
                Mail
            </v-btn>
            <v-btn value="profile" @click="profile">
                <v-icon>mdi-account</v-icon>
                Profile
            </v-btn>

            
        </v-bottom-navigation>
    </v-app>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const dialog = ref(false);
const studentid = ref('');
const username = ref('');
const password = ref('');
const fullname = ref('');
const name = ref('');
const singleFile = ref(null);
const singleFilePreview = ref(null);

const activities = ref([]); // นี่คือที่เก็บข้อมูลนักเรียน


// ฟังก์ชันดึงข้อมูลนักเรียน
const listData = async () => {
    try {
        const response = await axios.get('http://localhost:7000/listStudent');
        activities.value = response.data.datas;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const loadFullname = () => {
    const storedFullname = localStorage.getItem('fullname')
    fullname.value = storedFullname
}

// โหลดข้อมูลเมื่อคอมโพเนนต์โหลดเสร็จ
onMounted( async () => {
    loadFullname();
    const token = localStorage.getItem('token');
    console.log('check token from api = ',token)
    
    try {
    const response = await axios.get('http://localhost:7000/checkToken', {
        headers: {
            Authorization: `Bearer ${token}`
        },
    })
    console.log('data = ',response.data)
    } catch(error) {
        console.error('Error:', error.response.data);
        alert('กรุณา login ก่อน');
        router.push('/login');
    }

    listData();
});

const closeEdit = () => {
    item.dialog.value = false
}

const handleEdit = async (item) => {
    const confirmEdit = confirm(`คุณต้องการแก้ไข ${item.fullname} ใช่หรือไม่?`);
    if (confirmEdit) {
        try {
            await axios.post('http://localhost:7000/updateMember', {student_id:  item.student_id, fullname: item.fullname, username: item.username, password: item.password});
            alert('แก้ไขข้อมูลสำเร็จ')
            listData()
        } catch (error) {
            console.error('Error Editing member:', error);
        }
        
    }
}

// ฟังก์ชันการลบ
const handleDelete = async (item) => {
    const confirmDelete = confirm(`คุณต้องการลบ ${item.fullname} ใช่หรือไม่?`);
    if (confirmDelete) {
        try {
            await axios.post('http://localhost:7000/deleteMember', {student_id: item.student_id});
            alert('ลบข้อมูลสำเร็จ');
            listData(); // โหลดข้อมูลใหม่
        } catch (error) {
            console.error('Error deleting member:', error);
        }
    }
};

// ฟังก์ชันการบันทึกข้อมูล (สำหรับการเพิ่มนักเรียนใหม่)
const handleSave = async () => {
  dialog.value = false;  // ปิด dialog
  uploadSingleFile();    // เรียกฟังก์ชันอัปโหลดไฟล์
}

// ฟังก์ชันการอัปโหลดไฟล์ (สำหรับนักเรียนใหม่)
const uploadSingleFile = async () => {
    if (singleFile.value) {
        const formData = new FormData();
        formData.append('picture', singleFile.value);
        formData.append('username', username.value);
        formData.append('student_id', studentid.value);
        formData.append('password', password.value);
        formData.append('fullname', name.value);

        try {
            const response = await axios.post('http://localhost:7000/insertMember', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.message === "อัปโหลดไฟล์สำเร็จ") {
                alert('อัปโหลดไฟล์สำเร็จ');
                listData();
            }

        } catch (error) {
            console.error('Upload file error:', error);
        }
    }
};

// ฟังก์ชันแสดงตัวอย่างไฟล์ที่เลือก
const previewSingleFile = () => {
    if (singleFile.value) {
        singleFilePreview.value = URL.createObjectURL(singleFile.value);
    } else {
        singleFilePreview.value = null;
    }
}

const goBack = () => {
    router.push('/student_list2')
}

const goCheck = () => {
    router.push('/student_list2')
}

const profile = () => {
    router.push('/student_profile_1')
}
</script>

<style scoped>
.border-b {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

/* กำหนด style สำหรับ list */
.custom-list {
    border-radius: 4px;
    overflow: hidden;
}

/* กำหนด style สำหรับ list item และ hover effect */
.activity-item {
    transition: background-color 0.2s ease;
}

.activity-item:hover {
    background-color: #ffffff !important;
    cursor: pointer;
}
</style>