export function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label = 'Operation'
): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => {
      reject(
        new Error(
          `${label} timed out after ${Math.round(ms / 1000)}s (HF/Pinecone may be slow or stuck).`
        )
      )
    }, ms)
    promise
      .then((v) => {
        clearTimeout(t)
        resolve(v)
      })
      .catch((e) => {
        clearTimeout(t)
        reject(e)
      })
  })
}
