import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UserPlus, X, Crown, Users, Mail, ArrowLeft, Shield, Check, Trash2 } from 'lucide-react';
import { useWorkspaceMembers, useUpdateMemberRole, useRemoveMember } from '../useMember';
import {
    useWorkspaceInvitations,
    useSendInvitation,
    useCancelInvitation,
} from '../../invitation/useInvitation';
import Modal from '../../../components/ui/Modal';

const ROLES = ['ADMIN', 'EDITOR', 'VIEWER'];

const ROLE_BADGE = {
    OWNER: 'ds-badge ds-badge-blue',
    ADMIN: 'ds-badge ds-badge-red',
    EDITOR: 'ds-badge ds-badge-yellow',
    VIEWER: 'ds-badge ds-badge-green',
};

function MembersPage() {
    const { workspaceId } = useParams();

    const { data: membersData, isLoading: isMembersLoading } = useWorkspaceMembers(workspaceId);
    const { data: invitationsData, isLoading: isInvitationsLoading } = useWorkspaceInvitations(workspaceId);

    const updateRoleMutation = useUpdateMemberRole(workspaceId);
    const removeMemberMutation = useRemoveMember(workspaceId);
    const sendInvitationMutation = useSendInvitation(workspaceId);
    const cancelInvitationMutation = useCancelInvitation(workspaceId);

    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('EDITOR');

    const members = membersData?.data || [];
    const invitations = invitationsData?.data || [];
    const pendingInvitations = invitations.filter((inv) => inv.status === 'PENDING');

    const handleSendInvitation = (e) => {
        e.preventDefault();
        sendInvitationMutation.mutate(
            { email: inviteEmail, role: inviteRole },
            {
                onSuccess: () => {
                    setInviteEmail('');
                    setInviteRole('EDITOR');
                    setShowInviteModal(false);
                },
            }
        );
    };

    const handleRoleChange = (memberUserId, newRole) => {
        updateRoleMutation.mutate({ memberUserId, role: newRole });
    };

    const handleRemoveMember = (memberUserId) => {
        if (confirm('Remove this member from the workspace?')) {
            removeMemberMutation.mutate(memberUserId);
        }
    };

    const handleCancelInvitation = (invitationId) => {
        cancelInvitationMutation.mutate(invitationId);
    };

    return (
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Top Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <Link
                    to={`/workspaces/${workspaceId}`}
                    className="ds-btn ds-btn-ghost"
                    style={{ padding: '6px 12px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                    <ArrowLeft size={14} /> Back to Workspace
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            borderRadius: '99px',
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            color: 'var(--g-blue)',
                            fontSize: '12px',
                            fontWeight: 600,
                        }}
                    >
                        <Users size={13} />
                        {members.length} {members.length === 1 ? 'member' : 'members'}
                    </span>
                </div>
            </div>

            {/* Header Hero */}
            <div
                style={{
                    background: 'linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '24px 28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            background: 'rgba(59, 130, 246, 0.12)',
                            border: '1px solid rgba(59, 130, 246, 0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--g-blue)',
                            flexShrink: 0,
                        }}
                    >
                        <Users size={22} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
                            Workspace Members
                        </h1>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                            Manage members, assign permissions, and send email invitations to collaborate.
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setShowInviteModal(true)}
                    className="ds-btn ds-btn-primary"
                    id="invite-member-btn"
                    style={{ gap: '8px', padding: '10px 18px', fontSize: '13.5px' }}
                >
                    <UserPlus size={16} />
                    Invite Member
                </button>
            </div>

            {/* Members Section */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
                    <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                        Active Members ({members.length})
                    </h2>
                </div>

                {isMembersLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '13px', padding: '24px' }}>
                        <div className="ds-spinner" /> Loading members…
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {members.map((member) => {
                            const isOwner = member.role === 'OWNER';
                            const initial = member.user?.name?.[0]?.toUpperCase() || '?';
                            return (
                                <div
                                    key={member.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '14px 18px',
                                        background: 'var(--surface)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius-md)',
                                        gap: '16px',
                                        transition: 'background 0.15s ease, border-color 0.15s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.35)';
                                        e.currentTarget.style.background = 'var(--surface-2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--border)';
                                        e.currentTarget.style.background = 'var(--surface)';
                                    }}
                                >
                                    {/* Avatar + User Info */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                                        <div
                                            style={{
                                                width: '38px',
                                                height: '38px',
                                                borderRadius: '10px',
                                                background: isOwner
                                                    ? 'linear-gradient(135deg, #3B82F6, #1D4ED8)'
                                                    : 'linear-gradient(135deg, #64748B, #475569)',
                                                color: '#fff',
                                                fontSize: '15px',
                                                fontWeight: 700,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                                boxShadow: 'var(--shadow-xs)',
                                            }}
                                        >
                                            {initial}
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {member.user.name}
                                                </span>
                                                {isOwner && (
                                                    <span className={ROLE_BADGE['OWNER']}>
                                                        <Crown size={10} style={{ marginRight: '4px' }} />
                                                        Owner
                                                    </span>
                                                )}
                                            </div>
                                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                                                {member.user.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Role Selector + Actions */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                                        {isOwner ? (
                                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', paddingRight: '8px' }}>
                                                Primary workspace owner
                                            </span>
                                        ) : (
                                            <>
                                                <select
                                                    value={member.role}
                                                    onChange={(e) => handleRoleChange(member.user.id, e.target.value)}
                                                    className="ds-select"
                                                    style={{ padding: '6px 12px', fontSize: '12.5px', minWidth: '105px' }}
                                                >
                                                    {ROLES.map((role) => (
                                                        <option key={role} value={role}>{role}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={() => handleRemoveMember(member.user.id)}
                                                    disabled={removeMemberMutation.isPending}
                                                    style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        borderRadius: '8px',
                                                        border: '1px solid var(--border)',
                                                        background: 'var(--surface-2)',
                                                        color: 'var(--text-muted)',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transition: 'all 0.15s ease',
                                                    }}
                                                    title="Remove member from workspace"
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                                                        e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                                                        e.currentTarget.style.color = 'var(--g-red)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = 'var(--surface-2)';
                                                        e.currentTarget.style.borderColor = 'var(--border)';
                                                        e.currentTarget.style.color = 'var(--text-muted)';
                                                    }}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Pending Invitations Section */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
                    <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                        Pending Invitations ({pendingInvitations.length})
                    </h2>
                </div>

                {isInvitationsLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '13px', padding: '24px' }}>
                        <div className="ds-spinner" /> Loading invitations…
                    </div>
                ) : pendingInvitations.length === 0 ? (
                    <div
                        style={{
                            padding: '24px',
                            background: 'var(--surface)',
                            border: '1px dashed var(--border)',
                            borderRadius: 'var(--radius-md)',
                            textAlign: 'center',
                            color: 'var(--text-muted)',
                            fontSize: '13px',
                        }}
                    >
                        No pending invitations.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {pendingInvitations.map((invitation) => (
                            <div
                                key={invitation.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '14px 18px',
                                    background: 'var(--surface)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-md)',
                                    gap: '16px',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                                    <div
                                        style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '8px',
                                            background: 'rgba(251, 188, 4, 0.12)',
                                            border: '1px solid rgba(251, 188, 4, 0.25)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--g-yellow)',
                                            flexShrink: 0,
                                        }}
                                    >
                                        <Mail size={16} />
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {invitation.invitedEmail}
                                        </p>
                                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            Invited as
                                            <span className={ROLE_BADGE[invitation.role] || 'ds-badge ds-badge-green'}>
                                                {invitation.role}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleCancelInvitation(invitation.id)}
                                    disabled={cancelInvitationMutation.isPending}
                                    className="ds-btn ds-btn-ghost"
                                    style={{
                                        fontSize: '12px',
                                        padding: '5px 12px',
                                        color: 'var(--g-red)',
                                        borderColor: 'rgba(239, 68, 68, 0.3)',
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Invite Modal */}
            <Modal
                isOpen={showInviteModal}
                onClose={() => setShowInviteModal(false)}
                title="Invite Member to Workspace"
            >
                <form onSubmit={handleSendInvitation} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="form-group">
                        <label className="ds-label" htmlFor="invite-email">Email Address</label>
                        <input
                            id="invite-email"
                            type="email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            required
                            placeholder="colleague@example.com"
                            className="ds-input"
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label className="ds-label" htmlFor="invite-role">Permission Role</label>
                        <select
                            id="invite-role"
                            value={inviteRole}
                            onChange={(e) => setInviteRole(e.target.value)}
                            className="ds-select"
                            style={{ width: '100%' }}
                        >
                            <option value="ADMIN">ADMIN — Full management permissions</option>
                            <option value="EDITOR">EDITOR — Can create, edit and delete documents</option>
                            <option value="VIEWER">VIEWER — Read-only access to documents</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                        <button
                            type="button"
                            onClick={() => setShowInviteModal(false)}
                            className="ds-btn ds-btn-ghost"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={sendInvitationMutation.isPending}
                            className="ds-btn ds-btn-primary"
                        >
                            {sendInvitationMutation.isPending ? 'Sending Invite…' : 'Send Invitation'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default MembersPage;