<template>
  <div class="home">
    <section class="hero is-dark">
      <div class="hero-body">
        <div class="container">
          <h1 class="tokumasa-title title">席替えTokumasa</h1>
          <h2 class="subtitle is-6">トップページ</h2>
        </div>
      </div>
    </section>

    <div class="container my-4 is-max-desktop">
      <section class="section">
        <h2 class="title is-2 mb-6">メインメニュー</h2>
          
        <b-message
          title="Error"
          type="is-danger"
          v-if="this.$route.query.error == 'invalid'"
          has-icon
        >
          指定されたファイルは正しい.tkmscsではなかったため失敗しました。<br />クラスデータを生成しなおして再度実行してみてください。
        </b-message>

        <div class="columns">
          <div class="column">
            <input
              type="file"
              class="filepond"
              ref="tkmsfile"
              accept=".tkmsc, .tkmscs"
            />
            <b-button
              id="start_btn"
              class="my-2"
              type="is-primary is-large is-fullwidth"
              :disabled="!file"
              @click="next"
              >席替え開始！</b-button
            >
            <div class="columns">
              <div class="column">
                <b-button
                  id="start_btn"
                  type="is-info is-fullwidth"
                  :disabled="!file"
                  @click="createSeatMap"
                  >座席図作成</b-button
                >
              </div>
              <div class="column">
                <b-button
                  type="is-fullwidth is-dark"
                  disabled
                  >クラスデータ編集（実装中）</b-button
                >
              </div>
            </div>
            <hr>
            <b-button
              class="mb-2"
              type="is-large is-fullwidth"
              @click="$router.push('/create/members')"
              >クラスデータ新規作成</b-button
            >
          </div>
        </div>
      </section>

      <section class="section">
        <h2 class="title is-2">使い方</h2>
        <div class="block">
          <h3 class="title is-3">ステップ1 - クラスデータを準備する</h3>
          <p>
            席替えTokumasaではクラスの情報を1つのファイル（.tkmscs）にまとめて使用します。<br />
            このデータには座席に座るメンバーの写真や、人数、テーブル辺りの人数などが記録されています。<br />
            <br />
            <router-link to="/create/members"
              >クラスデータ生成ページ</router-link
            >へ移動し、手順に従って生成してください。
          </p>
        </div>
        <div class="block">
          <h3 class="title is-3">ステップ2 - 席替えをする</h3>
          <p>
            ステップ1で生成したクラスデータを元にランダムに席順を決めます。<br />
            席替えページヘをクリックすると、クラスデータ（.tkmscs）を選択する画面が出てくるので選択してください。<br />
            ファイルを選択すると自動的にランダムページに移動するので、Enterキーを押すと確定します。<br />
            また、確定と同時にファイルを画像ファイルをダウンロードするように誘導されるのでダウンロードしておいてください。
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as FilePond from "filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import "filepond/dist/filepond.min.css";

@Component
export default class Home extends Vue {
  file: File | null = null;

  mounted() {
    const tkmsfile = this.$refs.tkmsfile as HTMLInputElement;
    FilePond.registerPlugin(FilePondPluginFileValidateType);
    const pond = FilePond.create(tkmsfile, {
      acceptedFileTypes: [".tkmscs", ".tkmsc"],
      fileValidateTypeDetectType: (src: any, type) =>
        new Promise((res, rej) => {
          const name = src.name.split(".");
          if (name[name.length - 1] == "tkmsc") return res(".tkmsc");
          if (name[name.length - 1] == "tkmscs") return res(".tkmscs");
          if (!type) return rej();
          res(type);
        }),
      labelFileTypeNotAllowed: "ファイル形式が正しくありません",
      fileValidateTypeLabelExpectedTypes: "{lastType}形式である必要があります",
      labelIdle:
        '.tkmscsファイルをここにドラッグ&ドロップするか<span class="filepond--label-action"> ファイルを選択 </span>してください',
    });

    pond.onupdatefiles = (files: any) => {
      if (files.length == 0) return (this.file = null);
      const name = files[0].file.name.split(".");
      console.log(name[name.length - 1])
      if (name[name.length - 1] == "tkmsc") this.file = files[0].file;
      else if (name[name.length - 1] == "tkmscs") this.file = files[0].file;
      else this.file = null;
    };
  }
  next() {
    this.$store.commit("setFile", this.file);
    this.$router.push("/random");
  }
  createSeatMap() {
    this.$store.commit("setFile", this.file);
    this.$router.push("/seatmap");
  }
}
</script>
