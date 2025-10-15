import { Trip } from '../mockData';
import { useStore } from '../contexts/Store';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, Clock, Users, MapPin, DollarSign } from 'lucide-react';
import { Button } from './ui/button';

interface TripCardProps {
  trip: Trip;
  onViewDetails?: () => void;
  onBook?: () => void;
}

const statusColors = {
  scheduled: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
  'in-progress': 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
  completed: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
  cancelled: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
};

const statusLabels = {
  scheduled: 'Agendada',
  'in-progress': 'Em andamento',
  completed: 'Finalizada',
  cancelled: 'Cancelada',
};

export function TripCard({ trip, onViewDetails, onBook }: TripCardProps) {
  const { getRouteById, getVanById, currentUser } = useStore();
  const route = getRouteById(trip.routeId);
  const van = getVanById(trip.vanId);

  const isUserBooked = trip.passengers.some(p => p.id === currentUser?.id);
  const canBook = trip.status === 'scheduled' && trip.availableSeats > 0 && !isUserBooked;

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/50">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-foreground">{route?.name}</CardTitle>
            <p className="text-muted-foreground">{van?.model}</p>
          </div>
          <Badge className={statusColors[trip.status]}>
            {statusLabels[trip.status]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Data</p>
              <p className="text-foreground">
                {new Date(trip.scheduledDate).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Saída</p>
              <p className="text-foreground">{trip.departureTime}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-green-500 mt-1" />
            <div className="flex-1">
              <p className="text-muted-foreground">Origem</p>
              <p className="text-foreground">{route?.origin}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-red-500 mt-1" />
            <div className="flex-1">
              <p className="text-muted-foreground">Destino</p>
              <p className="text-foreground">{route?.destination}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">
                {trip.availableSeats} vagas
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">
                R$ {trip.price.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {isUserBooked && (
          <Badge variant="outline" className="w-full justify-center bg-primary/5">
            Você está nesta viagem
          </Badge>
        )}

        <div className="flex gap-2">
          {onViewDetails && (
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={onViewDetails}
            >
              Ver detalhes
            </Button>
          )}
          {canBook && onBook && (
            <Button 
              className="flex-1"
              onClick={onBook}
            >
              Reservar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
