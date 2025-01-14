<template>
    <v-container>
        <h3>อัปโหลดไฟล์</h3>

        <!-- Form สำหรับการอัปโหลดไฟล์เดี่ยว -->
        <v-form @submit.prevent="uploadSingleFile">
            <v-text-field v-model="username" style="padding-left: 2.5rem;" label="E-mail"
                prepend-inner-icon="mdi-account"></v-text-field>
            <v-file-input v-model="singleFile" label="อัปโหลดไฟล์เดี่ยว" accept="image/*" required
                @change="previewSingleFile"></v-file-input>
            <v-btn type="submit" color="primary">อัปโหลดไฟล์เดี่ยว</v-btn>

            <!-- แสดงภาพตัวอย่างสำหรับไฟล์เดี่ยว -->
            <v-img v-if="singleFilePreview" :src="singleFilePreview" max-width="200" max-height="200"
                class="my-4"></v-img>
        </v-form>

        <v-divider class="my-6"></v-divider>

        <!-- Form สำหรับการอัปโหลดหลายไฟล์ -->
        <v-form @submit.prevent="uploadMultipleFiles">
            <v-file-input v-model="multipleFiles" label="อัปโหลดหลายไฟล์" accept="image/*" multiple
                required></v-file-input>
            <v-btn type="submit" color="primary">อัปโหลดหลายไฟล์</v-btn>
        </v-form>
    </v-container>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            username: null,
            singleFile: null,
            multipleFiles: [],
            singleFilePreview: null,
        };
    },
    methods: {
        previewSingleFile() {
            if (this.singleFile) {
                this.singleFilePreview = URL.createObjectURL(this.singleFile);
            } else {
                this.singleFilePreview = null;
            }
        },
        async uploadSingleFile() {
            if (this.singleFile) {
                const formData = new FormData();
                formData.append('picture', this.singleFile);
                formData.append('username', this.username);

                try {
                    const response = await axios.post('http://localhost:7000/upload-single', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    console.log('Response:', response.data);
                    alert(response.data.message);
                } catch (error) {
                    console.error('Upload single file error:', error);
                } finally {
                    // ล้าง preview หลังจากการอัปโหลด
                    URL.revokeObjectURL(this.singleFilePreview);
                    this.singleFilePreview = null;
                }
            }
        },

        async uploadMultipleFiles() {
            if (this.multipleFiles.length > 0) {
                const formData = new FormData();
                this.multipleFiles.forEach((file) => {
                    formData.append('pictures', file);
                });

                try {
                    const response = await axios.post('http://localhost:7000/upload-multiple', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    console.log('Response:', response.data);
                    alert(response.data.message);
                } catch (error) {
                    console.error('Upload multiple files error:', error);
                }
            }
        }
    }
};
</script>