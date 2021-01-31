export interface Rooms {
  id: Int16Array;
  name: string;
  friend_id:Int16Array;
  user_id:Int16Array;
  status:string;
  createdAt:Date;
  updatedAt:Date;
  // "id": 1,
  // "name": "TestRoom",
  // "friend_id": 3,
  // "user_id": 4,
  // "status": "1",
  // "createdAt": "2021-01-31T15:50:00.000Z",
  // "updatedAt": "2021-01-31T15:50:00.000Z"
}
