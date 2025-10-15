import { useState } from 'react';
import { StoreProvider, useStore } from './contexts/Store';
import { AuthForm } from './components/AuthForm';
import { VanCard } from './components/VanCard';
import { RouteCard } from './components/RouteCard';
import { TripCard } from './components/TripCard';
import { TripDetail } from './components/TripDetail';
import { BookingForm } from './components/BookingForm';
import { MapView } from './components/MapView';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Toaster } from './components/ui/sonner';
import { 
  Bus, 
  Map, 
  Route, 
  Calendar, 
  LogOut, 
  User,
  Filter,
  MapPin
} from 'lucide-react';
import { Trip } from './mockData';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';

function AppContent() {
  const { 
    isAuthenticated, 
    currentUser, 
    logout, 
    vans, 
    routes, 
    trips,
    tripFilter,
    setTripFilter,
    vanFilter,
    setVanFilter,
  } = useStore();

  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [tripDetailOpen, setTripDetailOpen] = useState(false);
  const [bookingFormOpen, setBookingFormOpen] = useState(false);
  const [mapRoute, setMapRoute] = useState(routes[0]);

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  const handleViewTripDetails = (trip: Trip) => {
    setSelectedTrip(trip);
    setTripDetailOpen(true);
  };

  const handleBookTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setBookingFormOpen(true);
  };

  const handleViewRouteOnMap = (routeId: string) => {
    const route = routes.find(r => r.id === routeId);
    if (route) {
      setMapRoute(route);
    }
  };

  const filteredTrips = trips.filter(trip => 
    tripFilter === 'all' ? true : trip.status === tripFilter
  );

  const filteredVans = vans.filter(van => 
    vanFilter === 'all' ? true : van.status === vanFilter
  );

  const activeRoutes = routes.filter(r => r.active);

  // Stats
  const scheduledTrips = trips.filter(t => t.status === 'scheduled').length;
  const availableVans = vans.filter(v => v.status === 'available').length;
  const myTrips = trips.filter(t => t.passengers.some(p => p.id === currentUser?.id));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Bus className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-foreground">Easy Route</h1>
                <p className="text-muted-foreground">Sistema de transporte inteligente</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 rounded-lg">
                <User className="w-4 h-4 text-muted-foreground" />
                <div className="text-right">
                  <p className="text-foreground">{currentUser?.name}</p>
                  <p className="text-muted-foreground">
                    {currentUser?.role === 'passenger' ? 'Passageiro' : 'Motorista'}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="icon" onClick={logout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="dashboard" className="gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="trips" className="gap-2">
              <Route className="w-4 h-4" />
              <span className="hidden sm:inline">Viagens</span>
            </TabsTrigger>
            <TabsTrigger value="routes" className="gap-2">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Rotas</span>
            </TabsTrigger>
            <TabsTrigger value="vans" className="gap-2">
              <Bus className="w-4 h-4" />
              <span className="hidden sm:inline">Vans</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="gap-2">
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline">Mapa</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    Viagens agendadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">{scheduledTrips}</p>
                  <p className="text-muted-foreground">Próximas viagens disponíveis</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Bus className="w-5 h-5 text-green-500" />
                    Vans disponíveis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">{availableVans}</p>
                  <p className="text-muted-foreground">Prontas para uso</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-500" />
                    Minhas viagens
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">{myTrips.length}</p>
                  <p className="text-muted-foreground">Reservas ativas</p>
                </CardContent>
              </Card>
            </div>

            {/* My Trips */}
            {myTrips.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-foreground">Minhas Reservas</h2>
                  <Badge variant="secondary">{myTrips.length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myTrips.map((trip) => (
                    <TripCard
                      key={trip.id}
                      trip={trip}
                      onViewDetails={() => handleViewTripDetails(trip)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Trips */}
            <div className="space-y-4">
              <h2 className="text-foreground">Próximas Viagens</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trips
                  .filter(t => t.status === 'scheduled')
                  .slice(0, 6)
                  .map((trip) => (
                    <TripCard
                      key={trip.id}
                      trip={trip}
                      onViewDetails={() => handleViewTripDetails(trip)}
                      onBook={() => handleBookTrip(trip)}
                    />
                  ))}
              </div>
            </div>
          </TabsContent>

          {/* Trips Tab */}
          <TabsContent value="trips" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-foreground">Todas as Viagens</h2>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={tripFilter} onValueChange={(value: any) => setTripFilter(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="scheduled">Agendadas</SelectItem>
                    <SelectItem value="in-progress">Em andamento</SelectItem>
                    <SelectItem value="completed">Finalizadas</SelectItem>
                    <SelectItem value="cancelled">Canceladas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onViewDetails={() => handleViewTripDetails(trip)}
                  onBook={() => handleBookTrip(trip)}
                />
              ))}
            </div>

            {filteredTrips.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhuma viagem encontrada</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Routes Tab */}
          <TabsContent value="routes" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-foreground">Rotas Disponíveis</h2>
              <Badge variant="secondary">{activeRoutes.length} ativas</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {routes.map((route) => (
                <RouteCard
                  key={route.id}
                  route={route}
                  onViewDetails={() => handleViewRouteOnMap(route.id)}
                />
              ))}
            </div>
          </TabsContent>

          {/* Vans Tab */}
          <TabsContent value="vans" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-foreground">Frota de Vans</h2>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={vanFilter} onValueChange={(value: any) => setVanFilter(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="available">Disponíveis</SelectItem>
                    <SelectItem value="in-use">Em uso</SelectItem>
                    <SelectItem value="maintenance">Manutenção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVans.map((van) => (
                <VanCard key={van.id} van={van} />
              ))}
            </div>

            {filteredVans.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Bus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhuma van encontrada</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Map Tab */}
          <TabsContent value="map" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-foreground">Visualização de Rotas</h2>
              <Select 
                value={mapRoute.id} 
                onValueChange={(value) => {
                  const route = routes.find(r => r.id === value);
                  if (route) setMapRoute(route);
                }}
              >
                <SelectTrigger className="w-[250px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {routes.map((route) => (
                    <SelectItem key={route.id} value={route.id}>
                      {route.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <MapView route={mapRoute} vans={vans} className="h-[600px]" />
              </div>

              <div className="space-y-4">
                <RouteCard route={mapRoute} />
                
                <Card>
                  <CardHeader>
                    <CardTitle>Vans nesta rota</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {vans
                      .filter(v => v.status !== 'maintenance')
                      .slice(0, 3)
                      .map((van) => (
                        <div
                          key={van.id}
                          className="p-3 bg-muted/30 rounded-lg space-y-1"
                        >
                          <p className="text-foreground">{van.model}</p>
                          <p className="text-muted-foreground">{van.plate}</p>
                          <Badge className={
                            van.status === 'available' 
                              ? 'bg-green-500/10 text-green-500' 
                              : 'bg-yellow-500/10 text-yellow-500'
                          }>
                            {van.status === 'available' ? 'Disponível' : 'Em uso'}
                          </Badge>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modals */}
      <TripDetail
        trip={selectedTrip}
        open={tripDetailOpen}
        onOpenChange={setTripDetailOpen}
      />

      <BookingForm
        trip={selectedTrip}
        open={bookingFormOpen}
        onOpenChange={setBookingFormOpen}
      />

      <Toaster position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <div className="dark">
        <AppContent />
      </div>
    </StoreProvider>
  );
}
