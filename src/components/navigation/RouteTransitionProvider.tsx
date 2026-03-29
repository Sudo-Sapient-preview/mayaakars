"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type NavigateOptions = {
  replace?: boolean;
  scroll?: boolean;
  mode?: "wipe" | "rotation";
};

type RouteTransitionContextValue = {
  navigate: (href: string, options?: NavigateOptions) => void;
  isTransitioning: boolean;
};

type PendingNavigation = {
  href: string;
  options: NavigateOptions;
};


const COVER_DURATION_MS = 1250;
const REVEAL_DURATION_MS = 1250;
const REVEAL_FALLBACK_MS = 1800;
const BLOCKED_SCHEMES = /^(mailto:|tel:|javascript:)/i;

const RouteTransitionContext = createContext<RouteTransitionContextValue | null>(null);

const isModifiedEvent = (event: MouseEvent) =>
  event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

const isInternalHref = (href: string) => {
  if (!href || BLOCKED_SCHEMES.test(href)) return false;
  try {
    const parsed = new URL(href, window.location.href);
    return parsed.origin === window.location.origin;
  } catch {
    return false;
  }
};

const normalizeInternalHref = (href: string) => {
  const parsed = new URL(href, window.location.href);
  return `${parsed.pathname}${parsed.search}${parsed.hash}`;
};

const getCurrentHref = () =>
  `${window.location.pathname}${window.location.search}${window.location.hash}`;

const sameDocumentHashJump = (href: string) => {
  const parsed = new URL(href, window.location.href);
  return (
    parsed.pathname === window.location.pathname &&
    parsed.search === window.location.search &&
    parsed.hash.length > 0
  );
};

