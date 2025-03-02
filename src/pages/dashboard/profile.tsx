import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
  });

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "U";
    
    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`;
    } else if (firstName) {
      return firstName[0];
    } else {
      return user.email[0].toUpperCase();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically call an API to update the user profile
    // For now, we'll just toggle the editing state
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      <DashboardHeader 
        title="الملف الشخصي" 
        subtitle="عرض وتعديل معلومات حسابك الشخصي"
      />
      
      <div className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Card */}
          <Card className="border-white/10 bg-white/5 text-white backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle>معلومات الحساب</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" alt={user?.first_name || "User"} />
                  <AvatarFallback className="bg-[#FF6B00]/10 text-[#FF6B00] text-2xl">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="text-xl font-bold">
                    {user?.first_name
                      ? `${user.first_name} ${user.last_name || ""}`
                      : user?.email}
                  </h3>
                  <p className="text-sm text-gray-400">{user?.email}</p>
                  <p className="mt-1 text-sm text-gray-400">
                    {user?.is_admin ? "مدير" : "مستخدم"}
                  </p>
                </div>
                
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="bg-[#FF6B00] hover:bg-[#FF8533]"
                >
                  تعديل الملف الشخصي
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Edit Profile Form */}
          <Card className="border-white/10 bg-white/5 text-white backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle>{isEditing ? "تعديل الملف الشخصي" : "تفاصيل الحساب"}</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">الاسم الأول</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="border-white/10 bg-white/5 text-right text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="last_name">الاسم الأخير</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="border-white/10 bg-white/5 text-right text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled
                      className="border-white/10 bg-white/5 text-right text-white opacity-70"
                    />
                    <p className="text-xs text-gray-400">لا يمكن تغيير البريد الإلكتروني</p>
                  </div>
                  
                  <div className="flex justify-end space-x-2 space-x-reverse">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                      className="border-white/10 text-white hover:bg-white/5"
                    >
                      إلغاء
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-[#FF6B00] hover:bg-[#FF8533]"
                    >
                      حفظ التغييرات
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400">الاسم الأول</h4>
                    <p>{user?.first_name || "غير محدد"}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-400">الاسم الأخير</h4>
                    <p>{user?.last_name || "غير محدد"}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-400">البريد الإلكتروني</h4>
                    <p>{user?.email}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-400">نوع الحساب</h4>
                    <p>{user?.is_admin ? "مدير" : "مستخدم"}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;