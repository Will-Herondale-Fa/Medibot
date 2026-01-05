export function generateRoom() {
  return 'rural-' + Math.random().toString(36).slice(2, 10);
}

export function getRoomUrl(room: string) {
  return `https://meet.jit.si/${room}`;
}
