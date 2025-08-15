import Image from 'next/image';
import Link from 'next/link';
import { FaChevronLeft } from 'react-icons/fa';

import { Heading, BookingForm, Card } from '@/components';
import { buildAppwriteImageUrl, getFallbackImage, shouldBypassNextImageOptimization } from '@/utils';
import { formatIDR } from '@/utils/currency';
import getSingleRoom from '@/services/rooms/getSingleRoom';
import type { RoomDoc } from '@/types/rooms';

interface PageProps {
  params: { id: string };
}

export default async function RoomPage({ params }: PageProps) {
  const room: RoomDoc = await getSingleRoom(params.id);
  const imageSrc =
    buildAppwriteImageUrl({ fileId: room.image }) || getFallbackImage();
  const unoptimized = shouldBypassNextImageOptimization();

  return (
    <>
      <Heading
        title={room.name}
  subtitle={room.description || 'Room details and booking form'}
        rightSlot={
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline"
          >
            <FaChevronLeft className="mr-1" /> Back
          </Link>
        }
      />
      <Card className="p-6">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-blue-100 bg-blue-50">
              <Image
                src={imageSrc}
                alt={room.name}
                fill
                className="object-cover"
                unoptimized={unoptimized}
                priority
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-white/70 border border-blue-100 rounded-lg px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-blue-500 font-semibold mb-1">Size</p>
                <p className="text-sm font-medium text-blue-800">{room.sqft ?? '-'} sq ft</p>
              </div>
              <div className="bg-white/70 border border-blue-100 rounded-lg px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-blue-500 font-semibold mb-1">Availability</p>
                <p className="text-sm font-medium text-blue-800">{room.availability || '-'}</p>
              </div>
              <div className="bg-white/70 border border-blue-100 rounded-lg px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-blue-500 font-semibold mb-1">Price / Hour</p>
                <p className="text-sm font-bold text-blue-700">{formatIDR(room.price_per_hour)}</p>
              </div>
              <div className="bg-white/70 border border-blue-100 rounded-lg px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-blue-500 font-semibold mb-1">Address</p>
                <p className="text-sm font-medium text-blue-800 break-words">{room.address || '-'}</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="sticky top-6">
              <div className="mb-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg px-5 py-4 shadow">
                <p className="text-xs uppercase tracking-wide font-semibold">Starting from</p>
                <p className="text-2xl font-extrabold mt-1">{formatIDR(room.price_per_hour)}/hour</p>
              </div>
              <BookingForm room={room} />
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
