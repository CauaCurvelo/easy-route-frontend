import { useState } from 'react';
import { Trip } from '../mockData';
import { useStore } from '../contexts/Store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';
import { MapPin, DollarSign, Calendar, Clock } from 'lucide-react';

interface BookingFormProps {
  trip: Trip | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingForm({ trip, open, onOpenChange }: BookingFormProps) {
  const { getRouteById, bookTrip } = useStore();
  const [pickupPoint, setPickupPoint] = useState('');
  const [dropoffPoint, setDropoffPoint] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!trip) return null;

  const route = getRouteById(trip.routeId);
  const waypoints = route?.waypoints || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pickupPoint || !dropoffPoint) {
      toast.error('Selecione os pontos de embarque e desembarque');
      return;
    }

    if (pickupPoint === dropoffPoint) {
      toast.error('Os pontos de embarque e desembarque devem ser diferentes');
      return;
    }

    setIsLoading(true);
    try {
      const success = await bookTrip(trip.id, pickupPoint, dropoffPoint);
      if (success) {
        toast.success('Reserva realizada com sucesso!');
        onOpenChange(false);
        setPickupPoint('');
        setDropoffPoint('');
      } else {
        toast.error('Erro ao realizar reserva');
      }
    } catch (error) {
      toast.error('Erro ao realizar reserva');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reservar viagem</DialogTitle>
          <DialogDescription>
            Complete as informações para confirmar sua reserva
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Trip Info */}
          <div className="p-4 bg-muted/30 rounded-lg space-y-2">
            <h3 className="text-foreground">{route?.name}</h3>
            
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(trip.scheduledDate).toLocaleDateString('pt-BR')}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {trip.departureTime}
              </div>
            </div>

            <div className="flex items-center gap-2 text-foreground pt-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span>R$ {trip.price.toFixed(2)}</span>
            </div>
          </div>

          {/* Pickup Point */}
          <div className="space-y-2">
            <Label htmlFor="pickup">
              <MapPin className="w-4 h-4 inline mr-2 text-green-500" />
              Ponto de embarque
            </Label>
            <Select value={pickupPoint} onValueChange={setPickupPoint}>
              <SelectTrigger id="pickup">
                <SelectValue placeholder="Selecione o ponto de embarque" />
              </SelectTrigger>
              <SelectContent>
                {waypoints.map((waypoint, index) => (
                  <SelectItem key={index} value={waypoint.name}>
                    {waypoint.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dropoff Point */}
          <div className="space-y-2">
            <Label htmlFor="dropoff">
              <MapPin className="w-4 h-4 inline mr-2 text-red-500" />
              Ponto de desembarque
            </Label>
            <Select value={dropoffPoint} onValueChange={setDropoffPoint}>
              <SelectTrigger id="dropoff">
                <SelectValue placeholder="Selecione o ponto de desembarque" />
              </SelectTrigger>
              <SelectContent>
                {waypoints.map((waypoint, index) => (
                  <SelectItem key={index} value={waypoint.name}>
                    {waypoint.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Available Seats Info */}
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-foreground">
              {trip.availableSeats} {trip.availableSeats === 1 ? 'vaga disponível' : 'vagas disponíveis'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? 'Reservando...' : 'Confirmar reserva'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
