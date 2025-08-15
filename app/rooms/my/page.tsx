import { Heading, MyRoomCard, EmptyState } from '@/components';
import getMyRooms from '@/services/rooms/getMyRooms';

interface RoomDoc {
  $id: string;
  name: string;
}

const MyRoomsPage = async () => {
  const rooms = (await getMyRooms()) as RoomDoc[];

  return (
    <>
      <Heading title="My Rooms" subtitle="Kelola ruang yang Anda listing untuk disewakan" />
      {rooms.length > 0 ? (
        rooms.map((room) => <MyRoomCard key={room.$id} room={room} />)
      ) : (
        <EmptyState title="Belum ada ruang" message="Anda belum menambahkan ruang apa pun." />
      )}
    </>
  );
};

export default MyRoomsPage;
