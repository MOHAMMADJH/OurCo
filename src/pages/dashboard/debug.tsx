import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

const DebugPage: React.FC = () => {
  const { user, setAdminStatus, logout } = useAuth();
  const [localStorageData, setLocalStorageData] = useState<string>('');

  useEffect(() => {
    try {
      const allData: Record<string, any> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          if (value) {
            try {
              allData[key] = JSON.parse(value);
            } catch (e) {
              allData[key] = value;
            }
          }
        }
      }
      setLocalStorageData(JSON.stringify(allData, null, 2));
    } catch (error) {
      console.error('Error reading localStorage:', error);
    }
  }, [user]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-orange-500 mb-2">صفحة تشخيص النظام</h1>
        <p className="text-slate-400 mb-6">هذه الصفحة مخصصة للمطورين لتشخيص حالة المصادقة وتصحيح المشكلات</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* بطاقة معلومات المستخدم */}
          <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              معلومات المستخدم
            </h2>

            {user ? (
              <>
                <div className="space-y-3 text-slate-300">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-400">المعرف:</span>
                    <span className="font-mono text-xs truncate max-w-[200px]" title={user.id}>{user.id}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium text-slate-400">البريد الإلكتروني:</span>
                    <span>{user.email}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium text-slate-400">الاسم:</span>
                    <span>{user.name}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-400">الصلاحيات:</span>
                    <span
                      className={`px-2 py-1 rounded text-sm ${user.is_admin || user.role === "admin" ? 'bg-orange-700/30 text-orange-400' : 'bg-slate-700/30 text-slate-400'}`}
                    >
                      {user.is_admin || user.role === "admin" ? 'مسؤول' : 'مستخدم عادي'}
                    </span>
                  </div>

                  <div className="pt-1 border-t border-slate-700">
                    <span className="font-medium text-slate-400">حالة الخصائص:</span>
                    <div className="mt-2 bg-slate-900/50 p-2 rounded-md text-xs">
                      <div>
                        <code className="text-slate-400">is_admin:</code>
                        <code className={user.is_admin ? 'text-green-400' : 'text-red-400'}>
                          {user.is_admin ? 'true' : 'false/undefined'}
                        </code>
                      </div>
                      <div>
                        <code className="text-slate-400">role:</code>
                        <code className={user.role === 'admin' ? 'text-green-400' : 'text-orange-400'}>
                          {user.role || 'غير محدد'}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-slate-500 py-4">
                لم يتم تسجيل الدخول
              </div>
            )}
          </div>

          {/* بطاقة تعديل المستخدم */}
          <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              إدارة الصلاحيات
            </h2>

            <div className="space-y-4">
              <div className="flex flex-col">
                <button
                  onClick={() => setAdminStatus(true)}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 mb-2"
                >
                  تعيين كمسؤول
                </button>

                <button
                  onClick={() => setAdminStatus(false)}
                  className="bg-slate-600 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 mb-2"
                >
                  تعيين كمستخدم عادي
                </button>

                <button
                  onClick={() => logout()}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                >
                  تسجيل الخروج
                </button>
              </div>

              <div className="mt-4 text-slate-400 text-sm">
                <p>هذه الأزرار تقوم بتعديل حالة المستخدم مباشرة في LocalStorage وتحديث حالة التطبيق</p>
              </div>
            </div>
          </div>

          {/* بطاقة البيانات المحلية */}
          <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              بيانات التخزين المحلي
            </h2>

            <div className="overflow-hidden">
              <pre className="bg-slate-900 p-3 rounded-md overflow-x-auto text-xs text-slate-300 max-h-[300px] scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-900">
                {localStorageData || 'لا توجد بيانات'}
              </pre>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          معلومات التطبيق
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/50 p-4 rounded-md">
            <h3 className="text-lg font-medium text-orange-500 mb-2">مسارات صفحات المسؤول</h3>
            <ul className="list-disc list-inside text-slate-400 space-y-1">
              <li><code>/dashboard/services</code> - إدارة الخدمات (للمسؤول فقط)</li>
              <li><code>/dashboard/users</code> - إدارة المستخدمين (للمسؤول فقط)</li>
              <li><code>/dashboard/debug</code> - صفحة التشخيص</li>
            </ul>
          </div>

          <div className="bg-slate-900/50 p-4 rounded-md">
            <h3 className="text-lg font-medium text-orange-500 mb-2">معلومات الحسابات</h3>
            <ul className="list-disc list-inside text-slate-400 space-y-1">
              <li>حسابات المسؤولين: <code>role: "admin"</code></li>
              <li>حسابات المستخدمين العاديين: <code>role: "user"</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
