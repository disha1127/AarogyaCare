import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/context/LanguageContext";
import { useOffline } from "@/context/OfflineContext";
import { hospitals as localHospitals } from "@/data/hospitals";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HospitalCard from "@/components/HospitalCard";
import { useToast } from "@/hooks/use-toast";
import { Hospital } from "@shared/schema";

// Leaflet map wrapper component
function Map({ 
  hospitals, 
  userLocation 
}: { 
  hospitals: Hospital[],
  userLocation: { lat: number, lng: number } | null
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    // Initialize map
    if (mapRef.current && !leafletMapRef.current && typeof L !== 'undefined') {
      // Default view of India
      const initialView = userLocation || { lat: 20.5937, lng: 78.9629 };
      const zoom = userLocation ? 10 : 5;
      
      leafletMapRef.current = L.map(mapRef.current).setView(
        [initialView.lat, initialView.lng], 
        zoom
      );
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(leafletMapRef.current);
      
      // Add user location marker if available
      if (userLocation) {
        L.marker([userLocation.lat, userLocation.lng], {
          icon: L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          })
        })
        .addTo(leafletMapRef.current)
        .bindPopup(t("yourLocation", "Your Location"));
      }
    }
    
    // Add hospital markers
    if (leafletMapRef.current && hospitals.length > 0) {
      // Clear existing markers
      if (markersRef.current.length > 0) {
        markersRef.current.forEach(marker => {
          if (leafletMapRef.current) {
            leafletMapRef.current.removeLayer(marker);
          }
        });
        markersRef.current = [];
      }
      
      // Add new markers
      hospitals.forEach(hospital => {
        const lat = parseFloat(hospital.latitude);
        const lng = parseFloat(hospital.longitude);
        
        if (!isNaN(lat) && !isNaN(lng)) {
          const marker = L.marker([lat, lng])
            .addTo(leafletMapRef.current)
            .bindPopup(`
              <b>${hospital.name}</b><br>
              ${hospital.address}, ${hospital.city}<br>
              <strong>${hospital.type}</strong>
              ${hospital.emergencyServices ? '<br><span style="color: #10b981;">Emergency Services Available</span>' : ''}
            `);
            
          markersRef.current.push(marker);
        }
      });
      
      // Adjust the map view to fit all markers if we have user location and hospitals
      if (markersRef.current.length > 0 && userLocation) {
        const group = L.featureGroup(markersRef.current);
        leafletMapRef.current.fitBounds(group.getBounds().pad(0.2));
      }
    }
    
    // Cleanup
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [hospitals, userLocation, t]);

  return (
    <div ref={mapRef} className="h-[500px] rounded-lg"></div>
  );
}

