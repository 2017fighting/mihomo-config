export function direct() {
  return "DIRECT" as const;
}
export function reject() {
  return "REJECT" as const;
}
export function rejectDrop() {
  return "REJECT-DROP" as const;
}
export function compatible() {
  return "COMPATIBLE" as const;
}
export function pass() {
  return "PASS" as const;
}
