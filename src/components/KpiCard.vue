<template>
  <v-card class="mx-auto" elevation="2">
    <v-card-text>
      <div class="d-flex align-center">
        <v-avatar class="me-4" :color="color + '-lighten-4'" size="48">
          <v-icon :color="color" :icon="icon" size="24" />
        </v-avatar>
        <div>
          <div class="text-overline mb-1">{{ title }}</div>
          <div class="text-h4 font-weight-bold" :class="'text-' + color">
            {{ value }}
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  defineProps<{
    title: string
    value: string | number
    icon: string
    color: string
  }>()
</script>

<style scoped>
.text-overline {
  line-height: 1rem;
  color: rgba(0, 0, 0, 0.6);
}
</style>
