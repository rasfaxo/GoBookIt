'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useActionState } from 'react';
import { toast } from 'react-toastify';
import { FaChevronLeft, FaSave, FaUpload } from 'react-icons/fa';
import Link from 'next/link';

import { Heading, Card, Input, Button } from '@/components';
import { STRINGS } from '@/constants/strings';
import createRoom, { type CreateRoomState } from '@/services/rooms/createRoom';

const MAX_IMAGE_BYTES = 4.5 * 1024 * 1024; // 4.5MB

const inputBase = 'block w-full rounded-md border border-blue-200 bg-white/60 focus:bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition';

/* eslint-disable complexity, max-lines-per-function */
const AddRoomPage = () => {
  const [state, formAction] = useActionState<CreateRoomState, FormData>(createRoom, {});
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (state?.error) toast.error(state.error);
    if (state?.success) {
      toast.success('Room created successfully!');
      router.push('/');
    }
  }, [state, router]);

  return (
    <>
    <Heading
  title={STRINGS.rooms.addRoom}
  subtitle={STRINGS.rooms.addRoomSubtitle}
        rightSlot={
          <Link href="/" className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline">
            <FaChevronLeft className="mr-1" /> Back
          </Link>
        }
      />
      <Card className="p-6">
        <form
          action={formAction}
          className="space-y-8"
          onSubmit={(e) => {
            const fileInput = fileRef.current;
            const file = fileInput?.files?.[0];
            if (file && file.size > MAX_IMAGE_BYTES) {
              e.preventDefault();
              toast.error('Image too large (max 4.5MB)');
              return false;
            }
            return true;
          }}
        >
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <Input label="Room Name" id="name" name="name" required placeholder="Large Conference Room" />
                <Input label="Price / Hour" id="price_per_hour" name="price_per_hour" type="number" min={0} step={1} required placeholder="150" />
                <Input label="Square Feet" id="sqft" name="sqft" type="number" min={0} required placeholder="450" />
                <Input label="Capacity" id="capacity" name="capacity" type="number" min={1} required placeholder="12" />
                <Input label="Availability" id="availability" name="availability" required placeholder="Mon - Fri, 9am - 6pm" className="sm:col-span-2" />
                <Input label="Amenities (CSV)" id="amenities" name="amenities" required placeholder="projector, whiteboard, coffee" className="sm:col-span-2" />
                <Input label="Location" id="location" name="location" required placeholder="Building A, 3rd Floor" className="sm:col-span-2" />
                <Input label="Address" id="address" name="address" required placeholder="Full street address" className="sm:col-span-2" />
              </div>

              <div className="space-y-1">
                <label htmlFor="description" className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  placeholder="Describe the room, ambiance, equipment, etc."
                  className={`${inputBase} min-h-28 resize-y`}
                />
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Image</p>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-dashed border-blue-300 bg-blue-50 flex items-center justify-center">
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt="Preview" className="object-cover w-full h-full" />
                  ) : (
                    <div className="text-center text-blue-500 text-xs">
                      <FaUpload className="mx-auto mb-2 opacity-70" />
                      <p>Upload room image</p>
                      <p className="text-[10px] mt-1 opacity-70">PNG / JPG up to 4.5MB</p>
                    </div>
                  )}
                  <input
                    ref={fileRef}
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) {
                        setPreview(null);
                        return;
                      }
                      if (file.size > MAX_IMAGE_BYTES) {
                        toast.error('Image too large (max 4.5MB)');
                        e.target.value = '';
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = (r) => setPreview(r.target?.result as string);
                      reader.readAsDataURL(file);
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <FaSave /> Save Room
                </button>
                {state?.error && (
                  <p className="text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                    {state.error}
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </Card>
    </>
  );
};

export default AddRoomPage;
