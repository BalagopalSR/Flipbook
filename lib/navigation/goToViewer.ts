/** Hard navigation — reliable after large flipbook saves (client router can stall). */
export function goToViewer(flipbookId: string): void {
  window.location.assign(`/viewer/${flipbookId}`);
}
