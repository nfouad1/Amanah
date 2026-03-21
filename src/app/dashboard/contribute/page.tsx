'use client';

import dynamic from 'next/dynamic';

// Dynamically import with ssr:false to avoid useSearchParams prerender error
const ContributeContent = dynamic(
  () => import('./ContributeContent'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        Loading...
      </div>
    ),
  }
);

export default function Contribute() {
  return <ContributeContent />;
}
