<template>
  <v-container fluid class="pa-0">
      <!-- Mobile-Friendly Toolbar -->
      <v-toolbar color="primary" flat>
          <v-toolbar-title class="text-subtitle-1 font-weight-bold text-white">
              รายชื่อนักศึกษา
          </v-toolbar-title>
          <v-spacer />
          
          <!-- Add Student Button -->
          <v-btn 
              icon 
              color="white" 
              @click="dialog = true"
          >
              <v-icon>mdi-plus</v-icon>
          </v-btn>
      </v-toolbar>

      <!-- Responsive Data Table -->
      <v-data-table 
          :headers="headers" 
          :items="desserts" 
          :items-per-page="5"
          mobile-breakpoint="xs"
          class="elevation-1"
      >
          <!-- Mobile View for Small Screens -->
          <template v-if="$vuetify.display.mobile" v-slot:item="{ item }">
              <v-list-item>
                  <v-list-item-content>
                      <v-list-item-title>{{ item.fullname }}</v-list-item-title>
                      <v-list-item-subtitle>
                          ID: {{ item.student_id }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle>
                          Email: {{ item.username }}
                      </v-list-item-subtitle>
                  </v-list-item-content>
                  
                  <template v-slot:append>
                      <div class="d-flex">
                          <v-btn 
                              icon 
                              size="small" 
                              class="mr-2" 
                              @click.stop="editItem(item)"
                          >
                              <v-icon size="small">mdi-pencil</v-icon>
                          </v-btn>
                          <v-btn 
                              icon 
                              size="small" 
                              color="error" 
                              @click.stop="deleteItem(item)"
                          >
                              <v-icon size="small">mdi-delete</v-icon>
                          </v-btn>
                      </div>
                  </template>
              </v-list-item>
          </template>

          <!-- Actions Column for Desktop -->
          <template v-else v-slot:item.actions="{ item }">
              <div class="d-flex justify-center">
                  <v-icon 
                      class="me-2" 
                      size="small" 
                      @click="editItem(item)"
                  >
                      mdi-pencil
                  </v-icon>
                  <v-icon 
                      size="small" 
                      @click="deleteItem(item)"
                  >
                      mdi-delete
                  </v-icon>
              </div>
          </template>

          <!-- No Data Slot -->
          <template v-slot:no-data>
              <v-alert 
                  type="info" 
                  class="ma-4"
              >
                  ไม่มีข้อมูลนักศึกษา
              </v-alert>
          </template>
      </v-data-table>

      <!-- Add/Edit Dialog -->
      <v-dialog 
          v-model="dialog" 
          :fullscreen="$vuetify.display.mobile"
          max-width="600"
      >
          <v-card>
              <v-toolbar 
                  color="primary" 
                  :title="formTitle"
                  dark
              >
                  <v-btn 
                      icon 
                      @click="dialog = false"
                  >
                      <v-icon>mdi-close</v-icon>
                  </v-btn>
              </v-toolbar>

              <v-card-text class="pa-4">
                  <v-form ref="form" v-model="valid" lazy-validation>
                      <v-row>
                          <v-col cols="12" sm="6" md="4">
                              <v-text-field 
                                  v-model="editedItem.id"
                                  label="ID" 
                                  :rules="[v => !!v || 'กรุณากรอก ID']"
                                  required
                              ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                              <v-text-field 
                                  v-model="editedItem.fullname"
                                  label="ชื่อ-นามสกุล" 
                                  :rules="[v => !!v || 'กรุณากรอกชื่อ']"
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
                  <v-btn 
                      color="grey-lighten-1" 
                      variant="text" 
                      @click="dialog = false"
                  >
                      ยกเลิก
                  </v-btn>
                  <v-btn 
                      color="primary" 
                      variant="elevated" 
                      @click="save"
                  >
                      บันทึก
                  </v-btn>
              </v-card-actions>
          </v-card>
      </v-dialog>

      <!-- Delete Confirmation Dialog -->
      <v-dialog 
          v-model="dialogDelete" 
          max-width="400"
      >
          <v-card>
              <v-card-title>ยืนยันการลบ</v-card-title>
              <v-card-text>
                  คุณต้องการลบข้อมูลนักศึกษานี้ใช่หรือไม่?
              </v-card-text>
              <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn 
                      color="grey-lighten-1" 
                      variant="text" 
                      @click="dialogDelete = false"
                  >
                      ยกเลิก
                  </v-btn>
                  <v-btn 
                      color="error" 
                      variant="elevated" 
                      @click="deleteItemConfirm"
                  >
                      ลบ
                  </v-btn>
              </v-card-actions>
          </v-card>
      </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  data: () => ({
      dialog: false,
      dialogDelete: false,
      valid: true,
      emailRules: [
          v => !!v || 'กรุณากรอกอีเมล',
          v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'อีเมลไม่ถูกต้อง'
      ],
      headers: [
          {
              title: 'ID',
              align: 'start',
              sortable: false,
              key: 'id',
          },
          { title: 'ชื่อ-นามสกุล', key: 'fullname' },
          { title: 'อีเมล', key: 'username' },
          { title: 'รหัสนักศึกษา', key: 'student_id' },
          { title: 'การดำเนินการ', key: 'actions', sortable: false },
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
          id: '',
          fullname: '',
          username: '',
          student_id: '',
      },
      defaultItem: {
          id: '',
          fullname: '',
          username: '',
          student_id: '',
      },
  }),

  computed: {
      formTitle() {
          return this.editedIndex === -1 ? 'เพิ่มสมาชิกใหม่' : 'แก้ไขสมาชิก'
      },
  },

  mounted() {
      this.initialize()
  },

  methods: {
      async initialize() {
          try {
              const response = await axios.get('http://localhost:7000/listStudent')
              this.desserts = response.data.datas
          } catch (error) {
              console.error('Error fetching students:', error)
          }
      },

      editItem(item) {
          this.editedIndex = this.desserts.indexOf(item)
          this.editedItem = Object.assign({}, item)
          this.dialog = true
      },

      deleteItem(item) {
          this.editedIndex = this.desserts.indexOf(item)
          this.editedItem = Object.assign({}, item)
          this.dialogDelete = true
      },

      deleteItemConfirm() {
          this.desserts.splice(this.editedIndex, 1)
          this.dialogDelete = false
      },

      save() {
          if (this.editedIndex > -1) {
              Object.assign(this.desserts[this.editedIndex], this.editedItem)
          } else {
              this.desserts.push(this.editedItem)
          }
          this.dialog = false
      },
  },
}
</script>