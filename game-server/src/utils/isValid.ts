export function isValidSeat(seatNumber: number): boolean {
  return seatNumber >= 1 && seatNumber <= 10
}
export function isValidName(name: string): boolean {
  return name.length >= 3 && name.length <= 20
}
