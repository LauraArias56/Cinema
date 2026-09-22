export enum ReservationStatus {
    ACTIVE = "ACTIVE",
    CANCELLED = "CANCELLED"
}

export interface IFuncion {
    id: string;
    pelicula: string;
    sala: string;
    horario: string;
}

export interface ISilla {
    id: string;
    fila: string;
    numero: number;
}

export interface IReserva {
    id: string;
    funcionId: string;
    sillaId: string;
    usuarioId: string;
    status: ReservationStatus;
}

export interface IReservaRequest {
    funcionId: string;
    sillaId: string;
    usuarioId: string;
}

/**
 * Contrato del proveedor de datos (almacenamiento de funciones, sillas
 * y reservas). Debe ser mockeado en las pruebas unitarias del servicio:
 * nunca se debe depender de la implementación real durante esas pruebas.
 */
export interface IReservationProvider {
    existeFuncion(funcionId: string): boolean;
    existeSilla(sillaId: string): boolean;
    obtenerSillasDeFuncion(funcionId: string): ISilla[];
    obtenerSillasDisponibles(funcionId: string): ISilla[];
    sillaReservada(funcionId: string, sillaId: string): boolean;
    guardarReserva(reserva: IReserva): IReserva;
    obtenerReservaPorId(reservaId: string): IReserva | undefined;
    obtenerReservasPorUsuario(usuarioId: string): IReserva[];
    actualizarEstadoReserva(reservaId: string, status: ReservationStatus): void;
}

export interface IReservationService {
    consultarSillasDisponibles(funcionId: string): Promise<ISilla[]>;
    reservarSilla(request: IReservaRequest): Promise<IReserva>;
    cancelarReserva(reservaId: string): Promise<void>;
    consultarReservasPorUsuario(usuarioId: string): Promise<IReserva[]>;
}
