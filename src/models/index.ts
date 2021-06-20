import p5 from "p5";
import { Tkms } from "./tkms";

export interface State {
  tkms: Tkms | null;
  tables: number[];
  file: File | null;
}

export interface p5Member {
  url: string;
  image: p5.Image;
  name: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface Seat {
  x: (w: number) => number;
  y: (w: number, h: number) => number;
  r: (w: number) => number;
}
