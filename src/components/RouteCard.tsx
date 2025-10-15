import { Route } from '../mockData';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Navigation, Clock, DollarSign } from 'lucide-react';
import { Button } from './ui/button';

interface RouteCardProps {
  route: Route;
  onViewDetails?: () => void;
}

export function RouteCard({ route, onViewDetails }: RouteCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/50">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-foreground">{route.name}</CardTitle>
          <Badge variant={route.active ? 'default' : 'secondary'}>
            {route.active ? 'Ativa' : 'Inativa'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg mt-0.5">
              <MapPin className="w-4 h-4 text-green-500" />
            </div>
            <div className="flex-1">
              <p className="text-muted-foreground">Origem</p>
              <p className="text-foreground">{route.origin}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg mt-0.5">
              <MapPin className="w-4 h-4 text-red-500" />
            </div>
            <div className="flex-1">
              <p className="text-muted-foreground">Destino</p>
              <p className="text-foreground">{route.destination}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Distância</p>
              <p className="text-foreground">{route.distance} km</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Duração</p>
              <p className="text-foreground">{route.duration} min</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Preço</p>
              <p className="text-foreground">R$ {route.price.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {onViewDetails && (
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={onViewDetails}
          >
            Ver no mapa
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
