import { RoomCard, Heading, EmptyState } from '@/components';
import getAllRooms from '@/services/rooms/getAllRooms';

interface RoomDoc {
  $id: string;
  name: string;
  address?: string;
  availability?: string;
  price_per_hour?: number;
  image?: string;
}

export default async function Home() {
  const roomsResult = await getAllRooms();
  const rooms = roomsResult.ok ? (roomsResult.data as RoomDoc[]) : [];

  return (
    <>
  <Heading title="Available Rooms" subtitle="Find and book the meeting space that fits your needs" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rooms.length > 0 ? (
          rooms.map((room) => <RoomCard key={room.$id} room={room} />)
        ) : (
          <div className="md:col-span-2 lg:col-span-3">
            <EmptyState title="No rooms yet" message="No rooms are available right now. Try again later or add a new room if you're an owner." />
          </div>
        )}
      </div>
    </>
  );
}
