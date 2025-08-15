'use client';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

import deleteRoom from '@/services/rooms/deleteRoom';
import { useRouter } from 'next/navigation';

interface Props {
  roomId: string;
}

const DeleteRoomButton = ({ roomId }: Props) => {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this room?');
    if (!confirmed) return;
      try {
        const result = await deleteRoom(roomId);
        if (result && (result as any).error) {
          toast.error((result as any).error || 'Failed to delete room');
          return;
        }
        toast.success('Room deleted successfully!');
        router.refresh();
      } catch (error) {
        console.log('Failed to delete room', error);
        toast.error('Failed to delete room');
      }
  };
  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 text-white px-4 py-2 rounded mb-2 sm:mb-0 w-full sm:w-auto text-center hover:bg-red-700"
    >
      <FaTrash className="inline mr-1" /> Delete
    </button>
  );
};

export default DeleteRoomButton;
