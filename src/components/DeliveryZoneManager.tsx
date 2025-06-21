import React from 'react';
import { MapPin, Clock, DollarSign } from 'lucide-react';
import { useDeliveryZones } from '../hooks/useSupabase';

interface DeliveryZoneManagerProps {
  onZoneSelect: (zone: any) => void;
  selectedZone?: any;
}

const DeliveryZoneManager: React.FC<DeliveryZoneManagerProps> = ({ onZoneSelect, selectedZone }) => {
  const { data: zones, loading } = useDeliveryZones();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const activeZones = zones.filter(zone => zone.is_active);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">مناطق التوصيل</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeZones.map((zone) => (
          <div
            key={zone.id}
            onClick={() => onZoneSelect(zone)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedZone?.id === zone.id
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{zone.name}</h4>
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="h-4 w-4 ml-1" />
                {zone.delivery_fee} ج.م
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 ml-1" />
                {zone.estimated_time} دقيقة
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 ml-1" />
                الحد الأدنى: {zone.min_order_amount} ج.م
              </div>
              
              <div className="text-xs text-gray-500">
                المناطق: {zone.areas.join('، ')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryZoneManager;