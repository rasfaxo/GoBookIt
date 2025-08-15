import { RoomCard, Heading } from '@/components';
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
  const rooms = (await getAllRooms()) as RoomDoc[];

  return (
    <>
      <Heading title="Available Rooms" />
      {rooms.length > 0 ? (
        rooms.map((room) => <RoomCard room={room} key={room.$id} />)
      ) : (
        <p>No rooms available at the moment</p>
      )}
    </>
  );
}
