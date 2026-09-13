import { useState, useRef } from 'react';
import { Paperclip, X, Upload, File, Image, FileText as FileTextIcon } from 'lucide-react';
import { useDocumentAttachments, useUploadAttachment, useDeleteAttachment } from '../useAttachment';

function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(fileType) {
    if (fileType?.startsWith('image/')) return Image;
    if (fileType === 'application/pdf') return FileTextIcon;
    return File;
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
                setUploadError(err.response?.data?.message || 'Upload failed.');
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
        <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Paperclip size={15} style={{ color: 'var(--text-secondary)' }} />
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Attachments
                </h3>
            </div>

            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                    border: `2px dashed ${isDragging ? 'var(--g-blue)' : 'var(--border)'}`,
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: isDragging ? 'var(--accent-light)' : 'transparent',
                    transition: 'all 0.15s',
                }}
            >
                <Upload size={20} style={{ color: 'var(--text-muted)', margin: '0 auto 8px' }} />
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {uploadMutation.isPending ? 'Uploading…' : 'Drag a file here, or click to browse'}
                </p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Max 10MB
                </p>

                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileInputChange}
                    style={{ display: 'none' }}
                />
            </div>

            {uploadError && (
                <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '8px' }}>{uploadError}</p>
            )}

            {isLoading ? (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '12px' }}>Loading attachments…</p>
            ) : attachments.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                    {attachments.map((attachment) => {
                        const Icon = getFileIcon(attachment.fileType);
                        return (
              <div
                key={attachment.id}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
              >
                <a
                  href={attachment.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flex: 1, minWidth: 0 }}
                >
                  <Icon size={18} style={{ color: 'var(--g-blue)', flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {attachment.fileName}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {formatFileSize(attachment.fileSize)} · {attachment.uploadedByName}
                    </div>
                  </div>
                </a>

                <button
                  onClick={() => handleDelete(attachment)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', flexShrink: 0 }}
                >
                  <X size={16} />
                </button>
              </div>
            );
          })}
        </div>
    )
}
    </div >
  );
}

export default AttachmentPanel;