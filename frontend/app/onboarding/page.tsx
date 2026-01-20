'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/design-system/components/Button';
import { toast } from '@/components/shared/Toast';
import { colors } from '@/design-system/colors';

const step1Schema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  age: z.number().min(18, 'En az 18 yaşında olmalısınız').max(100, 'Lütfen geçerli bir yaş giriniz'),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']),
});

const step2Schema = z.object({
  timeCommitment: z.enum(['15', '30', '45', '60']),
});

const step3Schema = z.object({
  interests: z.array(z.string()).min(1, 'En az bir ilgi alanı seçiniz'),
});

const step4Schema = z.object({
  developmentArea: z.string().min(1, 'Lütfen bir gelişim alanı seçiniz'),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;
type Step4Data = z.infer<typeof step4Schema>;

const interestsOptions = [
  'Farkındalık & Meditasyon',
  'Fiziksel Fitness',
  'Kariyer Gelişimi',
  'İlişki Kurma',
  'Finansal Büyüme',
  'Yaratıcı İfade',
  'Kişisel Gelişim',
  'Alışkanlık Oluşturma',
];

const developmentAreas = [
  'Stres Yönetimi',
  'Zaman Yönetimi',
  'İletişim Becerileri',
  'Hedef Başarımı',
  'Özgüven',
  'İş-Yaşam Dengesi',
];

export default function OnboardingPage() {
  const router = useRouter();
  const { updateOnboarding } = useUser();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    step1: {} as Step1Data,
    step2: {} as Step2Data,
    step3: {} as Step3Data,
    step4: {} as Step4Data,
  });

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema as any),
  });

  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema as any),
  });

  const step3Form = useForm<Step3Data>({
    resolver: zodResolver(step3Schema as any),
    defaultValues: { interests: [] },
  });

  const step4Form = useForm<Step4Data>({
    resolver: zodResolver(step4Schema as any),
  });

  const nextStep = async () => {
    let isValid = false;

    switch (step) {
      case 1:
        isValid = await step1Form.trigger();
        if (isValid) {
          setFormData({ ...formData, step1: step1Form.getValues() });
          setStep(2);
        }
        break;
      case 2:
        isValid = await step2Form.trigger();
        if (isValid) {
          setFormData({ ...formData, step2: step2Form.getValues() });
          setStep(3);
        }
        break;
      case 3:
        isValid = await step3Form.trigger();
        if (isValid) {
          setFormData({ ...formData, step3: step3Form.getValues() });
          setStep(4);
        }
        break;
      case 4:
        isValid = await step4Form.trigger();
        if (isValid) {
          setFormData({ ...formData, step4: step4Form.getValues() });
          handleSubmit();
        }
        break;
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updateOnboarding({
        ...formData.step1,
        timeCommitment: parseInt(formData.step2.timeCommitment),
        interests: formData.step3.interests,
        developmentArea: formData.step4.developmentArea,
      });
      toast.success('Kurulum tamamlandı! Yolculuğunuza hoş geldiniz.');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Kurulum tamamlanamadı');
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (interest: string) => {
    const current = step3Form.getValues('interests') || [];
    const updated = current.includes(interest)
      ? current.filter((i) => i !== interest)
      : [...current, interest];
    step3Form.setValue('interests', updated);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full ${s <= step ? 'bg-primary-500' : 'bg-background-200'
                  }`}
              />
            ))}
          </div>
          <p className="text-center text-text-600">Adım {step} / 5</p>
        </div>

        {step === 1 && (
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-text-900 mb-6">Bize kendinden bahset</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-700 mb-2">Ad Soyad</label>
                <input
                  {...step1Form.register('name', { valueAsNumber: false })}
                  className="w-full px-4 py-3 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-text-900"
                  placeholder="Ahmet Yılmaz"
                />
                {step1Form.formState.errors.name && (
                  <p className="mt-1 text-sm text-error-600">{step1Form.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-700 mb-2">Yaş</label>
                <input
                  type="number"
                  {...step1Form.register('age', { valueAsNumber: true })}
                  className="w-full px-4 py-3 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-text-900"
                  placeholder="25"
                />
                {step1Form.formState.errors.age && (
                  <p className="mt-1 text-sm text-error-600">{step1Form.formState.errors.age.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-700 mb-2">Cinsiyet</label>
                <select
                  {...step1Form.register('gender')}
                  className="w-full px-4 py-3 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-text-900"
                >
                  <option value="male">Erkek</option>
                  <option value="female">Kadın</option>
                  <option value="other">Diğer</option>
                  <option value="prefer-not-to-say">Belirtmek İstemiyorum</option>
                </select>
                {step1Form.formState.errors.gender && (
                  <p className="mt-1 text-sm text-error-600">{step1Form.formState.errors.gender.message}</p>
                )}
              </div>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-text-900 mb-6">Günlük ne kadar zaman ayırabilirsin?</h2>
            <div className="grid grid-cols-2 gap-4">
              {['15', '30', '45', '60'].map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => step2Form.setValue('timeCommitment', time as any)}
                  className={`p-6 rounded-xl border-2 transition-all ${step2Form.watch('timeCommitment') === time
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-background-200 hover:border-primary-300'
                    }`}
                >
                  <p className="text-3xl font-bold text-text-900">{time}</p>
                  <p className="text-text-600">dakika/gün</p>
                </button>
              ))}
            </div>
            {step2Form.formState.errors.timeCommitment && (
              <p className="mt-4 text-sm text-error-600">{step2Form.formState.errors.timeCommitment.message}</p>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-text-900 mb-6">En çok neye ilgi duyuyorsun?</h2>
            <p className="text-text-600 mb-6">Uygun olanların hepsini seç</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {interestsOptions.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${(step3Form.watch('interests') || []).includes(interest)
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-background-200 hover:border-primary-300'
                    }`}
                >
                  {interest}
                </button>
              ))}
            </div>
            {step3Form.formState.errors.interests && (
              <p className="mt-4 text-sm text-error-600">{step3Form.formState.errors.interests.message}</p>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-text-900 mb-6">Ana gelişim alanın nedir?</h2>
            <div className="space-y-3">
              {developmentAreas.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => step4Form.setValue('developmentArea', area)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${step4Form.watch('developmentArea') === area
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-background-200 hover:border-primary-300'
                    }`}
                >
                  {area}
                </button>
              ))}
            </div>
            {step4Form.formState.errors.developmentArea && (
              <p className="mt-4 text-sm text-error-600">{step4Form.formState.errors.developmentArea.message}</p>
            )}
          </div>
        )}

        {step === 5 && (
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-text-900 mb-6">Özet</h2>
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-text-500">İsim</p>
                <p className="font-medium">{formData.step1.name}</p>
              </div>
              <div>
                <p className="text-sm text-text-500">Günlük Zaman</p>
                <p className="font-medium">{formData.step2.timeCommitment} dakika</p>
              </div>
              <div>
                <p className="text-sm text-text-500">İlgi Alanları</p>
                <p className="font-medium">{formData.step3.interests.join(', ')}</p>
              </div>
              <div>
                <p className="text-sm text-text-500">Gelişim Alanı</p>
                <p className="font-medium">{formData.step4.developmentArea}</p>
              </div>
            </div>
            <p className="text-text-600 mb-6">
              Her şey hazır! 21 günlük dönüşümüne başlamak için &quot;Yolculuğuna Başla&quot;ya tıkla.
            </p>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
          >
            Geri
          </Button>
          <Button onClick={nextStep} loading={loading}>
            {step === 5 ? 'Yolculuğuna Başla' : 'İleri'}
          </Button>
        </div>
      </div>
    </div>
  );
}
