import ellxify from "~ellx-hub/lib/utils/svelte.js";
import Upload from "/components/Upload.svelte";
import App from "./App.svelte";
import "./headlong.css";

export const app = ellxify(App);
export const upload = ellxify(Upload);
