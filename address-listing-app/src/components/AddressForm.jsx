import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const initialState = {
    region: '',
    city: '',
    branchNumber: '',
    fullAddress: '',
    phone: '',
    workingHours: ''
};

const AddressForm = ({ onSubmit, initialData, onCancel }) => {
    const [form, setForm] = useState(initialState);
    const { t } = useTranslation();

    useEffect(() => {
        if (initialData) setForm(initialData);
        else setForm(initialState);
    }, [initialData]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <div>
            <h3 className="address-form-title">{t('formTitle')}</h3>
            <form onSubmit={handleSubmit} className="address-form">
                <div className="modal-form-fields">
                    <input name="region" value={form.region} onChange={handleChange} placeholder={t('region')} required />
                    <input name="city" value={form.city} onChange={handleChange} placeholder={t('city')} required />
                    <input name="branchNumber" value={form.branchNumber} onChange={handleChange} placeholder={t('branchNumber')} />
                    <input name="fullAddress" value={form.fullAddress} onChange={handleChange} placeholder={t('fullAddress')} required />
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder={t('phone')} />
                    <input name="workingHours" value={form.workingHours} onChange={handleChange} placeholder={t('workingHours')} />
                </div>
                <div className="address-form-actions">
                    <button type="submit" className="form-btn form-btn-primary">{t('save')}</button>
                    {onCancel && <button type="button" className="form-btn" onClick={onCancel}>{t('cancel')}</button>}
                </div>
            </form>
        </div>
    );
};

export default AddressForm;
