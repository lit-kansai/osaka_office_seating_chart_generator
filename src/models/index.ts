export interface State {
  members: Member[]
  tables: number[]
}

export interface Member {
  name: string;
  image: ArrayBuffer;
  url: string;
}

export interface ManifestMember {
  name: string,
  file: string
}

export interface Manifest {
  name: string,
  members: ManifestMember[],
  table: string,
  tables: number[]
}
