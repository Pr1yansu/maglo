import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  Lock,
  User,
  Palette,
  Shield,
  CreditCard,
  Download,
  Trash2,
  Settings as SettingsIcon,
} from "lucide-react";
import { ThemeSwitcher } from "@/components/ui/mode-toggle";

const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: true,
    security: true,
  });

  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
    company: "Maglo Inc.",
    timezone: "UTC-5",
  });

  const handleNotificationChange = (key: string) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const handleProfileChange = (key: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <SettingsIcon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      {/* Profile Settings */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Profile Information</h2>
        </div>

        <div className="bg-card border rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => handleProfileChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleProfileChange("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => handleProfileChange("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={profile.company}
                onChange={(e) => handleProfileChange("company", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Appearance Settings */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Palette className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Appearance</h2>
        </div>

        <div className="bg-card border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Theme</h3>
              <p className="text-sm text-muted-foreground">
                Choose your preferred theme
              </p>
            </div>
            <ThemeSwitcher />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Language</h3>
              <p className="text-sm text-muted-foreground">
                Select your preferred language
              </p>
            </div>
            <select
              className="px-3 py-2 border rounded-md bg-background"
              title="Select your preferred language"
              aria-label="Language selection"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
        </div>
      </div>

      <Separator />

      {/* Notification Settings */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Notifications</h2>
        </div>

        <div className="bg-card border rounded-lg p-6 space-y-4">
          {Object.entries({
            email: "Email Notifications",
            push: "Push Notifications",
            marketing: "Marketing Updates",
            security: "Security Alerts",
          }).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{label}</h3>
                <p className="text-sm text-muted-foreground">
                  Receive {label.toLowerCase()} about your account
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notifications[key as keyof typeof notifications]}
                  onChange={() => handleNotificationChange(key)}
                  aria-label={`Toggle ${label}`}
                  title={`Toggle ${label}`}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Security Settings */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Security</h2>
        </div>

        <div className="bg-card border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Password</h3>
              <p className="text-sm text-muted-foreground">
                Last changed 3 months ago
              </p>
            </div>
            <Button variant="outline">
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security
              </p>
            </div>
            <Button variant="outline">Enable 2FA</Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Active Sessions</h3>
              <p className="text-sm text-muted-foreground">
                Manage your active sessions
              </p>
            </div>
            <Button variant="outline">View Sessions</Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Billing Settings */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Billing & Subscription</h2>
        </div>

        <div className="bg-card border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Current Plan</h3>
              <p className="text-sm text-muted-foreground">
                Pro Plan - $29/month
              </p>
            </div>
            <Button variant="outline">Upgrade Plan</Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Payment Method</h3>
              <p className="text-sm text-muted-foreground">
                •••• •••• •••• 4242
              </p>
            </div>
            <Button variant="outline">Update Payment</Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Billing History</h3>
              <p className="text-sm text-muted-foreground">
                Download your invoices
              </p>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Danger Zone */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Trash2 className="h-5 w-5 text-destructive" />
          <h2 className="text-xl font-semibold text-destructive">
            Danger Zone
          </h2>
        </div>

        <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-destructive">Delete Account</h3>
              <p className="text-sm text-muted-foreground">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
            </div>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
