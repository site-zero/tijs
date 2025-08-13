export type DropFileOptions = {
  target: () => HTMLElement | null;
  enter?: (el: HTMLElement, src: HTMLElement) => void;
  over?: (el: HTMLElement, src: HTMLElement) => void;
  leave?: (el: HTMLElement, src: HTMLElement) => void;
  drop?: (files?: FileList) => void;
};

export function useDropping(options: DropFileOptions) {
  let { enter, leave, over, drop } = options;
  let _drop_target = options.target();
  let _body_watched = false;

  function preventDefaults(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }

  function depose() {
    if (_drop_target && _drop_target.ownerDocument) {
      _drop_target.ownerDocument.body.removeEventListener(
        "dragover",
        onDragOver
      );
      _drop_target.ownerDocument.body.removeEventListener(
        "pointerup",
        onPointerUp
      );
      _drop_target.ownerDocument.removeEventListener(
        "mouseleave",
        onMouseLeaveDocument
      );
      _body_watched = false;
    }
  }

  function onEnter(e: Event) {
    preventDefaults(e);
    if (enter && _drop_target) {
      if (!_body_watched && _drop_target.ownerDocument) {
        _drop_target.ownerDocument.body.addEventListener(
          "dragover",
          onDragOver
        );
        _drop_target.ownerDocument.body.addEventListener(
          "pointerup",
          onPointerUp
        );
        _body_watched = true;
        _drop_target.ownerDocument.addEventListener(
          "mouseleave",
          onMouseLeaveDocument
        );
      }
      enter(_drop_target, e.target as HTMLElement);
    }
  }

  function onMouseLeaveDocument(e: Event) {
    if (leave && _drop_target) {
      leave(_drop_target, e.target as HTMLElement);
    }
    depose();
  }

  function onDrop(e: DragEvent) {
    preventDefaults(e);
    depose();
    if (drop && _drop_target) {
      const dt = e.dataTransfer;
      const files = dt?.files;
      drop(files);
    }
    if (_drop_target && leave) {
      leave(_drop_target, e.target as HTMLElement);
    }
  }

  function onDragOver(e: MouseEvent) {
    if (_drop_target) {
      //console.log("onDragOver", e.pageX, e.pageY);
      // 还在上面
      if (_drop_target.contains(e.target as HTMLElement)) {
        if (over) {
          over(_drop_target, e.target as HTMLElement);
        }
      }
      // 已经离开了
      else {
        if (leave) {
          leave(_drop_target, e.target as HTMLElement);
        }
      }
    }
  }

  function onPointerUp(e: MouseEvent) {
    preventDefaults(e);
    depose();
    if (_drop_target && leave) {
      leave(_drop_target, e.target as HTMLElement);
    }
  }

  return () => {
    _drop_target = options.target();
    if (_drop_target) {
      ["dragenter", "dragover", "drop"].forEach((eventName: string) => {
        _drop_target!.removeEventListener(eventName, preventDefaults);
        _drop_target!.addEventListener(eventName, preventDefaults);
      });

      _drop_target.removeEventListener("dragenter", onEnter);
      _drop_target.addEventListener("dragenter", onEnter);

      _drop_target.removeEventListener("drop", onDrop);
      _drop_target.addEventListener("drop", onDrop);
    }
  };
}
