import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './AuthModal.css';

export default function UploadProfileModal({ onClose }) {
    const { token, user, setUser } = useContext(AuthContext);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(user?.profile_picture_url || "");
    const [isUploading, setIsUploading] = useState(false);

    // Handle file changes
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            //Needs to be jpeg or png
            if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                alert("Invalid file format. Please upload a JPEG or PNG.");
                return;
            }
            // 5 MB max for pictures
            if (file.size > 5 * 1024 * 1024) {
                alert("File is too large. Maximum size is 5MB.");
                return;
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    //Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            alert("Please select an image first.");
            return;
        }

        setIsUploading(true);

        // Required for file uploads
        const formData = new FormData();
        formData.append('profile_image', selectedFile);

        // Send the file to the backend
        try {
            const apiBase = import.meta.env.VITE_API_URL || '';
            const response = await fetch(`${apiBase}/user/upload-profile-picture`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const result = await response.json();

            //Updates the picture in the navbar immediately after upload
            if (response.ok && result.status === 'success') {
                setUser({ ...user, profile_picture_url: result.profile_picture_url });
                alert("Profile picture updated successfully!");
                onClose();
            } else {
                alert(result.message || "Upload failed.");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("An error occurred during upload.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="auth-close-btn" onClick={onClose}>×</button>
                <h2 className="auth-title">Upload Profile Picture</h2>

                <form onSubmit={handleSubmit} className="auth-form" style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: '20px' }}>
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="Preview"
                                style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #ccc' }}
                            />
                        ) : (
                            <div style={{ width: '150px', height: '150px', borderRadius: '50%', backgroundColor: '#eee', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span>No Image</span>
                            </div>
                        )}
                    </div>

                    <div className="auth-field">
                        <input
                            type="file"
                            accept="image/jpeg, image/png"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', marginTop: '20px' }}>
                        <button type="button" className="auth-submit-btn" style={{ backgroundColor: '#6c757d' }} onClick={onClose}>Cancel</button>
                        <button type="submit" className="auth-submit-btn" disabled={isUploading}>
                            {isUploading ? 'Uploading...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}