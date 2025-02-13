<template>
    <v-app>
        <v-main class="bg-grey-lighten-4">
            <v-container class="px-4 py-6">
                <v-card class="mb-4 pa-4 elevation-2" color="white">
                    <div class="d-flex align-center">
                        <v-avatar size="56" class="mr-4">
                            <v-img :src="`http://localhost:7000/uploads/profile/${picture}`"></v-img>
                        </v-avatar>
                        <div>
                            <div class="text-h6 font-weight-bold">{{ fullname }}</div>
                            <div class="text-subtitle-2 text-medium-emphasis">
                                E5 เทคโนโลยีสารสนเทศ
                            </div>
                        </div>
                    </div>
                </v-card>

                <v-card class="elevation-2 rounded-lg" color="white">
                    <v-list lines="two">
                        <template v-for="(item, index) in processedActivities" :key="index">
                            <v-list-item class="px-4 py-3"
                                :class="{ 'border-bottom': index !== processedActivities.length - 1 }">
                                <template v-slot:prepend>
                                    <v-avatar size="48" class="mr-4">
                                        <v-img :src="`http://localhost:7000/uploads/profile/${item.picture}`"
                                            cover></v-img>
                                    </v-avatar>
                                </template>

                                <v-list-item-title class="font-weight-medium d-flex justify-space-between">
                                    <span>{{ item.fullname }}</span>
                                    <span :class="getAttendanceStatusClass(item.attendancePercentage)">
                                        {{ item.attendancePercentage.toFixed(1) }}% 
                                        ({{ item.attendancePercentage >= 60 ? 'ผ่าน' : 'ไม่ผ่าน' }})
                                    </span>
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    <div class="d-flex justify-space-between text-grey-darken-1">
                                        <span>
                                            <!-- {{ item.student_id }}<br> -->
                                            มา: {{ item.statusCounts[1] || 0 }}<br>
                                            สาย: {{ item.statusCounts[2] || 0 }}<br>
                                            ขาด: {{ item.statusCounts[3] || 0 }}<br>
                                            ลา: {{ item.statusCounts[4] || 0 }}<br>
                                        </span>
                                    </div>
                                </v-list-item-subtitle>
                            </v-list-item>
                        </template>
                    </v-list>
                </v-card>
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup>
definePageMeta({
  layout: "layoutstudent",
});
import axios from 'axios'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const fullname = ref('')
const activities = ref([])
const picture = ref('')

const processedActivities = computed(() => {
    return activities.value.map(item => {
        const totalSessions = Object.values(item.statusCounts).reduce((sum, count) => sum + (count || 0), 0)
        
        // คำนวนผลการมาเข้าแถว
        const present = (item.statusCounts[1] || 0) // มา 1
        const late = (item.statusCounts[2] || 0) * 0.5 // สาย 0.5
        const leave = (item.statusCounts[4] || 0) // ลา 1
        
        // คำนวนเปอร์เซนต์
        const effectiveAttendance = present + late + leave
        const attendancePercentage = totalSessions > 0 
            ? (effectiveAttendance / totalSessions) * 100 
            : 0

        return {
            ...item,
            attendancePercentage
        }
    })
})

const getAttendanceStatusClass = (percentage) => {
    return percentage >= 60 ? 'text-success' : 'text-error'
}

const listData = async () => {
    try {
        const response = await axios.get('http://localhost:7000/attendance')
        if (response.data.success) {
            activities.value = response.data.data
            picture.value = localStorage.getItem('picture')
        } else {
            console.error('Error in response:', response.data.message)
        }
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
</script>

<style scoped>
.border-bottom {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.text-success {
    color: #2e7d32 !important;
    font-weight: bold;
}

.text-error {
    color: #d32f2f !important;
    font-weight: bold;
}
</style>