<template>
  <div class="random-canvas" id="canvas"></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import p5 from "p5";
import { p5Member, Seat } from "@/models";
import { Tkms } from "@/models/tkms";
import { Position } from "node_modules/vue-router/types/router";

@Component
export default class Random extends Vue {
  tkms: Tkms = new Tkms();
  members: p5Member[] = [];
  seats: Seat[] = [];

  async mounted() {
    if (this.$store.state.file == null) return this.$router.push("/");

    this.tkms = new Tkms(await this.$store.state.file.arrayBuffer());
    if (!this.tkms.isValid()) return this.$router.push("/?error=invalid");

    const script = (p5: p5) => {
      let backImage: p5.Image;
      let noto: p5.Font;
      let canvas: p5.Renderer;
      let dragging: any = null;
      let enterOn = false;

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
        backImage = p5.loadImage(this.tkms.tableBlobUrl);
        this.members = this.tkms.members.map((i) => ({
          ...i,
          image: p5.loadImage(i.url),
        }));
        if (this.tkms.chart.length > 0) {
          this.members.sort(
            (a, b) =>
              this.tkms.chart.indexOf(a.name) - this.tkms.chart.indexOf(b.name)
          );
        } else {
          this.members = this.members
            .map((a) => ({ w: Math.random(), v: a }))
            .sort((a, b) => a.w - b.w)
            .map((a) => a.v);
        }
        noto = p5.loadFont("noto.otf");
      };

      p5.setup = () => {
        const size = calcCanvasSize();
        canvas = p5.createCanvas(size.w, size.h, p5.WEBGL);
        canvas.parent("canvas");
        p5.rectMode(p5.CENTER);
        p5.textFont(noto);
        p5.fill(0);
        p5.frameRate(10);
        p5.textAlign(p5.CENTER, p5.CENTER);

        const memberData = [...this.members];
        this.tkms.tables.forEach((tables, tableCount) => {
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

        const random = !enterOn
          ? this.members
              .map((a) => ({ w: Math.random(), v: a }))
              .sort((a, b) => a.w - b.w)
              .map((a) => a.v)
          : this.members;
        drawMembers(random);
      };

      p5.keyPressed = () => {
        if (p5.keyCode == 13 && !enterOn) {
          enterOn = true;
          setTimeout(() => {
            p5.resizeCanvas(1600, 1200);
            p5.saveCanvas(
              canvas,
              this.tkms.name +
                "_" +
                new Date().toLocaleDateString().replaceAll(/\//g, "-"),
              "png"
            );
            p5.windowResized();
          }, 200);
        }
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
        const height = box.clientHeight;
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

      p5.windowResized = () =>
        p5.resizeCanvas(calcCanvasSize().w, calcCanvasSize().h);
    };

    new p5(script);
    document.body.requestFullscreen();
  }
}
</script>


<style lang="stylus" scoped>
#canvas {
  background: #ffffb8;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
</style>
