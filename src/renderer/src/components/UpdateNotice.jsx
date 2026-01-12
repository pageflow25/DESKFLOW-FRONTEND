import { useEffect, useMemo, useState } from 'react'

const initialState = {
  status: 'idle',
  info: null,
  progress: null,
  error: null,
  disabledReason: null,
  dismissed: false
}

const getNotesText = (releaseNotes) => {
  if (!releaseNotes) return null
  if (typeof releaseNotes === 'string') return releaseNotes
  if (Array.isArray(releaseNotes)) {
    const note = releaseNotes.find((item) => typeof item === 'string' || item?.note)
    if (!note) return null
    return typeof note === 'string' ? note : note.note
  }
  return null
}

function UpdateNotice() {
  const [state, setState] = useState(initialState)

  useEffect(() => {
    const updates = window.api?.updates
    if (!updates) return undefined

    const offChecking = updates.on('updates:checking', () => {
      setState((current) => ({ ...current, status: 'checking', error: null, dismissed: false }))
    })

    const offAvailable = updates.on('updates:available', (info) => {
      setState({
        status: 'available',
        info,
        progress: null,
        error: null,
        disabledReason: null,
        dismissed: false
      })
    })

    const offNotAvailable = updates.on('updates:not-available', () => setState(initialState))

    const offProgress = updates.on('updates:download-progress', (progress) => {
      setState((current) => ({
        ...current,
        status: 'downloading',
        progress,
        dismissed: false,
        error: null
      }))
    })

    const offDownloaded = updates.on('updates:downloaded', (info) => {
      setState({
        status: 'ready',
        info,
        progress: null,
        error: null,
        disabledReason: null,
        dismissed: false
      })
    })

    const offError = updates.on('updates:error', (payload) => {
      setState((current) => ({
        ...current,
        status: 'error',
        error: payload?.message ?? 'Erro ao atualizar a aplicação',
        dismissed: false
      }))
    })

    const offDisabled = updates.on('updates:disabled', (payload) => {
      setState({
        status: 'disabled',
        info: null,
        progress: null,
        error: null,
        disabledReason: payload?.reason ?? 'disabled',
        dismissed: false
      })
    })

    updates.checkNow().catch(() => undefined)

    return () => [
      offChecking,
      offAvailable,
      offNotAvailable,
      offProgress,
      offDownloaded,
      offError,
      offDisabled
    ].forEach((off) => off?.())
  }, [])

  const releaseNotes = useMemo(() => getNotesText(state.info?.releaseNotes), [state.info])

  const handleDownload = () => {
    window.api?.updates?.startDownload()
  }

  const handleInstall = () => {
    window.api?.updates?.quitAndInstall()
  }

  const handleRetry = () => {
    setState((current) => ({ ...current, status: 'checking', error: null, dismissed: false }))
    window.api?.updates?.checkNow()
  }

  const handleDismiss = () => {
    setState((current) => ({ ...current, dismissed: true }))
  }

  const percent = Math.round(state.progress?.percent ?? 0)

  const isVisible = () => {
    if (state.dismissed) return false
    if (state.status === 'available') return true
    if (state.status === 'downloading') return true
    if (state.status === 'ready') return true
    if (state.status === 'error') return true
    return false
  }

  if (!isVisible()) return null

  const renderBody = () => {
    if (state.status === 'available') {
      return (
        <>
          <p className="text-sm font-semibold text-slate-900">Nova versão disponível</p>
          <p className="text-sm text-slate-700">
            Versão {state.info?.version ?? 'desconhecida'} pronta para download.
          </p>
          {releaseNotes ? <p className="text-xs text-slate-500">{releaseNotes}</p> : null}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className="rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-slate-800"
              onClick={handleDownload}
            >
              Atualizar agora
            </button>
            <button
              type="button"
              className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              onClick={handleDismiss}
            >
              Depois
            </button>
          </div>
        </>
      )
    }

    if (state.status === 'downloading') {
      return (
        <>
          <p className="text-sm font-semibold text-slate-900">Baixando atualização</p>
          <div className="mt-2 w-full rounded-md border border-slate-200 p-2">
            <div className="h-2 w-full overflow-hidden rounded bg-slate-100">
              <div
                className="h-2 bg-slate-900"
                style={{ width: `${Math.min(percent, 100)}%`, transition: 'width 120ms linear' }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-600">{percent}%</p>
          </div>
        </>
      )
    }

    if (state.status === 'ready') {
      return (
        <>
          <p className="text-sm font-semibold text-slate-900">Atualização pronta</p>
          <p className="text-sm text-slate-700">
            Reinicie para aplicar a versão {state.info?.version ?? ''}.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className="rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-slate-800"
              onClick={handleInstall}
            >
              Reiniciar agora
            </button>
            <button
              type="button"
              className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              onClick={handleDismiss}
            >
              Depois
            </button>
          </div>
        </>
      )
    }

    return (
      <>
        <p className="text-sm font-semibold text-slate-900">Falha na atualização</p>
        <p className="text-sm text-slate-700">{state.error ?? 'Não foi possível atualizar.'}</p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            className="rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-slate-800"
            onClick={handleRetry}
          >
            Tentar novamente
          </button>
          <button
            type="button"
            className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            onClick={handleDismiss}
          >
            Fechar
          </button>
        </div>
      </>
    )
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 w-full max-w-md rounded-xl border border-slate-200 bg-white p-4 shadow-xl ring-1 ring-black/5">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-900 text-xs font-semibold uppercase text-white">
          Upd
        </div>
        <div className="flex-1 space-y-2 text-left text-slate-800">{renderBody()}</div>
      </div>
    </div>
  )
}

export default UpdateNotice
