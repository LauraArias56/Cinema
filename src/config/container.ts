import { asClass, createContainer, InjectionMode } from "awilix";
import { ReservationProvider } from "../providers/reservation.provider";
import { ReservationService } from "../services/reservation.service";

export const container = createContainer({
    injectionMode: InjectionMode.CLASSIC
});

container.register({
    reservationProvider: asClass(ReservationProvider).singleton(),
    reservationService: asClass(ReservationService).singleton()
});
