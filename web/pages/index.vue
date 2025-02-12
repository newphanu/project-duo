<template>
    <div>
     <h1>INDEX</h1>   
    </div>
</template>
<script>
import { onMounted } from 'vue'
import { useRouter } from "vue-router";

const router = useRouter()

const goLogin = () => {
    router.push("/login1");

}

onMounted(() => {
    goLogin()
});
</script>