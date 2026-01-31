import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  GitBranch,
  Users,
  MessageSquare,
  Briefcase,
  Lightbulb,
  Building2,
  GraduationCap,
  CalendarDays,
  Network,
  Menu,
  X,
  LogOut,
  MessageCircle,
  Trophy,
  Target,
  DollarSign,
  BookOpen,
  FileEdit,
  Upload,
  Search,
} from "lucide-react";
import { Button } from "./Button";
import { QuickCaptureButton } from "./QuickCaptureButton";
import { GlobalSearchPalette } from "./GlobalSearchPalette";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";
import { BRAND_NAME, LOGO_URL } from "../helpers/brand";
import styles from "./AppLayout.module.css";

interface AppLayoutProps {
  children: React.ReactNode;
}

type NavItem = {
  path: string;
  label: string;
  icon: React.ComponentType<{ size?: number | string }>;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navGroups: NavGroup[] = [
    {
      title: "Overview",
      items: [
        { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { path: "/timeline", label: "Timeline", icon: GitBranch },
      ],
    },
    {
      title: "Career",
      items: [
        { path: "/jobs", label: "Jobs", icon: Building2 },
        { path: "/projects", label: "Projects", icon: Briefcase },
        { path: "/skills", label: "Skills", icon: Lightbulb },
        { path: "/achievements", label: "Achievements", icon: Trophy },
        { path: "/goals", label: "Goals", icon: Target },
        { path: "/compensation", label: "Compensation", icon: DollarSign },
      ],
    },
    {
      title: "People & Relationships",
      items: [
        { path: "/people", label: "People", icon: Users },
        { path: "/relationships", label: "Relationships", icon: Network },
        { path: "/interactions", label: "Interactions", icon: MessageSquare },
        { path: "/feedback", label: "Feedback", icon: MessageCircle },
      ],
    },
    {
      title: "Education & Institutions",
      items: [
        { path: "/institutions", label: "Institutions", icon: GraduationCap },
        { path: "/learning", label: "Learning", icon: BookOpen },
        { path: "/events", label: "Events", icon: CalendarDays },
        { path: "/content", label: "Content", icon: FileEdit },
      ],
    },
    {
      title: "System",
      items: [{ path: "/import", label: "Import", icon: Upload }],
    },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "k" &&
        (e.metaKey || e.ctrlKey) &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={styles.layout}>
      {/* Mobile Header */}
      <header className={styles.mobileHeader}>
        <div className={styles.logoContainer}>
          <img
            src={LOGO_URL}
            alt={`${BRAND_NAME} Logo`}
            className={styles.logo}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobileMenu}
          className={styles.menuButton}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </header>

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${isMobileMenuOpen ? styles.open : ""}`}
      >
        <div className={styles.sidebarHeader}>
          <div className={styles.logoContainer}>
            <img
              src={LOGO_URL}
              alt={`${BRAND_NAME} Logo`}
              className={styles.logo}
            />
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
              >
                <Search size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Search (⌘K)</TooltipContent>
          </Tooltip>
        </div>

        <nav className={styles.nav}>
          {navGroups.map((group) => (
            <div key={group.title} className={styles.navSection}>
              <div
                className={styles.navSectionTitle}
                role="heading"
                aria-level={2}
              >
                {group.title}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`${styles.navItem} ${isActive ? styles.active : ""}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <Button
            variant="ghost"
            className={styles.logoutButton}
            asChild
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Link to="/">
              <LogOut size={20} />
              <span>Log Out</span>
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.contentContainer}>{children}</div>
      </main>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div className={styles.overlay} onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <QuickCaptureButton />
      <GlobalSearchPalette open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
