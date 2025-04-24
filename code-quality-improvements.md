# تحسينات جودة الكود لمشروع OurCo للواجهة الأمامية

يقدم هذا المستند استراتيجيات وممارسات محددة لتحسين جودة الكود في مشروع OurCo للواجهة الأمامية، بناءً على خطة إعادة الهيكلة المقترحة.

## أفضل الممارسات للكود

### 1. اتفاقيات التسمية

- **المكونات**: استخدم PascalCase للمكونات (مثل `UserProfile`)
- **الملفات**: استخدم kebab-case للملفات (مثل `user-profile.tsx`)
- **المتغيرات والوظائف**: استخدم camelCase للمتغيرات والوظائف (مثل `getUserData`)
- **الثوابت**: استخدم UPPER_SNAKE_CASE للثوابت (مثل `API_BASE_URL`)
- **الأنواع والواجهات**: استخدم PascalCase مع بادئة I للواجهات (مثل `IUserData`)
- **المخازن**: استخدم camelCase مع لاحقة Store (مثل `userStore`)

### 2. تنظيم الاستيرادات

ترتيب الاستيرادات بالطريقة التالية:

```typescript
// 1. استيرادات المكتبات الخارجية
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. استيرادات الكيانات والميزات
import { User } from '@/entities/user/model/types';
import { useAuthStore } from '@/entities/user/model/store';

// 3. استيرادات المكونات المشتركة
import { Button } from '@/shared/ui/atoms/button';
import { Card } from '@/shared/ui/atoms/card';

// 4. استيرادات الأدوات المساعدة والثوابت
import { formatDate } from '@/shared/lib/utils';
import { ROUTES } from '@/shared/config/routes';

// 5. استيرادات الأنماط
import './styles.css';
```

### 3. هيكل المكونات

اتبع هذا الهيكل المتسق للمكونات:

```typescript
// 1. الاستيرادات

// 2. تعريف الواجهة
interface UserProfileProps {
  userId: string;
  showDetails?: boolean;
}

// 3. تعريف المكون
export const UserProfile: React.FC<UserProfileProps> = ({ userId, showDetails = false }) => {
  // 4. الحالة والمتغيرات
  const [isLoading, setIsLoading] = useState(false);
  
  // 5. الآثار الجانبية
  useEffect(() => {
    // ...
  }, [userId]);
  
  // 6. معالجات الأحداث
  const handleClick = () => {
    // ...
  };
  
  // 7. التصيير المشروط
  if (isLoading) {
    return <Spinner />;
  }
  
  // 8. التصيير الرئيسي
  return (
    <div>
      {/* ... */}
    </div>
  );
};
```

## استراتيجيات تحسين الأداء

### 1. التخزين المؤقت والتذكر

استخدم `useMemo` و `useCallback` لتجنب إعادة الحسابات غير الضرورية:

```typescript
// تذكر القيم المحسوبة
const sortedItems = useMemo(() => {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}, [items]);

// تذكر معالجات الأحداث
const handleSubmit = useCallback((data) => {
  // ...
}, [dependencies]);
```

### 2. تقسيم الكود

تنفيذ تقسيم الكود لتحسين أوقات التحميل:

```typescript
// استخدام الاستيراد الديناميكي للمكونات الكبيرة
const DashboardPage = React.lazy(() => import('@/pages/dashboard'));

// استخدام Suspense للتحميل الكسول
<Suspense fallback={<Spinner />}>
  <DashboardPage />
</Suspense>
```

### 3. تحسين التصيير

تجنب إعادة التصيير غير الضرورية:

```typescript
// استخدام React.memo للمكونات النقية
const UserCard = React.memo(({ user }) => {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
});

// استخدام useCallback لمعالجات الأحداث المستقرة
const handleClick = useCallback(() => {
  // ...
}, [dependencies]);
```

## أنماط التصميم الموصى بها

### 1. نمط المزود/المستهلك

استخدم نمط المزود/المستهلك لمشاركة الحالة بين المكونات:

```typescript
// إنشاء سياق
const UserContext = createContext<UserContextType | undefined>(undefined);

// إنشاء مزود
export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // ...
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// إنشاء خطاف مخصص للاستهلاك
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
```

### 2. نمط الواجهة المتكيفة

استخدم نمط الواجهة المتكيفة للتعامل مع واجهات API المختلفة:

```typescript
// تعريف واجهة موحدة
interface UserData {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
}

// إنشاء محول للواجهة الخارجية
const adaptUserFromApi = (apiUser: any): UserData => {
  return {
    id: apiUser.user_id,
    fullName: `${apiUser.first_name} ${apiUser.last_name}`,
    email: apiUser.email_address,
    avatarUrl: apiUser.profile_image || '/default-avatar.png',
  };
};
```

### 3. نمط المصنع

استخدم نمط المصنع لإنشاء كائنات معقدة:

```typescript
// إنشاء مصنع للنماذج
const createFormConfig = (formType: 'login' | 'register' | 'profile') => {
  switch (formType) {
    case 'login':
      return {
        fields: [
          { name: 'email', type: 'email', required: true },
          { name: 'password', type: 'password', required: true },
        ],
        submitLabel: 'Login',
        // ...
      };
    case 'register':
      return {
        fields: [
          { name: 'email', type: 'email', required: true },
          { name: 'password', type: 'password', required: true },
          { name: 'confirmPassword', type: 'password', required: true },
          { name: 'firstName', type: 'text', required: true },
          { name: 'lastName', type: 'text', required: true },
        ],
        submitLabel: 'Register',
        // ...
      };
    // ...
  }
};
```

## استراتيجيات اختبار فعالة

### 1. اختبار المكونات

استخدم React Testing Library لاختبار المكونات:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  test('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  test('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

### 2. اختبار الخطافات

استخدم renderHook لاختبار الخطافات المخصصة:

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useCounter } from './use-counter';

describe('useCounter', () => {
  test('should increment counter', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
  
  test('should decrement counter', () => {
    const { result } = renderHook(() => useCounter(10));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(9);
  });
});
```

### 3. اختبار المخازن

استخدم نهجًا مباشرًا لاختبار مخازن Zustand:

```typescript
import { useAuthStore } from './auth-store';

describe('authStore', () => {
  beforeEach(() => {
    // إعادة تعيين المخزن قبل كل اختبار
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });
  
  test('should update user on login', async () => {
    const loginMock = jest.fn().mockResolvedValue({
      user: { id: '1', name: 'Test User' },
      token: 'test-token',
    });
    
    // استبدال وظيفة تسجيل الدخول بوهمية
    const originalLogin = useAuthStore.getState().login;
    useAuthStore.setState({
      login: loginMock,
    });
    
    await useAuthStore.getState().login({ email: 'test@example.com', password: 'password' });
    
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user).toEqual({ id: '1', name: 'Test User' });
    
    // استعادة الوظيفة الأصلية
    useAuthStore.setState({
      login: originalLogin,
    });
  });
});
```

## الخلاصة

تنفيذ هذه الممارسات وأنماط التصميم سيؤدي إلى تحسين كبير في جودة الكود وقابلية الصيانة والأداء في مشروع OurCo للواجهة الأمامية. من خلال اتباع هذه الإرشادات، سيتمكن فريق التطوير من إنشاء قاعدة كود أكثر متانة وقابلية للتوسع وسهولة في الصيانة.
