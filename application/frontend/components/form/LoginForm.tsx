import FormUi from '@ui/form';
import { Button } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

export default function Form() {
    const { t } = useTranslation('form');
    return (
        <FormUi className='flex flex-col gap-4'>
            <FormUi.Input label={t('fields.email.label')} placeholder={t('fields.email.placeholder')} />
            <Button color='primary' size='lg'>
                {t('buttons.continue_with_email')}
            </Button>
        </FormUi>
    )
}