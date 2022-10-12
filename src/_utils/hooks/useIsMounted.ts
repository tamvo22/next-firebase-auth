import { useCallback, useEffect, useRef } from 'react';

export default function useIsMounted() {
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const isMounted = useCallback(() => {
    return isMountedRef.current;
  }, []);

  return isMounted();
}
