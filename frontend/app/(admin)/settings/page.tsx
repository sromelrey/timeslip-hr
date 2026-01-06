"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchSettings, updateSettings } from "@/store/core/slices/settings-slice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettingsForm } from "@/components/admin/settings/general-settings-form";
import { PayrollPoliciesForm } from "@/components/admin/settings/payroll-policies-form";
import { SecuritySettingsForm } from "@/components/admin/settings/security-settings-form";
import { useToast } from "@/hooks/use-toast";
import { Setting } from "@/lib/settings.api";

export default function SettingsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: settings, loading } = useSelector((state: RootState) => state.settings);
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  const handleSave = async (data: Partial<Setting>) => {
    try {
      await dispatch(updateSettings(data)).unwrap();
      toast({
        title: "Settings Saved",
        description: "Your changes have been successfully saved.",
      });
    } catch (error) {
      toast({
        title: "Error Saving Settings",
        description: typeof error === 'string' ? error : "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  if (!settings && loading) {
     return <div className="p-8">Loading settings...</div>;
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">
            Manage your organization profile and system usage policies.
          </p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payroll">Payroll Policies</TabsTrigger>
          <TabsTrigger value="security">Security & Compliance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <GeneralSettingsForm 
            settings={settings} 
            onSave={handleSave} 
            isLoading={loading} 
          />
        </TabsContent>
        
        <TabsContent value="payroll" className="space-y-4">
          <PayrollPoliciesForm 
             settings={settings} 
             onSave={handleSave} 
             isLoading={loading} 
          />
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <SecuritySettingsForm 
             settings={settings} 
             onSave={handleSave} 
             isLoading={loading} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
