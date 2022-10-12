import React from 'react';
import type { NextPage } from 'next';

declare global {
  // Next.js Typscript page with Layout
  type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
  };

  // Defined our todo type
  type Todo = {
    id: string;
    name: string;
    completed: boolean;
    createAt: Date;
    uid: string;
  };
}
