<template>
    <div>
        <h1>{{ msg }}</h1>
        <h2>
            You’ve successfully created a project with
            <a
                href="https://vitejs.dev/"
                rel="noopener"
                target="_blank"
            >
                Vite
            </a>
            +
            <a
                href="https://vuejs.org/"
                rel="noopener"
                target="_blank"
            >
                Vue 3
            </a>
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
