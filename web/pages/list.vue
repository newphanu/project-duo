<template>
  <div>
    <h1>Student List</h1>
    <ul>
      <li v-for="st in student" :key="st.code">
        <span>{{ st.username }}</span>
        <span>{{ st.student_id }}</span>
        <span>{{ st.password }}</span>
      </li>
    </ul>
    <v-btn 
        @click="listData" 
        class="gradient-btn mt-4" 
        height="50">
      แสดงข้อมูล
    </v-btn>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      student: [
        { student_id: '001', username: 'username1' },
        { student_id: '002', username: 'username2' },
        { student_id: '003', username: 'username3' },
        { student_id: '003', username: 'username4' },
      ],
    }
  },
  methods: {
    async listData() {
      const response = await axios.get("http://localhost:7000/listStudent")
      const list = response.data
      console.log("list = ", list);
      this.student = list.datas
    }
  },
}
</script>