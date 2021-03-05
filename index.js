import ellxify from "~ellx-hub/lib/utils/svelte.js";
import Upload from "/components/Upload.svelte";
import App from "./App.svelte";
import "./headlong.css";
export { DataFrame } from 'data-forge@1.8.17/dist/esm/index.esm.js';

export const app = ellxify(App);
export const upload = ellxify(Upload);
