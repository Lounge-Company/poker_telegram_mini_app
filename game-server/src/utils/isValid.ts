export function isValidSeat(seatNumber: number): boolean {
  return seatNumber >= 0 && seatNumber <= 9
}
export function isValidName(name: string): boolean {
  return name.length >= 3 && name.length <= 20
}
