import { Van } from '../mockData';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Bus, Users, MapPin, Wifi, Wind, Usb, Accessibility } from 'lucide-react';

interface VanCardProps {
  van: Van;
  onClick?: () => void;
}

const statusColors = {
  available: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
  'in-use': 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
  maintenance: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
};

const statusLabels = {
  available: 'Disponível',
  'in-use': 'Em uso',
  maintenance: 'Manutenção',
};

const featureIcons: Record<string, any> = {
  'Ar condicionado': Wind,
  'Wi-Fi': Wifi,
  'USB': Usb,
  'Acessibilidade': Accessibility,
};

export function VanCard({ van, onClick }: VanCardProps) {
  return (
    <Card 
      className="hover:shadow-lg transition-all duration-200 cursor-pointer border-border/50 hover:border-primary/50"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bus className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-foreground">{van.model}</CardTitle>
              <p className="text-muted-foreground">{van.plate}</p>
            </div>
          </div>
          <Badge className={statusColors[van.status]}>
            {statusLabels[van.status]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>Capacidade: {van.capacity} passageiros</span>
        </div>

        {van.currentLocation && (
          <div className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{van.currentLocation.address}</span>
          </div>
        )}

        {van.features.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {van.features.map((feature) => {
              const Icon = featureIcons[feature];
              return (
                <Badge key={feature} variant="outline" className="gap-1">
                  {Icon && <Icon className="w-3 h-3" />}
                  {feature}
                </Badge>
              );
            })}
          </div>
        )}

        <div className="pt-2 border-t border-border">
          <p className="text-muted-foreground">
            Motorista: <span className="text-foreground">{van.driverName}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
