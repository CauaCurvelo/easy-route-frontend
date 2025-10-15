import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Van, Route, Trip, mockUsers, mockVans, mockRoutes, mockTrips } from '../mockData';

interface StoreContextType {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: 'passenger' | 'driver') => Promise<boolean>;

  // Vans
  vans: Van[];
  getVanById: (id: string) => Van | undefined;

  // Routes
  routes: Route[];
  getRouteById: (id: string) => Route | undefined;

  // Trips
  trips: Trip[];
  getTripById: (id: string) => Trip | undefined;
  bookTrip: (tripId: string, pickupPoint: string, dropoffPoint: string) => Promise<boolean>;
  cancelBooking: (tripId: string) => Promise<boolean>;
  
  // Filters
  tripFilter: 'all' | 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  setTripFilter: (filter: 'all' | 'scheduled' | 'in-progress' | 'completed' | 'cancelled') => void;
  vanFilter: 'all' | 'available' | 'in-use' | 'maintenance';
  setVanFilter: (filter: 'all' | 'available' | 'in-use' | 'maintenance') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [vans, setVans] = useState<Van[]>(mockVans);
  const [routes, setRoutes] = useState<Route[]>(mockRoutes);
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [tripFilter, setTripFilter] = useState<'all' | 'scheduled' | 'in-progress' | 'completed' | 'cancelled'>('all');
  const [vanFilter, setVanFilter] = useState<'all' | 'available' | 'in-use' | 'maintenance'>('all');

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulated API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = async (name: string, email: string, password: string, role: 'passenger' | 'driver'): Promise<boolean> => {
    // Simulated API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newUser: User = {
      id: String(Date.now()),
      name,
      email,
      role,
      phone: '+55 11 00000-0000',
    };
    
    setCurrentUser(newUser);
    return true;
  };

  const getVanById = (id: string) => vans.find(v => v.id === id);
  const getRouteById = (id: string) => routes.find(r => r.id === id);
  const getTripById = (id: string) => trips.find(t => t.id === id);

  const bookTrip = async (tripId: string, pickupPoint: string, dropoffPoint: string): Promise<boolean> => {
    if (!currentUser) return false;

    // Simulated API call
    await new Promise(resolve => setTimeout(resolve, 500));

    setTrips(prevTrips => prevTrips.map(trip => {
      if (trip.id === tripId && trip.availableSeats > 0) {
        return {
          ...trip,
          passengers: [
            ...trip.passengers,
            {
              id: currentUser.id,
              name: currentUser.name,
              pickupPoint,
              dropoffPoint,
            },
          ],
          availableSeats: trip.availableSeats - 1,
        };
      }
      return trip;
    }));

    return true;
  };

  const cancelBooking = async (tripId: string): Promise<boolean> => {
    if (!currentUser) return false;

    // Simulated API call
    await new Promise(resolve => setTimeout(resolve, 500));

    setTrips(prevTrips => prevTrips.map(trip => {
      if (trip.id === tripId) {
        const updatedPassengers = trip.passengers.filter(p => p.id !== currentUser.id);
        return {
          ...trip,
          passengers: updatedPassengers,
          availableSeats: trip.availableSeats + (trip.passengers.length - updatedPassengers.length),
        };
      }
      return trip;
    }));

    return true;
  };

  return (
    <StoreContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
        register,
        vans,
        getVanById,
        routes,
        getRouteById,
        trips,
        getTripById,
        bookTrip,
        cancelBooking,
        tripFilter,
        setTripFilter,
        vanFilter,
        setVanFilter,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};
