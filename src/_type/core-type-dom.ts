export function isElement(input: any): input is Element {
  if (!input) {
    return false;
  }
  // Node.js 环境中没有 Element 对象
  if (typeof Element === 'undefined') {
    return false;
  }
  return input instanceof Element;
}

export function isHTMLElement(input: any): input is HTMLElement {
  if (!input) {
    return false;
  }
  // Node.js 环境中没有 HTMLElement 对象
  if (typeof HTMLElement === 'undefined') {
    return false;
  }
  return input instanceof HTMLElement;
}

export function isDocument(input: any): input is Document {
  if (!input) {
    return false;
  }
  // Node.js 环境中没有 Document 对象
  if (typeof Document === 'undefined') {
    return false;
  }
  return input instanceof Document;
}

export function isWindow(input: any): input is Window {
  if (!input) {
    return false;
  }
  // Node.js 环境中没有 Window 对象
  if (typeof Window === 'undefined') {
    return false;
  }
  return input instanceof Window;
}
