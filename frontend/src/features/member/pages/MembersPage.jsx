import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserPlus, X, Crown } from 'lucide-react';
import { useWorkspaceMembers, useUpdateMemberRole, useRemoveMember } from '../useMember';
import {
    useWorkspaceInvitations,
    useSendInvitation,
    useCancelInvitation,
} from '../../invitation/useInvitation';
import Modal from '../../../components/ui/Modal';

const ROLES = ['ADMIN', 'EDITOR', 'VIEWER'];

const ROLE_BADGE = {
    OWNER:  'ds-badge ds-badge-blue',
    ADMIN:  'ds-badge ds-badge-red',
    EDITOR: 'ds-badge ds-badge-yellow',
    VIEWER: 'ds-badge ds-badge-green',
};

function MembersPage() {
    const { workspaceId } = useParams();

    const { data: membersData, isLoading: isMembersLoading } = useWorkspaceMembers(workspaceId);
    const { data: invitationsData, isLoading: isInvitationsLoading } =
        useWorkspaceInvitations(workspaceId);

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
        <div>
            {/* Header */}
            <div className="members-header" style={{ marginBottom: '28px' }}>
                <div>
                    <h1 className="page-title">Members</h1>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        Manage who has access to this workspace.
                    </p>
                </div>
                <button
                    onClick={() => setShowInviteModal(true)}
                    className="ds-btn ds-btn-primary"
                    id="invite-member-btn"
                >
                    <UserPlus size={16} />
                    Invite Member
                </button>
            </div>

            {/* Members list */}
            <section style={{ marginBottom: '32px' }}>
                <h2 style={{
                    fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)',
                    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px',
                }}>
                    Members ({members.length})
                </h2>

                {isMembersLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '13px' }}>
                        <div className="ds-spinner" /> Loading members…
                    </div>
                ) : (
                    <div className="member-list">
                        {members.map((member) => (
                            <div key={member.id} className="member-row">
                                {/* Avatar + Info */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div
                                        className="avatar"
                                        style={{ width: '36px', height: '36px', fontSize: '14px' }}
                                    >
                                        {member.user.name?.[0]?.toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                                            {member.user.name}
                                        </p>
                                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                            {member.user.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Role + Actions */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {member.role === 'OWNER' ? (
                                        <span className={ROLE_BADGE['OWNER']}>
                                            <Crown size={10} style={{ marginRight: '4px' }} />
                                            Owner
                                        </span>
                                    ) : (
                                        <>
                                            <select
                                                value={member.role}
                                                onChange={(e) => handleRoleChange(member.user.id, e.target.value)}
                                                className="ds-select"
                                            >
                                                {ROLES.map((role) => (
                                                    <option key={role} value={role}>{role}</option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={() => handleRemoveMember(member.user.id)}
                                                style={{
                                                    width: '28px', height: '28px',
                                                    borderRadius: '50%', border: 'none',
                                                    background: 'var(--surface-2)',
                                                    color: 'var(--text-muted)',
                                                    cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    transition: 'background-color 0.15s, color 0.15s',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = 'var(--danger-light)';
                                                    e.currentTarget.style.color = 'var(--g-red)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = 'var(--surface-2)';
                                                    e.currentTarget.style.color = 'var(--text-muted)';
                                                }}
                                            >
                                                <X size={14} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Pending Invitations */}
            <section>
                <h2 style={{
                    fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)',
                    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px',
                }}>
                    Pending Invitations ({pendingInvitations.length})
                </h2>

                {isInvitationsLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '13px' }}>
                        <div className="ds-spinner" /> Loading…
                    </div>
                ) : pendingInvitations.length === 0 ? (
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No pending invitations.</p>
                ) : (
                    <div className="member-list">
                        {pendingInvitations.map((invitation) => (
                            <div key={invitation.id} className="member-row">
                                <div>
                                    <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                                        {invitation.invitedEmail}
                                    </p>
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                        Invited as{' '}
                                        <span className={ROLE_BADGE[invitation.role] || 'ds-badge ds-badge-green'}>
                                            {invitation.role}
                                        </span>
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleCancelInvitation(invitation.id)}
                                    className="ds-btn ds-btn-ghost"
                                    style={{ fontSize: '12px', padding: '5px 12px', color: 'var(--g-red)', borderColor: 'var(--g-red)' }}
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
                title="Invite a Member"
            >
                <form onSubmit={handleSendInvitation} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="form-group">
                        <label className="ds-label" htmlFor="invite-email">Email address</label>
                        <input
                            id="invite-email"
                            type="email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            required
                            placeholder="colleague@example.com"
                            className="ds-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="ds-label" htmlFor="invite-role">Role</label>
                        <select
                            id="invite-role"
                            value={inviteRole}
                            onChange={(e) => setInviteRole(e.target.value)}
                            className="ds-select"
                            style={{ width: '100%' }}
                        >
                            {ROLES.map((role) => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={sendInvitationMutation.isPending}
                        className="ds-btn ds-btn-primary"
                        style={{ width: '100%', padding: '11px' }}
                    >
                        {sendInvitationMutation.isPending ? 'Sending…' : 'Send Invitation'}
                    </button>
                </form>
            </Modal>
        </div>
    );
}

export default MembersPage;