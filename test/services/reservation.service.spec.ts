import { describe, expect, it, vi } from "vitest";
import { ReservationService } from "../../src/services/reservation.service";
import { ReservationStatus } from "../../src/services/interfaces/reservation.interface";
import type { IReservationProvider } from "../../src/services/interfaces/reservation.interface";

function createProviderMock(): IReservationProvider {
    return {
        existeFuncion: vi.fn(),
        existeSilla: vi.fn(),
        obtenerSillasDeFuncion: vi.fn(),
        obtenerSillasDisponibles: vi.fn(),
        sillaReservada: vi.fn(),
        guardarReserva: vi.fn(),
        obtenerReservaPorId: vi.fn(),
        obtenerReservasPorUsuario: vi.fn(),
        actualizarEstadoReserva: vi.fn()
    };
}

describe("ReservationService", () => {

    describe("consultarSillasDisponibles", () => {
        it("should return the available seats when the function exists", async () => {
            // Arrange
            const providerMock = createProviderMock();
            (providerMock.existeFuncion as ReturnType<typeof vi.fn>).mockReturnValue(true);
            const sillasDisponibles = [{ id: "A1", fila: "A", numero: 1 }];
            (providerMock.obtenerSillasDisponibles as ReturnType<typeof vi.fn>).mockReturnValue(
                sillasDisponibles
            );
            const service = new ReservationService(providerMock);

            // Act
            const result = await service.consultarSillasDisponibles("func-1");

            // Assert
            expect(result).toEqual(sillasDisponibles);
            expect(providerMock.obtenerSillasDisponibles).toHaveBeenCalledWith("func-1");
        });

        it("should throw an error when the function does not exist", async () => {
            // Arrange
            const providerMock = createProviderMock();
            (providerMock.existeFuncion as ReturnType<typeof vi.fn>).mockReturnValue(false);
            const service = new ReservationService(providerMock);

            // Act & Assert
            await expect(
                service.consultarSillasDisponibles("func-inexistente")
            ).rejects.toThrow("La función no existe");
            expect(providerMock.obtenerSillasDisponibles).not.toHaveBeenCalled();
        });
    });

    describe("reservarSilla", () => {
        it("should create an active reservation when the function and seat are valid and available", async () => {
            // Arrange
            const providerMock = createProviderMock();
            (providerMock.existeFuncion as ReturnType<typeof vi.fn>).mockReturnValue(true);
            (providerMock.existeSilla as ReturnType<typeof vi.fn>).mockReturnValue(true);
            (providerMock.sillaReservada as ReturnType<typeof vi.fn>).mockReturnValue(false);
            (providerMock.guardarReserva as ReturnType<typeof vi.fn>).mockImplementation(
                (reserva) => reserva
            );
            const service = new ReservationService(providerMock);

            // Act
            const result = await service.reservarSilla({
                funcionId: "func-1",
                sillaId: "A1",
                usuarioId: "user-1"
            });

            // Assert
            expect(result.status).toBe(ReservationStatus.ACTIVE);
            expect(result.funcionId).toBe("func-1");
            expect(result.sillaId).toBe("A1");
            expect(result.usuarioId).toBe("user-1");
            expect(providerMock.guardarReserva).toHaveBeenCalledTimes(1);
        });

        it("should throw an error when the user is not provided", async () => {
            // Arrange
            const providerMock = createProviderMock();
            const service = new ReservationService(providerMock);

            // Act & Assert
            await expect(
                service.reservarSilla({ funcionId: "func-1", sillaId: "A1", usuarioId: "" })
            ).rejects.toThrow("El usuario es obligatorio");
            expect(providerMock.existeFuncion).not.toHaveBeenCalled();
        });

        it("should throw an error when the user is only whitespace", async () => {
            // Arrange
            const providerMock = createProviderMock();
            const service = new ReservationService(providerMock);

            // Act & Assert
            await expect(
                service.reservarSilla({ funcionId: "func-1", sillaId: "A1", usuarioId: "   " })
            ).rejects.toThrow("El usuario es obligatorio");
        });

        it("should throw an error when the function does not exist", async () => {
            // Arrange
            const providerMock = createProviderMock();
            (providerMock.existeFuncion as ReturnType<typeof vi.fn>).mockReturnValue(false);
            const service = new ReservationService(providerMock);

            // Act & Assert
            await expect(
                service.reservarSilla({
                    funcionId: "func-inexistente",
                    sillaId: "A1",
                    usuarioId: "user-1"
                })
            ).rejects.toThrow("La función no existe");
            expect(providerMock.existeSilla).not.toHaveBeenCalled();
        });

        it("should throw an error when the seat does not exist", async () => {
            // Arrange
            const providerMock = createProviderMock();
            (providerMock.existeFuncion as ReturnType<typeof vi.fn>).mockReturnValue(true);
            (providerMock.existeSilla as ReturnType<typeof vi.fn>).mockReturnValue(false);
            const service = new ReservationService(providerMock);

            // Act & Assert
            await expect(
                service.reservarSilla({
                    funcionId: "func-1",
                    sillaId: "Z9",
                    usuarioId: "user-1"
                })
            ).rejects.toThrow("La silla no existe");
            expect(providerMock.sillaReservada).not.toHaveBeenCalled();
        });

        it("should throw an error when the seat is already reserved for that function", async () => {
            // Arrange
            const providerMock = createProviderMock();
            (providerMock.existeFuncion as ReturnType<typeof vi.fn>).mockReturnValue(true);
            (providerMock.existeSilla as ReturnType<typeof vi.fn>).mockReturnValue(true);
            (providerMock.sillaReservada as ReturnType<typeof vi.fn>).mockReturnValue(true);
            const service = new ReservationService(providerMock);

            // Act & Assert
            await expect(
                service.reservarSilla({
                    funcionId: "func-1",
                    sillaId: "A1",
                    usuarioId: "user-1"
                })
            ).rejects.toThrow("La silla ya está reservada para esta función");
            expect(providerMock.guardarReserva).not.toHaveBeenCalled();
        });
    });

    describe("cancelarReserva", () => {
        it("should cancel an existing active reservation", async () => {
            // Arrange
            const providerMock = createProviderMock();
            (providerMock.obtenerReservaPorId as ReturnType<typeof vi.fn>).mockReturnValue({
                id: "res-1",
                funcionId: "func-1",
                sillaId: "A1",
                usuarioId: "user-1",
                status: ReservationStatus.ACTIVE
            });
            const service = new ReservationService(providerMock);

            // Act
            await service.cancelarReserva("res-1");

            // Assert
            expect(providerMock.actualizarEstadoReserva).toHaveBeenCalledWith(
                "res-1",
                ReservationStatus.CANCELLED
            );
        });

        it("should throw an error when the reservation does not exist", async () => {
            // Arrange
            const providerMock = createProviderMock();
            (providerMock.obtenerReservaPorId as ReturnType<typeof vi.fn>).mockReturnValue(
                undefined
            );
            const service = new ReservationService(providerMock);

            // Act & Assert
            await expect(
                service.cancelarReserva("res-inexistente")
            ).rejects.toThrow("La reserva no existe");
            expect(providerMock.actualizarEstadoReserva).not.toHaveBeenCalled();
        });

        it("should throw an error when the reservation is already cancelled", async () => {
            // Arrange
            const providerMock = createProviderMock();
            (providerMock.obtenerReservaPorId as ReturnType<typeof vi.fn>).mockReturnValue({
                id: "res-1",
                funcionId: "func-1",
                sillaId: "A1",
                usuarioId: "user-1",
                status: ReservationStatus.CANCELLED
            });
            const service = new ReservationService(providerMock);

            // Act & Assert
            await expect(
                service.cancelarReserva("res-1")
            ).rejects.toThrow("La reserva ya se encuentra cancelada");
            expect(providerMock.actualizarEstadoReserva).not.toHaveBeenCalled();
        });
    });

    describe("consultarReservasPorUsuario", () => {
        it("should return the reservations of the given user", async () => {
            // Arrange
            const providerMock = createProviderMock();
            const reservas = [
                {
                    id: "res-1",
                    funcionId: "func-1",
                    sillaId: "A1",
                    usuarioId: "user-1",
                    status: ReservationStatus.ACTIVE
                }
            ];
            (providerMock.obtenerReservasPorUsuario as ReturnType<typeof vi.fn>).mockReturnValue(
                reservas
            );
            const service = new ReservationService(providerMock);

            // Act
            const result = await service.consultarReservasPorUsuario("user-1");

            // Assert
            expect(result).toEqual(reservas);
            expect(providerMock.obtenerReservasPorUsuario).toHaveBeenCalledWith("user-1");
        });

        it("should throw an error when the user is not provided", async () => {
            // Arrange
            const providerMock = createProviderMock();
            const service = new ReservationService(providerMock);

            // Act & Assert
            await expect(
                service.consultarReservasPorUsuario("")
            ).rejects.toThrow("El usuario es obligatorio");
            expect(providerMock.obtenerReservasPorUsuario).not.toHaveBeenCalled();
        });

        it("should throw an error when the user is only whitespace", async () => {
            // Arrange
            const providerMock = createProviderMock();
            const service = new ReservationService(providerMock);

            // Act & Assert
            await expect(
                service.consultarReservasPorUsuario("   ")
            ).rejects.toThrow("El usuario es obligatorio");
        });
    });
});
