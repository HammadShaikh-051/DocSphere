import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ArrowRight,
    CheckCircle2,
    FolderOpen,
    FileText,
    MessageSquare,
    History,
    Activity,
    Paperclip,
    Search,
    Trash2,
    Users,
    Layers,
    ShieldCheck,
    Sparkles,
    Menu,
    X,
    ChevronRight,
    Sun,
    Moon,
    Edit3,
    Clock,
    Check,
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import DocSphereLogo from '../../../components/ui/DocSphereLogo';

/* ─── Core Features Data (Real DocSphere capabilities) ─────────────────────── */
const FEATURES = [
    {
        id: 'workspaces',
        icon: Layers,
        color: 'var(--g-blue)',
        bg: 'rgba(66, 133, 244, 0.12)',
        title: 'Collaborative Workspaces',
        desc: 'Separate projects, teams, or personal notes into dedicated workspaces with role-based member permissions: Owner, Admin, Member, and Viewer.',
        badge: 'Organization',
    },
    {
        id: 'documents',
        icon: FileText,
        color: 'var(--g-green)',
        bg: 'rgba(52, 168, 83, 0.12)',
        title: 'Document & Folder Hierarchy',
        desc: 'Create nested folders, organize files cleanly, and write formatted documentation with real-time saving and instant access.',
        badge: 'Content',
    },
    {
        id: 'comments',
        icon: MessageSquare,
        color: 'var(--g-yellow)',
        bg: 'rgba(251, 188, 4, 0.14)',
        title: 'Comments & Discussions',
        desc: 'Collaborate directly around content with contextual threaded discussions. Keep questions and feedback attached to the document.',
        badge: 'Collaboration',
    },
    {
        id: 'versions',
        icon: History,
        color: 'var(--g-red)',
        bg: 'rgba(234, 67, 53, 0.10)',
        title: 'Version History',
        desc: 'Every document change is recorded. Browse chronological revisions, compare past versions, and restore previous snapshots with one click.',
        badge: 'History',
    },
    {
        id: 'activity',
        icon: Activity,
        color: 'var(--g-blue)',
        bg: 'rgba(66, 133, 244, 0.12)',
        title: 'Activity Timeline',
        desc: 'Audit trail across all your workspaces. Know who created, edited, renamed, restored, or deleted content at a glance.',
        badge: 'Audit Trail',
    },
    {
        id: 'attachments',
        icon: Paperclip,
        color: 'var(--g-green)',
        bg: 'rgba(52, 168, 83, 0.12)',
        title: 'File Attachments',
        desc: 'Upload images, assets, and project files directly alongside your workspace documentation to keep all references together.',
        badge: 'Assets',
    },
    {
        id: 'search',
        icon: Search,
        color: 'var(--g-yellow)',
        bg: 'rgba(251, 188, 4, 0.14)',
        title: 'Fast Workspace Search',
        desc: 'Instantly find workspaces and jump directly into content without navigating through nested folder trees.',
        badge: 'Navigation',
    },
    {
        id: 'trash',
        icon: Trash2,
        color: 'var(--g-red)',
        bg: 'rgba(234, 67, 53, 0.10)',
        title: 'Trash & Safe Recovery',
        desc: 'Accidental deletes are never permanent. Soft-deleted documents and folders remain safely recoverable from the trash bin.',
        badge: 'Security',
    },
];

/* ─── Workflow Steps ──────────────────────────────────────────────────────── */
const WORKFLOW_STEPS = [
    {
        number: '01',
        title: 'Create a Workspace',
        desc: 'Launch a space for your team, client project, or notes. Invite members with tailored access roles: Owner, Admin, Member, or Viewer.',
        icon: Layers,
        color: 'var(--g-blue)',
    },
    {
        number: '02',
        title: 'Organize and Collaborate',
        desc: 'Build folder hierarchies, author rich documentation, attach project assets, and discuss ideas via threaded comments.',
        icon: Users,
        color: 'var(--g-green)',
    },
    {
        number: '03',
        title: 'Track and Restore',
        desc: 'Stay informed with cross-workspace activity timelines, audit trails, version history snapshots, and safe trash recovery.',
        icon: ShieldCheck,
        color: 'var(--g-yellow)',
    },
];

