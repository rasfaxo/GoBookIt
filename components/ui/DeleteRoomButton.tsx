'use client';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { deleteRoomApi } from '@/services/adapters';
import { STRINGS } from '@/constants/strings';
import { useRouter } from 'next/navigation';

interface Props {
  roomId: string;
}

const DeleteRoomButton = ({ roomId }: Props) => {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm(STRINGS.rooms.deleteConfirm);
    if (!confirmed) return;
    try {
      const result = await deleteRoomApi(roomId);
      if (!result.ok) {
        toast.error(result.error || STRINGS.rooms.deleteError);
        return;
      }
      toast.success(STRINGS.rooms.deleteSuccess);
      router.refresh();
    } catch (error) {
      console.log('Failed to delete room', error);
      toast.error(STRINGS.rooms.deleteError);
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
