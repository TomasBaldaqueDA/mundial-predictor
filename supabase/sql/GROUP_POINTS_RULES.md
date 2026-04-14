# Regras de pontuação – previsões de grupos

Usar estas regras na função de cálculo de pontos de grupos (`calc_user_group_points`).

## Resumo

| Regra | Pontos |
|-------|--------|
| Acertar equipa **e** sua posição no grupo | **1 pt** por posição correta |
| Por cada grupo em que se acerte a posição das **4 equipas** | **+1 pt** (bónus grupo perfeito) |
| Acertar **as 32 equipas** que ficam qualificadas (conjunto previsto = conjunto real) | **+10 pts** |
| Acertar **os 8 grupos** cujo 3.º classificado avança | **+5 pts** |

_Notas_: não há pontos por “equipa qualificada” isolada; o bónus +10 cobre o conjunto completo.

## Detalhe

1. **Posição exata (1 pt)**  
   Para cada posição 1–4 em cada grupo: se a equipa prevista nessa posição coincidir com a tabela real → 1 ponto.

2. **Grupo perfeito (+1 pt)**  
   Se num grupo acertares as 4 posições → +1 pt extra nesse grupo.

3. **Bónus 32 qualificadas (+10 pts)**  
   As qualificadas reais = 1.º e 2.º de todos os grupos + 3.º dos 8 grupos em `group_actual_third_place`.  
   As escolhas do utilizador = equipes em 1.º e 2.º na previsão + 3.º onde `qualifies = true`.  
   Se houver exactamente 32 de cada lado e coincidirem todas → +10 pts.

4. **Bónus 8 grupos terceiros (+5 pts)**  
   Se existirem 8 linhas em `group_actual_third_place` e o utilizador marcar `qualifies` em exactamente esses 8 `group_code` (e não noutros) → +5 pts.
