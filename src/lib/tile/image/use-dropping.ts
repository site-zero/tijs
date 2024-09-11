import { Ref } from 'vue';

export type DropFileOptions = {
  target: () => HTMLElement | null;
  enter?: (el: HTMLElement, src: HTMLElement) => void;
  leave?: (el: HTMLElement, src: HTMLElement) => void;
  drop?: (files?: FileList) => void;
};

export function useDropping(options: DropFileOptions) {
  let { enter, leave, drop } = options;
  let dropZone = options.target();

  function preventDefaults(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }

  function onEnter(e: Event) {
    if (enter && dropZone) {
      enter(dropZone, e.target as HTMLElement);
    }
  }

  function onLeave(e: Event) {
    if (leave && dropZone) {
      leave(dropZone, e.target as HTMLElement);
    }
  }

  function onDrop(e: DragEvent) {
    if (drop && dropZone) {
      const dt = e.dataTransfer;
      const files = dt?.files;
      drop(files);
    }
    onLeave(e);
  }

  return () => {
    if (dropZone) {
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(
        (eventName: string) => {
          dropZone.removeEventListener(eventName, preventDefaults);
          dropZone.addEventListener(eventName, preventDefaults);
        }
      );

      dropZone.removeEventListener('dragenter', onEnter);
      if (enter) {
        dropZone.addEventListener('dragenter', onEnter);
      }

      dropZone.removeEventListener('dragleave', onLeave);
      if (leave) {
        dropZone.addEventListener('dragleave', onLeave);
      }

      dropZone.removeEventListener('drop', onDrop);
      if (drop) {
        console.log('listen drop');
        dropZone.addEventListener('drop', onDrop);
      }
    }
  };
}
