import { container } from "./config/container";
import type { IReservationService } from "./services/interfaces/reservation.interface";

const reservationService = container.resolve<IReservationService>("reservationService");

async function main() {
    try {
        const disponibles = await reservationService.consultarSillasDisponibles("func-1");
        console.log("Sillas disponibles en func-1:", disponibles);

        const reserva = await reservationService.reservarSilla({
            funcionId: "func-1",
            sillaId: "A1",
            usuarioId: "user-1"
        });
        console.log("Reserva creada:", reserva);

        const reservasUsuario = await reservationService.consultarReservasPorUsuario("user-1");
        console.log("Reservas de user-1:", reservasUsuario);

        await reservationService.cancelarReserva(reserva.id);
        console.log("Reserva cancelada:", reserva.id);
    } catch (error) {
        console.error("Error procesando la reserva:", error);
    }
}

main();
