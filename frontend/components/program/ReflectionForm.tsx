'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/design-system/components/Button';
import { toast } from '@/components/shared/Toast';
import { colors } from '@/design-system/colors';
import { useProgram } from '@/hooks/useProgram';

interface ReflectionFormProps {
  onSave?: (reflection: string) => void;
}

export function ReflectionForm({ onSave }: ReflectionFormProps) {
  const { submitReflection } = useProgram();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<{ reflection: string }>();

  const onSubmit = async (data: { reflection: string }) => {
    setLoading(true);
    try {
      await submitReflection(data.reflection);
      toast.success('Değerlendirme başarıyla kaydedildi!');
      onSave?.(data.reflection);
      reset();
    } catch (error) {
      toast.error('Değerlendirme kaydedilemedi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-background-200">
      <h3 className="text-lg font-semibold text-text-900 mb-4">Günlük Değerlendirme</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-700 mb-2">
            Bugün ne öğrendin?
          </label>
          <textarea
            {...register('reflection', { required: 'Lütfen düşüncelerini yaz' })}
            rows={4}
            className="w-full px-4 py-3 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            placeholder="Düşüncelerini, içgörülerini ve ilerlemeni paylaş..."
          />
          {errors.reflection && (
            <p className="mt-1 text-sm text-error-600">{errors.reflection.message}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="submit" loading={loading}>
            Kaydet
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => reset()}
          >
            Temizle
          </Button>
        </div>
      </form>
    </div>
  );
}
