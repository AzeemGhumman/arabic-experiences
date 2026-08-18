export type AudioClipMeta = {
  src: string
  arabic: string
}

export type AudioPackManifest = {
  clips: Record<string, AudioClipMeta>
}

export type AudioManifest = {
  version: number
  voice: string
  register: "msa"
  generatedAt?: string
  packs: Record<string, AudioPackManifest>
}
