import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner' 

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({onNoteCreated}: NewNoteCardProps){
  const [shouldShowOnBoarding, setShouldShowOnBoarding] = useState(true)
  const [content, setContent] = useState('')
  const [isRecording, setIsRecording] = useState(false)

  function handleStartEditor(){
    setShouldShowOnBoarding(false)
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>){
    setContent(event.target.value)

    if(event.target.value === ''){
      setShouldShowOnBoarding(true)
    }
  }

  function handleSaveNote(event: FormEvent<HTMLButtonElement>){
    event.preventDefault()

    if(content === '')
      return

    onNoteCreated(content)

    setContent('')
    setShouldShowOnBoarding(true)

    toast.success('Nota criada com sucesso!')
  }

  function handleStartRecording(){
    const isSpeechRecognitionAPIAvalable = 'SpeechRecognition' in window
    || 'webkitSpeechRecognition' in window

    if(!isSpeechRecognitionAPIAvalable){
      alert('Infelizmente seu navegador não suporta a API de gravação')
      return
    }

    setIsRecording(true)
    setShouldShowOnBoarding(false)

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
    speechRecognition = new SpeechRecognitionAPI()
    // speechRecognition.lang = navigator.language
    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true // continuar gravando até que o usuario peça para parar
    speechRecognition.maxAlternatives = 1 // retorna apenas uma palavra (evita de retornar várias palavras quando há dúvida)
    speechRecognition.interimResults = true // retorna resultados enquanto o usuario ainda está falando

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')

      setContent(transcription)
    }

    speechRecognition.onerror = (event) => {
      console.error(event)
    }

    speechRecognition.start()
  }

  function handleStopRecording(){
    setIsRecording(false)
    if(speechRecognition !== null)
      speechRecognition.stop()
    
  }


    return(
      <Dialog.Root>
        <Dialog.Trigger className='rounded-md text-left flex flex-col bg-slate-700 p-5 gap-3 outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
          <span className='text-sm font-medium text-slate-200'>
            Adicionar nota
          </span>
          <p className='text-sm leading-6 text-slate-400'>
            Grave uma nota em áudio que será convertida para texto automaticamente.
          </p>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 bg-black/50' />
          <Dialog.Content className='fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 flex flex-col outline-none md:rounded-md'>

              <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400'>
                  <X className='size-5'/>
              </Dialog.Close>

              <form className='flex-1 flex flex-col'>
                <div className='flex flex-1 flex-col gap-3 p-5'>
                    <span className='text-sm font-medium text-slate-300'>
                      Adicionar nota
                    </span>

                    {shouldShowOnBoarding ? (
                      <p className='text-sm leading-6 text-slate-400'>
                    Comece <button type="button" onClick={handleStartRecording} className='text-lime-400 hover:underline'>gravando uma nota</button> em áudio ou se preferir <button type="button" onClick={handleStartEditor} className='text-lime-400 hover:underline'>utilize apenas texto</button>.
                      </p>
                    ) : (
                      <textarea
                        autoFocus
                        className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none'
                        onChange={handleContentChanged}
                        value={content}
                      />
                    )}
                </div>

                {isRecording ? (
                  <button
                    type='button'
                    onClick={handleStopRecording}
                    className='w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-semibold hover:text-slate-100'
                  >
                    <div className='size-3 rounded-full bg-red-500 animate-pulse' />
                    Gravando! (Clique p/ interromper)
                  </button>
                ) : (
                  <button
                    type='button'
                    onClick={handleSaveNote}
                    className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-semibold hover:bg-lime-500'
                  >
                    Salvar nota
                  </button>
                )}
              </form>
              
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    )
}