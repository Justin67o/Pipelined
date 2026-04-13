export function matchScoreColor(score: number): { backgroundColor: string; color: string } {
  if (score >= 80) return { backgroundColor: '#142108', color: '#74b34e' }
  if (score >= 60) return { backgroundColor: '#2a1f08', color: '#c49a3c' }
  return { backgroundColor: '#2c1010', color: '#d46b6b' }
}