/* ─── Collaboration Value Points ─────────────────────────────────────────── */
const VALUE_POINTS = [
    {
        title: 'Unified Workspace Isolation',
        desc: 'Keep separate initiatives organized in dedicated workspaces so sensitive notes never get mixed with public team specs.',
        icon: CheckCircle2,
        color: 'var(--g-blue)',
    },
    {
        title: 'Clear Accountability',
        desc: 'Comprehensive activity logs show exact details of who edited, created, or restored files, providing team clarity.',
        icon: CheckCircle2,
        color: 'var(--g-green)',
    },
    {
        title: 'Zero Lost Knowledge',
        desc: 'Version history records snapshots over time while the trash bin prevents irreversible mistakes from accidental clicks.',
        icon: CheckCircle2,
        color: 'var(--g-yellow)',
    },
    {
        title: 'Personal Command Center',
        desc: 'Your dashboard automatically highlights recent documents and updates across all accessible workspaces in one view.',
        icon: CheckCircle2,
        color: 'var(--g-red)',
    },
];

function LandingPage() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const scrollToSection = (id) => {
        setIsMobileMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="lp-container">
            {/* ── SECTION 1: NAVBAR ──────────────────────────────────────── */}
            <header className="lp-navbar">
                <div className="lp-nav-content">
                    {/* Brand */}
                    <div className="lp-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <DocSphereLogo size={28} wordmarkSize="18px" />
                        <span className="lp-brand-badge">Workspace</span>
                    </div>

                    {/* Desktop Navigation Links */}
                    <nav className="lp-nav-links">
                        <button onClick={() => scrollToSection('features')} className="lp-nav-link">
                            Features
                        </button>
                        <button onClick={() => scrollToSection('how-it-works')} className="lp-nav-link">
                            How It Works
                        </button>
                        <button onClick={() => scrollToSection('collaboration')} className="lp-nav-link">
                            Collaboration
                        </button>
                        <button onClick={() => scrollToSection('preview')} className="lp-nav-link">
                            Product
                        </button>
                    </nav>

                    {/* Right-side CTAs */}
                    <div className="lp-nav-actions">
                        <button
                            className="theme-toggle lp-theme-toggle"
                            onClick={toggleTheme}
                            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                        </button>

                        <Link to="/login" className="lp-nav-login">
                            Sign In
                        </Link>

                        <Link to="/register" className="ds-btn ds-btn-primary lp-nav-cta">
                            Get Started
                            <ArrowRight size={14} />
                        </Link>

                        {/* Mobile menu trigger */}
                        <button
                            className="lp-mobile-toggle"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle navigation menu"
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Drawer */}
                {isMobileMenuOpen && (
                    <div className="lp-mobile-drawer">
                        <button onClick={() => scrollToSection('features')} className="lp-mobile-link">
                            Features
                        </button>
                        <button onClick={() => scrollToSection('how-it-works')} className="lp-mobile-link">
                            How It Works
                        </button>
                        <button onClick={() => scrollToSection('collaboration')} className="lp-mobile-link">
                            Collaboration
                        </button>
                        <button onClick={() => scrollToSection('preview')} className="lp-mobile-link">
                            Product Preview
                        </button>
                        <div className="lp-mobile-auth">
                            <Link to="/login" className="ds-btn ds-btn-ghost" style={{ justifyContent: 'center' }}>
                                Sign In
                            </Link>
                            <Link to="/register" className="ds-btn ds-btn-primary" style={{ justifyContent: 'center' }}>
                                Get Started Free <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            {/* ── SECTION 2: HERO ────────────────────────────────────────── */}
            <section className="lp-hero">
                <div className="lp-hero-ambient" aria-hidden="true" />
                
                <div className="lp-pill-badge">
                    <Sparkles size={14} style={{ color: 'var(--g-blue)' }} />
                    <span>A collaborative workspace for documents, teams and knowledge</span>
                </div>

                <h1 className="lp-hero-title">
                    Your documents.<br />
                    Your workspace.<br />
                    <span className="lp-hero-gradient">Together.</span>
                </h1>

                <p className="lp-hero-subtitle">
                    DocSphere brings your workspaces, rich documents, folders, and team collaboration into
                    one unified command center. Simple, secure, and built for modern teams.
                </p>

                <div className="lp-hero-actions">
                    <Link to="/register" className="ds-btn ds-btn-primary lp-cta-primary">
                        Get Started Free
                        <ArrowRight size={16} />
                    </Link>
                    <Link to="/login" className="ds-btn ds-btn-ghost lp-cta-secondary">
                        Sign In
                    </Link>
                </div>

                {/* Quick Trust Highlights */}
                <div className="lp-hero-highlights">
                    <div className="lp-highlight-item">
                        <Check size={14} className="lp-highlight-check" />
                        <span>Dedicated Workspaces</span>
                    </div>
                    <div className="lp-highlight-item">
                        <Check size={14} className="lp-highlight-check" />
                        <span>Version History & Restore</span>
                    </div>
                    <div className="lp-highlight-item">
                        <Check size={14} className="lp-highlight-check" />
                        <span>Real-Time Audit Trail</span>
                    </div>
                    <div className="lp-highlight-item">
                        <Check size={14} className="lp-highlight-check" />
                        <span>Trash & Safe Recovery</span>
                    </div>
                </div>
            </section>

            {/* ── SECTION 3: PRODUCT VISUAL (Stylized App Preview) ────────── */}
            <section id="preview" className="lp-preview-section">
                <div className="lp-preview-wrapper">
                    {/* Window Titlebar */}
                    <div className="lp-window-bar">
                        <div className="lp-window-dots">
                            <span className="lp-dot lp-dot-red" />
                            <span className="lp-dot lp-dot-yellow" />
                            <span className="lp-dot lp-dot-green" />
                        </div>
                        <div className="lp-window-url">
                            <span>https://docsphere.me/dashboard</span>
                        </div>
                        <div style={{ width: 44 }} />
                    </div>

                    {/* Window Inner App Simulation */}
                    <div className="lp-mockup-body">
                        {/* Sidebar Mockup */}
                        <div className="lp-mockup-sidebar">
                            <div className="lp-mockup-brand">
                                <DocSphereLogo size={18} wordmarkSize="13px" />
                            </div>
                            <div className="lp-mockup-nav-item active">
                                <FileText size={13} style={{ color: 'var(--g-blue)' }} />
                                <span>Dashboard</span>
                            </div>
                            <div className="lp-mockup-nav-item">
                                <FolderOpen size={13} style={{ color: 'var(--g-green)' }} />
                                <span>Workspaces</span>
                            </div>
                            <div className="lp-mockup-ws-section">
                                <span className="lp-mockup-ws-title">Workspaces</span>
                                <div className="lp-mockup-ws-chip">
                                    <span className="lp-chip-dot" style={{ backgroundColor: 'var(--g-blue)' }} />
                                    <span>Project</span>
                                </div>
                                <div className="lp-mockup-ws-chip">
                                    <span className="lp-chip-dot" style={{ backgroundColor: 'var(--g-green)' }} />
                                    <span>Notes</span>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Mockup */}
                        <div className="lp-mockup-main">
                            <div className="lp-mockup-header">
                                <div>
                                    <div className="lp-mockup-greeting">Good morning, Hammad 👋</div>
                                    <div className="lp-mockup-sub">Here's a summary of your DocSphere account.</div>
                                </div>
                                <div className="ds-btn ds-btn-primary" style={{ padding: '6px 12px', fontSize: 12 }}>
                                    + New Workspace
                                </div>
                            </div>

                            {/* Stat Strip */}
                            <div className="lp-mockup-stats">
                                <div className="lp-mockup-stat-card">
                                    <div className="lp-mockup-stat-val">2</div>
                                    <div className="lp-mockup-stat-lbl">Total Workspaces</div>
                                </div>
                                <div className="lp-mockup-stat-card">
                                    <div className="lp-mockup-stat-val">2</div>
                                    <div className="lp-mockup-stat-lbl">Owned by You</div>
                                </div>
                                <div className="lp-mockup-stat-card">
                                    <div className="lp-mockup-stat-val">100%</div>
                                    <div className="lp-mockup-stat-lbl">History Preserved</div>
                                </div>
                            </div>

                            {/* Content Columns */}
                            <div className="lp-mockup-grid">
                                {/* Documents Column */}
                                <div className="lp-mockup-box">
                                    <div className="lp-mockup-box-head">
                                        <FileText size={13} style={{ color: 'var(--g-blue)' }} />
                                        <span>Recent Documents · All Workspaces</span>
                                    </div>
                                    <div className="lp-mockup-list">
                                        <div className="lp-mockup-doc">
                                            <FileText size={13} style={{ color: 'var(--g-blue)', flexShrink: 0 }} />
                                            <div style={{ minWidth: 0, flex: 1 }}>
                                                <div className="lp-mockup-doc-title">Meeting Notes</div>
                                                <div className="lp-mockup-doc-meta">Notes · recently edited</div>
                                            </div>
                                            <span className="ds-badge ds-badge-green" style={{ fontSize: 10 }}>Notes</span>
                                        </div>
                                        <div className="lp-mockup-doc">
                                            <FileText size={13} style={{ color: 'var(--g-blue)', flexShrink: 0 }} />
                                            <div style={{ minWidth: 0, flex: 1 }}>
                                                <div className="lp-mockup-doc-title">Testing</div>
                                                <div className="lp-mockup-doc-meta">Project · 2 days ago</div>
                                            </div>
                                            <span className="ds-badge ds-badge-blue" style={{ fontSize: 10 }}>Project</span>
                                        </div>
                                        <div className="lp-mockup-doc">
                                            <FileText size={13} style={{ color: 'var(--g-blue)', flexShrink: 0 }} />
                                            <div style={{ minWidth: 0, flex: 1 }}>
                                                <div className="lp-mockup-doc-title">Intro</div>
                                                <div className="lp-mockup-doc-meta">Notes · recently edited</div>
                                            </div>
                                            <span className="ds-badge ds-badge-green" style={{ fontSize: 10 }}>Notes</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Activity Column */}
                                <div className="lp-mockup-box">
                                    <div className="lp-mockup-box-head">
                                        <Activity size={13} style={{ color: 'var(--g-green)' }} />
                                        <span>Recent Activity</span>
                                    </div>
                                    <div className="lp-mockup-list">
                                        <div className="lp-mockup-act">
                                            <span className="lp-mockup-act-dot" style={{ backgroundColor: 'var(--g-green)' }} />
                                            <div>
                                                <div className="lp-mockup-act-text">
                                                    <strong>Hammad</strong> created the document <strong>"Meeting Notes"</strong>
                                                </div>
                                                <div className="lp-mockup-doc-meta">Notes · just now</div>
                                            </div>
                                        </div>
                                        <div className="lp-mockup-act">
                                            <span className="lp-mockup-act-dot" style={{ backgroundColor: 'var(--g-blue)' }} />
                                            <div>
                                                <div className="lp-mockup-act-text">
                                                    <strong>Hammad</strong> edited the document <strong>"Intro"</strong>
                                                </div>
                                                <div className="lp-mockup-doc-meta">Notes · 10m ago</div>
                                            </div>
                                        </div>
                                        <div className="lp-mockup-act">
                                            <span className="lp-mockup-act-dot" style={{ backgroundColor: 'var(--g-yellow)' }} />
                                            <div>
                                                <div className="lp-mockup-act-text">
                                                    <strong>Hammad</strong> restored the document <strong>"New Doc"</strong>
                                                </div>
                                                <div className="lp-mockup-doc-meta">Project · 1 day ago</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 4: FEATURES ────────────────────────────────────── */}
            <section id="features" className="lp-section">
                <div className="lp-section-head">
                    <span className="lp-section-tag">Powerful Capabilities</span>
                    <h2 className="lp-section-title">Everything modern teams need to organize knowledge</h2>
                    <p className="lp-section-subtitle">
                        DocSphere is designed around clear boundaries, robust versioning, and real collaboration.
                    </p>
                </div>

                <div className="lp-features-grid">
                    {FEATURES.map((feat) => {
                        const Icon = feat.icon;
                        return (
                            <div key={feat.id} className="lp-feature-card">
                                <div className="lp-feature-top">
                                    <div className="lp-feature-icon" style={{ backgroundColor: feat.bg }}>
                                        <Icon size={18} style={{ color: feat.color }} />
                                    </div>
                                    <span className="lp-feature-badge">{feat.badge}</span>
                                </div>
                                <h3 className="lp-feature-title">{feat.title}</h3>
                                <p className="lp-feature-desc">{feat.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── SECTION 5: HOW IT WORKS ────────────────────────────────── */}
            <section id="how-it-works" className="lp-section lp-section-muted">
                <div className="lp-section-head">
                    <span className="lp-section-tag">Simple & Intuitive</span>
                    <h2 className="lp-section-title">How DocSphere Works</h2>
                    <p className="lp-section-subtitle">
                        Get started in seconds with a workflow that brings structure to your team's documents.
                    </p>
                </div>

                <div className="lp-steps-grid">
                    {WORKFLOW_STEPS.map((step) => {
                        const Icon = step.icon;
                        return (
                            <div key={step.number} className="lp-step-card">
                                <div className="lp-step-number" style={{ color: step.color }}>
                                    {step.number}
                                </div>
                                <div className="lp-step-icon-wrap" style={{ backgroundColor: `${step.color}18` }}>
                                    <Icon size={20} style={{ color: step.color }} />
                                </div>
                                <h3 className="lp-step-title">{step.title}</h3>
                                <p className="lp-step-desc">{step.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── SECTION 6: COLLABORATION VALUE ─────────────────────────── */}
            <section id="collaboration" className="lp-section">
                <div className="lp-section-head">
                    <span className="lp-section-tag">Why DocSphere</span>
                    <h2 className="lp-section-title">Built for clarity, speed, and confidence</h2>
                    <p className="lp-section-subtitle">
                        No more lost links, chaotic shared folders, or mysterious overwrites.
                    </p>
                </div>

                <div className="lp-values-grid">
                    {VALUE_POINTS.map((pt, i) => {
                        const Icon = pt.icon;
                        return (
                            <div key={i} className="lp-value-card">
                                <div className="lp-value-icon">
                                    <Icon size={20} style={{ color: pt.color }} />
                                </div>
                                <div>
                                    <h3 className="lp-value-title">{pt.title}</h3>
                                    <p className="lp-value-desc">{pt.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── SECTION 7: FINAL CTA ───────────────────────────────────── */}
            <section className="lp-cta-section">
                <div className="lp-cta-card">
                    <div className="lp-cta-ambient" aria-hidden="true" />
                    <span className="lp-section-tag" style={{ color: 'var(--g-blue)' }}>Get Started Today</span>
                    <h2 className="lp-cta-title">Ready to organize your workspace?</h2>
                    <p className="lp-cta-desc">
                        Create your free account today and experience a clean, focused environment
                        for your documents and team collaboration.
                    </p>
                    <div className="lp-cta-buttons">
                        <Link to="/register" className="ds-btn ds-btn-primary lp-cta-btn-large">
                            Get Started Free
                            <ArrowRight size={16} />
                        </Link>
                        <Link to="/login" className="ds-btn ds-btn-ghost lp-cta-btn-ghost">
                            Sign In to DocSphere
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── SECTION 8: FOOTER ──────────────────────────────────────── */}
            <footer className="lp-footer">
                <div className="lp-footer-content">
                    {/* Brand Column */}
                    <div className="lp-footer-brand-col">
                        <div style={{ marginBottom: '12px' }}>
                            <DocSphereLogo size={28} wordmarkSize="19px" />
                        </div>
                        <p className="lp-footer-desc">
                            A collaborative workspace for documents, teams, and knowledge.
                            Organize, write, and stay synchronized.
                        </p>
                        <div className="lp-footer-copy">
                            © {new Date().getFullYear()} DocSphere. All rights reserved.
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="lp-footer-links-group">
                        <div className="lp-footer-col">
                            <span className="lp-footer-heading">Product</span>
                            <button onClick={() => scrollToSection('features')} className="lp-footer-link">Features</button>
                            <button onClick={() => scrollToSection('how-it-works')} className="lp-footer-link">How It Works</button>
                            <button onClick={() => scrollToSection('collaboration')} className="lp-footer-link">Collaboration</button>
                            <button onClick={() => scrollToSection('preview')} className="lp-footer-link">App Preview</button>
                        </div>

                        <div className="lp-footer-col">
                            <span className="lp-footer-heading">Account</span>
                            <Link to="/login" className="lp-footer-link">Sign In</Link>
                            <Link to="/register" className="lp-footer-link">Create Account</Link>
                            <Link to="/dashboard" className="lp-footer-link">Command Center</Link>
                            <Link to="/workspaces" className="lp-footer-link">Workspaces</Link>
                        </div>

                        <div className="lp-footer-col">
                            <span className="lp-footer-heading">Security</span>
                            <span className="lp-footer-link" style={{ cursor: 'default' }}>Role-based Access</span>
                            <span className="lp-footer-link" style={{ cursor: 'default' }}>Audit Logging</span>
                            <span className="lp-footer-link" style={{ cursor: 'default' }}>Version Recovery</span>
                            <span className="lp-footer-link" style={{ cursor: 'default' }}>Google OAuth 2.0</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;
