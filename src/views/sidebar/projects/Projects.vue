<script setup>
const emit = defineEmits(["close"]);
</script>

<template>
  <div
    class="fixed flex flex-col h-full z-40 w-full sm:w-60 top-0 left-0 bg-black"
  >
    <div
      @click="emit('close')"
      class="p-6 flex items-center gap-4 cursor-pointer"
    >
      <img src="/images/logo/nftmx-logo-small.png" />
    </div>
    <div class="overflow-auto rtl-left flex flex-col items-end">
      <a
        href="https://pdo.finance/"
        target="_blank"
        class="py-2 cursor-pointer hover:bg-tertiary-900 pr-7 transition"
      >
        <img src="/images/logo/projects/pdo-finance-logo.png" />
      </a>
      <a
        href="https://landing.derex.exchange/"
        target="_blank"
        class="py-2 cursor-pointer hover:bg-tertiary-900 pr-7 transition"
      >
        <img src="/images/logo/projects/derex-exchange-logo.png" />
      </a>
      <a
        href="https://shield.pdo.finance/"
        target="_blank"
        class="py-2 cursor-pointer hover:bg-tertiary-900 pr-7 transition"
      >
        <img src="/images/logo/projects/dumper-shield-logo.png" />
      </a>
      <a
        href="https://www.jointer.io/"
        target="_blank"
        class="py-2 cursor-pointer hover:bg-tertiary-900 pr-7 transition"
      >
        <img src="/images/logo/projects/jointer-logo.png" />
      </a>
      <a
        href="https://smart.exchange/"
        target="_blank"
        class="py-2 cursor-pointer hover:bg-tertiary-900 pr-7 transition"
      >
        <img src="/images/logo/projects/smart-exchange-logo.png" />
      </a>
      <a
        href="https://cbdc.science/"
        target="_blank"
        class="py-2 cursor-pointer hover:bg-tertiary-900 pr-7 transition"
      >
        <img src="/images/logo/projects/cbdc-science.png" />
      </a>
      <a
        href="https://degenswap.io/"
        target="_blank"
        class="py-2 cursor-pointer hover:bg-tertiary-900 pr-7 transition"
      >
        <img src="/images/logo/projects/degen-logo.png" />
      </a>
      <div class="py-2 cursor-pointer hover:bg-tertiary-900 pr-7 transition">
        <img src="/images/logo/projects/element-zero-logo.png" />
      </div>
      <a
        href="https://freez.finance/"
        target="_blank"
        class="py-2 cursor-pointer hover:bg-tertiary-900 pr-7 transition"
      >
        <img src="/images/logo/projects/freez-finance.png" />
      </a>
      <div class="py-2 cursor-pointer hover:bg-tertiary-900 pr-7 transition">
        <img src="/images/logo/projects/multiverse-logo.png" />
      </div>
      <div class="py-2 cursor-pointer hover:bg-tertiary-900 pr-7 transition">
        <img src="/images/logo/projects/oxn-logo.png" />
      </div>
      <div class="py-2 cursor-pointer hover:bg-tertiary-900 pr-7 transition">
        <img src="/images/logo/projects/vtuber-exchange-logo.png" />
      </div>
      <div class="py-2 cursor-pointer hover:bg-tertiary-900 pr-7 transition">
        <img src="/images/logo/projects/vsinger-exchange-logo.png" />
      </div>
      <div class="py-2 cursor-pointer hover:bg-tertiary-900 pr-7 transition">
        <img src="/images/logo/projects/lp-insure-logo.png" />
      </div>
      <div class="py-2 cursor-pointer hover:bg-tertiary-900 pr-7 transition">
        <img src="/images/logo/projects/social-currency-logo.png" />
      </div>
      <div class="py-2 cursor-pointer hover:bg-tertiary-900 pr-7 transition">
        <img src="/images/logo/projects/updown-logo.png" />
      </div>
      <div class="py-2 cursor-pointer hover:bg-tertiary-900 pr-7 transition">
        <img src="/images/logo/projects/w3b-finance-logo.png" />
      </div>
      <div class="py-2 cursor-pointer hover:bg-tertiary-900 pr-7 transition">
        <img src="/images/logo/projects/zero-1-logo.png" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.rtl-left {
  direction: rtl;
}
::-webkit-scrollbar {
  width: 10px;
  height: 15px;
}
::-webkit-scrollbar-track {
  background: #343434;
}
/* Handle */
::-webkit-scrollbar-thumb {
  background: black;
  border: 3px solid transparent;
  background-clip: content-box;
}
::-webkit-scrollbar-corner {
  background: black;
}
</style>
