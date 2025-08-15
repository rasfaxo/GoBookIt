import { Heading, MyRoomCard, EmptyState } from '@/components';
import getMyRooms from '@/services/rooms/getMyRooms';

interface RoomDoc {
  $id: string;
  name: string;
}

const MyRoomsPage = async () => {
  const roomsResult = await getMyRooms();
  const rooms = roomsResult.ok ? (roomsResult.data as RoomDoc[]) : [];

  return (
    <>
  <Heading title="My Rooms" subtitle="Manage the rooms you have listed for booking" />
      {rooms.length > 0 ? (
        rooms.map((room) => <MyRoomCard key={room.$id} room={room} />)
      ) : (
  <EmptyState title="No rooms yet" message="You have not added any rooms." />
      )}
    </>
  );
};

export default MyRoomsPage;
