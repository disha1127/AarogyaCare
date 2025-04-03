import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useOffline } from '@/context/OfflineContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Settings, Bell, Download, Lock, Activity } from 'lucide-react';

interface ProfileData {
  name: string;
  age: string;
  gender: string;
  bloodGroup: string;
  allergies: string;
  medications: string;
  emergencyContact: string;
  carePreferences: {
    receiveEmergencyAlerts: boolean;
    shareDataWithDoctors: boolean;
    offlineAccessEnabled: boolean;
    languagePreference: string;
  };
}

const defaultProfile: ProfileData = {
  name: '',
  age: '',
  gender: '',
  bloodGroup: '',
  allergies: '',
  medications: '',
  emergencyContact: '',
  carePreferences: {
    receiveEmergencyAlerts: true,
    shareDataWithDoctors: false,
    offlineAccessEnabled: true,
    languagePreference: 'en',
  },
};

const Profile: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { isOffline, saveData, loadData } = useOffline();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);

  // Load profile data from localStorage on mount
  useEffect(() => {
    const loadProfile = async () => {
      const savedProfile = await loadData<ProfileData>('userProfile', defaultProfile);
      if (savedProfile) {
        setProfile(savedProfile);
      }
    };
    
    loadProfile();
  }, [loadData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handlePreferenceChange = (key: keyof ProfileData['carePreferences'], value: any) => {
    setProfile(prev => ({
      ...prev,
      carePreferences: {
        ...prev.carePreferences,
        [key]: value,
      },
    }));
  };

  const handleSaveProfile = async () => {
    await saveData('userProfile', profile);
    
    // Update language preference if changed
    if (language !== profile.carePreferences.languagePreference) {
      setLanguage(profile.carePreferences.languagePreference);
    }
    
    toast({
      title: t('profileSaved'),
      description: t('profileSavedDescription'),
    });
    
    setIsEditing(false);
  };

  const handleExportHealthData = () => {
    // Create a downloadable file with health data
    const dataStr = JSON.stringify(profile, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `arogya-health-profile-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: t('dataExported'),
      description: t('dataExportedDescription'),
    });
  };

  const handleClearData = async () => {
    if (confirm(t('confirmClearData'))) {
      setProfile(defaultProfile);
      await saveData('userProfile', defaultProfile);
      
      toast({
        title: t('dataCleared'),
        description: t('dataClearedDescription'),
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">{t('myProfile')}</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {t('profile')}
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {t('preferences')}
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            {t('healthData')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('personalInformation')}</CardTitle>
                  <CardDescription>
                    {t('personalInfoDescription')}
                  </CardDescription>
                </div>
                <Avatar className="h-16 w-16">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary-100 text-primary-700 text-lg">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : 'A'}
                  </AvatarFallback>
                </Avatar>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('fullName')}</Label>
                  <Input
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    placeholder={t('enterFullName')}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">{t('age')}</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={profile.age}
                    onChange={handleInputChange}
                    placeholder={t('enterAge')}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">{t('gender')}</Label>
                  <Input
                    id="gender"
                    name="gender"
                    value={profile.gender}
                    onChange={handleInputChange}
                    placeholder={t('enterGender')}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">{t('bloodGroup')}</Label>
                  <Input
                    id="bloodGroup"
                    name="bloodGroup"
                    value={profile.bloodGroup}
                    onChange={handleInputChange}
                    placeholder={t('enterBloodGroup')}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="allergies">{t('allergies')}</Label>
                <Input
                  id="allergies"
                  name="allergies"
                  value={profile.allergies}
                  onChange={handleInputChange}
                  placeholder={t('enterAllergies')}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="medications">{t('currentMedications')}</Label>
                <Input
                  id="medications"
                  name="medications"
                  value={profile.medications}
                  onChange={handleInputChange}
                  placeholder={t('enterCurrentMedications')}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">{t('emergencyContact')}</Label>
                <Input
                  id="emergencyContact"
                  name="emergencyContact"
                  value={profile.emergencyContact}
                  onChange={handleInputChange}
                  placeholder={t('enterEmergencyContact')}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    {t('cancel')}
                  </Button>
                  <Button onClick={handleSaveProfile}>
                    {t('saveChanges')}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  {t('edit')}
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>{t('carePreferences')}</CardTitle>
              <CardDescription>
                {t('preferencesDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emergency-alerts"
                  checked={profile.carePreferences.receiveEmergencyAlerts}
                  onCheckedChange={(checked) => 
                    handlePreferenceChange('receiveEmergencyAlerts', Boolean(checked))
                  }
                />
                <Label htmlFor="emergency-alerts" className="flex flex-col">
                  <span>{t('receiveEmergencyAlerts')}</span>
                  <span className="text-sm text-slate-500">
                    {t('receiveEmergencyAlertsDescription')}
                  </span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="share-data"
                  checked={profile.carePreferences.shareDataWithDoctors}
                  onCheckedChange={(checked) => 
                    handlePreferenceChange('shareDataWithDoctors', Boolean(checked))
                  }
                />
                <Label htmlFor="share-data" className="flex flex-col">
                  <span>{t('shareDataWithDoctors')}</span>
                  <span className="text-sm text-slate-500">
                    {t('shareDataWithDoctorsDescription')}
                  </span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="offline-access"
                  checked={profile.carePreferences.offlineAccessEnabled}
                  onCheckedChange={(checked) => 
                    handlePreferenceChange('offlineAccessEnabled', Boolean(checked))
                  }
                />
                <Label htmlFor="offline-access" className="flex flex-col">
                  <span>{t('enableOfflineAccess')}</span>
                  <span className="text-sm text-slate-500">
                    {t('enableOfflineAccessDescription')}
                  </span>
                </Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language-preference">{t('languagePreference')}</Label>
                <select
                  id="language-preference"
                  className="w-full h-10 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={profile.carePreferences.languagePreference}
                  onChange={(e) => handlePreferenceChange('languagePreference', e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="bn">বাংলা (Bengali)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                </select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile} className="ml-auto">
                {t('savePreferences')}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>{t('healthDataManagement')}</CardTitle>
              <CardDescription>
                {t('dataManagementDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                <h3 className="text-lg font-medium text-slate-900 mb-2 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary-500" />
                  {t('healthDataSummary')}
                </h3>
                <div className="grid gap-1">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">{t('profile')}</span>
                    <span className="font-medium">{profile.name ? t('complete') : t('incomplete')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">{t('medicationReminders')}</span>
                    <span className="font-medium">{t('active')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">{t('emergencyContacts')}</span>
                    <span className="font-medium">{profile.emergencyContact ? t('set') : t('notSet')}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">{t('lastUpdated')}</span>
                    <span className="font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-3 md:grid-cols-2">
                <Button variant="outline" className="gap-2" onClick={handleExportHealthData}>
                  <Download className="h-4 w-4" />
                  {t('exportHealthData')}
                </Button>
                <Button variant="destructive" className="gap-2" onClick={handleClearData}>
                  <Lock className="h-4 w-4" />
                  {t('clearAllData')}
                </Button>
              </div>
              
              {isOffline && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                  <div className="flex gap-2">
                    <Bell className="h-5 w-5 text-amber-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium text-amber-800">{t('offlineMode')}</h4>
                      <p className="text-amber-700 text-sm mt-1">
                        {t('offlineModeDataDescription')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
