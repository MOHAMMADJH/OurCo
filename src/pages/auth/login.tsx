import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Here you would typically handle authentication
    // For now, we'll just simulate a delay and redirect
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B1340] px-4">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a237e10_0%,transparent_100%)]" />
        <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-[#FF6B00] opacity-[0.15] blur-[150px]" />
        <div className="absolute right-0 top-[20%] h-[300px] w-[300px] rounded-full bg-[#4A90E2] opacity-[0.1] blur-[100px]" />
      </div>

      <Card className="relative w-full max-w-md border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">
            تسجيل الدخول إلى لوحة التحكم
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-white" htmlFor="email">
                البريد الإلكتروني
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="border-white/10 bg-white/5 text-right text-white placeholder:text-gray-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white" htmlFor="password">
                كلمة المرور
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="أدخل كلمة المرور"
                className="border-white/10 bg-white/5 text-right text-white placeholder:text-gray-400"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <Button
                variant="link"
                className="px-0 text-[#FF6B00] hover:text-[#FF8533]"
                onClick={() => navigate("/auth/forgot-password")}
              >
                نسيت كلمة المرور؟
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#FF6B00] hover:bg-[#FF8533]"
              disabled={isLoading}
            >
              {isLoading ? (
                "جاري تسجيل الدخول..."
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  تسجيل الدخول
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
