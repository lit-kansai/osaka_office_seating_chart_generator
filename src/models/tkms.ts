import { Zip } from "@/zip";
import { Unzip } from "@/unzip";

export class Tkms {
  chart: string[] = [];
  tableBlobUrl = "";
  members: TkmsMember[] = [];
  name = "";
  table = "";
  tables: number[] = [];
  manifestVersion = 0;

  constructor(buffer?: ArrayBuffer) {
    if (!buffer) return;

    try {
      const unzip = new Unzip(buffer);

      const manifest = new Manifest(unzip.getJson("manifest.json"));
      this.name = manifest.name;
      this.table = manifest.table;
      this.tables = manifest.tables;
      this.manifestVersion = manifest.version;

      this.tableBlobUrl = unzip.getImageAsUrl(this.table, "image/png");
      this.chart = unzip.getJson("chart.json").chart || [];

      this.members = manifest.members
        .filter((m) => m.name != "")
        .map((m) => ({
          ...m,
          url: unzip.getImageAsUrl(m.file, "image/png"),
          buffer: unzip.getImageAsBuffer(m.file),
        } as TkmsMember));
    } catch (e) {
      console.error(e);
    }
  }

  isValid() {
    return this.members.length > 0;
  }

  async generateTkmscs() {
    const zip = new Zip();

    const manifest = new Manifest();
    manifest.members = this.members.map((m, i) => {
      const filename = `photo/photo${("00" + i).slice(-2)}.png`;
      zip.addBuffer(m.buffer, filename);
      return { name: m.name, file: filename } as ManifestMember;
    });
    manifest.name = this.name;
    manifest.table = "table.png";
    manifest.tables = this.tables;
    manifest.version = this.manifestVersion;

    const tableImg = await fetch("/table.png").then((res) => res.arrayBuffer());
    zip.addBuffer(tableImg, "table.png");
    zip.addJSON(manifest, "manifest.json");
    if (this.chart) zip.addJSON({ chart: this.chart }, "chart.json");

    return zip.toBlobURL();
  }
}

export interface TkmsMember {
  name: string; // メンバー名
  file: string; // ファイル名
  url: string; // BlobURL
  buffer: ArrayBuffer; // Buffer
}

export interface ManifestMember {
  name: string;
  file: string;
}

export class Manifest {
  version = 0;
  name = "";
  members: ManifestMember[] = [];
  table = "";
  tables: number[] = []; // 改名したい

  constructor(init?: Partial<Manifest>) {
    Object.assign(this, init);
  }

  public toObject(): any {
    return Object.assign({}, this);
  }
}
