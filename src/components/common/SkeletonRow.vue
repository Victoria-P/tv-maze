<template>
  <div class="wrap">
    <div class="bar"></div>
    <div class="cards">
      <div class="card" v-for="n in 7" :key="n"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrap {
  margin: 18px 0 26px;
}
.bar {
  width: 180px;
  height: 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
}
.cards {
  margin-top: 12px;
  display: flex;
  gap: 12px;
  overflow: hidden;
}
.card {
  width: 150px;
  height: 210px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--line);
}
</style>
