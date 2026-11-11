"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useTheme } from "@/app/theme-provider";
import { authApi } from "@/lib/auth-api";
import HomeTab from "@/components/cms/home/home-tab";
import InquiriesTab from "@/components/cms/inquiries/inquiries-tab";
import ProjectsTab from "@/components/cms/projects/projects-tab";

const sections = [
  { id: "home", title: "Home" },
  { id: "projects", title: "Projects" },
  { id: "outbound", title: "Outbound Travels" },
  { id: "srilanka", title: "Travel Sri Lanka" },
  { id: "hotels", title: "Hotel Bookings" },
  { id: "trains", title: "Trains" },
  { id: "cruises", title: "Cruises" },
  { id: "gallery", title: "Gallery" },
  { id: "rental", title: "Rental" },
  { id: "inquiries", title: "Inquiries" },
];

const navigationIcons: Record<string, ReactNode> = {
  home: <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />,
  projects: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  outbound: <><path d="M2 22h20" /><path d="M6.4 17.4 3 13l2-1 3 2 4-2.5L6 6l2.5-1 8 4 3.6-2a2 2 0 0 1 2 3.4L9 17.4z" /></>,
  srilanka: <><path d="M12 3c2.5 0 5 2.6 5 7 0 5-2.7 11-5 11s-5-6-5-11c0-4.4 2.5-7 5-7z" /><circle cx="12" cy="10" r="2" /></>,
  hotels: <><path d="M3 21h18M5 21V7l7-4 7 4v14" /><path d="M9 9h1M14 9h1M9 13h1M14 13h1M10 21v-4h4v4" /></>,
  trains: <><rect height="14" rx="3" width="14" x="5" y="3" /><path d="M5 11h14M9 21l-2-4M15 21l2-4M9 7h6" /></>,
  cruises: <><path d="M2 20c2 1 4 1 6 0s4-1 6 0 4 1 6 0" /><path d="M4 17 3 12h18l-2 5M6 12V8h12v4M12 8V4" /></>,
  gallery: <><rect height="18" rx="2" width="18" x="3" y="3" /><circle cx="9" cy="9" r="2" /><path d="m21 15-5-5L5 21" /></>,
  rental: <><path d="M5 17h14M5 17a2 2 0 1 0 4 0M15 17a2 2 0 1 0 4 0" /><path d="M3 17v-5l2-5h11l3 5h2v5M5 12h16" /></>,
  inquiries: <><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z" /><path d="M8 12h8M8 9h5" /></>,
};

function getSectionFromHash() {
  const section = window.location.hash.slice(1).split("/")[0];
  return sections.some((item) => item.id === section) ? section : "home";
}

function getRouteFromHash() {
  const route = window.location.hash.slice(1);
  return sections.some((item) => item.id === route.split("/")[0]) ? route : "home";
}

