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

    <div class="container my-4">
      <h3 class="title is-3">机辺りの人数</h3>

      <img src="/table.png" alt="" width="600px" style="margin: auto; display: block;" class="my-4"/>
      
      <div class="columns">
        <div class="column">
          <b-numberinput v-model="number"></b-numberinput>
        </div>
        <div class="column">
          <b-numberinput v-model="number"></b-numberinput>
        </div>
        <div class="column">
          <b-numberinput v-model="number"></b-numberinput>
        </div>
        <div class="column">
          <b-numberinput v-model="number"></b-numberinput>
        </div>
        <div class="column">
          <b-numberinput v-model="number"></b-numberinput>
        </div>
      </div>
      <div class="columns">
        <div class="column">
          <b-numberinput v-model="number"></b-numberinput>
        </div>
        <div class="column">
          <b-numberinput v-model="number"></b-numberinput>
        </div>
        <div class="column">
          <b-numberinput v-model="number"></b-numberinput>
        </div>
        <div class="column">
          <b-numberinput v-model="number"></b-numberinput>
        </div>
        <div class="column">
          <b-numberinput v-model="number"></b-numberinput>
        </div>
      </div>
    </div>
  </div>
</template>