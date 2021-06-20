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
      <h3 class="title is-3">メンバー登録</h3>

      <div id="drop_zone">
        画像をここにドラッグアンドドロップしてください<br />ファイル名が名前として入力されます
      </div>
    </div>

    <div class="container my-6" v-show="tkms.members.length > 0">
      <div class="card-box">
        <div class="card" v-for="(member, i) in tkms.members" v-bind:key="i">
          <div class="card-image">
            <figure class="image member-image">
              <img :src="member.url" />
            </figure>
          </div>
          <div class="card-content">
            <b-input v-model="member.name" placeholder="メンバー名"></b-input>
            <div class="remove" @click="remove(i)">削除</div>
          </div>
        </div>
      </div>
    </div>
    <b-button
      type="is-primary"
      @click="next"
      class="next my-6"
      :disabled="tkms.members.length == 0 || tkms.members.some(m => m.name == '')"
      >次へ</b-button
    >
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import p5 from "p5";
import { Tkms } from "@/models/tkms";

@Component
export default class Create1 extends Vue {
  tkms: Tkms = new Tkms()

  mounted(): void {
    var dropZone = document.getElementById("drop_zone") as HTMLDivElement;
    dropZone.addEventListener(
      "dragover",
      (e) => {
        e.stopPropagation();
        e.preventDefault();
        const t = e.dataTransfer;
        if (t) t.dropEffect = "copy";
      },
      false
    );
    dropZone.addEventListener(
      "drop",
      (e) => {
        e.stopPropagation();
        e.preventDefault();

        const files = e.dataTransfer?.files;
        if (!files) return;
        [...files].forEach(async (f) => {
          const script = (p5: p5) => {
            let i: p5.Image; 
            const size = 200;

            p5.preload = () => {
              i = p5.loadImage(window.URL.createObjectURL(f))
            }

            p5.setup = () => {
              const canvas = p5.createCanvas(size, size);
              canvas.elt.style.display = "none"
              p5.imageMode(p5.CENTER);
              p5.background(220);
              
              const isLandscape = i.width > i.height
              const short = isLandscape ? i.height : i.width
              
              const long = (isLandscape ? i.width : i.height) * (size / short);
              p5.image(i, p5.width / 2, p5.height / 2, isLandscape ? long : size, isLandscape ? size: long );

              const c = (canvas.elt as HTMLCanvasElement)
              c.toBlob(async blob => {
                const buffer = await blob?.arrayBuffer()
                if(!buffer) return
                this.tkms.members.push({
                  name: f.name.split(".").slice(0, -1).join("."),
                  file: "",
                  url: window.URL.createObjectURL(blob),
                  buffer,
                });
              })
            };
          };

          new p5(script);
        });
      },
      false
    );
  }
  remove(count: number): void {
    this.tkms.members.splice(count, 1);
  }
  next() {
    this.$store.commit("setTkms", this.tkms);
    this.$router.push("/create/tables");
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
#drop_zone {
  width: 80%;
  border-radius: 16px;
  margin: auto;
  text-align: center;
  font-size: 20pt;
  padding: 64px;
  background: #eee;
  border: 6px dashed #ccc;
}

.card-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.card {
  margin: 8px;
  width: 172px;
}

.member-image {
  width: 172px;
  height: 172px;
}

.card-content {
  padding: 12px;
}

.remove {
  color: red;
  cursor: pointer;
  text-align: right;
  margin-top: 4px;

  &:hover {
    text-decoration: underline;
  }
}

.next {
  display: block;
  margin: auto;
}
</style>
