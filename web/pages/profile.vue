<template>
    <v-container>
        <v-form @submit.prevent="submitForm">
            <v-text-field v-model="name" label="Name" required></v-text-field>
            <v-text-field v-model="email" label="Email" required></v-text-field>

            <!-- Avatar Upload -->
            <v-file-input label="Upload Avatars" accept="image/*" prepend-icon="mdi-camera"
                multiple @change="onFileChange"></v-file-input>

            <v-btn color="primary" type="submit">Submit</v-btn>
        </v-form>

        <!-- Preview Avatars -->
        <v-row>
            <v-col v-for="(avatar, index) in avatars" :key="index" cols="auto">
                <v-img :src="avatar" max-width="200"></v-img>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'

export default {
    setup() {
        const name = ref("")
        const email = ref("")
        const avatarFiles = ref([])  // Store multiple files
        const avatars = ref([])  // Store multiple image previews

        const onFileChange = (event) => {
            const files = event.target.files
            avatarFiles.value = []  // Reset files
            avatars.value = []  // Reset previews

            // Loop through selected files and generate previews
            Array.from(files).forEach((file) => {
                const reader = new FileReader()
                reader.onload = (e) => {
                    avatars.value.push(e.target.result)
                }
                reader.readAsDataURL(file)
                avatarFiles.value.push(file)
            })

            console.log('avatarFiles.value =', avatarFiles.value)
            console.log('avatars.value =', avatars.value)
        }

        const submitForm = async () => {
            console.log('submit')
            const formData = new FormData()
            formData.append("name", name.value)
            formData.append("email", email.value)
            
            // Append each file to formData
            avatarFiles.value.forEach((file, index) => {
                formData.append(`pictures`, file)  // Use the same key for array upload
            })

            try {
                const response = await axios.post("http://localhost:7000/upprofile", formData)
                console.log('API Response:', response.data)
            } catch (error) {
                console.error("Error:", error)
            }
        }

        return {
            name,
            email,
            avatarFiles,
            avatars,
            onFileChange,
            submitForm
        }
    }
}
</script>
