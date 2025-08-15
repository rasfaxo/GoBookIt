import Link from 'next/link';
import { FaEye } from 'react-icons/fa';
import DeleteRoomButton from '../ui/DeleteRoomButton';
import { Button } from '@/components';

interface MyRoomCardProps {
  room: { $id: string; name: string };
}

const MyRoomCard = ({ room }: MyRoomCardProps) => (
  <article className="group relative flex flex-col rounded-xl border border-blue-100 bg-white/90 backdrop-blur-sm shadow-sm p-4 transition hover:shadow-md">
    <div className="flex items-start justify-between gap-4">
      <h4 className="text-base font-semibold tracking-tight text-blue-800 line-clamp-1" title={room.name}>
        {room.name}
      </h4>
      <div className="flex items-center gap-2">
        <Button asChild size="sm" variant="secondary" className="font-medium">
          <Link href={`/rooms/${room.$id}`} aria-label={`View ${room.name}`}>
            <FaEye className="mr-1 inline" /> Lihat
          </Link>
        </Button>
        <DeleteRoomButton roomId={room.$id} />
      </div>
    </div>
  </article>
);

export default MyRoomCard;
