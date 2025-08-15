import Image from 'next/image';
import Link from 'next/link';
import { buildAppwriteImageUrl, getFallbackImage, shouldBypassNextImageOptimization } from '@/utils';
import { formatUSD } from '@/utils/currency';
import { Button } from '@/components';

interface RoomCardProps {
  room: {
    $id: string;
    name: string;
    address?: string;
    availability?: string;
    price_per_hour?: number;
    image?: string | null;
    description?: string;
  };
}

const RoomCard = ({ room }: RoomCardProps) => {
  const imageSrc = buildAppwriteImageUrl({ fileId: room.image }) || getFallbackImage();
  const unoptimized = shouldBypassNextImageOptimization();
  const price = formatUSD(room.price_per_hour);
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-blue-100 bg-white/90 backdrop-blur-sm shadow-sm transition hover:shadow-md focus-within:ring-2 focus-within:ring-blue-400">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-blue-50">
        <Image
          src={imageSrc}
          alt={room.name}
          fill
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized={unoptimized}
          loading="lazy"
        />
        <div className="absolute top-2 left-2 rounded-md bg-white/80 px-2 py-1 text-[11px] font-medium text-blue-700 shadow">
          {price}/hour
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 line-clamp-1 text-base font-semibold tracking-tight text-blue-800" title={room.name}>
          {room.name}
        </h3>
        {room.description && (
          <p
            className="mb-2 line-clamp-2 text-xs text-blue-600/90"
            title={room.description}
          >
            {room.description}
          </p>
        )}
        <div className="mt-auto space-y-1.5">
          {room.address && (
            <p className="truncate text-[11px] font-medium text-blue-700/80" title={room.address}>
              {room.address}
            </p>
          )}
          {room.availability && (
            <p className="truncate text-[11px] text-blue-500" title={room.availability}>
              {room.availability}
            </p>
          )}
          <div className="pt-2">
            <Button
              asChild
              size="sm"
              variant="primary"
              className="w-full font-medium"
            >
              <Link href={`/rooms/${room.$id}`} aria-label={`View details for ${room.name}`}>
                View Details
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};
export default RoomCard;
