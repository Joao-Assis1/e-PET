<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { db } from '@/services/localDb'
  import { syncService } from '@/services/syncService'

  const families = ref<any[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  async function loadTerritory () {
    loading.value = true
    error.value = null
    try {
      // Abre o banco explicitamente
      if (!db.isOpen()) {
        await db.open()
      }

      const localFamilies = await db.families.toArray()
      console.log('Famílias encontradas no IndexedDB:', localFamilies.length)

      if (localFamilies.length === 0) {
        console.log('Banco local vazio, disparando sincronização...')
        await syncService.performInitialSync()
        families.value = await db.families.toArray()
      } else {
        families.value = localFamilies
      }
    } catch (error_: any) {
      error.value = 'Falha ao sincronizar dados. Verifique sua conexão e se está logado.'
      console.error('Erro no território:', error_)
    } finally {
      loading.value = false
    }
  }

  function getRiskColor (risk?: string) {
    if (!risk) return 'grey'
    const r = risk.toUpperCase()
    if (r.includes('MÁXIMO') || r.includes('MAXIMO') || r.includes('R3')) return 'red-darken-4'
    if (r.includes('MÉDIO') || r.includes('MEDIO') || r.includes('R2')) return 'deep-orange-darken-2'
    if (r.includes('MENOR') || r.includes('R1')) return 'orange-darken-2'
    if (r.includes('BAIXO') || r.includes('R0') || r.includes('SEM RISCO')) return 'green-darken-2'
    return 'grey'
  }

  onMounted(loadTerritory)
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6 color-primary font-weight-bold">
          <v-icon class="mr-2" icon="mdi-map-marker-radius" />
          Gestão de Território (Direto Neon)
        </h1>

        <v-alert v-if="error" class="mb-4" type="error" variant="tonal">
          {{ error }}
        </v-alert>

        <v-card class="elevation-4 rounded-xl">
          <v-progress-linear v-if="loading" color="primary" indeterminate />

          <v-list v-if="families.length > 0" lines="two">
            <v-list-item
              v-for="family in families"
              :key="family.id"
              :subtitle="`Cadastrada em: ${new Date(family.created_at).toLocaleDateString()}`"
              :title="`Prontuário: ${family.familyCode || 'Sem Identificador'}`"
            >
              <template #prepend>
                <v-avatar color="blue-lighten-5">
                  <v-icon color="blue-darken-2" icon="mdi-home-group" />
                </v-avatar>
              </template>

              <template #append>
                <v-chip
                  class="font-weight-bold"
                  :color="getRiskColor(family.riskClass)"
                  size="small"
                  variant="flat"
                >
                  {{ family.riskClass || 'Sem Risco' }}
                </v-chip>
              </template>
            </v-list-item>
          </v-list>

          <v-card-text v-else-if="!loading" class="text-center pa-10 text-grey">
            <v-icon class="mb-2" icon="mdi-database-off" size="48" />
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
