import { Heading, MyRoomCard } from '@/components';
import getMyRooms from '@/services/rooms/getMyRooms';

interface RoomDoc {
  $id: string;
  name: string;
}

const MyRoomsPage = async () => {
  const rooms = (await getMyRooms()) as RoomDoc[];

  return (
    <>
      <Heading title="My Rooms" />
      {rooms.length > 0 ? (
        rooms.map((room) => <MyRoomCard key={room.$id} room={room} />)
      ) : (
        <p>You have no room listings</p>
      )}
    </>
  );
};

export default MyRoomsPage;
