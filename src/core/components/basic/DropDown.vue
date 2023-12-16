<script>
export default {
    props: {
        title: {
            type: String,
            required: true
        }
    },
    setup (props) {
        const title = props.title;

        return {
            title
        }
    },
    data () {
        return {
            open: false
        }
    },
    watch: { },
    methods: {
        clickMenu() {
            this.open = !this.open;
        },
        onClickOutside() {
            this.open = false;
        }
    },
}

</script>

<template>
    <div v-click-outside="onClickOutside">
        <button @click="clickMenu" class="w-52 text-white bg-black font-medium text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
            <span class="text-left flex-1">{{title}}</span>
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                <path fill="currentColor" d="M7,10L12,15L17,10H7Z" />
            </svg>
        </button>

        <!-- Dropdown menu -->
        <div :class="{'hidden': !open}" class="absolute z-10 w-52 text-base list-none bg-black divide-y divide-gray-100 shadow dark:bg-gray-700 text-primary-900">
            <ul class="py-1">
                <slot />
            </ul>
        </div>
    </div>
</template>