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
      <h3 class="title is-3">クラス情報</h3>

      <b-field label="クラス名">
        <b-input placeholder="例: 17期 大阪日曜Bクラス" v-model="manifest.name"></b-input>
      </b-field>
    </div>

    <b-button type="is-primary" class="finish my-6" @click="finish"
      >完了</b-button
    >
  </div>
</template>

<script lang="ts">
import { Manifest, Member } from "@/models";
import { Component, Vue } from "vue-property-decorator";
import { Zip } from "zlibt2";

@Component
export default class Create3 extends Vue {

  members: Member[] = this.$store.state.members;
  manifest: Manifest = {
    name: "",
    members: [],
    tables: this.$store.state.tables,
    table: "table.png"
  };

  mounted() {
    if (this.$store.state.members.length == 0)
      return this.$router.push("/create/members");
    if (this.$store.state.tables.length == 0)
      return this.$router.push("/create/members");
  }

  async finish() {
    const zip = new Zip();
    
    this.manifest.members = this.members.map((m, i) => {
      const filename = `photo/photo${('00' + i).slice(-2)}.jpg`;
      zip.addFile(new Uint8Array(m.image), {
        filename: new TextEncoder().encode(filename),
      });
      return {
        name: m.name,
        file: filename
      }
    })

    const table = await fetch("/table.png")
    zip.addFile(new Uint8Array(await table.arrayBuffer()), {
      filename: new TextEncoder().encode(`table.png`),
    });

    zip.addFile(new TextEncoder().encode(JSON.stringify(this.manifest)), {
      filename: new TextEncoder().encode(`manifest.json`),
    });

    const a = document.createElement('a')
    a.href = window.URL.createObjectURL(new Blob([zip.compress()]))
    a.download = `${this.manifest.name}.tkmscs`
    document.body.appendChild(a)
    a.style.display = 'none'
    a.click()
    a.remove()

    this.$router.push('/')
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
.finish {
  display: block;
  margin: auto;
}
</style>
