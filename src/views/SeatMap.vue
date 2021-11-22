<template>
  <div class="seatmap">
    <section class="hero is-dark">
      <div class="hero-body">
        <div class="container">
          <h1 class="tokumasa-title title" @click="$router.push('/')">
            席替えTokumasa
          </h1>
          <h2 class="subtitle is-6">座席図作成</h2>
        </div>
      </div>
    </section>
    <div class="container">
      <div class="columns">
        <div class="column canvas-box is-8">
          <div class="seatmap-canvas" id="canvas"></div>
        </div>
        <div class="column is-1"></div>
        <div class="column is-3">
          <h2 class="title is-4 mt-4">メニュー</h2>
          <b-field label="座席名">
            <b-input placeholder="座席表_4月" v-model="name"></b-input>
          </b-field>
          <b-button
            type="is-primary mr-2 mb-2"
            :disabled="!name"
            @click="downloadSeats"
            >座席保存</b-button
          >
          <b-button
            type="is-primary is-outlined"
            :disabled="!name"
            @click="downloadImage"
            >画像保存</b-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import p5 from "p5";
import { Zlib as ZlibZip } from "zlibjs/bin/zip.min";
import { Zlib as ZlibUnzip } from "zlibjs/bin/unzip.min";
import { Manifest, p5Member, Seat } from "@/models";
import { Position } from "node_modules/vue-router/types/router";

@Component
export default class SeatMap extends Vue {
  manifest: Manifest = {} as Manifest;
  members: p5Member[] = [];
  seats: Seat[] = [];
  tkmscs: File = this.$store.state.file;
  tableImageUrl = "";
  name = "";
  player: p5 | null = null;

  async decompress() {
    const tkmscsArray = await this.tkmscs.arrayBuffer();
    const unzip = new ZlibUnzip.Unzip(new Uint8Array(tkmscsArray));
    if (!unzip.getFilenames().includes("manifest.json"))
      return this.$router.push("/?error=invalid");

    this.manifest = new Manifest({}, unzip.decompress("manifest.json"));
    const tableImage = new Blob([unzip.decompress(this.manifest.table)]);
    this.tableImageUrl = window.URL.createObjectURL(tableImage);
    this.members = this.manifest.members.map((m) => ({
      url: window.URL.createObjectURL(new Blob([unzip.decompress(m.file)])),
      name: m.name,
      image: new p5.Image(),
    }));
  }

