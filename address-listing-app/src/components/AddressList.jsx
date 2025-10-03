import React, { useEffect, useState } from 'react';
import { fetchAddresses, createAddress, updateAddress, deleteAddress } from '../api/addressApi';
import AddressForm from './AddressForm';
import Modal from './Modal';
import '../styles/AddressList.css';

const AddressList = () => {
    const [showForm, setShowForm] = useState(false);
    const [editData, setEditData] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleAdd = () => {
        setEditData(null);
        setShowForm(true);
    };

    const handleEdit = (address) => {
        setEditData(address);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Silmek istediğinize emin misiniz?')) {
            console.log('Deleting address with id:', id);
            await deleteAddress(id);
            setAddresses(addresses.filter(a => a.id !== id));
        }
    };

    const handleFormSubmit = async (form) => {
        if (editData) {
            const updated = await updateAddress(editData.id, form);
            setAddresses(addresses.map(a => a.id === editData.id ? updated : a));
        } else {
            const created = await createAddress(form);
            setAddresses([...addresses, created]);
        }
        setShowForm(false);
    };

    useEffect(() => {
        fetchAddresses()
            .then(data => setAddresses(data))
            .catch(err => setError('Veri alınamadı!'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="address-list-container">
            {loading && (
                <div className="state-message">
                    <div className="spinner"></div>
                    <div>Adresler yükleniyor...</div>
                </div>
            )}
            {error && (
                <div className="state-message error-message">
                    <span role="img" aria-label="error">⚠️</span> {error}
                </div>
            )}
            {!loading && !error && addresses.length === 0 && (
                <div className="state-message empty-message">
                    <span role="img" aria-label="empty">📭</span>
                    <div>Hiç adres bulunamadı.<br />Yeni bir adres ekleyebilirsiniz.</div>
                </div>
            )}

            <h2>Відділення Нової Пошти в місті Одеса</h2>
            <button className="add-btn" onClick={handleAdd}>Yeni Adres Ekle</button>
            <Modal open={showForm} onClose={() => setShowForm(false)}>
                <AddressForm
                    onSubmit={handleFormSubmit}
                    initialData={editData}
                    onCancel={() => setShowForm(false)}
                />
            </Modal>
            <div className="address-list-cards">
                {addresses.map((item, idx) => (
                    <div className="address-card" key={item.id || idx}>
                        <div className="address-info">
                            <div><strong>Region:</strong> {item.region}</div>
                            <div><strong>City:</strong> {item.city}</div>
                            <div><strong>Branch Number:</strong> {item.branchNumber}</div>
                            <div><strong>Full Address:</strong> {item.fullAddress}</div>
                            <div><strong>Phone:</strong> {item.phone}</div>
                            <div><strong>Working Hours:</strong> {item.workingHours}</div>
                        </div>
                        <div className="address-actions">
                            <button className="edit-btn" onClick={() => handleEdit(item)}>
                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 4, verticalAlign: 'middle' }}><path d="M12.1 3.9l-8.2 8.2-1.4 4.1 4.1-1.4 8.2-8.2c.4-.4.4-1 0-1.4l-1.3-1.3c-.4-.4-1-.4-1.4 0z" /></svg>
                            </button>
                            <button className="delete-btn" onClick={() => handleDelete(item.id)}>
                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 4, verticalAlign: 'middle' }}><path d="M2 4h12M6 4V2h4v2m1 0v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4h8z" /></svg>
                            </button>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default AddressList;