export default function HospitalFinder() {
  const { t } = useLanguage();
  const { isOffline, getOfflineData, saveOfflineData } = useOffline();
  const { toast } = useToast();
  const [locationQuery, setLocationQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [nearbyHospitals, setNearbyHospitals] = useState<Hospital[]>([]);
  const [activeTab, setActiveTab] = useState("map");

  // Fetch hospitals from API when online
  const { data: apiHospitals, isLoading } = useQuery({
    queryKey: ['/api/hospitals'],
    enabled: !isOffline
  });

  // If offline, use cached hospitals or fallback to local data
  useEffect(() => {
    const fetchOfflineHospitals = async () => {
      if (isOffline) {
        const offlineData = await getOfflineData<Hospital[]>('hospitals');
        if (offlineData && offlineData.length > 0) {
          setNearbyHospitals(offlineData);
        } else {
          setNearbyHospitals(localHospitals);
        }
      }
    };

    fetchOfflineHospitals();
  }, [isOffline, getOfflineData]);

  // When online, update hospitals based on API data
  useEffect(() => {
    if (!isOffline && apiHospitals) {
      setNearbyHospitals(apiHospitals);
      // Cache hospitals for offline use
      saveOfflineData('hospitals', apiHospitals);
    }
  }, [isOffline, apiHospitals, saveOfflineData]);

  // Get user's current location
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      toast({
        title: t("gettingLocation", "Getting your location..."),
        description: t("pleaseWait", "Please wait while we find your location."),
        duration: 3000,
      });
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          // In a real app, we would fetch nearby hospitals based on the location
          // For now, we'll just set all hospitals as nearby
          const allHospitals = !isOffline && apiHospitals ? apiHospitals : localHospitals;
          setNearbyHospitals(allHospitals);
          
          toast({
            title: t("locationFound", "Location found!"),
            description: t("hospitalsNearYou", "Showing hospitals near you."),
            duration: 3000,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: t("locationError", "Location Error"),
            description: t("locationErrorDesc", "Couldn't get your location. Please ensure location services are enabled."),
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: t("locationNotSupported", "Location Not Supported"),
        description: t("locationNotSupportedDesc", "Your browser does not support geolocation."),
        variant: "destructive",
      });
    }
  };

  // Search for hospitals by location name
  const handleSearchLocation = () => {
    if (!locationQuery.trim()) return;
    
    // In a real app, we would geocode the location query and fetch hospitals
    // For simplicity, we'll just show a toast and set all hospitals as results
    toast({
      title: t("searchingLocation", `Searching for "${locationQuery}"`),
      description: t("pleaseWait", "Please wait while we find hospitals near this location."),
      duration: 3000,
    });
    
    // Simulate a search with a timeout
    setTimeout(() => {
      const allHospitals = !isOffline && apiHospitals ? apiHospitals : localHospitals;
      setNearbyHospitals(allHospitals);
      
      // Set a dummy location for the map
      // In a real app, we would get coordinates from a geocoding API
      setUserLocation({ lat: 21.466, lng: 83.975 });
      
      toast({
        title: t("hospitalsFound", "Hospitals found!"),
        description: t("showingHospitalsInLocation", `Showing hospitals in "${locationQuery}".`),
        duration: 3000,
      });
    }, 1500);
  };

  return (
    <div className="container mx-auto max-w-7xl py-12 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{t("hospitalFinder", "Hospital Finder")}</h1>
        <p className="text-slate-600 max-w-3xl">
          {t("hospitalFinderDescription", "Find hospitals, healthcare centers, and clinics near you. Get directions, contact information, and details about available facilities.")}
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid gap-4 md:flex md:items-center md:gap-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                </svg>
              </div>
              <Input
                type="text"
                placeholder={t("enterLocation", "Enter your location")}
                className="pl-10"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchLocation()}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSearchLocation}>
                {t("search", "Search")}
              </Button>
              <Button variant="outline" onClick={handleUseCurrentLocation}>
                <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                </svg>
                {t("useCurrentLocation", "Use Current Location")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="map" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="map">{t("mapView", "Map View")}</TabsTrigger>
          <TabsTrigger value="list">{t("listView", "List View")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="map" className="mt-0">
          {isLoading ? (
            <div className="text-center py-12 bg-slate-100 rounded-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-3"></div>
              <p className="text-slate-500">{t("loading", "Loading...")}</p>
            </div>
          ) : (
            <Map hospitals={nearbyHospitals} userLocation={userLocation} />
          )}
        </TabsContent>
        
        <TabsContent value="list" className="mt-0">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-3"></div>
              <p className="text-slate-500">{t("loading", "Loading...")}</p>
            </div>
          ) : nearbyHospitals.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {nearbyHospitals.map(hospital => (
                <HospitalCard 
                  key={hospital.id} 
                  hospital={hospital} 
                  // Calculate distance if we have user location
                  distance={userLocation ? calculateDistance(
                    userLocation.lat, 
                    userLocation.lng, 
                    parseFloat(hospital.latitude), 
                    parseFloat(hospital.longitude)
                  ) : undefined}
                  onClick={() => {
                    setActiveTab("map");
                    // In a real app, we would also center the map on this hospital
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-slate-900">{t("noHospitalsFound", "No Hospitals Found")}</h3>
              <p className="mt-1 text-sm text-slate-500">{t("tryDifferentSearch", "Try searching with a different location.")}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {isOffline && (
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <svg className="h-6 w-6 text-amber-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-amber-800">
                {t("offlineMode", "Offline Mode")}
              </h3>
              <p className="text-sm text-amber-700 mt-1">
                {t("offlineHospitalsInfo", "You're viewing cached hospital data available offline. Some features like real-time location search may be limited.")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simplified distance calculation (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}
