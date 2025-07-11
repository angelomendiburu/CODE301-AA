import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Metrics - GrowthTrack Pro',
};

export default function AdminMetricsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
