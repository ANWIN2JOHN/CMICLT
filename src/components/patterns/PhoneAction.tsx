import { useState } from 'react';
import { Button } from '../ui/Button';
import { BottomSheet } from '../ui/overlays';
import { whatsappLink } from '../../lib/contact';
import { useLocale } from '../../contexts/LocaleContext';

export function usePhoneAction() {
  const [contactPhone, setContactPhone] = useState<{ number: string; name: string } | null>(null);
  
  const handlePhoneTap = (number: string, name: string) => {
    setContactPhone({ number, name });
  };

  return { contactPhone, setContactPhone, handlePhoneTap };
}

interface PhoneActionSheetProps {
  contactPhone: { number: string; name: string } | null;
  onClose: () => void;
}

export function PhoneActionSheet({ contactPhone, onClose }: PhoneActionSheetProps) {
  const { t } = useLocale();

  const handleCall = () => {
    if (contactPhone) {
      window.location.href = `tel:${contactPhone.number.replace(/[\s()\-]/g, '')}`;
      onClose();
    }
  };

  const handleWhatsApp = () => {
    if (contactPhone) {
      window.open(whatsappLink(contactPhone.number), '_blank');
      onClose();
    }
  };

  return (
    <BottomSheet 
      open={contactPhone !== null} 
      onClose={onClose}
      title={contactPhone ? contactPhone.name : ''}
    >
      <div className="space-y-3 pt-2">
        <Button fullWidth onClick={handleCall}>
          {t('common.call')}
        </Button>
        <Button fullWidth variant="outline" onClick={handleWhatsApp}>
          {t('common.whatsapp')}
        </Button>
        <Button fullWidth variant="outline" onClick={onClose}>
          {t('common.cancel')}
        </Button>
      </div>
    </BottomSheet>
  );
}
