<template>
  <div class="pb-10 text-tertiary-400 text-11 font-ibm">
    <img v-lazy="'/images/logo/nftmx-logo-small.png'" alt="NFT mx" />
    <div class="leading-5">
      <font-awesome-icon :icon="['far', 'copyright']" />2023 NFT.Protection All
      rights reserved
    </div>
    <div class="flex items-center gap-2.5 font-ibm-bold my-0.5">
      <span> Powered by </span>
      <img
        v-lazy="'/images/logo/atom-logo-footer.png'"
        alt="logo"
        class="w-38"
      />
    </div>
    <div class="leading-4.5 pr-1">
      Qwantum Finance is a DeFi ecosystem powered by brilliant decentralized
      protocols designed to create an efficient financial system based on
      quantum finance methods. Qwantum’s methods reduce investment risk and
      increase liquidity to illiquid and risky assets.
    </div>
  </div>
</template>
