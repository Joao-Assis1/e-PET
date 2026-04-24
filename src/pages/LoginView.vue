<template>
  <div class="login-wrapper">
    <!-- Background Elements -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>

    <v-container class="fill-height justify-center relative-container" fluid>
      <v-row class="justify-center align-center w-100 ma-0">
        <v-col cols="12" sm="8" md="5" lg="4" xl="3">
          <v-card class="login-card pa-8 pa-md-10" border>
            <div class="logo-section mb-8 text-center">
              <div class="d-flex justify-center mb-4">
                <v-avatar color="primary" size="80" class="elevation-4">
                  <v-icon
                    icon="mdi-account-heart"
                    size="48"
                    color="white"
                  ></v-icon>
                </v-avatar>
              </div>
              <h1 class="text-h4 font-weight-black text-primary mb-1">e-PET</h1>
              <h1 class="text-subtitle-1 text-grey-darken-1 font-weight-medium">
                Prontuário Eletrônico de Território
              </h1>
            </div>

            <v-form @submit.prevent="handleLogin" class="login-form">
              <div class="input-group mb-4">
                <label class="custom-label">Usuário</label>
                <v-text-field
                  v-model="cpf"
                  variant="outlined"
                  bg-color="white"
                  placeholder="000.000.000-00"
                  v-maska="'###.###.###-##'"
                  prepend-inner-icon="mdi-account-outline"
                  :error-messages="error"
                  hide-details="auto"
                ></v-text-field>
              </div>

              <div class="input-group mb-6">
                <div class="d-flex justify-space-between align-center mb-1">
                  <label class="custom-label">Senha</label>
                </div>
                <v-text-field
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  variant="outlined"
                  bg-color="white"
                  placeholder="••••••••"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="
                    showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
                  "
                  @click:append-inner="showPassword = !showPassword"
                  hide-details
                ></v-text-field>
              </div>

              <v-btn
                type="submit"
                color="primary"
                block
                size="x-large"
                elevation="4"
                :loading="loading"
                class="access-btn"
              >
                Entrar no Sistema
              </v-btn>

              <div class="mt-8 text-center text-caption text-grey">
                &copy; 2026 e-PET - Gestão de Saúde Pública. <br />
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";

const router = useRouter();
const authStore = useAuthStore();
const { loading, error } = storeToRefs(authStore);

const cpf = ref("");
const password = ref("");
const showPassword = ref(false);

const handleLogin = async () => {
  const cleanCpf = cpf.value.replace(/\D/g, "");
  const success = await authStore.login(cleanCpf, password.value);
  if (success) {
    router.push("/");
  }
};
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
