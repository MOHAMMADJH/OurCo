import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle, UserCheck, Clock, AlertCircle, Loader2 } from 'lucide-react'; // أيقونات
import { fetchRecentLeads, fetchUpcomingFollowups } from '@/services/dashboardAPI'; // استيراد خدمة dashboardAPI

// نوع بيانات العميل المتوقع من الـ API
interface Lead {
    id: string;
    name: string;
    source: string; // حاليًا قيمة ثابتة "Unknown"
    addedDate: string;
    clientUrl: string;
}

interface FollowUp {
    id: string;
    clientName: string;
    dueDate: string;
    notes?: string; // ملاحظات مختصرة
    taskUrl: string;
}

const mockFollowUps: FollowUp[] = [
    { id: 'f1', clientName: 'شركة النجاح', dueDate: '2025-04-01', notes: 'مناقشة العرض الجديد', taskUrl: '/tasks/f1' },
    { id: 'f2', clientName: 'متجر الأفكار', dueDate: '2025-04-03', taskUrl: '/tasks/f2' },
];

const CRMSnippetsWidget = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoadingLeads, setIsLoadingLeads] = useState<boolean>(true);
    const [errorLeads, setErrorLeads] = useState<string | null>(null);

    const [followups, setFollowups] = useState<FollowUp[]>([]);
    const [isLoadingFollowups, setIsLoadingFollowups] = useState<boolean>(true);
    const [errorFollowups, setErrorFollowups] = useState<string | null>(null);

    useEffect(() => {
        const fetchLeads = async () => {
            setIsLoadingLeads(true);
            setErrorLeads(null);
            try {
                // استخدام خدمة dashboardAPI الجديدة
                const data = await fetchRecentLeads();
                setLeads(data);
            } catch (err) {
                console.error("Failed to fetch recent leads:", err);
                setErrorLeads('فشل في تحميل العملاء المحتملين. يرجى المحاولة مرة أخرى لاحقًا.');
            } finally {
                setIsLoadingLeads(false);
            }
        };

        fetchLeads();
    }, []);

    useEffect(() => {
        const fetchFollowups = async () => {
            setIsLoadingFollowups(true);
            setErrorFollowups(null);
            try {
                // استخدام خدمة dashboardAPI الجديدة
                const data = await fetchUpcomingFollowups();
                setFollowups(data);
            } catch (err) {
                console.error("Failed to fetch upcoming followups:", err);
                setErrorFollowups('فشل في تحميل المتابعات القادمة. يرجى المحاولة مرة أخرى لاحقًا.');
            } finally {
                setIsLoadingFollowups(false);
            }
        };

        // تعليق هذا مؤقتًا حتى تكون واجهة API جاهزة
        // fetchFollowups();
        // استخدام البيانات الوهمية في الوقت الحالي
        setFollowups(mockFollowUps);
    }, []);

    return (
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg font-semibold text-white">
                    متابعة العملاء (CRM)
                </CardTitle>
                <Button variant="outline" size="sm" asChild className="text-xs bg-transparent hover:bg-white/10">
                    {/* TODO: ربط هذا الزر بنافذة إضافة عميل أو صفحة مخصصة */}
                    <Link to="/dashboard/clients/new"> {/* تأكد من المسار الصحيح */}
                        <PlusCircle className="ms-1 h-4 w-4" />
                        إضافة عميل
                    </Link>
                </Button>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
                {/* قسم العملاء المحتملين الجدد */}
                <div>
                    <h3 className="mb-3 text-sm font-medium text-gray-300 flex items-center">
                        <UserCheck className="ms-2 h-4 w-4 text-blue-400" /> أحدث العملاء المحتملين
                    </h3>
                    <div className="space-y-3">
                        {isLoadingLeads && (
                            <div className="flex justify-center items-center p-4">
                                <Loader2 className="h-5 w-5 text-white animate-spin" />
                                <span className="me-2 text-gray-300 text-xs">جار تحميل العملاء...</span>
                            </div>
                        )}
                        {errorLeads && (
                            <div className="text-center p-4 text-red-500 text-xs flex items-center justify-center">
                                <AlertCircle className="ms-2 h-4 w-4" />
                                {errorLeads}
                            </div>
                        )}
                        {!isLoadingLeads && !errorLeads && leads.length === 0 && (
                            <p className="text-center text-gray-500 text-xs py-2">لا يوجد عملاء جدد.</p>
                        )}
                        {!isLoadingLeads && !errorLeads && leads.length > 0 && (
                            leads.map((lead) => (
                                <div key={lead.id} className="flex items-center justify-between gap-2 p-2 rounded-md bg-black/10 text-xs hover:bg-black/20 transition-colors">
                                    <div className='flex flex-col items-start min-w-0'>
                                        <Link to={lead.clientUrl} className="font-medium text-white hover:underline truncate" title={lead.name}>{lead.name}</Link>
                                        <span className="text-gray-400 truncate" title={lead.source}>{lead.source}</span>
                                    </div>
                                    <span className="text-gray-500 flex-shrink-0">{lead.addedDate}</span>
                                    {/* يمكن إضافة زر رابط سريع لعرض تفاصيل العميل */}
                                </div>
                            ))
                        )}
                        {!isLoadingLeads && !errorLeads && leads.length > 0 && ( /* عرض الرابط فقط إذا كان هناك بيانات */
                            <div className="mt-2 text-center">
                                <Button variant="link" size="sm" asChild className="text-xs px-0 h-auto text-blue-400 hover:text-blue-300">
                                    {/* TODO: تأكد من أن الرابط يوجه للصفحة الصحيحة مع الفلترة */} 
                                    <Link to="/dashboard/clients?filter=leads">عرض كل العملاء المحتملين</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* قسم تذكيرات المتابعة */}
                <div>
                    <h3 className="mb-3 text-sm font-medium text-gray-300 flex items-center">
                        <Clock className="ms-2 h-4 w-4 text-yellow-400" /> تذكيرات المتابعة القادمة
                    </h3>
                    <div className="space-y-3">
                        {isLoadingFollowups && (
                            <div className="flex justify-center items-center p-4">
                                <Loader2 className="h-5 w-5 text-white animate-spin" />
                                <span className="me-2 text-gray-300 text-xs">جار تحميل المتابعات...</span>
                            </div>
                        )}
                        {errorFollowups && (
                            <div className="text-center p-4 text-red-500 text-xs flex items-center justify-center">
                                <AlertCircle className="ms-2 h-4 w-4" />
                                {errorFollowups}
                            </div>
                        )}
                        {followups.length > 0 ? (
                            followups.slice(0, 3).map((followup) => ( // عرض أول 3 مثلاً
                                <div key={followup.id} className="flex items-center justify-between gap-2 p-2 rounded-md bg-black/10 text-xs hover:bg-black/20 transition-colors">
                                    <div className='flex flex-col items-start min-w-0'>
                                        <Link to={followup.taskUrl ?? '#'} className="font-medium text-white hover:underline truncate" title={followup.clientName}>{followup.clientName}</Link>
                                        {followup.notes && <span className="text-gray-400 truncate" title={followup.notes}>{followup.notes}</span>}
                                    </div>
                                    <span className="text-gray-500 flex-shrink-0">{followup.dueDate}</span>
                                    {/* يمكن إضافة زر إتمام المتابعة */}
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 text-xs py-2">لا توجد متابعات قادمة.</p>
                        )}
                        {followups.length > 3 && (
                            <div className="mt-2 text-center">
                                <Button variant="link" size="sm" asChild className="text-xs px-0 h-auto text-yellow-400 hover:text-yellow-300">
                                    {/* TODO: تأكد من أن الرابط يوجه للصفحة الصحيحة مع الفلترة */} 
                                    <Link to="/dashboard/tasks?filter=followups">عرض كل المتابعات</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CRMSnippetsWidget;
