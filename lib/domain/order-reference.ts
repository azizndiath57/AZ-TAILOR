export function formatOrderReference(year: number, sequence: number): string {
  // Format: CMD-YYYY-0001
  const paddedSequence = sequence.toString().padStart(4, "0");
  return `CMD-${year}-${paddedSequence}`;
}
