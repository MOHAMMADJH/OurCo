import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Mail,
  Shield,
  UserCog,
  Edit2,
  Trash2,
  Key,
} from "lucide-react";
import { userService, IUser } from "@/services/userService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "react-hot-toast";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  is_active: boolean;
  last_login: string;
  permissions: string[];
}

const UsersPage = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState<null | IUser>(null);
  const [showDelete, setShowDelete] = useState<null | IUser>(null);
  const [processing, setProcessing] = useState(false);
  const [form, setForm] = useState<Partial<IUser>>({ first_name: "", last_name: "", email: "", role: "user", is_active: true });

  // جلب المستخدمين
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError("فشل في تحميل المستخدمين");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // إضافة مستخدم
  const handleAdd = async () => {
    setProcessing(true);
    try {
      await userService.createUser(form);
      toast.success("تمت إضافة المستخدم بنجاح");
      setShowAdd(false);
      setForm({ first_name: "", last_name: "", email: "", role: "user", is_active: true });
      fetchUsers();
    } catch {
      toast.error("فشل في إضافة المستخدم");
    } finally {
      setProcessing(false);
    }
  };

  // تعديل مستخدم
  const handleEdit = async () => {
    if (!showEdit) return;
    setProcessing(true);
    try {
      await userService.updateUser(showEdit.id, form);
      toast.success("تم تعديل المستخدم");
      setShowEdit(null);
      fetchUsers();
    } catch {
      toast.error("فشل في تعديل المستخدم");
    } finally {
      setProcessing(false);
    }
  };

  // حذف مستخدم
  const handleDelete = async () => {
    if (!showDelete) return;
    setProcessing(true);
    try {
      await userService.deleteUser(showDelete.id);
      toast.success("تم حذف المستخدم");
      setShowDelete(null);
      fetchUsers();
    } catch {
      toast.error("فشل في حذف المستخدم");
    } finally {
      setProcessing(false);
    }
  };

  // تفعيل/تعطيل مستخدم
  const handleToggleActive = async (user: IUser) => {
    try {
      await userService.toggleUserActive(user.id);
      fetchUsers();
    } catch {
      toast.error("فشل في تغيير حالة المستخدم");
    }
  };

  // تغيير الدور
  const handleChangeRole = async (user: IUser, role: string) => {
    try {
      await userService.changeUserRole(user.id, role);
      fetchUsers();
    } catch {
      toast.error("فشل في تغيير الدور");
    }
  };

  // البحث
  const [search, setSearch] = useState("");
  const filteredUsers = users.filter(u =>
    u.email?.includes(search) ||
    u.first_name?.includes(search) ||
    u.last_name?.includes(search)
  );

  return (
    <DashboardLayout>
      <DashboardHeader
        title="إدارة المستخدمين"
        subtitle="إدارة المستخدمين والصلاحيات"
      />

      <div className="p-6">
        <div className="mb-6 flex justify-between">
          <Button className="bg-[#FF6B00] hover:bg-[#FF8533]" onClick={() => setShowAdd(true)}>
            <Plus className="mr-2 h-4 w-4" />
            إضافة مستخدم جديد
          </Button>

          <div className="relative w-64">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="user-search"
              name="user-search"
              placeholder="بحث عن مستخدم..."
              className="border-white/10 bg-white/5 pr-10 text-right text-white placeholder:text-gray-400"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4">
          {loading ? (
            <div className="text-center text-white">جاري التحميل...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center text-gray-400">لا يوجد مستخدمون</div>
          ) : (
            filteredUsers.map((user) => (
              <Card
                key={user.id}
                className="border-white/10 bg-white/5 text-white backdrop-blur-sm"
              >
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF6B00]/10 text-[#FF6B00]">
                      <UserCog className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{user.first_name} {user.last_name}</h3>
                      <div className="mt-1 flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Shield className="h-4 w-4" />
                          {user.role}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={user.is_active ? "default" : "secondary"}
                      className={user.is_active ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"}
                    >
                      {user.is_active ? "نشط" : "غير نشط"}
                    </Badge>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" title="تغيير حالة التفعيل" onClick={() => handleToggleActive(user)}>
                        <Key className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="تعديل" onClick={() => { setShowEdit(user); setForm(user); }}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" title="حذف" onClick={() => setShowDelete(user)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <select
                        className="rounded bg-white/10 px-2 py-1 text-xs text-white"
                        value={user.role}
                        onChange={e => handleChangeRole(user, e.target.value)}
                      >
                        <option value="user">مستخدم</option>
                        <option value="editor">محرر</option>
                        <option value="admin">مدير</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* نافذة إضافة مستخدم */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة مستخدم جديد</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Input placeholder="الاسم الأول" value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} />
            <Input placeholder="الاسم الأخير" value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} />
            <Input placeholder="البريد الإلكتروني" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <select className="rounded bg-white/10 px-2 py-1 text-xs text-white" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
              <option value="user">مستخدم</option>
              <option value="editor">محرر</option>
              <option value="admin">مدير</option>
            </select>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
              نشط
            </label>
          </div>
          <DialogFooter>
            <Button onClick={handleAdd} disabled={processing}>إضافة</Button>
            <Button variant="ghost" onClick={() => setShowAdd(false)} disabled={processing}>إلغاء</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة تعديل */}
      <Dialog open={!!showEdit} onOpenChange={v => { setShowEdit(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل مستخدم</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Input placeholder="الاسم الأول" value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} />
            <Input placeholder="الاسم الأخير" value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} />
            <Input placeholder="البريد الإلكتروني" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <select className="rounded bg-white/10 px-2 py-1 text-xs text-white" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
              <option value="user">مستخدم</option>
              <option value="editor">محرر</option>
              <option value="admin">مدير</option>
            </select>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
              نشط
            </label>
          </div>
          <DialogFooter>
            <Button onClick={handleEdit} disabled={processing}>حفظ</Button>
            <Button variant="ghost" onClick={() => setShowEdit(null)} disabled={processing}>إلغاء</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة تأكيد حذف */}
      <Dialog open={!!showDelete} onOpenChange={v => { setShowDelete(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد حذف المستخدم</DialogTitle>
          </DialogHeader>
          <div className="text-center text-red-500">هل أنت متأكد أنك تريد حذف هذا المستخدم؟</div>
          <DialogFooter>
            <Button onClick={handleDelete} disabled={processing} className="bg-red-600 hover:bg-red-700">حذف</Button>
            <Button variant="ghost" onClick={() => setShowDelete(null)} disabled={processing}>إلغاء</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default UsersPage;