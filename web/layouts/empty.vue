<template>
    <v-app>
        <v-main>
            <slot />
        </v-main>
    </v-app>
</template>

<script setup>
definePageMeta({
    layout: "empty",
});
</script>

<style scoped></style>