'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { CalendarView } from '@/components/dashboard/CalendarView';
import { Card } from '@/design-system/components/Card';

export default function CalendarPage() {
    return (
        <ProtectedRoute>
            <div className="p-6 lg:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-text-900 mb-2">Takvim</h1>
                    <p className="text-text-600">Planınızı ve ilerlemenizi takip edin</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <CalendarView />

                    <Card className="p-6">
                        <h2 className="text-xl font-semibold text-text-900 mb-4">Yaklaşan Etkinlikler</h2>
                        <p className="text-text-500">Şu anda planlanmış etkinlik yok.</p>
                    </Card>
                </div>
            </div>
        </ProtectedRoute>
    );
}
