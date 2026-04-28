# 🚀 Prompts de Instrução para Desenvolvimento (IA-Assisted)

Use os prompts abaixo em ferramentas de geração de código (Cursor, ChatGPT, etc.) para acelerar o desenvolvimento do dashboard no repositório `e-pet`.

---

### Prompt 1: Criação da Camada de Serviço e Pinia Store
> "Crie um serviço em TypeScript para integrar com a API e-TET (NestJS). Preciso de métodos para buscar estatísticas consolidadas de:
> 1. Famílias (agrupadas por renda familiar e classificação de risco).
> 2. Indivíduos (contagem de condições de saúde como diabetes, hipertensão e gestantes).
> 3. Visitas (desfecho e motivos de acompanhamento).
> Além disso, crie uma Store no Pinia chamada `dashboardStore` para gerenciar o estado desses dados e filtros globais por 'Data' e 'Bairro'. Utilize a estrutura de entidades que já possuo (Family, Individual, Household, Visit)."

---

### Prompt 2: Componentes de KPIs e Gráficos de Risco
> "Usando Vue 3 com Vuetify e a biblioteca Chart.js (ou Vue-Chartjs), desenvolva o componente principal de Dashboard. 
> - O cabeçalho deve conter 4 cards com KPIs (Total Cidadãos, Famílias, Domicílios, % Visitas Realizadas).
> - Abaixo, crie um gráfico de Donut que mostre a Distribuição de Risco Familiar (R0 a R3) baseado no campo 'riskClass'.
> - Adicione um gráfico de barras horizontais mostrando os 5 principais motivos de vulnerabilidade da escala Coelho-Savassi (Acamados, Analfabetismo, Deficiência, etc.).
> - Não inclua filtros por microárea ou profissional/criador."

---

### Prompt 3: Painel Clínico e Filtros de Território
> "Crie uma seção de 'Saúde da População' no dashboard Vue 3. 
> - Deve exibir gráficos de barras comparativos para: (Hipertensão vs Diabetes) e (Fumantes vs Uso de Álcool).
> - Implemente uma barra de filtros no topo com: 
>   1. Seletor de Intervalo de Datas.
>   2. Autocomplete para 'Bairro' (buscando os bairros únicos da entidade Household).
>   3. Toggle para filtrar visitas 'Realizadas' ou 'Ausentes'.
> Garanta que os componentes sejam reativos aos filtros e que a interface seja limpa e profissional, focada em profissionais de saúde."

---

### Prompt 4: Lista de Busca Ativa (Priorização)
> "Desenvolva um componente de tabela (v-data-table) para exibir 'Cidadãos Prioritários'. 
> - A lógica deve filtrar indivíduos de famílias R3 ou R2 que possuem condições críticas (Gestante ou Acamado).
> - A tabela deve mostrar: Nome, Cartão SUS, Risco da Família e Data da Última Visita.
> - Adicione um botão de 'Ver Detalhes' que redirecione para a página do cidadão."
