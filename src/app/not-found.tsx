import React from 'react';
import type { Metadata } from 'next';
import NotFoundClient from '@/components/common/NotFoundClient';

export const metadata: Metadata = {
  title: 'Page Not Found - SaaS Decision',
  description: 'The requested software tool or page could not be found. Search 980+ SaaS tools and open-source alternatives.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return <NotFoundClient />;
}
