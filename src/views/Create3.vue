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
        <b-input
          placeholder="例: 17期 大阪日曜Bクラス"
          v-model="tkms.name"
        ></b-input>
      </b-field>
    </div>

    <b-button
      type="is-primary"
      class="finish my-6"
      @click="finish"
      :disabled="tkms.name == ''"
      >完了</b-button
    >
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Tkms } from "@/models/tkms";

@Component
export default class Create3 extends Vue {
  tkms: Tkms = this.$store.state.tkms;

  mounted() {
    if (this.tkms.members.length == 0)
      return this.$router.push("/create/members");
    if (this.tkms.tables.length == 0)
      return this.$router.push("/create/members");
  }

  async finish() {
    const a = document.createElement("a");
    a.href = await this.tkms.generateTkmscs();
    a.download = `${this.tkms.name}.tkmscs`;
    document.body.appendChild(a);
    a.style.display = "none";
    a.click();
    a.remove();

    this.$router.push("/");
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
