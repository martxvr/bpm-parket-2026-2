import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { getServiceBySlug } from '@/lib/db/services';
import { ServiceForm } from '@/components/admin/ServiceForm';

type Props = { params: Promise<{ slug: string }> };

export default async function EditServicePage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <div>
      <Link
        href="/admin/diensten"
        className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Diensten
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Bewerk: {service.title}</h1>
        <Link
          href={`/${service.slug}`}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1 text-sm text-black/60 hover:text-black"
        >
          Bekijk live <ExternalLink className="h-4 w-4" />
        </Link>
      </div>

      <ServiceForm service={service} />
    </div>
  );
}
