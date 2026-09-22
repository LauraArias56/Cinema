# Sistema de Reservas de Sillas de Cine — Evaluación Pruebas Unitarias

Servicio en TypeScript que administra la reserva de sillas para las funciones
de una plataforma de cine, evitando reservas duplicadas y garantizando la
disponibilidad de las sillas. Sigue la misma estructura y requisitos técnicos
usados en el proyecto de ejemplo (interfaces, inyección de dependencias con
Awilix, pruebas con Vitest, patrón AAA, mocks, code coverage y mutation
testing).

## Estructura del proyecto

```
src/
├── config/
│   └── container.ts                    # Configuración del contenedor Awilix
├── providers/
│   └── reservation.provider.ts         # Almacenamiento en memoria de funciones, sillas y reservas
├── services/
│   ├── interfaces/
│   │   └── reservation.interface.ts
│   └── reservation.service.ts          # Lógica de negocio (unidad bajo prueba)
└── index.ts                            # Punto de entrada (aplicación de consola)

test/
├── providers/
│   └── reservation.provider.spec.ts
└── services/
    └── reservation.service.spec.ts

docs/
└── mutation-testing.md                 # Guía para documentar coverage y mutation testing
```

## Servicio implementado

`ReservationService` expone:

- `consultarSillasDisponibles(funcionId)` — sillas disponibles para una función.
- `reservarSilla({ funcionId, sillaId, usuarioId })` — reserva una silla.
- `cancelarReserva(reservaId)` — cancela una reserva existente.
- `consultarReservasPorUsuario(usuarioId)` — reservas de un usuario.

## Reglas de negocio implementadas

- La función debe existir.
- La silla debe existir.
- El usuario es obligatorio (se rechazan valores vacíos o solo espacios).
- Una silla no puede reservarse dos veces para la misma función (se valida
  contra las reservas **activas** de esa función).
- Una reserva cancelada libera la silla (al cancelar, la reserva deja de
  contarse como activa y la silla vuelve a estar disponible).
- No se puede cancelar una reserva inexistente.
- No se puede cancelar una reserva que ya estaba cancelada.
- Una reserva debe tener una función y una silla válidas (se valida su
  existencia antes de crear la reserva).

## Requisitos técnicos cubiertos

1. **Interfaces**: `IReservationProvider`, `IReservationService`, `IReserva`,
   `IFuncion`, `ISilla`, etc.
2. **Inyección de dependencias**: `ReservationService` recibe
   `IReservationProvider` por constructor; el contenedor Awilix (modo
   `CLASSIC`) resuelve la dependencia por nombre de parámetro.
3. **Pruebas unitarias con Vitest**: casos exitosos, casos de error y valores
   límite (usuario vacío o solo espacios, reserva duplicada, reserva/función/
   silla inexistente, reserva ya cancelada).
4. **Patrón AAA** en cada prueba (Arrange / Act / Assert).
5. **Mocks**: `IReservationProvider` se mockea con `vi.fn()` en las pruebas de
   `ReservationService`; nunca se usa la implementación real. El
   `ReservationProvider` en sí mismo se prueba de forma aislada en
   `reservation.provider.spec.ts`.
6. **Code Coverage**: `npm run test:coverage` genera el reporte con Vitest
   (`text`, `html`, `lcov`).
7. **Mutation Testing**: configurado con Stryker (`stryker.config.json`),
   apuntando a `src/services/*.ts` y `src/providers/*.ts`.

## Instalación

```bash
npm install
```

## Comandos

```bash
npm run dev             # Ejecuta la aplicación de consola
npm test                # Ejecuta las pruebas unitarias
npm run test:coverage   # Ejecuta las pruebas con reporte de cobertura
npm run stryker         # Ejecuta Mutation Testing
npm run build           # Compila el proyecto TypeScript
```

> **Nota:** las pruebas fueron escritas y el proyecto fue tipado y validado
> con `tsc --noEmit`, pero los binarios nativos incluidos en este entorno no
> pudieron ejecutar Vitest/Stryker aquí (dependencias nativas para otra
> plataforma y sin acceso a red). Ejecuta `npm install` en tu máquina para
> correr `npm test`, `npm run test:coverage` y `npm run stryker`, y completa
> [`docs/mutation-testing.md`](docs/mutation-testing.md) con los resultados
> reales, tal como pide la guía de evaluación.
