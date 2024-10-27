<template>
    <div>
        <h1>{{ msg }}</h1>
        <h2 class="bg-white dark:bg-black text-black dark:text-orange-300">
            Welcome to the World OcelotUi!
        </h2>
    </div>
</template>

<script setup>
defineProps({
    msg: {
        type: String,
        required: true
    }
})
</script>
