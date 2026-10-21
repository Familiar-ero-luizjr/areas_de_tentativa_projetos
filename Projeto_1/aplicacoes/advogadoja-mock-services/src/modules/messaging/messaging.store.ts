import type { MockNotification } from "./messaging.types"; const history:MockNotification[]=[]; export const messagingStore={history,clear:()=>history.splice(0)};
