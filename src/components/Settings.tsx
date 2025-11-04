import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Settings as SettingsIcon, User, Bell, Download, Upload, Trash2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { dataManagement } from '../utils/storage';

export function Settings() {
  const { settings, updateSettings } = useApp();
  const [showSuccess, setShowSuccess] = useState(false);

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
            alert('Data imported successfully! Please refresh the page.');
            window.location.reload();
          } else {
            alert('Error importing data. Please check the file format.');
          }
        } catch (error) {
          alert('Error parsing file. Please ensure it\'s a valid JSON file.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone!')) {
      if (confirm('This will delete ALL your workouts, exercises, and settings. Are you absolutely sure?')) {
        dataManagement.clearAll();
        alert('All data has been cleared. The page will now reload.');
        window.location.reload();
      }
    }
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

      {/* Notifications */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Bell className="w-5 h-5 text-primary" />
            Notifications
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Workout Reminders</p>
              <p className="text-sm text-muted-foreground">Get reminded about scheduled workouts</p>
            </div>
            <Switch
              checked={settings.notifications.workoutReminders}
              onCheckedChange={(checked) =>
                handleUpdateSettings({
                  notifications: { ...settings.notifications, workoutReminders: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Achievement Notifications</p>
              <p className="text-sm text-muted-foreground">Celebrate your milestones</p>
            </div>
            <Switch
              checked={settings.notifications.achievements}
              onCheckedChange={(checked) =>
                handleUpdateSettings({
                  notifications: { ...settings.notifications, achievements: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Streak Reminders</p>
              <p className="text-sm text-muted-foreground">Stay motivated with your streak</p>
            </div>
            <Switch
              checked={settings.notifications.streakReminders}
              onCheckedChange={(checked) =>
                handleUpdateSettings({
                  notifications: { ...settings.notifications, streakReminders: checked },
                })
              }
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
              Import Data
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Restore data from a previous backup
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
    </div>
  );
}
