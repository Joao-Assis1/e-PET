<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { db } from '@/services/localDb';
import { syncService } from '@/services/syncService';

const families = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const loadTerritory = async () => {
  loading.value = true;
  error.value = null;
  try {
    // Primeiro tenta ler o que já está no banco local
    const localFamilies = await db.families.toArray();
    
    if (localFamilies.length === 0) {
      // Se estiver vazio, tenta sincronizar do backend
      console.log('Banco local vazio, tentando sincronização inicial...');
      await syncService.performInitialSync();
      families.value = await db.families.toArray();
    } else {
      families.value = localFamilies;
    }
  } catch (err: any) {
    error.value = 'Falha ao sincronizar dados. Verifique sua conexão e se está logado.';
    console.error('Erro no território:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadTerritory);
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6 color-primary font-weight-bold">
          <v-icon icon="mdi-map-marker-radius" class="mr-2"></v-icon>
          Gestão de Território (Direto Neon)
        </h1>
        
        <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
          {{ error }}
        </v-alert>

        <v-card class="elevation-4 rounded-xl">
          <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>
          
          <v-list v-if="families.length > 0" lines="two">
            <v-list-item
              v-for="family in families"
              :key="family.id"
              :title="`Família: ${family.sobrenome || 'Sem Sobrenome'}`"
              :subtitle="`Cadastrada em: ${new Date(family.created_at).toLocaleDateString()}`"
            >
              <template v-slot:prepend>
                <v-avatar color="blue-lighten-5">
                  <v-icon icon="mdi-home-group" color="blue-darken-2"></v-icon>
                </v-avatar>
              </template>
              
              <template v-slot:append>
                <v-chip
                  :color="family.pontuacao_risco > 5 ? 'error' : 'success'"
                  variant="flat"
                  size="small"
                  class="font-weight-bold"
                >
                  Score: {{ family.pontuacao_risco || 0 }}
                </v-chip>
              </template>
            </v-list-item>
          </v-list>

          <v-card-text v-else-if="!loading" class="text-center pa-10 text-grey">
            <v-icon icon="mdi-database-off" size="48" class="mb-2"></v-icon>
            <p>Nenhuma família sincronizada encontrada no Neon.</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.color-primary {
  color: #007a33;
}
</style>
