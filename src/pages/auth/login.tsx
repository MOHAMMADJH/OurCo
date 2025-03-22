import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await login(formData);
      if (user.is_admin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
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
                name="email"
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="border-white/10 bg-white/5 text-right text-white placeholder:text-gray-400"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white" htmlFor="password">
                كلمة المرور
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="أدخل كلمة المرور"
                className="border-white/10 bg-white/5 text-right text-white placeholder:text-gray-400"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

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

            <div className="text-center">
              <Button
                variant="link"
                className="text-white hover:text-gray-300"
                onClick={() => navigate('/auth/register')}
              >
                ليس لديك حساب؟ سجل الآن
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
