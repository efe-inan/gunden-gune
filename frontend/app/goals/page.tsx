'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Target, Plus } from 'lucide-react';
import { Button } from '@/design-system/components/Button';
import { Card } from '@/design-system/components/Card';

export default function GoalsPage() {
    return (
        <ProtectedRoute>
            <div className="p-6 lg:p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-text-900 mb-2">Hedefler</h1>
                        <p className="text-text-600">Kişisel hedeflerinizi belirleyin ve takip edin</p>
                    </div>
                    <Button leftIcon={<Plus className="w-5 h-5" />}>
                        Yeni Hedef
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Example Goal Card */}
                    <Card className="p-6 border-l-4 border-l-primary-500">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-primary-50 rounded-lg">
                                <Target className="w-6 h-6 text-primary-600" />
                            </div>
                            <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                                Devam Ediyor
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-text-900 mb-2">21 Günlük Program</h3>
                        <p className="text-text-600 text-sm mb-4">
                            Dönüşüm programını başarıyla tamamlamak
                        </p>
                        <div className="w-full bg-background-100 rounded-full h-2">
                            <div
                                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: '0%' }}
                            />
                        </div>
                        <div className="flex justify-between mt-2 text-sm text-text-500">
                            <span>İlerleme</span>
                            <span>%0</span>
                        </div>
                    </Card>

                    {/* Empty State for other slots */}
                    <button className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-background-300 rounded-xl hover:bg-background-50 transition-colors h-full min-h-[200px] group">
                        <div className="w-12 h-12 bg-background-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                            <Plus className="w-6 h-6 text-text-400 group-hover:text-primary-600" />
                        </div>
                        <span className="font-medium text-text-600 group-hover:text-primary-700">Yeni Hedef Ekle</span>
                    </button>
                </div>
            </div>
        </ProtectedRoute>
    );
}
