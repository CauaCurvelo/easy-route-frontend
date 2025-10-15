import { Trip } from '../mockData';
import { useStore } from '../contexts/Store';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Calendar, Clock, MapPin, Users, DollarSign, User, Navigation, Bus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useState } from 'react';

interface TripDetailProps {
  trip: Trip | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusColors = {
  scheduled: 'bg-blue-500/10 text-blue-500',
  'in-progress': 'bg-yellow-500/10 text-yellow-500',
  completed: 'bg-green-500/10 text-green-500',
  cancelled: 'bg-red-500/10 text-red-500',
};

const statusLabels = {
  scheduled: 'Agendada',
  'in-progress': 'Em andamento',
  completed: 'Finalizada',
  cancelled: 'Cancelada',
};

export function TripDetail({ trip, open, onOpenChange }: TripDetailProps) {
  const { getRouteById, getVanById, currentUser, cancelBooking } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  if (!trip) return null;

  const route = getRouteById(trip.routeId);
  const van = getVanById(trip.vanId);
  const isUserBooked = trip.passengers.some(p => p.id === currentUser?.id);
  const userBooking = trip.passengers.find(p => p.id === currentUser?.id);

  const handleCancelBooking = async () => {
    setIsLoading(true);
    try {
      const success = await cancelBooking(trip.id);
      if (success) {
        toast.success('Reserva cancelada com sucesso!');
        onOpenChange(false);
      } else {
        toast.error('Erro ao cancelar reserva');
      }
    } catch (error) {
      toast.error('Erro ao cancelar reserva');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{route?.name}</SheetTitle>
          <SheetDescription>
            Detalhes completos da viagem
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Status */}
          <div className="flex items-center gap-3">
            <Badge className={statusColors[trip.status]}>
              {statusLabels[trip.status]}
            </Badge>
            {isUserBooked && (
              <Badge variant="outline" className="bg-primary/5">
                Você está nesta viagem
              </Badge>
            )}
          </div>

          {/* Van Info */}
          <div className="p-4 bg-muted/30 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <Bus className="w-5 h-5 text-primary" />
              <h3 className="text-foreground">Veículo</h3>
            </div>
            <p className="text-foreground">{van?.model}</p>
            <p className="text-muted-foreground">{van?.plate}</p>
            <p className="text-muted-foreground">Capacidade: {van?.capacity} passageiros</p>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Data</span>
              </div>
              <p className="text-foreground">
                {new Date(trip.scheduledDate).toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Horário</span>
              </div>
              <p className="text-foreground">Saída: {trip.departureTime}</p>
              {trip.arrivalTime && (
                <p className="text-foreground">Chegada: {trip.arrivalTime}</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Route */}
          <div className="space-y-3">
            <h3 className="text-foreground flex items-center gap-2">
              <Navigation className="w-5 h-5 text-primary" />
              Rota
            </h3>
            
            <div className="space-y-3 pl-1">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <MapPin className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <p className="text-muted-foreground">Origem</p>
                  <p className="text-foreground">{route?.origin}</p>
                </div>
              </div>

              {route && route.waypoints.length > 2 && (
                <div className="pl-6 space-y-2">
                  <p className="text-muted-foreground">Paradas intermediárias</p>
                  {route.waypoints.slice(1, -1).map((waypoint, index) => (
                    <div key={index} className="flex items-center gap-2 text-foreground">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                      {waypoint.name}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <MapPin className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <p className="text-muted-foreground">Destino</p>
                  <p className="text-foreground">{route?.destination}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 text-muted-foreground">
              <span>Distância: {route?.distance} km</span>
              <span>•</span>
              <span>Duração: {route?.duration} min</span>
            </div>
          </div>

          <Separator />

          {/* Passengers */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Passageiros
              </h3>
              <Badge variant="outline">
                {trip.availableSeats} vagas disponíveis
              </Badge>
            </div>

            {trip.passengers.length > 0 ? (
              <div className="space-y-2">
                {trip.passengers.map((passenger) => (
                  <div
                    key={passenger.id}
                    className="p-3 bg-muted/30 rounded-lg space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <p className="text-foreground">{passenger.name}</p>
                      {passenger.id === currentUser?.id && (
                        <Badge variant="secondary" className="ml-auto">Você</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">
                      De: {passenger.pickupPoint}
                    </p>
                    <p className="text-muted-foreground">
                      Até: {passenger.dropoffPoint}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhum passageiro ainda</p>
            )}
          </div>

          <Separator />

          {/* Price */}
          <div className="p-4 bg-primary/5 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                <span className="text-foreground">Valor da passagem</span>
              </div>
              <span className="text-foreground">R$ {trip.price.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          {isUserBooked && userBooking && trip.status === 'scheduled' && (
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleCancelBooking}
              disabled={isLoading}
            >
              {isLoading ? 'Cancelando...' : 'Cancelar minha reserva'}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
