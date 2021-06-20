import { Zlib as ZlibZip } from "zlibjs/bin/zip.min";

export class Zip {
  zip = new ZlibZip.Zip();

  addBuffer(data: ArrayBuffer, filename: string) {
    this.zip.addFile(new Uint8Array(data), {
      filename: this.getUTF8(filename),
    });
  }

  addText(data: string, filename: string) {
    this.zip.addFile(this.getUTF8(data), {
      filename: this.getUTF8(filename),
    });
  }

  addJSON(data: any, filename: string) {
    this.zip.addFile(this.getUTF8(JSON.stringify(data)), {
      filename: this.getUTF8(filename),
    });
  }

  getUTF8(text: string) {
    return new TextEncoder().encode(text);
  }

  toBlobURL() {
    return window.URL.createObjectURL(new Blob([this.zip.compress()]))
  }
}