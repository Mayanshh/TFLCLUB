import { useState, useEffect, useLayoutEffect } from 'react';

// Use useLayoutEffect to prevent "flash" of desktop content on mobile
// Next.js SSR fix: fallback to useEffect on server
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface DeviceState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  device: DeviceType;
  width: number | undefined;
}

const BREAKPOINTS = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1024px)',
  desktop: '(min-width: 1025px)',
};

export const useDevice = (): DeviceState => {
  const [deviceState, setDeviceState] = useState<DeviceState>({
    isMobile: false,
    isTablet: false,
    isDesktop: true, // Default to desktop for SSR consistency
    device: 'desktop',
    width: undefined,
  });

  useIsomorphicLayoutEffect(() => {
    const mobileQuery = window.matchMedia(BREAKPOINTS.mobile);
    const tabletQuery = window.matchMedia(BREAKPOINTS.tablet);
    const desktopQuery = window.matchMedia(BREAKPOINTS.desktop);

    const updateDevice = () => {
      const isMobile = mobileQuery.matches;
      const isTablet = tabletQuery.matches;
      const isDesktop = desktopQuery.matches;

      let device: DeviceType = 'desktop';
      if (isMobile) device = 'mobile';
      if (isTablet) device = 'tablet';

      setDeviceState({
        isMobile,
        isTablet,
        isDesktop,
        device,
        width: window.innerWidth,
      });
    };

    // Initial check
    updateDevice();

    // Listeners for media queries (Low overhead compared to 'resize')
    mobileQuery.addEventListener('change', updateDevice);
    tabletQuery.addEventListener('change', updateDevice);
    desktopQuery.addEventListener('change', updateDevice);

    // Backup listener for manual window resizing that might not cross a breakpoint
    // but affects Three.js canvas size
    window.addEventListener('resize', updateDevice);

    return () => {
      mobileQuery.removeEventListener('change', updateDevice);
      tabletQuery.removeEventListener('change', updateDevice);
      desktopQuery.removeEventListener('change', updateDevice);
      window.removeEventListener('resize', updateDevice);
    };
  }, []);

  return deviceState;
};