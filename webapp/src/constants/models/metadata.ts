export interface ICountry {
  id: string;
  name?: string;
  code?: string;
  phone_code?: string;
}

export interface ICity {
  id: string;
  name?: string;
  code?: string;
  country_id?: number;
}

export interface IPost {
  createdAt?: string;
  // document_contents?: Array<any>;
  name?: string;
  content?: string;
  id?: number;
  image?: string;
  open?: number;
  status?: number;
  type?: string;
  updatedAt?: string;
}

export interface ICompany {
  content?: string;
  id?: number;
  status?: number;
}
