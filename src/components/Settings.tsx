import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Settings as SettingsIcon, User, Bell, Download, Upload, Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { dataManagement } from '../utils/storage';
import { clearDemoMode } from '../utils/demoData';
import { DangerConfirmModal } from './ui/modal';
import { useToast } from '../contexts/ToastContext';

export function Settings() {
  const { settings, updateSettings } = useApp();
  const { toast } = useToast();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showClearDataModal, setShowClearDataModal] = useState(false);
  const [showStartOverModal, setShowStartOverModal] = useState(false);

  const handleUpdateSettings = (updates: any) => {
    updateSettings(updates);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleExportData = () => {
    const data = dataManagement.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `checkpoint-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully!');
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (dataManagement.importAll(data)) {
            toast.success('Data imported successfully! Refreshing...');
            setTimeout(() => window.location.reload(), 1500);
          } else {
            toast.error('Error importing data. Please check the file format.');
          }
        } catch (error) {
          toast.error('Error parsing file. Please ensure it\'s a valid JSON file.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleClearData = () => {
    setShowClearDataModal(true);
  };

  const confirmClearData = () => {
    dataManagement.clearAll();
    toast.success('All data has been cleared. Reloading...');
    setTimeout(() => window.location.reload(), 1500);
  };

  const handleStartOver = () => {
    setShowStartOverModal(true);
  };

  const confirmStartOver = () => {
    clearDemoMode();
    dataManagement.clearAll();
    toast.success('Starting fresh! Reloading...');
    setTimeout(() => window.location.reload(), 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Customize your Checkpoint experience
        </p>
      </div>

      {showSuccess && (
        <div className="bg-accent/20 border-2 border-accent rounded-lg p-4">
          <p className="text-accent font-semibold">Settings saved successfully!</p>
        </div>
      )}

      {/* Preferences */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <SettingsIcon className="w-5 h-5 text-primary" />
            Preferences
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Adjust your workout and app preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="theme" className="text-foreground">Theme</Label>
            <Select
              value={settings.theme}
              onValueChange={(value: any) => handleUpdateSettings({ theme: value })}
            >
              <SelectTrigger id="theme" className="bg-input text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="units" className="text-foreground">Unit System</Label>
            <Select
              value={settings.unitSystem}
              onValueChange={(value: any) => handleUpdateSettings({ unitSystem: value })}
            >
              <SelectTrigger id="units" className="bg-input text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="imperial">Imperial (lbs, mi)</SelectItem>
                <SelectItem value="metric">Metric (kg, km)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="restTime" className="text-foreground">
              Default Rest Time (seconds)
            </Label>
            <Input
              id="restTime"
              type="number"
              value={settings.defaultRestTime}
              onChange={(e) =>
                handleUpdateSettings({ defaultRestTime: parseInt(e.target.value) || 90 })
              }
              className="bg-input text-foreground"
              min="30"
              max="300"
            />
          </div>
        </CardContent>
      </Card>


      {/* Data Management */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <User className="w-5 h-5 text-primary" />
            Data Management
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Export, import, or clear your data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Button
              onClick={handleExportData}
              variant="outline"
              className="w-full justify-start"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data (JSON)
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Download all your workout data as a backup
            </p>
          </div>

          <div>
            <Button
              onClick={handleImportData}
              variant="outline"
              className="w-full justify-start"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Data (JSON)
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Restore your data from a previous backup
            </p>
          </div>

          <div>
            <Button
              onClick={handleStartOver}
              variant="outline"
              className="w-full justify-start"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Start Over
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Clear all data and return to welcome screen
            </p>
          </div>

          <div className="pt-4 border-t border-border">
            <Button
              onClick={handleClearData}
              variant="destructive"
              className="w-full justify-start"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Data
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Permanently delete all your data (cannot be undone)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">About Checkpoint</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p><strong className="text-foreground">Version:</strong> 1.0.0</p>
          <p><strong className="text-foreground">Build:</strong> Production</p>
          <p className="pt-4">
            Checkpoint is your comprehensive fitness tracking companion. Track workouts,
            monitor progress, and achieve your fitness goals.
          </p>
        </CardContent>
      </Card>

      {/* Clear Data Modal */}
      <DangerConfirmModal
        isOpen={showClearDataModal}
        onClose={() => setShowClearDataModal(false)}
        onConfirm={confirmClearData}
        title="Clear All Data?"
        description="This will permanently delete ALL your workouts, exercises, body measurements, and settings. This action cannot be undone!"
        confirmText="Clear All Data"
        cancelText="Cancel"
        requiredInput="DELETE"
        icon={<AlertTriangle className="w-8 h-8 text-red-600" />}
      />

      {/* Start Over Modal */}
      <DangerConfirmModal
        isOpen={showStartOverModal}
        onClose={() => setShowStartOverModal(false)}
        onConfirm={confirmStartOver}
        title="Start Over?"
        description="This will clear all your current data and return you to the welcome screen. You'll start with a fresh profile. This action cannot be undone!"
        confirmText="Start Over"
        cancelText="Cancel"
        requiredInput="RESET"
        icon={<AlertTriangle className="w-8 h-8 text-red-600" />}
      />
    </div>
  );
}
