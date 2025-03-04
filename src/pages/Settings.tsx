import React, { useState } from 'react';
import { Save, Bell, Lock, User, Globe, Mail, Shield, Smartphone, Key, Clock, AlertTriangle } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';
import { Modal } from '../components/Modal';

const Settings: React.FC = () => {
  const { settings, updateNotifications, updateProfile, updatePreferences } = useSettingsStore();
  const [notificationSettings, setNotificationSettings] = useState(settings.notifications);
  const [profileSettings, setProfileSettings] = useState(settings.profile);
  const [preferenceSettings, setPreferenceSettings] = useState(settings.preferences);
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    passwordLastChanged: '2024-02-15',
    sessionTimeout: 30,
    loginNotifications: true
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [twoFactorStep, setTwoFactorStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      updateProfile(profileSettings);
      updateNotifications(notificationSettings);
      updatePreferences(preferenceSettings);
      setIsSaving(false);
      
      // Show success message
      alert('Settings saved successfully!');
    }, 1000);
  };

  const handlePasswordChange = () => {
    // Validate password
    const errors: {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      // Simulate password change
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Show success message
        alert('Password changed successfully!');
      }, 1000);
    }
  };

  const handleSetupTwoFactor = () => {
    if (twoFactorStep === 1) {
      // Move to verification step
      setTwoFactorStep(2);
    } else {
      // Verify code
      if (verificationCode === '123456') { // Mock verification
        setSecuritySettings({
          ...securitySettings,
          twoFactorEnabled: true
        });
        setShowTwoFactorModal(false);
        setTwoFactorStep(1);
        setVerificationCode('');
        
        // Show success message
        alert('Two-factor authentication enabled successfully!');
      } else {
        alert('Invalid verification code. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <button 
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <Save size={20} />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-800">Profile Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileSettings.fullName}
                  onChange={(e) => setProfileSettings({...profileSettings, fullName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileSettings.email}
                  onChange={(e) => setProfileSettings({...profileSettings, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileSettings.phone}
                  onChange={(e) => setProfileSettings({...profileSettings, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={profileSettings.location}
                  onChange={(e) => setProfileSettings({...profileSettings, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-6 h-6 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-800">Security Settings</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Password</h3>
                  <p className="text-sm text-gray-500">Last changed on {securitySettings.passwordLastChanged}</p>
                </div>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Change
                </button>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500">
                      {securitySettings.twoFactorEnabled 
                        ? 'Enabled - Your account has an extra layer of security' 
                        : 'Disabled - Enable for additional security'}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowTwoFactorModal(true)}
                    className={`px-3 py-1 rounded ${
                      securitySettings.twoFactorEnabled 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {securitySettings.twoFactorEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Session Settings</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Session Timeout (minutes)</label>
                    <select
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="loginNotifications"
                      checked={securitySettings.loginNotifications}
                      onChange={(e) => setSecuritySettings({...securitySettings, loginNotifications: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="loginNotifications" className="ml-2 block text-sm text-gray-900">
                      Notify me of new login attempts
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-800">Preferences</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select 
                  value={preferenceSettings.language}
                  onChange={(e) => setPreferenceSettings({...preferenceSettings, language: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="ja">Japanese</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Zone
                </label>
                <select
                  value={preferenceSettings.timezone}
                  onChange={(e) => setPreferenceSettings({...preferenceSettings, timezone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time (ET)</option>
                  <option value="CST">Central Time (CT)</option>
                  <option value="MST">Mountain Time (MT)</option>
                  <option value="PST">Pacific Time (PT)</option>
                  <option value="IST">India Standard Time (IST)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Format
                </label>
                <select
                  value={preferenceSettings.dateFormat || 'MM/DD/YYYY'}
                  onChange={(e) => setPreferenceSettings({...preferenceSettings, dateFormat: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.emailNotifications}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    emailNotifications: e.target.checked
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Push Notifications</p>
                <p className="text-sm text-gray-500">Receive push notifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.pushNotifications}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    pushNotifications: e.target.checked
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Notify me about:</h3>
              
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notificationSettings.issueAssigned}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      issueAssigned: e.target.checked
                    })}
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Issues assigned to me</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notificationSettings.projectUpdates}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      projectUpdates: e.target.checked
                    })}
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Project updates</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notificationSettings.qaResults}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      qaResults: e.target.checked
                    })}
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">QA test results</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notificationSettings.apiAlerts}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      apiAlerts: e.target.checked
                    })}
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">API performance alerts</span>
                </label>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Notification Frequency:</h3>
              
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="frequency"
                    value="realtime"
                    checked={notificationSettings.frequency === 'realtime'}
                    onChange={() => setNotificationSettings({
                      ...notificationSettings,
                      frequency: 'realtime'
                    })}
                    className="border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Real-time</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="frequency"
                    value="hourly"
                    checked={notificationSettings.frequency === 'hourly'}
                    onChange={() => setNotificationSettings({
                      ...notificationSettings,
                      frequency: 'hourly'
                    })}
                    className="border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Hourly digest</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="frequency"
                    value="daily"
                    checked={notificationSettings.frequency === 'daily'}
                    onChange={() => setNotificationSettings({
                      ...notificationSettings,
                      frequency: 'daily'
                    })}
                    className="border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Daily digest</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
          setPasswordErrors({});
        }}
        title="Change Password"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                className={`w-full pl-10 pr-4 py-2 border ${
                  passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter current password"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
            {passwordErrors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                className={`w-full pl-10 pr-4 py-2 border ${
                  passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter new password"
              />
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
            {passwordErrors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                className={`w-full pl-10 pr-4 py-2 border ${
                  passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Confirm new password"
              />
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
            {passwordErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword}</p>
            )}
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
            <div className="flex items-start gap-2">
              <AlertTriangle size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Password Requirements</h4>
                <ul className="text-xs text-yellow-700 mt-1 list-disc list-inside">
                  <li>At least 8 characters long</li>
                  <li>Include at least one uppercase letter</li>
                  <li>Include at least one number</li>
                  <li>Include at least one special character</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordData({
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: ''
                });
                setPasswordErrors({});
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handlePasswordChange}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Change Password
            </button>
          </div>
        </div>
      </Modal>

      {/* Two-Factor Authentication Modal */}
      <Modal
        isOpen={showTwoFactorModal}
        onClose={() => {
          setShowTwoFactorModal(false);
          setTwoFactorStep(1);
          setVerificationCode('');
        }}
        title="Two-Factor Authentication"
      >
        {twoFactorStep === 1 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <Shield className="text-blue-500" size={24} />
              <div>
                <h3 className="font-medium text-blue-800">Enhanced Security</h3>
                <p className="text-sm text-blue-600">Two-factor authentication adds an extra layer of security to your account.</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">How it works:</h4>
              <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
                <li>Set up an authenticator app on your mobile device</li>
                <li>Scan the QR code or enter the setup key</li>
                <li>Enter the verification code to confirm setup</li>
                <li>You'll need to enter a code from the app each time you log in</li>
              </ol>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => {
                  setShowTwoFactorModal(false);
                  setTwoFactorStep(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setTwoFactorStep(2)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Continue
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <div className="mb-4 p-2 bg-white rounded">
                {/* Mock QR code */}
                <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">QR Code Placeholder</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Scan this QR code with your authenticator app or enter the code manually:
              </p>
              <div className="mt-2 p-2 bg-gray-100 rounded font-mono text-sm">
                ABCD-EFGH-IJKL-MNOP
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setTwoFactorStep(1)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleSetupTwoFactor}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                disabled={verificationCode.length !== 6}
              >
                Verify
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Settings;