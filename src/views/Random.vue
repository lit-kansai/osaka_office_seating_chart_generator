<template>
  <div class="random">
    <div class="random-canvas" id="canvas"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import p5 from "p5";
import { Zlib } from "zlibjs/bin/unzip.min";
import { Manifest } from "@/models";

interface p5Member {
  image: p5.Image;
  name: string;
}

@Component
export default class Random extends Vue {
  manifest: Manifest = {} as Manifest;

  async mounted() {
    if (this.$store.state.file == null) return this.$router.push("/");

    try {
      const unzip = new Zlib.Unzip(
        new Uint8Array(await this.$store.state.file.arrayBuffer())
      );
      if (!unzip.getFilenames().includes("manifest.json"))
        return this.$router.push("/?error=invalid");

      this.manifest = new Manifest(
        JSON.parse(new TextDecoder().decode(unzip.decompress("manifest.json")))
      );

      const script = (p5: p5) => {
        let backImage: p5.Image;
        let noto: p5.Font;
        let enterOn = false;
        let members: p5Member[] = [];

        p5.preload = () => {
          backImage = p5.loadImage(
            window.URL.createObjectURL(
              new Blob([unzip.decompress(this.manifest.table)])
            )
          );
          noto = p5.loadFont("noto.otf");
          members = this.manifest.members.map((member) => ({
            image: p5.loadImage(
              window.URL.createObjectURL(
                new Blob([unzip.decompress(member.file)], {
                  type: "image/jpeg",
                })
              )
            ),
            name: member.name,
          }));
        };

        p5.setup = () => {
          const isLandscape = p5.windowWidth / 4 > p5.windowHeight / 3;
          const w = isLandscape ? (p5.windowHeight / 3) * 4 : p5.windowWidth;
          const h = isLandscape ? p5.windowHeight : (p5.windowWidth / 4) * 3;
          const canvas = p5.createCanvas(w, h, p5.WEBGL);
          canvas.parent("canvas");
          p5.frameRate(10);
          p5.rectMode(p5.CENTER);
          p5.textFont(noto);
          p5.fill(0);
          p5.textAlign(p5.CENTER, p5.CENTER);
        };

        p5.draw = () => {
          if (!enterOn) {
            p5.texture(backImage);
            p5.noStroke();
            p5.rect(0, 0, p5.width, p5.height);
            p5.stroke(0);
            drawRandom();
          }
        };

        p5.keyPressed = () => {
          if (p5.keyCode == 13) enterOn = true;
        };

        const drawRandom = () => {
          const random = members
            .map((a) => ({ w: Math.random(), v: a }))
            .sort((a, b) => a.w - b.w)
            .map((a) => a.v);

          p5.translate(-p5.width / 2, -p5.height / 2);
          drawTables(random, this.manifest.tables);
        };

        const drawTables = (members: p5Member[], tables: number[]) => {
          const r = 0.065;
          drawTable(members.splice(0, tables[0]), 0.119, 0.505, r);
          drawTable(members.splice(0, tables[1]), 0.3095, 0.505, r);
          drawTable(members.splice(0, tables[2]), 0.5, 0.505, r);
          drawTable(members.splice(0, tables[3]), 0.6905, 0.505, r);
          drawTable(members.splice(0, tables[4]), 0.881, 0.505, r);
          drawTable(members.splice(0, tables[5]), 0.119, 0.755, r);
          drawTable(members.splice(0, tables[6]), 0.3095, 0.755, r);
          drawTable(members.splice(0, tables[7]), 0.5, 0.755, r);
          drawTable(members.splice(0, tables[8]), 0.6905, 0.755, r);
          drawTable(members.splice(0, tables[9]), 0.881, 0.755, r);
        };

        const drawTable = (
          members: p5Member[],
          xp: number,
          yp: number,
          r: number
        ) => {
          members.forEach((m, i) => {
            const _rad =
              (i / members.length) * p5.PI * 2 +
              p5.PI / 2 +
              p5.PI +
              p5.PI / members.length;
            const x = r * p5.width * p5.cos(_rad) + p5.width * xp;
            const y = r * p5.width * p5.sin(_rad) + p5.height * yp;

            const w = p5.width * 0.05;
            const h = p5.width * 0.05;

            p5.texture(m.image);
            p5.ellipse(x, y, w, h);
            p5.textSize(p5.width / 80);
            p5.text(m.name, x, y + p5.width * 0.03);
          });
        };

        p5.windowResized = () => {
          const isLandscape = p5.windowWidth / 4 > p5.windowHeight / 3;
          const w = isLandscape ? (p5.windowHeight / 3) * 4 : p5.windowWidth;
          const h = isLandscape ? p5.windowHeight : (p5.windowWidth / 4) * 3;
          p5.resizeCanvas(w, h);
        };
      };

      new p5(script);
    } catch (e) {
      console.error(e);
      return this.$router.push("/?error=invalid");
    }
  }
}
</script>


<style lang="stylus">
.random {
  background: #ffffb8;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
</style>
