import type {
    IFuncion,
    IReserva,
    IReservationProvider,
    ISilla
} from "../services/interfaces/reservation.interface";
import { ReservationStatus } from "../services/interfaces/reservation.interface";

/**
 * Implementación concreta (en memoria) del proveedor de datos de funciones,
 * sillas y reservas. En una aplicación real, aquí se consultaría una base
 * de datos. No se utiliza en las pruebas unitarias del servicio: esas
 * pruebas deben aislar esta dependencia con un mock.
 */
export class ReservationProvider implements IReservationProvider {
    private readonly funciones: Map<string, IFuncion> = new Map([
        ["func-1", { id: "func-1", pelicula: "Matrix", sala: "Sala 1", horario: "18:00" }],
        ["func-2", { id: "func-2", pelicula: "Interstellar", sala: "Sala 2", horario: "20:30" }]
    ]);

    private readonly sillas: Map<string, ISilla> = new Map([
        ["A1", { id: "A1", fila: "A", numero: 1 }],
        ["A2", { id: "A2", fila: "A", numero: 2 }],
        ["A3", { id: "A3", fila: "A", numero: 3 }],
        ["B1", { id: "B1", fila: "B", numero: 1 }],
        ["B2", { id: "B2", fila: "B", numero: 2 }]
    ]);

    private readonly reservas: Map<string, IReserva> = new Map();

    existeFuncion(funcionId: string): boolean {
        return this.funciones.has(funcionId);
    }

    existeSilla(sillaId: string): boolean {
        return this.sillas.has(sillaId);
    }

    obtenerSillasDeFuncion(_funcionId: string): ISilla[] {
        return Array.from(this.sillas.values());
    }

    obtenerSillasDisponibles(funcionId: string): ISilla[] {
        return this.obtenerSillasDeFuncion(funcionId).filter(
            (silla) => !this.sillaReservada(funcionId, silla.id)
        );
    }

    sillaReservada(funcionId: string, sillaId: string): boolean {
        return Array.from(this.reservas.values()).some(
            (reserva) =>
                reserva.funcionId === funcionId &&
                reserva.sillaId === sillaId &&
                reserva.status === ReservationStatus.ACTIVE
        );
    }

    guardarReserva(reserva: IReserva): IReserva {
        this.reservas.set(reserva.id, reserva);
        return reserva;
    }

    obtenerReservaPorId(reservaId: string): IReserva | undefined {
        return this.reservas.get(reservaId);
    }

    obtenerReservasPorUsuario(usuarioId: string): IReserva[] {
        return Array.from(this.reservas.values()).filter(
            (reserva) => reserva.usuarioId === usuarioId
        );
    }

    actualizarEstadoReserva(reservaId: string, status: ReservationStatus): void {
        const reserva = this.reservas.get(reservaId);
        if (reserva) {
            reserva.status = status;
        }
    }
}
