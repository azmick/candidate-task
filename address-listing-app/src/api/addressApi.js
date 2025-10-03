import axios from 'axios';

const API_BASE_URL = 'https://localhost:7221/api';

export const fetchAddresses = async () => {
    const response = await axios.get(`${API_BASE_URL}/addresses`);
    console.log(response.data);
    return response.data;
};

export const fetchAddressById = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/addresses/${id}`);
    return response.data;
};

export const createAddress = async (address) => {
    const response = await axios.post(`${API_BASE_URL}/addresses`, address);
    return response.data;
};

export const updateAddress = async (id, address) => {
    const response = await axios.put(`${API_BASE_URL}/addresses/${id}`, address);
    return response.data;
};

export const deleteAddress = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/addresses/${id}`);
    return response.data;
};

export async function bulkImportAddresses(file) {
    const text = await file.text();
    let addresses;
    try {
        addresses = JSON.parse(text);
    } catch {
        addresses = text
            .split('\n')
            .map(line => line.trim())
            .filter(Boolean)
            .map(line =>
                line.replace(/^"(.*)"$/, '$1') // Satýr baþý ve sonundaki çift týrnaklarý kaldýrýr
            );
    }

    const response = await fetch(`${API_BASE_URL}/addresses/bulk-import`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(addresses)
    });

    if (!response.ok) {
        throw new Error('Toplu adres yüklenemedi');
    }
    // 204 No Content kontrolü
    if (response.status === 204) {
        return null;
    }
    return await response.json();
}




