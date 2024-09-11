import { Ref } from 'vue';

export type DropFileOptions = {
  target: Ref<HTMLElement | null>;
  enter?: (el: HTMLElement, src: HTMLElement) => void;
  leave?: (el: HTMLElement, src: HTMLElement) => void;
  drop?: (files?: FileList) => void;
};

export function useDropping(options: DropFileOptions) {
  let { enter, leave, drop } = options;
  let dropZone = options.target?.value;

  function onEnter(e: Event) {
    e.stopPropagation();
    e.preventDefault();

    if (enter && dropZone) {
      enter(dropZone, e.target as HTMLElement);
    }
  }

  function onLeave(e: Event) {
    e.stopPropagation();
    e.preventDefault();

    if (leave && dropZone) {
      leave(dropZone, e.target as HTMLElement);
    }
  }

  function onDrop(e: DragEvent) {
    e.stopPropagation();
    e.preventDefault();

    if (drop && dropZone) {
      const dt = e.dataTransfer;
      const files = dt?.files;
      drop(files);
    }
  }

  return () => {
    if (dropZone) {
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
        dropZone.addEventListener('drop', onDrop);
      }
    }
  };
}
