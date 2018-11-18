export interface LoggedInUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  profile_pic_path: string;
  profile_pic_path_50_50: string;
  wall_pic: {
    wall_pic_path: string,
    wall_x: number,
    wall_y: number
  };
}
