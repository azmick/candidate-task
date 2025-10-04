import React, { useEffect, useState, useRef } from 'react';
import { fetchAddresses, createAddress, updateAddress, deleteAddress, bulkImportAddresses } from '../api/addressApi';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import AddressForm from './AddressForm';
import Modal from './Modal';
import '../styles/AddressList.css';

const AddressList = () => {
    const [showForm, setShowForm] = useState(false);
    const [editData, setEditData] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const cityOptions = Array.from(new Set(addresses.map(a => a.city).filter(Boolean)));
    const regionOptions = Array.from(new Set(addresses.map(a => a.region).filter(Boolean)));
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [notification, setNotification] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });
    const fileInputRef = useRef();
    const itemsPerPage = 8;
    const { t } = useTranslation();



    const handleAdd = () => {
        setEditData(null);
        setShowForm(true);
    };

    const handleEdit = (address) => {
        setEditData(address);
        setShowForm(true);
    };

    const handleDeleteClick = (id) => {
        setDeleteConfirm({ open: true, id });
    };

    const handleFormSubmit = async (form) => {
        if (editData) {
            const updated = await updateAddress(editData.id, form);
            setAddresses(addresses.map(a => a.id === editData.id ? updated : a));
            showNotification(t('addressUpdated'));
        } else {
            const created = await createAddress(form);
            setAddresses([...addresses, created]);
            showNotification(t('addressCreated'));
        }
        setShowForm(false);
    };

    const handleBulkImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            await bulkImportAddresses(file);
            fetchAddresses().then(data => setAddresses(data));
            showNotification(t('bulkUploadSuccess'));
        } catch (err) {
            showNotification(t('bulkUploadError'));
        }
    };

    const confirmDelete = async () => {
        await deleteAddress(deleteConfirm.id);
        setAddresses(addresses.filter(a => a.id !== deleteConfirm.id));
        showNotification(t('addressDeleted'));
        setDeleteConfirm({ open: false, id: null });
    };


    useEffect(() => {
        fetchAddresses()
            .then(data => setAddresses(data))
            .catch(err => setError(t('errorLoadingData')))
            .finally(() => setLoading(false));
    }, []);

    const filteredAddresses = addresses
        .filter(item =>
            item.region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.branchNumber?.toString().includes(searchTerm) ||
            item.fullAddress?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(item =>
            (selectedCity ? item.city === selectedCity : true) &&
            (selectedRegion ? item.region === selectedRegion : true)
        );

    let sortedAddresses = [...filteredAddresses];
    if (sortField) {
        sortedAddresses.sort((a, b) => {
            let valA = a[sortField];
            let valB = b[sortField];
            // Sayı ise sayı olarak, değilse string olarak karşılaştır
            if (sortField === 'branchNumber') {
                valA = Number(valA);
                valB = Number(valB);
                if (isNaN(valA)) valA = 0;
                if (isNaN(valB)) valB = 0;
            } else {
                valA = (valA || '').toString().toLowerCase();
                valB = (valB || '').toString().toLowerCase();
            }
            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }

    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(''), 2500);
    };

    const totalPages = Math.ceil(sortedAddresses.length / itemsPerPage);
    const paginatedAddresses = sortedAddresses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );




    return (
        <div className="address-list-container">
            <div className="header-with-language">
                <h2>{t('title')}</h2>
                <LanguageSwitcher />
            </div>

                {notification && (
                    <div className="address-toast address-toast--danger">
                        <span role="img" aria-label="deleted" style={{ marginRight: 8 }}>🗑️</span>
                        {notification}
                        <button className="toast-close-btn" onClick={() => setNotification('')}>×</button>
                    </div>
                )}
                {loading && (
                    <div className="state-message">
                        <div className="spinner"></div>
                        <div>{t('loading')}</div>
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
                        <div>{t('noData')}</div>
                    </div>
                )}

                <input
                    type="text"
                    className="address-search"
                    placeholder={t('search')}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />

                <div className="filters-container">
                    <select className="address-filter" value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>
                        <option value="">{t('allCities')}</option>
                        {cityOptions.map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                    <select className="address-filter" value={selectedRegion} onChange={e => setSelectedRegion(e.target.value)}>
                        <option value="">{t('allRegions')}</option>
                        {regionOptions.map(region => (
                            <option key={region} value={region}>{region}</option>
                        ))}
                    </select>
                    <select className="address-filter" value={sortField} onChange={e => setSortField(e.target.value)}>
                        <option value="">{t('noSort')}</option>
                        <option value="city">{t('city')}</option>
                        <option value="region">{t('region')}</option>
                        <option value="branchNumber">{t('branchNumber')}</option>
                    </select>
                    <button
                        className="sort-btn"
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        title={sortOrder === 'asc' ? t('ascending') : t('descending')}
                    >
                        {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                    <button className="bulk-btn" onClick={() => fileInputRef.current.click()}>
                        {t('bulkUpload')}
                    </button>
                    <input
                        type="file"
                        accept=".csv,.xlsx"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleBulkImport}
                    />
                </div>

                <button className="add-btn" onClick={handleAdd}>{t('addNew')}</button>
                <Modal open={showForm} onClose={() => setShowForm(false)}>
                    <AddressForm
                        onSubmit={handleFormSubmit}
                        initialData={editData}
                        onCancel={() => setShowForm(false)}
                    />
                </Modal>
                <Modal open={deleteConfirm.open} onClose={() => setDeleteConfirm({ open: false, id: null })}>
                    <div style={{ textAlign: 'center', padding: 12 }}>
                        <div style={{ fontSize: 18, marginBottom: 18 }}>{t('confirmDelete')}</div>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                            <button className="delete-modal-btn" onClick={confirmDelete}>{t('yes')}</button>
                            <button className="delete-modal-btn" onClick={() => setDeleteConfirm({ open: false, id: null })}>{t('cancel')}</button>
                        </div>
                    </div>
                </Modal>
                <div className="address-list-cards">
                    {paginatedAddresses.map((item, idx) => (
                        <div className="address-card" key={item.id || idx}>
                            <div className="address-info">
                                <div><strong>{t('region')}:</strong> {item.region}</div>
                                <div><strong>{t('city')}:</strong> {item.city}</div>
                                <div><strong>{t('branchNumber')}:</strong> {item.branchNumber}</div>
                                <div><strong>{t('fullAddress')}:</strong> {item.fullAddress}</div>
                                <div><strong>{t('phone')}:</strong> {item.phone}</div>
                                <div><strong>{t('workingHours')}:</strong> {item.workingHours}</div>
                            </div>
                            <div className="address-actions">
                                <button className="edit-btn" onClick={() => handleEdit(item)} title={t('edit')}>
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 4, verticalAlign: 'middle' }}><path d="M12.1 3.9l-8.2 8.2-1.4 4.1 4.1-1.4 8.2-8.2c.4-.4.4-1 0-1.4l-1.3-1.3c-.4-.4-1-.4-1.4 0z" /></svg>
                                </button>
                                <button className="delete-btn" onClick={() => handleDeleteClick(item.id)} title={t('delete')}>
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 4, verticalAlign: 'middle' }}><path d="M2 4h12M6 4V2h4v2m1 0v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4h8z" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {totalPages > 1 && (
                    <div className="address-pagination">
                        <button
                            className="pagination-btn"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            &lt;
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                className={`pagination-btn${currentPage === i + 1 ? ' active' : ''}`}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            className="pagination-btn"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            &gt;
                        </button>
                    </div>
                )}
        </div>
    );
};

export default AddressList;