  async mounted() {
    if (this.tkmscs == null) return this.$router.push("/");

    try {
      await this.decompress();
    } catch (e) {
      console.error(e);
      return this.$router.push("/?error=invalid");
    }

    const script = (p5: p5) => {
      let backImage: p5.Image;
      let noto: p5.Font;
      let canvas: p5.Renderer;
      let dragging: any = null;

      const tablePosition: Position[] = [
        { x: 0.119, y: 0.505 },
        { x: 0.3095, y: 0.505 },
        { x: 0.5, y: 0.505 },
        { x: 0.6905, y: 0.505 },
        { x: 0.881, y: 0.505 },
        { x: 0.119, y: 0.755 },
        { x: 0.3095, y: 0.755 },
        { x: 0.5, y: 0.755 },
        { x: 0.6905, y: 0.755 },
        { x: 0.881, y: 0.755 },
      ];

      p5.preload = () => {
        backImage = p5.loadImage(this.tableImageUrl);
        this.members = this.members.map((i) => ({
          ...i,
          image: p5.loadImage(i.url),
        }));
        noto = p5.loadFont("noto.otf");
      };

      p5.setup = () => {
        const size = calcCanvasSize();
        canvas = p5.createCanvas(size.w, size.h, p5.WEBGL);
        canvas.parent("canvas");
        p5.rectMode(p5.CENTER);
        p5.textFont(noto);
        p5.fill(0);
        p5.textAlign(p5.CENTER, p5.CENTER);

        const memberData = [...this.members];
        this.manifest.tables.forEach((tables, tableCount) => {
          const tableMembers = memberData.splice(0, tables);
          tableMembers.forEach((m, i) => {
            const rad = calcRadian(i, tableMembers.length);
            this.seats.push({
              x: (w) =>
                0.065 * w * p5.cos(rad) + w * tablePosition[tableCount].x,
              y: (w, h) =>
                0.065 * w * p5.sin(rad) + h * tablePosition[tableCount].y,
              r: (w) => (w * 0.05) / 2,
            });
          });
        });
      };

      p5.draw = () => {
        p5.texture(backImage);
        p5.noStroke();
        p5.rect(0, 0, p5.width, p5.height);
        p5.stroke(0);
        p5.translate(-p5.width / 2, -p5.height / 2);
        drawMembers(this.members);
      };

      const drawMembers = (members: p5Member[]) => {
        const m = members.find((m) => m.name == dragging);
        this.seats.forEach((seat, i) => {
          const member = members[i];
          if (members[i] == m) return;
          const image = getImageByName(member.name);
          if (image) p5.texture(image);
          p5.ellipse(
            seat.x(p5.width),
            seat.y(p5.width, p5.height),
            seat.r(p5.width) * 2
          );
          p5.textSize(p5.width / 80);
          p5.text(
            members[i].name,
            seat.x(p5.width),
            seat.y(p5.width, p5.height) + p5.width * 0.03
          );
        });
        if (m) {
          const image = getImageByName(m.name);
          if (image) p5.texture(image);
          p5.ellipse(p5.mouseX, p5.mouseY, p5.width * 0.05);
          p5.textSize(p5.width / 80);
          p5.text(m.name, p5.mouseX, p5.mouseY + p5.width * 0.03);
        }
      };

      function calcCanvasSize() {
        const box = document.querySelector("#canvas") as HTMLDivElement;
        if (!box) return { w: 640, h: 480 };
        const width = box.clientWidth;
        const height = box.clientHeight - 24;
        const isLandscape = width / 4 > height / 3;
        return {
          w: isLandscape ? (height / 3) * 4 : width,
          h: isLandscape ? height : (width / 4) * 3,
        };
      }

      const getImageByName = (name: string) =>
        this.members.find((i) => i.name == name)?.image;

      const calcRadian = (pos: number, cap: number) =>
        (pos / cap) * p5.PI * 2 + p5.PI / 2 + p5.PI + p5.PI / cap;

      const calcDistanceToCursor = (s: Seat) =>
        Math.sqrt(
          (s.x(p5.width) - p5.mouseX) ** 2 +
            (s.y(p5.width, p5.height) - p5.mouseY) ** 2
        );

      const getSelectedMember = () => {
        const nearest = this.seats.reduce((a, b) =>
          calcDistanceToCursor(a) < calcDistanceToCursor(b) ? a : b
        );
        if (calcDistanceToCursor(nearest) > nearest.r(p5.width)) return null;
        return this.members[this.seats.indexOf(nearest)];
      };

      p5.mousePressed = () => (dragging = getSelectedMember()?.name);

      p5.mouseReleased = () => {
        if (dragging == null) return;

        const selectedMember = getSelectedMember();
        if (selectedMember == null) return (dragging = null);

        const a = this.members.find((m) => m.name == dragging);
        const b = this.members.find((m) => m == selectedMember);

        if (!a || !b) return;
        const apos = this.members.indexOf(a);
        const bpos = this.members.indexOf(b);
        this.members.splice(apos, 1, b);
        this.members.splice(bpos, 1, a);

        dragging = null;
      };

      p5.windowResized = () =>
        p5.resizeCanvas(calcCanvasSize().w, calcCanvasSize().h);
    };

    this.player = new p5(script);
  }

  async downloadSeats() {
    const zip = new ZlibZip.Zip();
    const tkmscsArray = await this.tkmscs.arrayBuffer();
    const unzip = new ZlibUnzip.Unzip(new Uint8Array(tkmscsArray));

    unzip.getFilenames().forEach((name: string) => {
      zip.addFile(unzip.decompress(name), {
        filename: new TextEncoder().encode(name),
      });
    });

    const chart = { chart: this.members.map((m) => m.name) };

    zip.addFile(new TextEncoder().encode(JSON.stringify(chart)), {
      filename: new TextEncoder().encode("chart.json"),
    });

    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(new Blob([zip.compress()]));
    a.download = `${this.manifest.name}_${this.name}.tkmsc`;
    document.body.appendChild(a);
    a.style.display = "none";
    a.click();
    a.remove();
  }

  downloadImage() {
    this.player?.resizeCanvas(1600, 1200);
    this.player?.saveCanvas(`${this.manifest.name}_${this.name}`, "png");
    this.player?.windowResized();
  }
}
</script>

<style lang="stylus" scoped>
.canvas-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 156px);
}

#canvas {
  width: 100%;
  height: 100%;
}

.columns {
  margin: 0px !important;
}
</style>
