import { isEmpty, get } from "lodash";

export const isTauri = async () => {
  return (
    !isEmpty(get(window, "__TAURI_INTERNALS__")) &&
    !isEmpty(get(window, "__TAURI_INTERNALS__", "ipc")) &&
    !isEmpty(get(window, "__TAURI_INTERNALS__", "invoke")) &&
    !isEmpty(get(window, "__TAURI_INTERNALS__", "postMessage"))
  );
};
