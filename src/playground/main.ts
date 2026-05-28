import { installTev3I18n } from "@/locales";
import { createApp } from "vue";
// import "../style.css";
import "../styles/index.scss";
import App from "./App.vue";

const app = createApp(App);
installTev3I18n(app);
app.mount("#app");
