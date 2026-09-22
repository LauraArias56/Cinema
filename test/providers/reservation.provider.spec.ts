import { beforeEach, describe, expect, it } from "vitest";
import { ReservationProvider } from "../../src/providers/reservation.provider";
import { ReservationStatus } from "../../src/services/interfaces/reservation.interface";
import type { IReserva } from "../../src/services/interfaces/reservation.interface";

describe("ReservationProvider", () => {
    let provider: ReservationProvider;

    beforeEach(() => {
        // Arrange
        provider = new ReservationProvider();
    });

    it("should return true when the function exists", () => {
        // Act
        const result = provider.existeFuncion("func-1");

        // Assert
        expect(result).toBe(true);
    });

    it("should return false when the function does not exist", () => {
        // Act
        const result = provider.existeFuncion("func-inexistente");

        // Assert
        expect(result).toBe(false);
    });

    it("should return true when the seat exists", () => {
        // Act
        const result = provider.existeSilla("A1");

        // Assert
        expect(result).toBe(true);
    });

    it("should return false when the seat does not exist", () => {
        // Act
        const result = provider.existeSilla("Z9");

        // Assert
        expect(result).toBe(false);
    });

    it("should return every seat of the room for a given function", () => {
        // Act
        const sillas = provider.obtenerSillasDeFuncion("func-1");

        // Assert
        expect(sillas).toHaveLength(5);
        expect(sillas.map((s) => s.id)).toContain("A1");
    });

    it("should return all seats as available when there are no reservations", () => {
        // Act
        const disponibles = provider.obtenerSillasDisponibles("func-1");

        // Assert
        expect(disponibles).toHaveLength(5);
    });

    it("should exclude a seat with an active reservation from availability", () => {
        // Arrange
        const reserva: IReserva = {
            id: "res-1",
            funcionId: "func-1",
            sillaId: "A1",
            usuarioId: "user-1",
            status: ReservationStatus.ACTIVE
        };
        provider.guardarReserva(reserva);

        // Act
        const disponibles = provider.obtenerSillasDisponibles("func-1");

        // Assert
        expect(disponibles.map((s) => s.id)).not.toContain("A1");
        expect(disponibles).toHaveLength(4);
    });

    it("should not mark a seat as reserved when there is no reservation for it", () => {
        // Act
        const result = provider.sillaReservada("func-1", "A1");

        // Assert
        expect(result).toBe(false);
    });

    it("should mark a seat as reserved when it has an active reservation for that function", () => {
        // Arrange
        provider.guardarReserva({
            id: "res-1",
            funcionId: "func-1",
            sillaId: "A1",
            usuarioId: "user-1",
            status: ReservationStatus.ACTIVE
        });

        // Act
        const result = provider.sillaReservada("func-1", "A1");

        // Assert
        expect(result).toBe(true);
    });

    it("should not consider a seat reserved for a different function", () => {
        // Arrange
        provider.guardarReserva({
            id: "res-1",
            funcionId: "func-1",
            sillaId: "A1",
            usuarioId: "user-1",
            status: ReservationStatus.ACTIVE
        });

        // Act
        const result = provider.sillaReservada("func-2", "A1");

        // Assert
        expect(result).toBe(false);
    });

    it("should not consider a cancelled reservation as occupying the seat", () => {
        // Arrange
        provider.guardarReserva({
            id: "res-1",
            funcionId: "func-1",
            sillaId: "A1",
            usuarioId: "user-1",
            status: ReservationStatus.CANCELLED
        });

        // Act
        const result = provider.sillaReservada("func-1", "A1");

        // Assert
        expect(result).toBe(false);
    });

    it("should store and retrieve a reservation by id", () => {
        // Arrange
        const reserva: IReserva = {
            id: "res-1",
            funcionId: "func-1",
            sillaId: "A1",
            usuarioId: "user-1",
            status: ReservationStatus.ACTIVE
        };

        // Act
        provider.guardarReserva(reserva);
        const result = provider.obtenerReservaPorId("res-1");

        // Assert
        expect(result).toEqual(reserva);
    });

    it("should return undefined when the reservation does not exist", () => {
        // Act
        const result = provider.obtenerReservaPorId("res-inexistente");

        // Assert
        expect(result).toBeUndefined();
    });

    it("should return only the reservations belonging to the given user", () => {
        // Arrange
        provider.guardarReserva({
            id: "res-1",
            funcionId: "func-1",
            sillaId: "A1",
            usuarioId: "user-1",
            status: ReservationStatus.ACTIVE
        });
        provider.guardarReserva({
            id: "res-2",
            funcionId: "func-1",
            sillaId: "A2",
            usuarioId: "user-2",
            status: ReservationStatus.ACTIVE
        });

        // Act
        const reservas = provider.obtenerReservasPorUsuario("user-1");

        // Assert
        expect(reservas).toHaveLength(1);
        expect(reservas[0]?.id).toBe("res-1");
    });

    it("should update the status of an existing reservation", () => {
        // Arrange
        provider.guardarReserva({
            id: "res-1",
            funcionId: "func-1",
            sillaId: "A1",
            usuarioId: "user-1",
            status: ReservationStatus.ACTIVE
        });

        // Act
        provider.actualizarEstadoReserva("res-1", ReservationStatus.CANCELLED);

        // Assert
        expect(provider.obtenerReservaPorId("res-1")?.status).toBe(ReservationStatus.CANCELLED);
    });

    it("should do nothing when updating the status of a non-existing reservation", () => {
        // Act & Assert
        expect(() =>
            provider.actualizarEstadoReserva("res-inexistente", ReservationStatus.CANCELLED)
        ).not.toThrow();
    });
});
