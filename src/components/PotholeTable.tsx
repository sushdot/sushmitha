import { Pothole } from '@/types/pothole';
import { StatusBadge } from './StatusBadge';
import { MapPin, Calendar, Clock, User } from 'lucide-react';

interface PotholeTableProps {
  potholes: Pothole[];
}

export function PotholeTable({ potholes }: PotholeTableProps) {
  return (
    <div className="bg-card rounded-xl shadow-card overflow-hidden animate-fade-in">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Pothole Lifecycle Tracking</h3>
        <p className="text-sm text-muted-foreground mt-1">Real-time status of all reported potholes</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead className="bg-muted/50">
            <tr>
              <th>Pothole ID</th>
              <th>Location</th>
              <th>Status</th>
              <th>Days Open</th>
              <th>SLA Status</th>
              <th>Contractor</th>
            </tr>
          </thead>
          <tbody>
            {potholes.map((pothole, index) => (
              <tr 
                key={pothole.id} 
                className="hover:bg-muted/30 transition-colors"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td>
                  <span className="font-mono text-sm font-medium text-primary">
                    {pothole.id}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{pothole.location}</span>
                  </div>
                </td>
                <td>
                  <StatusBadge status={pothole.status} />
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{pothole.daysOpen}</span>
                    <span className="text-muted-foreground text-xs">days</span>
                  </div>
                </td>
                <td>
                  <StatusBadge status={pothole.slaStatus} size="sm" />
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{pothole.contractor}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
