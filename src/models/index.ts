export interface State {
  members: Member[]
}

export interface Member {
  name: string;
  image: File;
  url: string;
}