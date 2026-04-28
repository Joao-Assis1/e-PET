<template>
  <v-dialog v-model="visible" max-width="400" persistent>
    <v-card class="pa-4">
      <v-card-title class="text-h5 text-center mb-4">
        Login ao e-SUS PEC
      </v-card-title>

      <v-card-text>
        <v-form ref="form" @submit.prevent="handleLogin">
          <v-text-field
            v-model="credentials.usuario"
            label="Username"
            prepend-inner-icon="mdi-account"
            required
            :rules="[(v) => !!v || 'Campo obrigatório']"
            variant="outlined"
          />

          <v-text-field
            v-model="credentials.senha"
            label="Password"
            prepend-inner-icon="mdi-lock"
            required
            :rules="[(v) => !!v || 'Campo obrigatório']"
            type="password"
            variant="outlined"
          />

          <v-alert v-if="error" class="mb-4" type="error" variant="tonal">
            {{ error }}
          </v-alert>

          <v-btn
            block
            class="mt-4"
            color="primary"
            :loading="loading"
            size="large"
            type="submit"
          >
            Entrar
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { reactive, ref, watch } from 'vue'
  import api from '@/services/api'

  const props = defineProps<{
    modelValue: boolean
  }>()

  const emit = defineEmits(['update:modelValue', 'success'])

  const visible = ref(props.modelValue)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const credentials = reactive({
    usuario: '',
    senha: '',
  })

  // Sync visibility with prop
  watch(
    () => props.modelValue,
    val => {
      visible.value = val
    },
  )

  watch(visible, val => {
    emit('update:modelValue', val)
  })

  async function handleLogin () {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('/login', credentials)
      // Na sua API, o token é devolvido como 'access_token'
      const token = response.data.access_token
      if (token) {
        localStorage.setItem('token', token)
        visible.value = false
        emit('success')
      } else {
        throw new Error('Token não recebido')
      }
    } catch (error_: any) {
      error.value
        = error_.response?.data?.message
          || 'Erro ao realizar login. Verifique as credenciais.'
    } finally {
      loading.value = false
    }
  }
</script>
