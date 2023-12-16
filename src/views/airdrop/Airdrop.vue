<script setup>
import BodyContainer from "@/core/container/BodyContainer.vue";
import NftmxTooltip from "@/core/components/basic/NftmxTooltip.vue";
</script>

<template>
  <body-container>
    <div class="font-press text-3xl text-white text-center mt-9.5">
      Airdrop Super Bonus
    </div>
    <div class="text-white mt-5.75">
      <p>
        NFT.Protection did not conduct any presale or VC early investment
        offers, and the team does not hold any tokens. Instead, the project
        rewards users and projects utilizing NFT.Protection by giving away
        $NFTPX tokens as a bonus.
      </p>
      <br />
      <p>
        This tokens not only have no selling pressure from existing holders, but
        also have a correlated buying pressure model that uses 80% of generated
        fees to buy back and burn $NFTPX tokens
      </p>
    </div>
    <div class="mt-16 font-ibm text-sm text-white text-center">
      <table class="border border-black w-full bg-tertiary-800 text-sm">
        <thead>
          <tr class="divide-x divide-black">
            <td
              class="py-1.75 text-tertiary-400 bg-tertiary-350 text-xs text-left px-4"
            >
              Reward type
            </td>
            <td class="py-1.75">Deposit to vault</td>
            <td class="py-1.75">Listing for sale</td>
            <td class="py-1.75 bg-tertiary-350">Make offers</td>
            <td class="py-1.75">Purchasing</td>
            <td class="py-1.75">Seeling</td>
            <td class="py-1.75">Multilevel ownership</td>
          </tr>
        </thead>
        <tbody class="border-t border-black divide-y divide-black">
          <tr class="divide-x divide-black">
            <td
              class="py-4 text-tertiary-400 bg-tertiary-350 text-xs text-left px-4"
            >
              P2P APY
            </td>
            <td class="py-4">115.50%</td>
            <td class="py-4">75.50%</td>
            <td class="py-4 bg-tertiary-350">50.25%</td>
            <td class="py-4">225.99%</td>
            <td class="py-4">225.99%</td>
            <td class="py-4">315.50%</td>
          </tr>
          <tr class="divide-x divide-black">
            <td
              class="py-4 text-tertiary-400 bg-tertiary-350 text-xs text-left px-4"
            >
              P2C APY
            </td>
            <td class="py-4">0</td>
            <td class="py-4">0</td>
            <td class="py-4 bg-tertiary-350">0</td>
            <td class="py-4">0</td>
            <td class="py-4">0</td>
            <td class="py-4">0</td>
          </tr>
          <tr class="divide-x divide-black">
            <td
              class="py-4 text-tertiary-400 bg-tertiary-350 text-xs text-left px-4"
            >
              C2C APY
            </td>
            <td class="py-4">0</td>
            <td class="py-4">0</td>
            <td class="py-4 bg-tertiary-350">0</td>
            <td class="py-4">0</td>
            <td class="py-4">0</td>
            <td class="py-4">0</td>
          </tr>
          <tr class="divide-x divide-black">
            <td
              class="py-4 text-tertiary-400 bg-tertiary-350 text-xs text-left px-4"
            >
              NFTPX to claim
            </td>
            <td class="py-4">0</td>
            <td class="py-4">0</td>
            <td class="py-4 bg-tertiary-350">0</td>
            <td class="py-4">0</td>
            <td class="py-4">0</td>
            <td class="py-4">0</td>
          </tr>
          <tr class="divide-x divide-black text-xs">
            <td class="py-2.25 text-tertiary-400 bg-tertiary-350"></td>
            <td class="py-2.25">
              <button
                v-if="false"
                class="border-2 border-black shadow-default shadow-black text-primary-900 transition hover:shadow-primary-900 hover:border-primary-900 hover:bg-primary-900 font-press text-10 w-50 hover:text-white py-1"
              >
                CLAIM
              </button>
              <div v-else class="font-press text-10 text-red-600">
                NO REWARDS AVAILABLE
              </div>
            </td>
            <td class="py-2.25">
              <button
                v-if="false"
                class="border-2 border-black shadow-default shadow-black text-primary-900 transition hover:shadow-primary-900 hover:border-primary-900 hover:bg-primary-900 font-press text-10 w-50 hover:text-white py-1"
              >
                CLAIM
              </button>
              <div v-else class="font-press text-10 text-red-600">
                NO REWARDS AVAILABLE
              </div>
            </td>
            <td class="py-2.25 bg-tertiary-350">
              <button
                v-if="false"
                class="border-2 border-black shadow-default shadow-black text-primary-900 transition hover:shadow-primary-900 hover:border-primary-900 hover:bg-primary-900 font-press text-10 w-50 hover:text-white py-1"
              >
                CLAIM
              </button>
              <div v-else class="font-press text-10 text-red-600">
                NO REWARDS AVAILABLE
              </div>
            </td>
            <td class="py-2.25">
              <div class="font-press text-10 text-red-600">
                NO REWARDS AVAILABLE
              </div>
            </td>
            <td class="py-2.25">
              <button
                v-if="false"
                class="border-2 border-black shadow-default shadow-black text-primary-900 transition hover:shadow-primary-900 hover:border-primary-900 hover:bg-primary-900 font-press text-10 w-50 hover:text-white py-1"
              >
                CLAIM
              </button>
              <div v-else class="font-press text-10 text-red-600">
                NO REWARDS AVAILABLE
              </div>
            </td>
            <td class="py-2.25">
              <button
                v-if="false"
                class="border-2 border-black shadow-default shadow-black text-primary-900 transition hover:shadow-primary-900 hover:border-primary-900 hover:bg-primary-900 font-press text-10 w-50 hover:text-white py-1"
              >
                CLAIM
              </button>
              <div v-else class="font-press text-10 text-red-600">
                NO REWARDS AVAILABLE
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex justify-between font-ibm text-xs mt-6 mb-26">
      <div>
        <span class="text-tertiary-400"> Total </span>
        <span class="text-white"> $NFTPX </span>
        <span class="text-tertiary-400"> to claim: </span>
        <span class="text-white"> {{ (1586986.5344).toLocaleString() }} </span>
      </div>
      <div class="text-red-600">
        $NFTPX token are subject to Dumper Shield restriction
      </div>
    </div>
  </body-container>
</template>
