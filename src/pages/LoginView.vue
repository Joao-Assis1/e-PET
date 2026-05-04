<template>
  <div class="login-wrapper">
    <!-- Background Elements -->
    <div class="bg-decoration">
      <div class="circle circle-1" />
      <div class="circle circle-2" />
    </div>

    <v-container class="fill-height justify-center relative-container" fluid>
      <v-row class="justify-center align-center w-100 ma-0">
        <v-col
          cols="12"
          lg="4"
          md="5"
          sm="8"
          xl="3"
        >
          <v-card border class="login-card pa-8 pa-md-10">
            <div class="logo-section mb-8 text-center">
              <div class="d-flex justify-center mb-4">
                <v-avatar class="elevation-4" color="primary" size="80">
                  <v-icon
                    color="white"
                    icon="mdi-account-heart"
                    size="48"
                  />
                </v-avatar>
              </div>
              <h1 class="text-h4 font-weight-black text-primary mb-1">e-PET</h1>
              <h1 class="text-subtitle-1 text-grey-darken-1 font-weight-medium">
                Prontuário Eletrônico de Território
              </h1>
            </div>

            <v-form class="login-form" @submit.prevent="handleLogin">
              <div class="input-group mb-4">
                <label class="custom-label">Usuário</label>
                <v-text-field
                  v-model="cpf"
                  v-maska="'###.###.###-##'"
                  bg-color="white"
                  :error-messages="error"
                  hide-details="auto"
                  placeholder="000.000.000-00"
                  prepend-inner-icon="mdi-account-outline"
                  variant="outlined"
                />
              </div>

              <div class="input-group mb-6">
                <div class="d-flex justify-space-between align-center mb-1">
                  <label class="custom-label">Senha</label>
                </div>
                <v-text-field
                  v-model="password"
                  :append-inner-icon="
                    showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
                  "
                  bg-color="white"
                  hide-details
                  placeholder="••••••••"
                  prepend-inner-icon="mdi-lock-outline"
                  :type="showPassword ? 'text' : 'password'"
                  variant="outlined"
                  @click:append-inner="showPassword = !showPassword"
                />
              </div>

              <v-btn
                block
                class="access-btn"
                color="primary"
                elevation="4"
                :loading="loading"
                size="x-large"
                type="submit"
              >
                Entrar no Sistema
              </v-btn>

              <div class="mt-8 text-center text-caption text-grey">
                &copy; 2026 e-PET - Gestão de Saúde Pública. <br>
                Versão 1.0.0
              </div>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/authStore'

  const router = useRouter()
  const authStore = useAuthStore()
  const { loading, error } = storeToRefs(authStore)

  const cpf = ref('')
  const password = ref('')
  const showPassword = ref(false)

  async function handleLogin () {
    const cleanCpf = cpf.value.replace(/\D/g, '')
    const success = await authStore.login(cleanCpf, password.value)
    if (success) {
      router.push('/')
    }
  }
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  background: linear-gradient(135deg, #004092 0%, #2d82e4 100%);
  position: relative;
  overflow: hidden;
}

.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
}

.circle-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  right: -100px;
}

.circle-2 {
  width: 600px;
  height: 600px;
  bottom: -200px;
  left: -200px;
}

.relative-container {
  position: relative;
  z-index: 1;
}

.login-card {
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(10px);
  border-color: rgba(255, 255, 255, 0.3) !important;
  box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.25) !important;
}

.custom-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.access-btn {
  letter-spacing: 1px;
  height: 56px !important;
}

.custom-checkbox :deep(.v-label) {
  font-size: 0.9rem;
  opacity: 1;
  color: #666;
}
</style>
