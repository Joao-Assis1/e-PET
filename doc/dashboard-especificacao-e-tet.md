# 📋 Especificação Técnica: Dashboard e-TET (Gestão de Saúde)

Este documento detalha a arquitetura de dados e os requisitos funcionais para a construção do dashboard de saúde territorial, integrando os dados da API e-TET.

## 1. Mapeamento de Entidades e Dados
Abaixo estão as fontes de dados primárias para cada componente visual:

### A. Indicadores de Cobertura (Cards de KPI)
* **Total de Cidadãos:** `count(Individual)` [cite: 3]
* **Total de Famílias:** `count(Family)` [cite: 2]
* **Domicílios Ativos:** `count(Household)` [cite: 4]
* **Eficiência de Visitas:** Razão de `visita_realizada: true` sobre o total de registros em `Visit` [cite: 5].

### B. Estratificação de Risco (Escala Coelho-Savassi)
* **Distribuição de Risco:** Agrupamento por `riskClass` ou `classificacao_risco` (R0, R1, R2, R3) [cite: 1, 2].
* **Fatores de Vulnerabilidade:** Soma das colunas de contagem em `FamilyRiskStratification` (ex: `bedriddenCount`, `illiterateCount`) [cite: 1].

### C. Perfil Clínico e Epidemiológico
* **Doenças Crônicas:** Flags em `IndividualHealth` (`hipertensao_arterial`, `diabetes`) [cite: 3].
* **Grupos de Risco:** `gestante`, `doenca_mental`, `acamado_domiciliado` [cite: 3].
* **Hábitos de Vida:** `fumante`, `uso_alcool`, `uso_outras_drogas` [cite: 3].

### D. Determinantes Ambientais
* **Saneamento:** Cruzamento de `basicSanitation` (FamilyRisk) com `saneamento_inadequado` (Family) [cite: 1, 2].
* **Abastecimento e Lixo:** Campos `abastecimento_agua` e `destino_lixo` da entidade `Household` [cite: 4].

## 2. Requisitos de Interface (UI/UX)
* **Filtros Globais:** * Intervalo de Datas (`createdAt` / `data_visita`).
    * Bairro (baseado no campo `bairro` em `Household`) [cite: 4].
    * Desfecho da Visita (Realizada, Recusa, Ausente) [cite: 5].
* **Visualização:** * Gráficos de Pizza para classificações de risco.
    * Gráficos de Barras para motivos de visita e condições de saúde.
    * Tabelas de listagem para busca ativa de pacientes prioritários (ex: Risco R3 sem visita recente).

## 3. Lógica de Negócio
1.  **Cálculo de Risco:** O dashboard deve consumir o `finalScore` e a `riskClass` já processados pela API [cite: 1].
2.  **Priorização:** Famílias com `riskClass: 'R3'` e `gestante: true` devem ter destaque visual imediato.
