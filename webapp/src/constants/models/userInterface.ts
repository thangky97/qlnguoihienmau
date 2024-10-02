export interface IUser {
  fullName: string;
  email: string;
  phoneNumber: string;
  country: string;
  city: string;
}

class User {
  fullName: string;
  email: string;
  phoneNumber: string;
  country: string;
  city: string;

  constructor(props: IUser) {
    this.email = props.email;
    this.fullName = props.fullName;
    this.phoneNumber = props.phoneNumber;
    this.country = props.country;
    this.city = props.city;
  }
}

export default User;
