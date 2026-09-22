# Resultados de Code Coverage y Mutation Testing

Este documento cumple con el entregable de "Mutation Testing" de la guía:
resultado inicial, mutantes sobrevivientes, análisis y resultado final.

Complétalo ejecutando los comandos localmente (`npm install` primero):

```bash
npm run test:coverage
npm run stryker
```

## 1. Resultado inicial

### Code coverage (`npm run test:coverage`)

Pega aquí la tabla que imprime Vitest (`% Stmts`, `% Branch`, `% Funcs`,
`% Lines`, `Uncovered Line #s`) antes de agregar casos de prueba adicionales
para cubrir ramas faltantes.

### Mutation testing (`npm run stryker`)

Pega aquí el resumen que imprime Stryker (mutation score total, mutantes
`Killed`, `Survived`, `Timeout`, `NoCoverage`).

### Mutantes sobrevivientes identificados

Por cada mutante sobreviviente, documenta:

- Archivo y línea donde ocurrió.
- Tipo de mutación aplicada (por ejemplo `LogicalOperator`,
  `ConditionalExpression`, `StringLiteral`, `EqualityOperator`).
- Por qué ninguna prueba existente lo detectó.

Puntos a revisar especialmente en este proyecto:

- Validación de `usuarioId` vacío vs. solo espacios en blanco
  (`!request.usuarioId || request.usuarioId.trim() === ""`).
- Comparaciones de `ReservationStatus` (`ACTIVE` vs. `CANCELLED`).
- Condición de `sillaReservada` (función, silla y estado deben coincidir).
- Orden de las validaciones en `reservarSilla` (usuario → función → silla →
  duplicado).

## 2. Correcciones aplicadas

Describe aquí los casos de prueba que agregaste para matar cada mutante
sobreviviente y para cubrir las ramas faltantes.

## 3. Resultado final

Pega aquí la tabla de coverage y el resumen de Stryker después de las
correcciones.

## 4. Comparación

| Métrica | Inicial | Final |
|---|---|---|
| Mutation score total | | |
| Mutantes sobrevivientes | | |
| Mutantes sin cobertura (`NoCoverage`) | | |
| Coverage `reservation.provider.ts` | | |
| Coverage `reservation.service.ts` | | |
| Total de pruebas | | |