export default function CmsFrame() {
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [activeRoute, setActiveRoute] = useState("home");
  const [projectDirty, setProjectDirty] = useState(false);
  const { mode, setMode } = useTheme();

  const signOut = useCallback(async () => {
    setLoggingOut(true);
    setLogoutError(null);

    try {
      const result = await authApi.logout();
      if (!result.ok) {
        throw new Error(`The logout endpoint returned ${result.status}.`);
      }
      window.location.replace("/login");
    } catch (error) {
      console.error("Could not end the session.", error);
      setLogoutError("The session could not be ended. Please try again.");
      setLoggingOut(false);
    }
  }, []);

  useEffect(() => {
    const syncRoute = () => {
      const route = getRouteFromHash();
      setActiveRoute(route);
      setActiveSection(getSectionFromHash());
    };
    syncRoute();
    const handleHashChange = () => syncRoute();
    function handleMessage(event: MessageEvent<unknown>) {
      if (
        event.origin !== window.location.origin ||
        typeof event.data !== "object" ||
        event.data === null ||
        !("type" in event.data) ||
        event.data.type !== "letsfly-cms-logout"
      ) {
        return;
      }

      void signOut();
    }

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
      window.removeEventListener("message", handleMessage);
    };
  }, [signOut]);

  function navigate(section: string) {
    if (!sections.some((item) => item.id === section)) return;
    if (activeSection === section && activeRoute === section) return;
    if (activeSection === "projects" && projectDirty && section !== "projects" &&
        !window.confirm("You have unsaved changes to this project. If you leave now, they will be lost.")) {
      return;
    }
    if (activeSection === "projects" && section !== "projects") setProjectDirty(false);
    setActiveSection(section);
    setActiveRoute(section);
    const hash = section === "home" ? "" : `#${section}`;
    window.history.pushState(null, "", `${window.location.pathname}${window.location.search}${hash}`);
  }

  const currentTitle = sections.find((section) => section.id === activeSection)?.title ?? "Home";

  return (
    <main className="cms-app flex h-dvh w-full overflow-hidden bg-cms-bg text-cms-text font-[family-name:Poppins,system-ui,-apple-system,Segoe_UI,sans-serif] text-[14px] leading-[1.55] max-[760px]:flex-col">
      <div className="cms-home-shell fixed inset-0 z-60 flex h-dvh w-screen pointer-events-none [hidden]:hidden max-[760px]:flex-col">
        <aside aria-label="CMS navigation" className="relative z-40 flex h-full w-66 shrink-0 grow-0 basis-66 flex-col bg-[#13087a] px-3 pb-3.5 text-white pointer-events-auto max-[760px]:h-auto max-[760px]:w-full max-[760px]:basis-auto max-[760px]:flex-wrap max-[760px]:px-2.5 max-[760px]:pb-2">
        <a className="flex min-h-18 flex-none items-center gap-2.5 border-b border-[rgba(255,255,255,.08)] px-1.5 text-white no-underline max-[760px]:min-h-[46px] max-[760px]:border-0" href="/cms" onClick={(event) => {
          event.preventDefault();
          navigate("home");
        }}>
          <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-cms-yellow text-[13px] font-extrabold text-cms-primary">LF</span>
          <b className="text-[14px] whitespace-nowrap">Let&apos;s Fly <small className="block text-[10px] uppercase tracking-[1px] text-cms-yellow">CMS</small></b>
        </a>
        <div className="px-2.5 pb-2.5 pt-[22px] text-[10px] font-semibold uppercase tracking-[1.4px] text-[rgba(255,255,255,.52)] max-[760px]:hidden">Menu</div>
        <nav aria-label="CMS sections" className="flex flex-col gap-1 overflow-y-auto max-[760px]:flex-row max-[760px]:basis-full max-[760px]:gap-0.5 max-[760px]:overflow-x-auto max-[760px]:overflow-y-hidden max-[760px]:pr-23 max-[760px]:pt-2">
          {sections.map((section) => (
            <button suppressHydrationWarning
              aria-current={activeSection === section.id ? "page" : undefined}
              className={activeSection === section.id
                ? "relative flex min-h-11 flex-none items-center gap-3 whitespace-nowrap rounded-lg border-0 bg-[rgba(255,255,255,.12)] px-3 text-left text-[13px] font-medium text-white before:absolute before:bottom-2.5 before:-left-3 before:top-2.5 before:w-1 before:rounded-r-[4px] before:bg-cms-yellow before:content-[''] max-[760px]:min-h-[38px] max-[760px]:gap-[7px] max-[760px]:px-[9px] max-[760px]:text-[11px] max-[760px]:before:bottom-0 max-[760px]:before:left-[9px] max-[760px]:before:right-[9px] max-[760px]:before:top-auto max-[760px]:before:h-[3px] max-[760px]:before:w-auto max-[760px]:before:rounded-[3px_3px_0_0]"
                : "flex min-h-11 flex-none items-center gap-3 whitespace-nowrap rounded-lg border-0 bg-transparent px-3 text-left text-[13px] font-medium text-[rgba(255,255,255,.76)] hover:bg-[rgba(255,255,255,.12)] hover:text-white max-[760px]:min-h-[38px] max-[760px]:gap-[7px] max-[760px]:px-[9px] max-[760px]:text-[11px]"}
              key={section.id}
              onClick={() => navigate(section.id)}
              type="button"
            >
              <svg aria-hidden="true" className={`shrink-0 grow-0 basis-5 max-[760px]:size-4 max-[760px]:basis-4 ${activeSection === section.id ? "text-cms-yellow" : "text-[rgba(255,255,255,.72)]"}`} fill="none" height="20" viewBox="0 0 24 24" width="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">{navigationIcons[section.id]}</svg>
              {section.title}
            </button>
          ))}
        </nav>
        <button suppressHydrationWarning className="mt-auto flex min-h-12 items-center gap-3 rounded-lg border border-[rgba(255,255,255,.13)] bg-[rgba(255,255,255,.06)] px-3 text-[13px] font-medium text-white disabled:cursor-wait! disabled:opacity-60 max-[760px]:absolute max-[760px]:right-2.5 max-[760px]:top-2 max-[760px]:ml-auto max-[760px]:min-h-[34px] max-[760px]:px-2.5 max-[760px]:text-[11px]" disabled={loggingOut} onClick={() => void signOut()} type="button">
          <span aria-hidden="true">↪</span>{loggingOut ? "Signing out…" : "Sign out"}
        </button>
        <button suppressHydrationWarning
          className="flex min-h-11 flex-none items-center gap-3 whitespace-nowrap rounded-lg border-0 bg-transparent px-3 text-left text-[13px] font-medium text-[rgba(255,255,255,.76)] hover:bg-[rgba(255,255,255,.12)] hover:text-white max-[760px]:min-h-[38px] max-[760px]:gap-[7px] max-[760px]:px-[9px] max-[760px]:text-[11px]"
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
          type="button"
          aria-label={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          <svg
            aria-hidden="true"
            className="shrink-0 grow-0 basis-5 text-[rgba(255,255,255,.72)] max-[760px]:size-4 max-[760px]:basis-4"
            fill="none"
            height="20"
            viewBox="0 0 24 24"
            width="20"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>{mode === "light" ? "🌙" : "☀️"}</span>
        </button>
        </aside>
        <section className="flex h-full min-w-0 flex-1 flex-col pointer-events-auto [hidden]:hidden max-[760px]:flex-1 max-[760px]:min-h-0" hidden={activeSection !== "home" && activeSection !== "inquiries" && activeSection !== "projects"}>
          <header className="flex min-h-18 items-center border-b border-cms-line bg-[rgba(246,246,251,.96)] px-8 backdrop-blur-[10px]">
            <div>
              <span className="text-[12px] text-cms-muted">CMS / {currentTitle}</span>
              <h1 className="mt-px text-[20px] font-semibold leading-[1.3] text-cms-ink">{currentTitle}</h1>
            </div>
          </header>
          <div className="mx-auto min-h-0 w-[min(100%,1344px)] flex-1 overflow-y-auto px-8 py-7 max-[760px]:w-full max-[760px]:px-4 max-[760px]:pb-8 max-[760px]:pt-5">
            {activeSection === "home" ? (
              <HomeTab onNavigate={navigate} />
            ) : activeSection === "inquiries" ? (
              <InquiriesTab />
            ) : (
              <ProjectsTab onDirtyChange={setProjectDirty} />
            )}
          </div>
        </section>
      </div>
      {activeSection !== "home" && activeSection !== "inquiries" && activeSection !== "projects" && (
        <>
          <iframe
            className="fixed inset-0 z-50 block h-dvh w-screen border-0 bg-cms-bg max-[760px]:h-dvh"
            key={activeSection}
            src={`/api/cms-demo#${activeRoute}`}
            title={`Let's Fly CMS — ${currentTitle}`}
          />
          <div className="fixed right-4 top-3 z-60 flex gap-2 rounded-[10px] border border-[rgba(19,8,122,.1)] bg-[rgba(255,255,255,.94)] p-1.5 shadow-[0_4px_16px_rgba(10,4,70,.12)] max-[760px]:right-2 max-[760px]:top-2">
            <button suppressHydrationWarning className="min-h-[34px] rounded-[7px] border border-cms-line bg-white px-[11px] text-[11px]! font-semibold! text-cms-ink hover:not-disabled:bg-cms-bg disabled:cursor-wait! disabled:opacity-60" onClick={() => navigate("home")} type="button">Return to React Home</button>
            <button suppressHydrationWarning className="min-h-[34px] rounded-[7px] border border-cms-line bg-white px-[11px] text-[11px]! font-semibold! text-cms-ink hover:not-disabled:bg-cms-bg disabled:cursor-wait! disabled:opacity-60" disabled={loggingOut} onClick={() => void signOut()} type="button">
              {loggingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </>
      )}
      {logoutError && (
        <div className="fixed right-4 top-21 z-100 flex max-w-[min(460px,calc(100vw_-_32px))] items-center gap-4 rounded-[10px] bg-white px-4 py-3.5 shadow-[0_12px_35px_rgba(10,4,70,.18)] text-[13px] text-[#991b1b]" role="alert">
          <span>{logoutError}</span>
          <button suppressHydrationWarning className="rounded-md border-0 bg-[#b91c1c] px-3 py-[7px] font-semibold! text-white" disabled={loggingOut} onClick={() => void signOut()} type="button">Retry</button>
        </div>
      )}
    </main>
  );
}