export default function RouteTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [phase, setPhase] = useState<"idle" | "covering" | "revealing">("idle");
  const [mode, setMode] = useState<"wipe" | "rotation">("wipe");
  const [isTransitioning, setIsTransitioning] = useState(false);


  const pendingNavigationRef = useRef<PendingNavigation | null>(null);
  const hasIssuedNavigationRef = useRef(false);
  const coverTimerRef = useRef<number | null>(null);
  const revealTimerRef = useRef<number | null>(null);
  const fallbackTimerRef = useRef<number | null>(null);
  const revealRequestRafRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (coverTimerRef.current !== null) {
      window.clearTimeout(coverTimerRef.current);
      coverTimerRef.current = null;
    }
    if (revealTimerRef.current !== null) {
      window.clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }
    if (fallbackTimerRef.current !== null) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    if (revealRequestRafRef.current !== null) {
      window.cancelAnimationFrame(revealRequestRafRef.current);
      revealRequestRafRef.current = null;
    }
  }, []);

  const endTransition = useCallback(() => {
    setPhase("idle");
    setIsTransitioning(false);
    pendingNavigationRef.current = null;
    hasIssuedNavigationRef.current = false;
    window.dispatchEvent(new Event("mayaakars:route-transition-end"));
  }, []);

  const startReveal = useCallback(() => {
    if (!isTransitioning) return;
    if (revealTimerRef.current !== null) return;

    setPhase("revealing");
    revealTimerRef.current = window.setTimeout(() => {
      revealTimerRef.current = null;
      endTransition();
    }, REVEAL_DURATION_MS);
  }, [endTransition, isTransitioning]);

  const navigate = useCallback(
    (href: string, options: NavigateOptions = {}) => {
      if (typeof window === "undefined") return;

      if (!isInternalHref(href)) {
        window.location.assign(href);
        return;
      }

      if (sameDocumentHashJump(href)) {
        window.location.assign(href);
        return;
      }

      const targetHref = normalizeInternalHref(href);
      if (targetHref === getCurrentHref()) return;
      if (isTransitioning) return;

      clearTimers();
      const transitionMode = (options as any).mode || "wipe";
      pendingNavigationRef.current = { href: targetHref, options };
      hasIssuedNavigationRef.current = false;

      setIsTransitioning(true);
      setPhase("covering");
      setMode(transitionMode);
      window.dispatchEvent(new Event("mayaakars:route-transition-start"));

      coverTimerRef.current = window.setTimeout(() => {
        coverTimerRef.current = null;
        const pending = pendingNavigationRef.current;
        if (!pending) {
          startReveal();
          return;
        }

        hasIssuedNavigationRef.current = true;
        if (pending.options.replace) {
          router.replace(pending.href, { scroll: pending.options.scroll ?? true });
        } else {
          router.push(pending.href, { scroll: pending.options.scroll ?? true });
        }

        fallbackTimerRef.current = window.setTimeout(() => {
          fallbackTimerRef.current = null;
          startReveal();
        }, REVEAL_FALLBACK_MS);
      }, COVER_DURATION_MS);
    },
    [clearTimers, isTransitioning, router, startReveal]
  );

  const maybeRevealForCompletedNavigation = useCallback(() => {
    if (!isTransitioning) return;
    if (!hasIssuedNavigationRef.current) return;
    const pending = pendingNavigationRef.current;
    if (!pending) return;

    const currentHref = getCurrentHref();
    const currentNoHash = currentHref.split("#")[0];
    const pendingNoHash = pending.href.split("#")[0];
    if (currentHref !== pending.href && currentNoHash !== pendingNoHash) return;

    if (fallbackTimerRef.current !== null) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }

    if (revealRequestRafRef.current !== null) return;
    revealRequestRafRef.current = window.requestAnimationFrame(() => {
      revealRequestRafRef.current = null;
      startReveal();
    });
  }, [isTransitioning, startReveal]);

  useEffect(() => {
    maybeRevealForCompletedNavigation();
  }, [maybeRevealForCompletedNavigation, pathname, searchParams]);

  useEffect(() => {
    if (!isTransitioning) return;
    if (!hasIssuedNavigationRef.current) return;

    const intervalId = window.setInterval(() => {
      maybeRevealForCompletedNavigation();
    }, 60);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isTransitioning, maybeRevealForCompletedNavigation]);

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || isModifiedEvent(event)) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      if (anchor.dataset.routeTransition === "false") return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (!isInternalHref(href)) return;

      const parsed = new URL(href, window.location.href);
      const currentWithoutHash = `${window.location.pathname}${window.location.search}`;
      const targetWithoutHash = `${parsed.pathname}${parsed.search}`;
      if (targetWithoutHash === currentWithoutHash && parsed.hash) return;

      event.preventDefault();
      
      const targetMode = anchor.getAttribute("data-transition") || "wipe";
      
      navigate(`${parsed.pathname}${parsed.search}${parsed.hash}`, {
        scroll: anchor.dataset.scroll !== "false",
        mode: targetMode as any
      });
    };


    document.addEventListener("click", onDocumentClick, true);
    return () => {
      document.removeEventListener("click", onDocumentClick, true);
    };
  }, [navigate]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  const contextValue = useMemo<RouteTransitionContextValue>(
    () => ({
      navigate,
      isTransitioning,
    }),
    [isTransitioning, navigate]
  );

  return (
    <RouteTransitionContext.Provider value={contextValue}>
      {children}
      <div
        aria-hidden
        className={`mk-route-wipe mk-route-wipe-${mode} ${
          phase === "idle" ? "" : phase === "covering" ? "is-covering" : "is-revealing"
        }`}
      >
        <div className="mk-route-wipe-half mk-route-wipe-left">
          <div className="mk-route-wipe-inner" />
        </div>
        <div className="mk-route-wipe-half mk-route-wipe-right">
          <div className="mk-route-wipe-inner" />
        </div>
      </div>
    </RouteTransitionContext.Provider>
  );
}

export const useRouteTransition = () => {
  const context = useContext(RouteTransitionContext);
  if (!context) {
    throw new Error("useRouteTransition must be used within RouteTransitionProvider.");
  }
  return context;
};
