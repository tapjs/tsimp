let didOnExitPrint = false

type Sample = {
  name: string
  count: number
  mean: number
  total: number
}

const samples: Record<string, Sample> = Object.create(null)

const doProfile = process.env.TSIMP_PROFILE === '1'

const startTimer = (name: string) => {
  if (!didOnExitPrint) {
    didOnExitPrint = true
    process.on('beforeExit', () =>
      console.error(
        Object.values(samples).sort(
          ({ total: a }, { total: b }) => b - a
        )
      )
    )
  }
  const start = performance.now()
  return () => {
    const end = performance.now()
    const dur = end - start
    const existing = samples[name]
    if (!existing) {
      samples[name] = {
        name,
        count: 1,
        mean: dur,
        total: dur,
      }
    } else {
      const count = existing.count + 1
      const mean = dur / count + (existing.mean * (count - 1)) / count
      const total = dur + existing.total
      samples[name] = {
        name,
        count,
        mean,
        total,
      }
    }
  }
}

export const start = doProfile ? startTimer : (_: string) => () => {}
