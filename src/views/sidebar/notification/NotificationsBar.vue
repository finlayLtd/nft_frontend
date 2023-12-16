<script setup>
import SidebarContainer from '@/core/container/SidebarContainer.vue';
import { computed } from 'vue';
import { useStore } from 'vuex';
import Notification from './Notification.vue';

defineProps({
    orderLogs: {
        type: Array,
        default: []
    }
})

const store = useStore();

function toggleNotificationBar() {
    store.commit('app/TOGGLE_NOTIFICATION_BAR', false);
}
</script>

<template>
    <sidebar-container>
        <div class="mt-5 mb-7 flex items-center justify-between cursor-default text-sm text-primary-900">
            See All
            <font-awesome-icon
                @click="toggleNotificationBar()"
                :icon="['fas', 'times']"
                class="text-white hover:text-tertiary-400 transition text-lg cursor-pointer"
            />
        </div>
        <notification v-for="(log, i) in orderLogs" :key="i" :log="log" />
    </sidebar-container>
</template>
