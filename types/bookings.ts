export interface BookingDoc {
  $id: string;
  room_id: string; // referenced room document id
  user_id: string;
  check_in: string; // ISO timestamp
  check_out: string; // ISO timestamp
}
