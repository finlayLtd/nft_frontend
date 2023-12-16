import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import "./assets/custom.css";
import router from "./router";
import store from "./store";
import vClickOutside from "click-outside-vue3";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import VueClipboard from "vue3-clipboard";
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
import VueLazyLoad from "vue3-lazyload";
import VueApexCharts from "vue3-apexcharts";
import {
  faFilter,
  faExternalLinkAlt,
  faSearch,
  faTimes,
  faTimesCircle,
  faQuestionCircle,
  faMoon,
  faSun,
  faSortUp,
  faSortDown,
  faCloudUploadAlt,
  faEllipsisV,
  faThumbsUp,
  faUndo,
  faShareAlt,
  faBars,
  faCalendarAlt,
  faCopy,
  faGlobe,
  faCog,
  faEdit,
  faBell,
  faUser,
  faPlay,
  faPause,
  faArrowLeft,
  faArrowRight,
  faArrowDown,
  faArrowUp,
  faTrashAlt,
  faCheckCircle,
  faSort,
  faPlus,
  faUpload,
  faThList,
  faSquare,
  faFlag,
  faLink,
  faCode,
  faClock,
  faAngleRight,
  faAngleLeft,
  faCartArrowDown,
  faAngleDown,
  faAngleUp,
  faDollarSign,
  faShieldAlt,
  faMinusCircle,
  faPlusCircle,
  faAngleDoubleLeft,
  faLayerGroup,
  faGavel,
  faTag,
  faInfoCircle,
  faExclamationTriangle,
  faStar,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faTelegramPlane,
  faDiscord,
  faTwitter,
  faMediumM,
  faInstagram,
  faEthereum,
} from "@fortawesome/free-brands-svg-icons";
import { faCopyright } from "@fortawesome/free-regular-svg-icons";
import "./assets/v-calendar.css";
import { vfmPlugin } from "vue-final-modal";

library.add(
  faFilter,
  faExternalLinkAlt,
  faSearch,
  faTimes,
  faTimesCircle,
  faQuestionCircle,
  faFacebookF,
  faTelegramPlane,
  faDiscord,
  faTwitter,
  faCopy,
  faGlobe,
  faCog,
  faMediumM,
  faMoon,
  faSun,
  faCopyright,
  faSortUp,
  faSortDown,
  faCloudUploadAlt,
  faEllipsisV,
  faThumbsUp,
  faUndo,
  faShareAlt,
  faBars,
  faCalendarAlt,
  faInstagram,
  faEdit,
  faBell,
  faUser,
  faPlay,
  faPause,
  faArrowLeft,
  faArrowRight,
  faArrowDown,
  faArrowUp,
  faTrashAlt,
  faCheckCircle,
  faCheck,
  faSort,
  faPlus,
  faUpload,
  faThList,
  faSquare,
  faFlag,
  faLink,
  faCode,
  faClock,
  faAngleRight,
  faAngleLeft,
  faEthereum,
  faCartArrowDown,
  faAngleDown,
  faAngleUp,
  faDollarSign,
  faShieldAlt,
  faMinusCircle,
  faPlusCircle,
  faAngleDoubleLeft,
  faLayerGroup,
  faGavel,
  faTag,
  faInfoCircle,
  faExclamationTriangle,
  faStar
);

const options = {
  position: "top-right",
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: "button",
  icon: true,
  rtl: false,
};

createApp(App)
  .use(store)
  .use(router)
  .use(vClickOutside)
  .use(VueClipboard, {
    autoSetContainer: true,
    appendToBody: true,
  })
  .use(vfmPlugin)
  .use(Toast, options)
  .use(VueLazyLoad)
  .use(VueApexCharts)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
