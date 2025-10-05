import React from "react";

const AddressCard = ({ item, t, onEdit, onDelete }) => (
    <div className="address-card">
        <div className="address-info">
            <div><strong>{t('region')}:</strong> {item.region}</div>
            <div><strong>{t('city')}:</strong> {item.city}</div>
            <div><strong>{t('branchNumber')}:</strong> {item.branchNumber}</div>
            <div><strong>{t('fullAddress')}:</strong> {item.fullAddress}</div>
            <div><strong>{t('phone')}:</strong> {item.phone}</div>
            <div><strong>{t('workingHours')}:</strong> {item.workingHours}</div>
        </div>
        <div className="address-actions">
            <button className="edit-btn" onClick={() => onEdit(item)} title={t('edit')}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 4, verticalAlign: 'middle' }}><path d="M12.1 3.9l-8.2 8.2-1.4 4.1 4.1-1.4 8.2-8.2c.4-.4.4-1 0-1.4l-1.3-1.3c-.4-.4-1-.4-1.4 0z" /></svg>
            </button>
            <button className="delete-btn" onClick={() => onDelete(item.id)} title={t('delete')}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 4, verticalAlign: 'middle' }}><path d="M2 4h12M6 4V2h4v2m1 0v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4h8z" /></svg>
            </button>
        </div>
    </div>
);

export default AddressCard;
