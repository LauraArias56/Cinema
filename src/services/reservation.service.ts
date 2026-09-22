import type {
    IReserva,
    IReservaRequest,
    IReservationProvider,
    IReservationService,
    ISilla
} from "./interfaces/reservation.interface";
import { ReservationStatus } from "./interfaces/reservation.interface";

export class ReservationService implements IReservationService {
    constructor(
        private readonly reservationProvider: IReservationProvider
    ) {}

    async consultarSillasDisponibles(funcionId: string): Promise<ISilla[]> {
        if (!this.reservationProvider.existeFuncion(funcionId)) {
            throw new Error("La función no existe");
        }

        return this.reservationProvider.obtenerSillasDisponibles(funcionId);
    }

    async reservarSilla(request: IReservaRequest): Promise<IReserva> {
        this.validateReservaRequest(request);

        const reserva: IReserva = {
            id: `res-${request.funcionId}-${request.sillaId}-${Date.now()}`,
            funcionId: request.funcionId,
            sillaId: request.sillaId,
            usuarioId: request.usuarioId,
            status: ReservationStatus.ACTIVE
        };

        return this.reservationProvider.guardarReserva(reserva);
    }

    async cancelarReserva(reservaId: string): Promise<void> {
        const reserva = this.reservationProvider.obtenerReservaPorId(reservaId);

        if (!reserva) {
            throw new Error("La reserva no existe");
        }

        if (reserva.status === ReservationStatus.CANCELLED) {
            throw new Error("La reserva ya se encuentra cancelada");
        }

        this.reservationProvider.actualizarEstadoReserva(reservaId, ReservationStatus.CANCELLED);
    }

    async consultarReservasPorUsuario(usuarioId: string): Promise<IReserva[]> {
        if (!usuarioId || usuarioId.trim() === "") {
            throw new Error("El usuario es obligatorio");
        }

        return this.reservationProvider.obtenerReservasPorUsuario(usuarioId);
    }

    private validateReservaRequest(request: IReservaRequest): void {
        if (!request.usuarioId || request.usuarioId.trim() === "") {
            throw new Error("El usuario es obligatorio");
        }
        if (!this.reservationProvider.existeFuncion(request.funcionId)) {
            throw new Error("La función no existe");
        }
        if (!this.reservationProvider.existeSilla(request.sillaId)) {
            throw new Error("La silla no existe");
        }
        if (this.reservationProvider.sillaReservada(request.funcionId, request.sillaId)) {
            throw new Error("La silla ya está reservada para esta función");
        }
    }
}
