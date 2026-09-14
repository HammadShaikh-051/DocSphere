import { useState, useRef } from 'react';
import { Paperclip, X, Upload, File, Image, FileText as FileTextIcon, Download } from 'lucide-react';
import { useDocumentAttachments, useUploadAttachment, useDeleteAttachment } from '../useAttachment';

function formatFileSize(bytes) {
    if (!bytes && bytes !== 0) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileMeta(fileType) {
    if (fileType?.startsWith('image/')) {
        return { icon: Image, color: 'var(--g-green)', bg: 'rgba(16, 185, 129, 0.12)' };
    }
    if (fileType === 'application/pdf') {
        return { icon: FileTextIcon, color: 'var(--g-red)', bg: 'rgba(239, 68, 68, 0.12)' };
    }
    return { icon: File, color: 'var(--g-blue)', bg: 'rgba(59, 130, 246, 0.12)' };
}

function AttachmentPanel({ documentId }) {
    const { data, isLoading } = useDocumentAttachments(documentId);
    const uploadMutation = useUploadAttachment(documentId);
    const deleteMutation = useDeleteAttachment(documentId);

    const [isDragging, setIsDragging] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const fileInputRef = useRef(null);

    const attachments = data?.data || [];

    const handleFile = (file) => {
        if (!file) return;
        setUploadError('');

        uploadMutation.mutate(file, {
            onError: (err) => {
                setUploadError(err.response?.data?.message || 'Upload failed. Please try again.');
            },
        });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        handleFile(file);
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files?.[0];
        handleFile(file);
        e.target.value = '';
    };

    const handleDelete = (attachment) => {
        if (confirm(`Delete "${attachment.fileName}"?`)) {
            deleteMutation.mutate(attachment.id);
        }
    };

    return (
        <div
            style={{
                background: 'var(--surface-1)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                boxShadow: 'var(--shadow-card)',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Paperclip size={16} style={{ color: 'var(--g-yellow)' }} />
                    <h3
                        style={{
                            fontSize: '14px',
                            fontWeight: 700,
                            color: 'var(--text-secondary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                        }}
                    >
                        Attachments
                    </h3>
                    <span className="ds-badge ds-badge-yellow" style={{ fontSize: '11px', padding: '2px 8px' }}>
                        {attachments.length}
                    </span>
                </div>
            </div>

            {/* Dropzone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                    border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '24px 16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: isDragging ? 'var(--accent-light)' : 'var(--surface-2)',
                    transition: 'all 0.15s ease',
                }}
            >
                <div
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'var(--surface-3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 10px',
                        color: isDragging ? 'var(--accent)' : 'var(--text-secondary)',
                    }}
                >
                    <Upload size={20} />
                </div>
                <p style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--text-primary)' }}>
                    {uploadMutation.isPending ? 'Uploading file…' : 'Drag a file here, or browse files'}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Supports images, PDFs, spreadsheets and documents up to 10MB
                </p>

                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileInputChange}
                    style={{ display: 'none' }}
                />
            </div>

            {uploadError && (
                <div className="ds-alert ds-alert-red" style={{ marginTop: '12px', fontSize: '12.5px' }}>
                    {uploadError}
                </div>
            )}

            {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', padding: '16px 0' }}>
                    <div className="ds-spinner" style={{ width: '16px', height: '16px' }} />
                    <span style={{ fontSize: '13px' }}>Loading attachments…</span>
                </div>
            ) : attachments.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                    {attachments.map((attachment) => {
                        const meta = getFileMeta(attachment.fileType);
                        const Icon = meta.icon;
                        return (
                            <div
                                key={attachment.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '10px 14px',
                                    background: 'var(--surface-2)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-md)',
                                    transition: 'border-color 0.15s ease',
                                }}
                            >
                                <a
                                    href={attachment.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', flex: 1, minWidth: 0 }}
                                >
                                    <div
                                        style={{
                                            width: '34px',
                                            height: '34px',
                                            borderRadius: '8px',
                                            backgroundColor: meta.bg,
                                            border: `1px solid ${meta.color}30`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: meta.color,
                                            flexShrink: 0,
                                        }}
                                    >
                                        <Icon size={16} />
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <div
                                            style={{
                                                fontSize: '13px',
                                                fontWeight: 600,
                                                color: 'var(--text-primary)',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {attachment.fileName}
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                            {formatFileSize(attachment.fileSize)} · uploaded by {attachment.uploadedByName || 'User'}
                                        </div>
                                    </div>
                                </a>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <a
                                        href={attachment.fileUrl}
                                        download
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '6px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--text-muted)',
                                            textDecoration: 'none',
                                            transition: 'all 0.15s ease',
                                        }}
                                        title="Download file"
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = 'var(--text-primary)';
                                            e.currentTarget.style.background = 'var(--surface-3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = 'var(--text-muted)';
                                            e.currentTarget.style.background = 'transparent';
                                        }}
                                    >
                                        <Download size={14} />
                                    </a>

                                    <button
                                        onClick={() => handleDelete(attachment)}
                                        style={{
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '6px',
                                            border: 'none',
                                            background: 'transparent',
                                            cursor: 'pointer',
                                            color: 'var(--text-muted)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.15s ease',
                                        }}
                                        title="Delete attachment"
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = 'var(--g-red)';
                                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = 'var(--text-muted)';
                                            e.currentTarget.style.background = 'transparent';
                                        }}
                                    >
                                        <X size={15} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default AttachmentPanel;