export interface User {
  id: string;
  name: string;
  email: string;
  role: 'passenger' | 'driver';
  phone: string;
  avatar?: string;
}

export interface Van {
  id: string;
  model: string;
  plate: string;
  capacity: number;
  driverId: string;
  driverName: string;
  status: 'available' | 'in-use' | 'maintenance';
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  features: string[];
}

export interface Route {
  id: string;
  name: string;
  origin: string;
  destination: string;
  distance: number; // km
  duration: number; // minutes
  waypoints: Array<{
    lat: number;
    lng: number;
    name: string;
  }>;
  price: number;
  active: boolean;
}

export interface Trip {
  id: string;
  routeId: string;
  vanId: string;
  driverId: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  departureTime: string;
  arrivalTime?: string;
  passengers: Array<{
    id: string;
    name: string;
    pickupPoint: string;
    dropoffPoint: string;
  }>;
  availableSeats: number;
  price: number;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
    role: 'passenger',
    phone: '+55 11 98765-4321',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@example.com',
    role: 'driver',
    phone: '+55 11 91234-5678',
  },
];

// Mock Vans
export const mockVans: Van[] = [
  {
    id: 'v1',
    model: 'Mercedes-Benz Sprinter',
    plate: 'ABC-1234',
    capacity: 16,
    driverId: '2',
    driverName: 'Maria Santos',
    status: 'available',
    currentLocation: {
      lat: -23.5505,
      lng: -46.6333,
      address: 'Av. Paulista, 1000 - São Paulo, SP',
    },
    features: ['Ar condicionado', 'Wi-Fi', 'USB', 'Acessibilidade'],
  },
  {
    id: 'v2',
    model: 'Fiat Ducato',
    plate: 'XYZ-5678',
    capacity: 14,
    driverId: '2',
    driverName: 'Maria Santos',
    status: 'in-use',
    currentLocation: {
      lat: -23.5629,
      lng: -46.6544,
      address: 'R. da Consolação, 2000 - São Paulo, SP',
    },
    features: ['Ar condicionado', 'Câmera de ré'],
  },
  {
    id: 'v3',
    model: 'Renault Master',
    plate: 'DEF-9012',
    capacity: 15,
    driverId: '2',
    driverName: 'Maria Santos',
    status: 'maintenance',
    features: ['Ar condicionado', 'Wi-Fi'],
  },
];

// Mock Routes
export const mockRoutes: Route[] = [
  {
    id: 'r1',
    name: 'Centro - Zona Sul',
    origin: 'Praça da Sé, Centro',
    destination: 'Shopping Morumbi',
    distance: 12.5,
    duration: 35,
    waypoints: [
      { lat: -23.5505, lng: -46.6333, name: 'Praça da Sé' },
      { lat: -23.5629, lng: -46.6544, name: 'Av. Paulista' },
      { lat: -23.5955, lng: -46.6989, name: 'Shopping Morumbi' },
    ],
    price: 15.0,
    active: true,
  },
  {
    id: 'r2',
    name: 'Aeroporto - Centro',
    origin: 'Aeroporto de Guarulhos',
    destination: 'Estação da Luz',
    distance: 28.0,
    duration: 50,
    waypoints: [
      { lat: -23.4356, lng: -46.4731, name: 'Aeroporto GRU' },
      { lat: -23.5261, lng: -46.5253, name: 'Av. Cruzeiro do Sul' },
      { lat: -23.5345, lng: -46.6356, name: 'Estação da Luz' },
    ],
    price: 35.0,
    active: true,
  },
  {
    id: 'r3',
    name: 'Zona Leste - Zona Oeste',
    origin: 'Itaquera',
    destination: 'Lapa',
    distance: 18.0,
    duration: 45,
    waypoints: [
      { lat: -23.5404, lng: -46.4564, name: 'Itaquera' },
      { lat: -23.5505, lng: -46.6333, name: 'Centro' },
      { lat: -23.5282, lng: -46.7012, name: 'Lapa' },
    ],
    price: 20.0,
    active: false,
  },
];

// Mock Trips
export const mockTrips: Trip[] = [
  {
    id: 't1',
    routeId: 'r1',
    vanId: 'v1',
    driverId: '2',
    status: 'scheduled',
    scheduledDate: '2025-10-16',
    departureTime: '08:00',
    passengers: [
      {
        id: '1',
        name: 'João Silva',
        pickupPoint: 'Praça da Sé',
        dropoffPoint: 'Shopping Morumbi',
      },
    ],
    availableSeats: 15,
    price: 15.0,
  },
  {
    id: 't2',
    routeId: 'r2',
    vanId: 'v2',
    driverId: '2',
    status: 'in-progress',
    scheduledDate: '2025-10-15',
    departureTime: '14:30',
    passengers: [
      {
        id: '3',
        name: 'Pedro Costa',
        pickupPoint: 'Aeroporto GRU',
        dropoffPoint: 'Estação da Luz',
      },
      {
        id: '4',
        name: 'Ana Lima',
        pickupPoint: 'Aeroporto GRU',
        dropoffPoint: 'Av. Cruzeiro do Sul',
      },
    ],
    availableSeats: 12,
    price: 35.0,
  },
  {
    id: 't3',
    routeId: 'r1',
    vanId: 'v1',
    driverId: '2',
    status: 'completed',
    scheduledDate: '2025-10-14',
    departureTime: '09:00',
    arrivalTime: '09:40',
    passengers: [
      {
        id: '1',
        name: 'João Silva',
        pickupPoint: 'Praça da Sé',
        dropoffPoint: 'Av. Paulista',
      },
    ],
    availableSeats: 0,
    price: 15.0,
  },
  {
    id: 't4',
    routeId: 'r2',
    vanId: 'v1',
    driverId: '2',
    status: 'cancelled',
    scheduledDate: '2025-10-13',
    departureTime: '16:00',
    passengers: [],
    availableSeats: 16,
    price: 35.0,
  },
];
