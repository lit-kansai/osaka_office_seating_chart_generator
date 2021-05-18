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

    <div class="container my-4">
      <section class="section">
        <h2 class="title is-2">メインメニュー</h2>
        <div class="columns">
          <div class="column">
            <input type="file" class="filepond" id="class_data" onchange="myFunction(e)" accept=".osakascs">
            <b-button id="start_btn" type="is-primary is-large is-fullwidth" disabled>席替えページへ</b-button>
          </div>
          <div class="column">
            <b-button type="is-large is-fullwidth" @click="$router.push('create')">クラスデータ生成ページへ</b-button>
          </div>
        </div>
      </section>
      <section class="section">
        <h2 class="title is-2">使い方</h2>
        <div class="block">
          <h3 class="title is-3">ステップ1 - クラスデータを準備する</h3>
          <p>
            席替えTokumasaではクラスの情報を1つのファイル（.osakascs）にまとめて使用します。<br>
            このデータには座席に座るメンバーの写真や、人数、テーブル辺りの人数などが記録されています。<br>
            <br>
            <a href="/create.html">クラスデータ生成ページ</a>へ移動し、手順に従って生成してください。
          </p>
        </div>
        <div class="block">
          <h3 class="title is-3">ステップ2 - 席替えをする</h3>
          <p>
            ステップ1で生成したクラスデータを元にランダムに席順を決めます。<br>
            席替えページヘをクリックすると、クラスデータ（.osakascs）を選択する画面が出てくるので選択してください。<br>
            ファイルを選択すると自動的にランダムページに移動するので、Enterキーを押すと確定します。<br>
            また、確定と同時にファイルを画像ファイルをダウンロードするように誘導されるのでダウンロードしておいてください。
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Home extends Vue {}
</script>
