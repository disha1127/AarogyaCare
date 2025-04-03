import React, { useEffect, useRef, useState } from 'react';
import { Hospital } from '@/data/hospitals';
import { useLanguage } from '@/providers/LanguageProvider';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useOffline } from '@/providers/OfflineProvider';
import { useToast } from '@/hooks/use-toast';

interface HospitalMapProps {
  hospitals: Hospital[];
  onHospitalSelect: (hospital: Hospital) => void;
  selectedHospital?: Hospital;
}

const HospitalMap: React.FC<HospitalMapProps> = ({ 
  hospitals, 
  onHospitalSelect,
  selectedHospital 
}) => {
  const { t } = useLanguage();
  const { isOffline } = useOffline();
  const { toast } = useToast();
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapObject, setMapObject] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [locationSearch, setLocationSearch] = useState('');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapObject) return;
    
    try {
      // Check if Leaflet is available
      if (typeof L === 'undefined') {
        throw new Error('Leaflet library not loaded');
      }
      
      // Create map instance
      const map = L.map(mapRef.current).setView([20.5937, 78.9629], 5);
      
      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
      
      setMapObject(map);
      setIsLoading(false);
      
      // Try to get user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation([latitude, longitude]);
            map.setView([latitude, longitude], 10);
            
            // Add user marker
            L.marker([latitude, longitude], {
              icon: L.divIcon({
                className: 'user-location-marker',
                html: '<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md"></div>',
                iconSize: [20, 20]
              })
            }).addTo(map).bindPopup(t('yourLocation'));
          },
          (error) => {
            console.error('Error getting location:', error);
            toast({
              title: t('locationError'),
              description: t('locationErrorDesc'),
              variant: 'destructive'
            });
          }
        );
      }
      
      return () => {
        map.remove();
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      setIsLoading(false);
      toast({
        title: t('mapError'),
        description: t('mapErrorDesc'),
        variant: 'destructive'
      });
    }
  }, [mapRef, mapObject, t, toast]);

  // Add hospital markers when hospitals or map changes
  useEffect(() => {
    if (!mapObject || !hospitals.length) return;
    
    // Clear existing markers
    markers.forEach(marker => marker.remove());
    
    // Create marker cluster group
    const markerClusterGroup = L.markerClusterGroup();
    const newMarkers = [];
    
    // Add markers for each hospital
    for (const hospital of hospitals) {
      const marker = L.marker([hospital.latitude, hospital.longitude])
        .bindPopup(`<b>${hospital.name}</b><br>${hospital.city}, ${hospital.state}`);
      
      marker.on('click', () => {
        onHospitalSelect(hospital);
      });
      
      markerClusterGroup.addLayer(marker);
      newMarkers.push(marker);
    }
    
    mapObject.addLayer(markerClusterGroup);
    setMarkers(newMarkers);
    
    // If there's a selected hospital, focus on it
    if (selectedHospital) {
      mapObject.setView(
        [selectedHospital.latitude, selectedHospital.longitude], 
        12
      );
    }
    
    return () => {
      markerClusterGroup.clearLayers();
    };
  }, [mapObject, hospitals, onHospitalSelect, selectedHospital]);

  // Handle location search
  const handleLocationSearch = () => {
    if (!locationSearch.trim() || !mapObject) return;
    
    if (isOffline) {
      toast({
        title: t('offlineSearchError'),
        description: t('offlineSearchErrorDesc'),
        variant: 'destructive'
      });
      return;
    }
    
    // In a real app, use a geocoding service like Nominatim or Google Maps
    // For this demo, we'll just show a toast message
    toast({
      title: t('searchingFor').replace('{location}', locationSearch),
      description: t('searchingDesc')
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-slate-400" />
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              placeholder={t('enterYourLocation')}
              className="pl-10"
            />
            <Button onClick={handleLocationSearch} disabled={isOffline || !locationSearch.trim()}>
              {t('search')}
            </Button>
          </div>
        </div>
      </div>
      
      <div 
        ref={mapRef} 
        className="h-80 rounded-lg bg-slate-100 relative"
        style={{ minHeight: '320px' }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-3"></div>
              <p className="text-slate-500">{t('loadingMapData')}</p>
            </div>
          </div>
        )}
        
        {isOffline && (
          <div className="absolute bottom-4 left-4 right-4 bg-amber-100 text-amber-800 p-2 rounded-md text-sm">
            {t('offlineMapWarning')}
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalMap;
