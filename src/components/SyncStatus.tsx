import { Cloud, CloudOff, CheckCircle, AlertCircle } from 'lucide-react';
import { SyncStatus as SyncStatusType } from '../hooks/useFirestoreSync';

interface SyncStatusProps {
  status: SyncStatusType;
  lastSyncTime?: Date | null;
  className?: string;
}

export function SyncStatus({ status, lastSyncTime, className = '' }: SyncStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'syncing':
        return {
          icon: <Cloud className="w-4 h-4 animate-pulse" />,
          text: 'Syncing...',
          color: 'text-yellow-500',
        };
      case 'synced':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          text: 'Synced',
          color: 'text-green-500',
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          text: 'Sync error',
          color: 'text-red-500',
        };
      case 'offline':
      default:
        return {
          icon: <CloudOff className="w-4 h-4" />,
          text: 'Offline',
          color: 'text-gray-400',
        };
    }
  };

  const config = getStatusConfig();

  // Format last sync time
  const formatSyncTime = (date: Date | null | undefined) => {
    if (!date) return '';
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  // Don't show if offline
  if (status === 'offline') {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <div className={`flex items-center gap-1.5 ${config.color}`}>
        {config.icon}
        <span>{config.text}</span>
      </div>
      {lastSyncTime && status === 'synced' && (
        <span className="text-xs text-muted-foreground">
          {formatSyncTime(lastSyncTime)}
        </span>
      )}
    </div>
  );
}
