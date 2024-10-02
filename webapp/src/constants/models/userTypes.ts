export interface IUser {
  city_id?: number;
  country_id?: number;
  email?: string
  first_name?: string
  id: number;
  last_name?: string
  status: number;
  token: string;
  username: string;
  avatar?: string;
}

class User {
  city_id: number;
  country_id: number;
  email: string
  first_name: string
  id: number;
  last_name: string
  status: number;
  token: string;
  avatar?: string;
  username: string;

  constructor(props: IUser) {
    this.city_id = props.city_id;
    this.country_id = props.country_id;
    this.email = props.email
    this.first_name = props.first_name
    this.id = props.id;
    this.last_name = props.last_name
    this.status = props.status;
    this.token = props.token;
    this.username = props.username;
    this.avatar = props.avatar;
  }
}

export default User;
