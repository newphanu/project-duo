<template>
    <v-app>


        <!-- Main Content -->
        <v-main class="bg-grey-lighten-4">
            <v-container class="px-4 py-6">
                <v-card class="mb-4 pa-4 elevation-2" color="white">
                    <div class="d-flex align-center">
                        <v-avatar color="primary" size="56" class="mr-4">
                            <v-icon>mdi-account</v-icon>
                        </v-avatar>
                        <div>
                            <div class="text-h6 font-weight-bold">{{ fullname }}</div>
                            <div class="text-subtitle-2 text-medium-emphasis">
                                E1 เทคโนโลยีสารสนเทศ
                            </div>
                            <div class="text-caption text-grey">
                                ครูที่ปรึกษา : ครูกฤษณา แนววิเศษ
                            </div>
                        </div>
                    </div>
                </v-card>

                <v-card class="elevation-2 rounded-lg" color="white">
                    <v-list lines="two">
                        <template v-for="(item, index) in activities" :key="index">
                            <v-list-item class="px-4 py-3"
                                :class="{ 'border-bottom': index !== activities.length - 1 }">
                                <template v-slot:prepend>
                                    <v-avatar size="48" class="mr-4">
                                        <v-img :src="`http://localhost:7000/uploads/profile/${item.picture}`"
                                            cover></v-img>
                                    </v-avatar>
                                </template>

                                <v-list-item-title class="font-weight-medium">
                                    {{ item.fullname }}
                                </v-list-item-title>
                                <v-list-item-subtitle class="text-grey-darken-1">
                                    {{ item.student_id }}
                                </v-list-item-subtitle>

                                <template v-slot:append>
                                    <v-select v-model="item.attendance" :items="attendanceOptions" item-value="value"
                                        item-title="text" variant="outlined" density="compact" class="attendance-select"
                                        :class="getAttendanceClass(item.attendance)"
                                        @change="updateAttendance(index, item.attendance)"></v-select>
                                </template>
                            </v-list-item>
                        </template>
                    </v-list>
                </v-card>

                <div class="text-center mt-6">
                    <v-btn @click="submitAttendance" color="primary" size="large" rounded="xl" width="80%"
                        max-width="400" class="elevation-4">
                        บันทึกข้อมูลการเช็คชื่อ
                    </v-btn>
                </div>
            </v-container>
        </v-main>


    </v-app>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const fullname = ref('')
const attendanceOptions = [
    { text: 'ขาด', value: 3 },
    { text: 'ลา', value: 4 },
    { text: 'มา', value: 1 },
    { text: 'สาย', value: 2 }
]

const getAttendanceClass = (attendance) => {
    switch (attendance) {
        case 1: return "attendance-green"
        case 2: return "attendance-yellow"
        case 3: return "attendance-red"
        case 4: return "attendance-blue"
        default: return ""
    }
}

const activities = ref([])

const listData = async () => {
    try {
        const response = await axios.get('http://localhost:7000/listStudent')
        const result = response.data
        activities.value = result.datas.map((item) => ({
            ...item,
            attendance: item.attendance ?? 1
        }))
    } catch (error) {
        console.error('Error fetching data:', error)
    }
}

const loadFullname = () => {
    const storedFullname = localStorage.getItem('fullname')
    fullname.value = storedFullname
}

onMounted(() => {
    loadFullname()
    listData()
})

const updateAttendance = async (index, value) => {
    activities.value[index] = {
        ...activities.value[index],
        attendance: value
    }
}

const submitAttendance = async () => {
    const payload = activities.value.map(activity => ({
        studentName: activity.username,
        student_id: activity.student_id,
        attendance: activity.attendance,
        time: activity.password
    }))

    try {
        const response = await axios.post("http://localhost:7000/check2", { payload })
        console.log('API Response:', response.data)
        alert('บันทึกข้อมูลการเข้าแถวสำเร็จ')
    } catch (error) {
        console.error('Error sending data to API:', error)
    }
}

const profile = () => {
    router.push('/student_profile_1')
}

const goList = () => {
    router.push('/student_list')
}

const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("fullname")
    localStorage.removeItem("username")
    router.push('/login')
}
</script>

<style scoped>
.border-bottom {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.attendance-select.attendance-green .v-field {
    background-color: #d4edda !important;
    color: #155724;
}

.attendance-select.attendance-yellow .v-field {
    background-color: #fff3cd !important;
    color: #856404;
}

.attendance-select.attendance-red .v-field {
    background-color: #f8d7da !important;
    color: #721c24;
}

.attendance-select.attendance-blue .v-field {
    background-color: #d1ecf1 !important;
    color: #0c5460;
}
</style>