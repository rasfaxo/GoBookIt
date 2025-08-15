import { RoomCard, Heading, Card, EmptyState } from '@/components';
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
      <Heading title="Available Rooms" subtitle="Temukan dan pesan ruang meeting yang sesuai kebutuhan Anda" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <Card key={room.$id} hover className="p-0">
              <RoomCard room={room} />
            </Card>
          ))
        ) : (
          <div className="md:col-span-2 lg:col-span-3">
            <EmptyState title="Belum ada ruang" message="Belum ada ruang tersedia sekarang. Coba lagi nanti atau tambahkan ruang baru jika Anda pemilik." />
          </div>
        )}
      </div>
    </>
  );
}
