import React, { useState, useEffect } from 'react';

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
            <h3 className="address-form-title">Adres Bilgisi</h3>
            <form onSubmit={handleSubmit} className="address-form">
                <div className="modal-form-fields">
                    <input name="region" value={form.region} onChange={handleChange} placeholder="Region" required />
                    <input name="city" value={form.city} onChange={handleChange} placeholder="City" required />
                    <input name="branchNumber" value={form.branchNumber} onChange={handleChange} placeholder="Branch Number" />
                    <input name="fullAddress" value={form.fullAddress} onChange={handleChange} placeholder="Full Address" required />
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
                    <input name="workingHours" value={form.workingHours} onChange={handleChange} placeholder="Working Hours" />
                </div>
                <div className="address-form-actions">
                    <button type="submit" className="form-btn form-btn-primary">Kaydet</button>
                    {onCancel && <button type="button" className="form-btn" onClick={onCancel}>Ýptal</button>}
                </div>
            </form>
        </div>
    );
};

export default AddressForm;
