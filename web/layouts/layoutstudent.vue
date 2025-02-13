<template>
    <v-app>
        <!-- Mobile-Friendly App Bar -->
        <v-app-bar 
            color="primary" 
            flat 
            density="compact" 
            elevation="2"
        >
            <template v-slot:prepend>
                <v-avatar 
                    color="secondary" 
                    size="small"
                    class="mr-2"
                >
                    <v-icon size="small">mdi-school</v-icon>
                </v-avatar>
            </template>

            <v-toolbar-title class="text-subtitle-1 font-weight-bold">
                ระบบเช็คชื่อ
            </v-toolbar-title>

            <v-spacer />

            <!-- Mobile Navigation Drawer -->
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        </v-app-bar>

        <!-- Navigation Drawer for Mobile -->
        <v-navigation-drawer
            v-model="drawer"
            temporary
            location="right"
            class="bg-secondary"
        >
            <v-list>
                <v-list-item 
                    v-for="nav in navigationItems" 
                    :key="nav.to"
                    :to="nav.to"
                    @click="drawer = false"
                >
                    <template v-slot:prepend>
                        <v-icon>{{ nav.icon }}</v-icon>
                    </template>
                    <v-list-item-title>{{ nav.text }}</v-list-item-title>
                </v-list-item>

                <v-divider class="my-2"></v-divider>

                <v-list-item @click="handleLogout">
                    <template v-slot:prepend>
                        <v-icon color="error">mdi-logout</v-icon>
                    </template>
                    <v-list-item-title class="text-error">
                        ออกจากระบบ
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <!-- Main Content Area -->
        <v-main class="bg-grey-lighten-4">
            <v-container fluid class="pa-2">
                <v-fade-transition>
                    <slot />
                </v-fade-transition>
            </v-container>
        </v-main>

        <!-- Bottom Navigation for Mobile -->
        <v-bottom-navigation 
            v-if="$vuetify.display.mobile"
            color="primary"
            mode="shift"
        >
            <v-btn 
                v-for="nav in navigationItems" 
                :key="nav.to"
                :to="nav.to"
            >
                <v-icon>{{ nav.icon }}</v-icon>
                <span>{{ nav.text }}</span>
            </v-btn>
        </v-bottom-navigation>
    </v-app>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();
const drawer = ref(false);

// Navigation Items Configuration
const navigationItems = ref([
    { 
        to: "/result_2", 
        text: "ผลการเข้าแถว", 
        icon: "mdi-chart-areaspline" 
    },
    { 
        to: "/student_profile_2", 
        text: "โปรไฟล์", 
        icon: "mdi-account-details" 
    }
]);

// Logout Function
const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullname");
    localStorage.removeItem("username");
    router.push("/login1");
    drawer.value = false;
};
</script>

<style scoped>
/* Mobile-first Typography */
.v-toolbar-title {
    font-family: "Prompt", sans-serif;
    letter-spacing: 0.3px;
}

/* Responsive List Item Styling */
.v-list-item {
    margin: 8px 0;
}

/* Hide text on small screens */
@media (max-width: 360px) {
    .v-bottom-navigation span {
        display: none;
    }
}
</style>