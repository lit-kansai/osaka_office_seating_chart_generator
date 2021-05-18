<template>
  <div class="about">
    <section class="hero is-dark">
      <div class="hero-body">
        <div class="container">
          <h1 class="tokumasa-title title" @click="$router.push('/')">
            席替えTokumasa
          </h1>
          <h2 class="subtitle is-6">クラスデータ作成ページ</h2>
        </div>
      </div>
    </section>

    <div class="container my-6">
      <h3 class="title is-3">机辺りの人数</h3>

      <div class="preview-canvas" id="canvas"></div>

      <div class="columns" v-for="i in 2" v-bind:key="i - 1">
        <div class="column" v-for="j in 5" v-bind:key="j - 1">
          <b-numberinput
            v-model="tables[(i - 1) * 5 + j - 1]"
            min="0"
            :max="tableMax[(i - 1) * 5 + j - 1]"
            :editable="false"
          ></b-numberinput>
        </div>
      </div>
    </div>
    <b-button type="is-primary" class="next my-6" :disabled="remains > 0" @click="next"
      >次へ</b-button
    >
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import p5 from "p5";

@Component
export default class Create2 extends Vue {
  tables: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  tableMax: number[] = [6, 6, 6, 6, 6, 6, 6, 6, 6, 6];
  memberCount = this.$store.state.members.length;

  created() {
    [...Array(this.memberCount)].forEach((_, i) => {
      this.tables[i % 10] += 1;
    });
  }

  mounted(): any {
    this.changeMembers();
    if (this.$store.state.members.length == 0)
      return this.$router.push("/create/members");

    const script = (p5: p5) => {
      const backImage = p5.loadImage("/table.png");

      p5.setup = () => {
        const canvas = p5.createCanvas(640, 480);
        canvas.parent("canvas");
        p5.frameRate(10);
      };

      p5.draw = () => {
        p5.image(backImage, 0, 0, p5.width, p5.height);
        drawTables();
        drawBottom(this.remains);
      };

      const drawTables = () => {
        const r = 0.065;
        drawTable(this.tables[0], 0.119, 0.53, r);
        drawTable(this.tables[1], 0.3095, 0.53, r);
        drawTable(this.tables[2], 0.5, 0.53, r);
        drawTable(this.tables[3], 0.6905, 0.53, r);
        drawTable(this.tables[4], 0.881, 0.53, r);
        drawTable(this.tables[5], 0.119, 0.78, r);
        drawTable(this.tables[6], 0.3095, 0.78, r);
        drawTable(this.tables[7], 0.5, 0.78, r);
        drawTable(this.tables[8], 0.6905, 0.78, r);
        drawTable(this.tables[9], 0.881, 0.78, r);
      };

      function drawTable(members: number, xp: number, yp: number, r: number) {
        [...new Array(members)].forEach((m, i) => {
          const _rad =
            (i / members) * p5.PI * 2 + p5.PI / 2 + p5.PI + p5.PI / members;
          const x = r * p5.width * p5.cos(_rad) + p5.width * xp;
          const y = r * p5.width * p5.sin(_rad) + p5.height * yp;
          p5.ellipse(x, y, 30);
        });
      }

      function drawBottom(count: number) {
        p5.textSize(24);
        p5.text(`残り: ${count}`, 25, 455);
        [...Array(count)].forEach((_, i) => {
          p5.ellipse(150 + i * 20, 447, 30);
        });
      }
    };

    new p5(script);
  }

  @Watch("tables")
  changeMembers() {
    this.tableMax =
      this.remains == 0 ? [...this.tables] : this.tableMax.map((_) => 6);
  }

  get remains() {
    return this.memberCount - this.tables.reduce((a, b) => a + b);
  }

  next() {
    this.$store.commit("setTables", this.tables);
    this.$router.push("/create/info");
  }
}
</script>

<style lang="stylus">
.preview-canvas > canvas {
  margin: auto;
  display: block;
  margin-bottom: 16px;
}
</style>

<style lang="stylus" scoped>

.next {
  display: block;
  margin: auto;
}
</style>
