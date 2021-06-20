import { Zlib as ZlibUnzip } from "zlibjs/bin/unzip.min";

export class Unzip {
  unzip: any;

  constructor(buffer: ArrayBuffer) {
    this.unzip = new ZlibUnzip.Unzip(new Uint8Array(buffer))
  }

  getJson(name: string): any {
    if (!this.unzip.getFilenames().includes(name)) return {};
    return JSON.parse(new TextDecoder().decode(this.unzip.decompress(name)));
  }

  getImageAsUrl(name: string, type: string): string {
    if (!this.unzip.getFilenames().includes(name)) return "";
    return window.URL.createObjectURL(
      new Blob([this.unzip.decompress(name)], { type: type })
    );
  }

  getImageAsBuffer(name: string): ArrayBuffer {
    if (!this.unzip.getFilenames().includes(name)) return new ArrayBuffer(0);
    return this.unzip.decompress(name).buffer;
  }
}