import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { Bell, Lock, Globe, Moon } from "lucide-react";

const SettingsPage = () => {
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [language, setLanguage] = useState("ar");
  
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });
  
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    
    // Clear messages when user starts typing again
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError("كلمات المرور الجديدة غير متطابقة");
      return;
    }
    
    if (passwordData.new_password.length < 8) {
      setPasswordError("يجب أن تكون كلمة المرور الجديدة 8 أحرف على الأقل");
      return;
    }
    
    try {
      // In a real app, you would call an API endpoint here
      // await axios.post(`${API_BASE_URL}/api/users/change-password`, passwordData);
      
      // Show success message
      setPasswordSuccess("تم تغيير كلمة المرور بنجاح");
      
      // Reset form
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: ""
      });
    } catch (error) {
      setPasswordError("فشل تغيير كلمة المرور. يرجى التحقق من كلمة المرور الحالية.");
    }
  };

  return (
    <DashboardLayout>
      <DashboardHeader 
        title="الإعدادات" 
        subtitle="تخصيص إعدادات حسابك"
      />
      
      <div className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Security Settings */}
          <Card className="border-white/10 bg-white/5 text-white backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-[#FF6B00]" />
                الأمان
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current_password">كلمة المرور الحالية</Label>
                  <Input
                    id="current_password"
                    name="current_password"
                    type="password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    className="border-white/10 bg-white/5 text-right text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new_password">كلمة المرور الجديدة</Label>
                  <Input
                    id="new_password"
                    name="new_password"
                    type="password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    className="border-white/10 bg-white/5 text-right text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm_password">تأكيد كلمة المرور الجديدة</Label>
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    className="border-white/10 bg-white/5 text-right text-white"
                    required
                  />
                </div>
                
                {passwordError && (
                  <p className="text-sm text-red-500">{passwordError}</p>
                )}
                
                {passwordSuccess && (
                  <p className="text-sm text-green-500">{passwordSuccess}</p>
                )}
                
                <Button 
                  type="submit"
                  className="w-full bg-[#FF6B00] hover:bg-[#FF8533]"
                >
                  تغيير كلمة المرور
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {/* Preferences */}
          <Card className="border-white/10 bg-white/5 text-white backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle>التفضيلات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-[#FF6B00]" />
                  <div>
                    <p className="font-medium">الإشعارات</p>
                    <p className="text-sm text-gray-400">تفعيل إشعارات البريد الإلكتروني</p>
                  </div>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                  className="data-[state=checked]:bg-[#FF6B00]"
                />
              </div>
              
              {/* Dark Mode */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Moon className="h-5 w-5 text-[#FF6B00]" />
                  <div>
                    <p className="font-medium">الوضع الداكن</p>
                    <p className="text-sm text-gray-400">تفعيل الوضع الداكن للواجهة</p>
                  </div>
                </div>
                <Switch
                  checked={darkModeEnabled}
                  onCheckedChange={setDarkModeEnabled}
                  className="data-[state=checked]:bg-[#FF6B00]"
                />
              </div>
              
              {/* Language */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-[#FF6B00]" />
                  <div>
                    <p className="font-medium">اللغة</p>
                    <p className="text-sm text-gray-400">اختر لغة واجهة المستخدم</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={language === "ar" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLanguage("ar")}
                    className={language === "ar" ? "bg-[#FF6B00] hover:bg-[#FF8533]" : "border-white/10 text-white hover:bg-white/5"}
                  >
                    العربية
                  </Button>
                  <Button
                    variant={language === "en" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLanguage("en")}
                    className={language === "en" ? "bg-[#FF6B00] hover:bg-[#FF8533]" : "border-white/10 text-white hover:bg-white/5"}
                  >
                    English
                  </Button>
                </div>
              </div>
              
              <Button className="w-full bg-[#FF6B00] hover:bg-[#FF8533]">
                حفظ التفضيلات
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;