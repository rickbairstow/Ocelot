<template>
    <div class="greetings">
        <h1 class="green">{{ msg }}</h1>
        <h3>
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
            .
        </h3>
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
