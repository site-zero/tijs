export type DropFileOptions = {
  target: () => HTMLElement | null;
  enter?: (el: HTMLElement, src: HTMLElement) => void;
  over?: (el: HTMLElement, src: HTMLElement) => void;
  leave?: (el: HTMLElement, src: HTMLElement) => void;
  drop?: (files?: FileList) => void;
};

export function useDropping(options: DropFileOptions) {
  let { enter, leave, over, drop } = options;
  let dropZone = options.target();
  let body_watched = false;

  function preventDefaults(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }

  function depose() {
    if (dropZone) {
      dropZone.ownerDocument?.body.removeEventListener('dragover', onDragOver);
      dropZone.ownerDocument?.body.removeEventListener(
        'pointerup',
        onPointerUp
      );
    }
  }

  function onEnter(e: Event) {
    preventDefaults(e);
    if (enter && dropZone) {
      if (!body_watched) {
        dropZone.ownerDocument?.body.addEventListener('dragover', onDragOver);
        dropZone.ownerDocument?.body.addEventListener('pointerup', onPointerUp);
        body_watched = true;
      }
      enter(dropZone, e.target as HTMLElement);
    }
  }

  function onDrop(e: DragEvent) {
    preventDefaults(e);
    depose();
    if (drop && dropZone) {
      const dt = e.dataTransfer;
      const files = dt?.files;
      drop(files);
    }
    if (dropZone && leave) {
      leave(dropZone, e.target as HTMLElement);
    }
  }

  function onDragOver(e: MouseEvent) {
    if (dropZone) {
      // 还在上面
      if (dropZone.contains(e.target as HTMLElement)) {
        if (over) {
          over(dropZone, e.target as HTMLElement);
        }
      }
      // 已经离开了
      else {
        if (leave) {
          leave(dropZone, e.target as HTMLElement);
        }
      }
    }
  }

  function onPointerUp(e: MouseEvent) {
    preventDefaults(e);
    depose();
    if (dropZone && leave) {
      leave(dropZone, e.target as HTMLElement);
    }
  }

  return () => {
    if (dropZone) {
      ['dragenter', 'dragover', 'drop'].forEach((eventName: string) => {
        dropZone.removeEventListener(eventName, preventDefaults);
        dropZone.addEventListener(eventName, preventDefaults);
      });

      dropZone.removeEventListener('dragenter', onEnter);
      dropZone.addEventListener('dragenter', onEnter);

      dropZone.removeEventListener('drop', onDrop);
      dropZone.addEventListener('drop', onDrop);
    }
  };
}
