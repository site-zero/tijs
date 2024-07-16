import _ from 'lodash';
import { CssUtils, Match, Rects, Str, Util } from '../';
import {
  DockOptions,
  DomQueryContext,
  DomSelector,
  EleFilter,
  EleIteratee,
  EleOptions,
  ElePredicate,
  FontSizeCallback,
  FontSizeOptions,
  NameStrValue,
  Point2D,
  Predicate,
  Rect,
  SeekUtilOptions,
  Size2D,
  StrCaseMode,
  Vars,
  WindowTheme,
} from '../../_type';
import { ref } from 'vue';

/*-------------------------------------------

              重要方法

  -------------------------------------------*/
export function createElement(
  options: EleOptions,
  $doc = document
): HTMLElement {
  let {
    tagName = 'div',
    attrs,
    props,
    data,
    className,
    style = {},
    $p,
    $refer,
  } = options;
  const $el = $doc.createElement(tagName);
  if (className) {
    $el.className = CssUtils.joinClassNames(className);
  }

  setStyle($el, style);
  setAttrs($el, attrs);
  setData($el, data);

  _.forEach(props, (val, key) => {
    _.set($el, key, val);
  });

  if ($refer && $refer.parentElement && !$p) {
    $p = $refer.parentElement;
  }

  if ($p) {
    $p.insertBefore($el, $refer ?? null);
  }

  return $el;
}
//----------------------------------------------------
export function appendToHead($el: Element, $head = document.head) {
  if (_.isElement($el) && _.isElement($head)) {
    $head.appendChild($el);
  }
}
//----------------------------------------------------
export function appendToBody($el: Element, $body = document.body) {
  if (_.isElement($el) && _.isElement($body)) {
    $body.appendChild($el);
  }
}
//----------------------------------------------------
export function appendTo($el: Element, $p: Element) {
  if (_.isElement($el) && _.isElement($p)) {
    $p.appendChild($el);
  }
}
//----------------------------------------------------
export function prependTo($el: Element, $p: Element) {
  if ($p.firstChild) {
    $p.insertBefore($el, $p.firstChild);
  } else {
    $p.appendChild($el);
  }
}
//----------------------------------------------------
export function wrap($el: Element, $newEl: Element) {
  $el.insertAdjacentElement('afterend', $newEl);
  $newEl.appendChild($el);
}
//----------------------------------------------------
export function unwrap($el: Element) {
  let $p = $el.parentNode;
  if (!$p) {
    return $el;
  }
  let list = [];
  for (let i = 0; i < $el.childNodes.length; i++) {
    let $child = $el.childNodes[i];
    list.push($child);
  }
  for (let $child of list) {
    $p.insertBefore($child, $el);
  }
  remove($el);
}
//----------------------------------------------------
export function replace($el: Element, $newEl: Element, keepInnerHTML = false) {
  $el.insertAdjacentElement('afterend', $newEl);
  if (keepInnerHTML) {
    $newEl.innerHTML = $el.innerHTML;
  }
  remove($el);
  return $newEl;
}
//----------------------------------------------------
export type AttrPredicate = {
  (name: string, value?: string): boolean | string | NameStrValue;
};
export type AttrFilter =
  | string
  | AttrPredicate
  | boolean
  | RegExp
  | AttrFilter[];
export function attrFilter(filter: AttrFilter): AttrPredicate {
  // Selector
  if (_.isString(filter)) {
    if (filter.startsWith('^') && filter.endsWith('$')) {
      let reg = new RegExp(filter);
      return (key: string) => reg.test(key);
    }
    return (key) => filter === key;
  }

  // Function
  if (_.isFunction(filter)) {
    return filter;
  }

  // Boolean
  if (_.isBoolean(filter)) {
    return () => filter;
  }

  // RegExp
  if (_.isRegExp(filter)) {
    return (key) => filter.test(key);
  }

  // Array
  if (_.isArray(filter)) {
    let fltList = [] as any[];
    for (let t of filter) {
      fltList.push(attrFilter(t));
    }
    return (el) => {
      for (let te of fltList) {
        if (te(el)) {
          return true;
        }
      }
      return false;
    };
  }

  throw new Error('Unsupport attrFilter: ' + filter);
}
//----------------------------------------------------
export function attr($el: Element, name: string, dft?: any): any {
  if (!name || !_.isElement($el)) {
    return dft;
  }
  return $el.getAttribute(name) ?? dft;
}
//----------------------------------------------------
export function attrs($el: Element, flt: AttrFilter = true) {
  let filter = attrFilter(flt);
  let re = {} as Vars;
  for (let i = 0; i < $el.attributes.length; i++) {
    let { name, value } = $el.attributes[i];
    let fre = filter(name, value);
    let key: string | undefined;
    let val: any = value;
    // Just say yes
    if (_.isBoolean(fre)) {
      if (fre) {
        key = name;
      }
    } else if (_.isString(fre)) {
      key = fre;
    }
    // convert name and value
    else {
      val = fre.value;
      key = fre.name;
    }
    // say no ..
    if (!key) {
      continue;
    }
    // Auto convert "true/false"
    if ('true' == val) {
      val = true;
    } else if ('false' == val) {
      val = false;
    }
    // Set the value
    re[key] = val;
  }
  return re;
}
//----------------------------------------------------
export function getClassList(
  className: string | string[] | Element,
  { filter = () => true, dftList = [] } = {} as {
    filter: Predicate<string>;
    dftList: any[];
  }
) {
  if (!className) {
    return dftList;
  }
  if (_.isArray(className)) {
    if (className.length == 0) return dftList;
    return _.uniq(className);
  }

  let str: string;
  if (_.isString(className)) {
    str = className;
  } else {
    str = className.className;
  }
  let list = _.without(str.split(/\s+/), '');
  let re = [];
  for (let li of list) {
    if (filter(li)) {
      re.push(li);
    }
  }
  re = _.uniq(re);
  if (_.isEmpty(re)) {
    return dftList;
  }
  return re;
}
//----------------------------------------------------
export function getStyle($el: HTMLElement, flt: AttrFilter = true): Vars {
  let filter = attrFilter(flt);
  let re = {} as Vars;
  for (let i = 0; i < $el.style.length; i++) {
    let name = $el.style[i];
    let value = $el.style.getPropertyValue(name);
    let fre = filter(name, value);
    if (fre) {
      let key: string;
      if (_.isBoolean(fre)) {
        key = _.camelCase(name);
      } else if (_.isString(fre)) {
        key = fre;
      } else {
        key = fre.name;
      }
      let val = $el.style.getPropertyValue(key);
      re[key] = val;
    }
  }
  return re;
}
//----------------------------------------------------
export function getComputedStyle($el: Element, name: string | string[]) {
  let style = $el.ownerDocument.defaultView?.getComputedStyle($el, null);
  if (_.isString(name)) {
    return _.get(style, name);
  }
  if (!_.isEmpty(name)) {
    return _.pick(style, ...name);
  }
  return style;
}
//----------------------------------------------------
export function getOwnStyle($el: Element, filter = true) {
  if (_.isElement($el)) {
    return CssUtils.parseCssRule($el.getAttribute('style'), filter);
  }
}
//----------------------------------------------------
export function parseCssRule(rule = '', filter = true) {
  console.warn('!Deprecate call: parseCssRule -> Css.parseCssRule');
  return CssUtils.parseCssRule(rule, filter);
}
//----------------------------------------------------
export function renderCssRule(css = {}) {
  console.warn('!Deprecate call: renderCssRule -> Css.renderCssRule');
  return CssUtils.renderCssRule(css);
}
//----------------------------------------------------
export function removeAttrs($el: Element, flt = false) {
  let filter = attrFilter(flt);
  let re = {} as Vars;
  for (let i = 0; i < $el.attributes.length; i++) {
    let { name, value } = $el.attributes[i];
    let fre = filter(name, value);
    if (fre) {
      let key: string;
      if (_.isBoolean(fre)) {
        key = name;
      } else if (_.isString(fre)) {
        key = fre;
      }
      // convert name and value
      else {
        key = fre.name;
      }
      re[key] = value;
      $el.removeAttribute(name);
    }
  }
  return re;
}
//----------------------------------------------------
export function getData($el: Element, flt = true) {
  let filter = attrFilter(flt);
  let re = {} as Vars;
  for (let i = 0; i < $el.attributes.length; i++) {
    let { name, value } = $el.attributes[i];
    if (name.startsWith('data-')) {
      name = _.camelCase(name.substring(5));
      let key = filter(name, value);
      if (key) {
        // return : true
        if (_.isBoolean(key)) {
          re[name] = value;
        } else if (_.isString(key)) {
          re[key] = value;
        }
        // return : {name, value}
        else {
          re[key.name] = key.value;
        }
      }
    }
  }
  return re;
}
//----------------------------------------------------
export function setData($el: Element, data = {}) {
  _.forEach(data, (val, key) => {
    if (_.isNil(val)) {
      $el.removeAttribute(`data-${_.kebabCase(key)}`);
    } else {
      $el.setAttribute(`data-${_.kebabCase(key)}`, val);
    }
  });
}
//----------------------------------------------------
export function copyAttributes(
  $el: Element,
  $ta: Element,
  attrFilter: AttrPredicate = () => true
) {
  let attrs = $el.attributes;
  for (let i = 0; i < attrs.length; i++) {
    let { name, value } = attrs[i];
    if (!attrFilter(name, value)) {
      continue;
    }
    $ta.setAttribute(name, value);
  }
}
//----------------------------------------------------
export function renameElement(
  $el: Element,
  newTagName: string,
  attrFilter: AttrPredicate = () => true
) {
  if (!_.isString(newTagName)) return $el;
  newTagName = newTagName.toUpperCase();
  if ($el.tagName == newTagName) return $el;
  let $doc = $el.ownerDocument;
  let $ta = $doc.createElement(newTagName);
  copyAttributes($el, $ta, attrFilter);
  return replace($el, $ta, true);
}
//----------------------------------------------------
export function getHeadingLevel($h?: Element) {
  if ($h) {
    let m = /^H([1-6])$/.exec($h.tagName);
    if (m) {
      return parseInt(m[1]);
    }
  }
  return 0;
}
//----------------------------------------------------
export function getMyHeadingLevel($el: HTMLElement) {
  let $hp = seek(
    $el,
    (el) => {
      return /^H([1-6])$/.test(el.tagName);
    },
    (el): HTMLElement | undefined => {
      if (el.previousElementSibling) {
        return el.previousElementSibling as HTMLElement;
      }
      if (el.parentElement) {
        return el.parentElement;
      }
    }
  );
  return getHeadingLevel($hp);
}
//----------------------------------------------------
export function remove(
  selectorOrElement: DomSelector,
  context?: DomQueryContext
) {
  if (_.isString(selectorOrElement)) {
    let $els = findAll(selectorOrElement, context);
    for (let $el of $els) {
      remove($el);
    }
    return;
  }
  // remove single element
  if (_.isElement(selectorOrElement)) {
    let $p = selectorOrElement.parentNode;
    if ($p) {
      $p.removeChild(selectorOrElement);
    }
  }
}
//----------------------------------------------------
// self by :scope
export function findAll(selector = '*', qc?: DomQueryContext): Element[] {
  let $doc: Document | Element;
  if (!qc) {
    $doc = document;
  } else if (_.isElement(qc)) {
    $doc = qc;
  } else {
    $doc = qc as Document;
  }
  const $ndList = $doc.querySelectorAll(selector);
  let re = _.map($ndList, ($nd) => $nd as Element);
  return re;
}
//----------------------------------------------------
export function find(
  selector: DomSelector | undefined | null,
  qc?: DomQueryContext
): HTMLElement | undefined {
  let $doc = qc || document;
  if (_.isUndefined(selector)) {
    if (_.isElement($doc)) {
      return $doc as HTMLElement;
    }
    let d: Document = $doc as Document;
    return d.body;
  }

  if (_.isNull(selector)) {
    return;
  }

  if (_.isElement(selector)) {
    return selector as HTMLElement;
  }

  if (_.isString(selector)) {
    let re = $doc.querySelector(selector);
    if (re) {
      return re as HTMLElement;
    }
    return;
  }
}
//----------------------------------------------------
export function elementFilter<T extends Element>(
  test?: EleFilter<T>
): ElePredicate<T> {
  if (!test) {
    return () => false;
  }
  // Selector
  if (_.isString(test)) {
    if (test.startsWith('^') && test.endsWith('$')) {
      let reg = new RegExp(test);
      return (el) => reg.test(el.tagName);
    }
    return (el) => is(el, test);
  }

  // Element
  if (_.isElement(test)) {
    return (el) => test === el;
  }

  // Boolean
  if (_.isBoolean(test)) return () => test;

  // RegExp
  if (_.isRegExp(test)) return (el) => test.test(el.tagName);

  // Array
  if (_.isArray(test)) {
    let fltList = [] as ElePredicate<T>[];
    for (let t of test) {
      fltList.push(elementFilter(t));
    }
    return (el) => {
      for (let te of fltList) {
        if (te(el)) return true;
      }
      return false;
    };
  }

  // Function
  if (_.isFunction(test)) {
    return test;
  }

  throw 'Unsupport elementFilter: ' + test;
}
//----------------------------------------------------
export function seekUntil<T extends Element>(
  $el: T,
  flt?: EleFilter<T>,
  {
    by,
    iteratee = (el: T) => el,
    includeSelf = false,
    includeStop = true,
    reverse = false,
  } = {} as SeekUtilOptions<T>
) {
  if (!flt || !_.isFunction(by)) {
    return [$el];
  }
  // Default test
  if (_.isNil(flt)) {
    flt = $el.ownerDocument.documentElement;
  }
  // Normlize tester
  let filter = elementFilter(flt);

  let re = [];
  if (includeSelf) {
    re.push($el);
  }

  let $pel: T | undefined = $el;
  $pel = by($pel);
  while ($pel) {
    if (filter($pel)) {
      if (includeStop) {
        re.push($pel);
      }
      break;
    }
    let it = iteratee($pel);
    if (it) {
      if (_.isBoolean(it)) {
        re.push($pel);
      } else {
        re.push(it);
      }
    }
    $pel = by($pel);
  }
  if (reverse) {
    return re.reverse();
  }
  return re;
}
//----------------------------------------------------

export function seek<T extends Element>(
  $el: T,
  flt: EleFilter<T>,
  by: EleIteratee<T>
): T | undefined {
  if (!_.isFunction(by)) {
    return $el;
  }

  // Normlize tester
  let filter = elementFilter(flt);

  let $pel = $el;
  while ($pel) {
    if (filter($pel)) {
      return $pel;
    }
    let pe = by($pel);
    if (!pe) {
      return;
    }
    $pel = pe;
  }
  return;
}
//----------------------------------------------------
export function seekByTagName<T extends Element>(
  $el: T,
  tagName: string,
  by: EleIteratee<T>
) {
  if (!tagName || !_.isFunction(by)) {
    return;
  }

  let am = Match.parse(tagName);
  return seek(
    $el,
    (el) => {
      return am.test(el.tagName);
    },
    by
  );
}
//
// prev
//
export function prev<T extends Element>($el: T, filter: EleFilter<T>) {
  return seek($el, filter, (el) => el.previousElementSibling as T);
}
export function prevByTagName<T extends Element>($el: T, tagName: string) {
  return seekByTagName($el, tagName, (el) => el.previousElementSibling as T);
}
export function prevUtil<T extends Element>(
  $el: T,
  test?: EleFilter<T>,
  setup = {} as SeekUtilOptions<T>
) {
  return seekUntil($el, test, {
    ...setup,
    by: (el: T) => el.previousElementSibling as T,
  });
}
//
// next
//
export function next<T extends Element>($el: T, filter: EleFilter<T>) {
  return seek($el, filter, (el) => el.nextElementSibling as T);
}
export function nextByTagName($el: Element, tagName: string) {
  return seekByTagName($el, tagName, (el) => el.nextElementSibling as Element);
}
export function nextUtil<T extends Element>(
  $el: T,
  test?: EleFilter<T>,
  setup = {} as SeekUtilOptions<T>
) {
  return seekUntil($el, test, {
    ...setup,
    by: (el) => el.nextElementSibling as T,
  });
}
//
// Closest
//
export function closest<T extends Element>(
  $el: T,
  filter: EleFilter<T>,
  { includeSelf = false } = {}
): T | undefined {
  if (!_.isElement($el)) {
    return;
  }
  let $p: T | undefined;
  if (includeSelf) {
    $p = $el;
  } else if ($el.parentElement) {
    $p = $el.parentElement as unknown as T;
  }
  if (!$p) {
    return;
  }
  return seek($p, filter, (el) => {
    if (el.parentElement) {
      return el.parentElement as unknown as T;
    }
  });
}
export function closestByTagName<T extends Element>(
  $el: T,
  tagName: string,
  { includeSelf = false } = {}
) {
  if (!_.isElement($el)) {
    return;
  }
  let $p: T | undefined;
  if (includeSelf) {
    $p = $el;
  } else if ($el.parentElement) {
    $p = $el.parentElement as unknown as T;
  }
  if (!$p) {
    return;
  }
  return seekByTagName($p, tagName, (el) => {
    if (el.parentElement) {
      return el.parentElement as unknown as T;
    }
  });
}
export function parentsUntil<T extends Element>(
  $el: T,
  selector: DomSelector,
  setup = {} as SeekUtilOptions<T>
) {
  if (!_.isElement($el)) {
    return;
  }
  return seekUntil($el, selector, {
    ...setup,
    by: (el) => {
      if (el.parentElement) {
        return el.parentElement as unknown as T;
      }
    },
  });
}
//
// Event current target
//
export function eventCurrentTarget(
  evt: Event,
  selector?: DomSelector,
  scope?: Element
) {
  let $el: Element | null = evt.target as Element;
  if (!selector) {
    return $el;
  }
  if (_.isFunction(selector)) {
    return selector($el, scope, evt);
  }
  while ($el) {
    if ($el === scope) {
      return;
    }
    if (is($el, selector)) {
      return $el;
    }
    $el = $el.parentElement;
  }
}
//----------------------------------------------------
export function ownerWindow($el: Element | Document | Window) {
  if ($el instanceof Element) {
    return $el.ownerDocument.defaultView;
  }
  if ($el instanceof Document) {
    return $el.defaultView;
  }
  return $el;
}
//----------------------------------------------------
export function isTouchDevice() {
  let UA = window.navigator.userAgent || '';
  if (/^.+(\((ipad|iphone);|linux;\s*android).+$/i.test(UA)) {
    return true;
  }
  // For iPad 13
  if (/macintosh/i.test(UA) && window.navigator.maxTouchPoints > 1) {
    return true;
  }
  return false;
}
//----------------------------------------------------
export function autoRootFontSize(
  {
    $win = window,
    phoneMaxWidth = 540,
    tabletMaxWidth = 768,
    designWidth = 1000,
    max = 100,
    min = 80,
    callback,
  } = {} as FontSizeOptions
) {
  const $doc = $win.document;
  const $root = $doc.documentElement;
  const win_rect = Rects.createBy($win);
  let size = (win_rect.width / designWidth) * max;
  let fontSize = Math.min(Math.max(size, min), max);
  // apply the mark
  if (_.isFunction(callback)) {
    let mode =
      win_rect.width > tabletMaxWidth
        ? 'desktop'
        : win_rect.width > phoneMaxWidth
        ? 'tablet'
        : 'phone';

    callback({
      $win,
      $doc,
      $root,
      mode,
      fontSize,
      width: win_rect.width,
      height: win_rect.height,
    });
  }
}
//----------------------------------------------------
export function watchDocument(
  event: any,
  handler: { (this: any, ev: any): any }
) {
  document.addEventListener(event, handler);
}
//----------------------------------------------------
export function unwatchDocument(
  event: any,
  handler: { (this: any, ev: any): any }
) {
  document.removeEventListener(event, handler);
}
//----------------------------------------------------
export function watchAutoRootFontSize(
  setup = {} as FontSizeOptions | FontSizeCallback,
  callback: FontSizeCallback | Window,
  $win: Window = window
) {
  let opt: FontSizeOptions | undefined;
  if (_.isFunction(setup)) {
    $win = callback instanceof Window ? callback : window;
    callback = setup;
  } else {
    opt = setup;
  }
  let options: FontSizeOptions = _.assign({}, opt, { $win, callback });
  // Watch the window resizing
  $win.addEventListener('resize', () => {
    autoRootFontSize(options);
  });
  // auto resize firstly
  _.delay(() => {
    autoRootFontSize(options);
  }, 1);
}
//----------------------------------------------------
export function formatStyle(css = {} as Vars, caseMode: StrCaseMode): Vars {
  let reCss = {} as Vars;
  let keyFn = Str.getCaseFunc(caseMode);
  let keys = _.keys(css);
  for (let key of keys) {
    let val = css[key];
    if (keyFn) {
      key = keyFn(key);
    }
    if (/^(opacity|z-index|zIndex|order)$/.test(key)) {
      reCss[key] = val * 1;
    } else if (_.isNumber(val) || /^\d+(\.\d+)?$/.test(val)) {
      reCss[key] = `${val}px`;
    } else {
      reCss[key] = val;
    }
  }
  return reCss;
}
//----------------------------------------------------
export function setStyleValue(
  $el: HTMLElement,
  name: string,
  val: any,
  oldVal: any
) {
  if (!_.isUndefined(oldVal) && oldVal == val) return;
  if (!val || 'none' == val) {
    $el.style.removeProperty(name);
  } else if (_.isNumber(val) || /^\d+(\.\d+)?$/.test(val)) {
    $el.style.setProperty(name, `${val}px`);
  } else {
    $el.style.setProperty(name, val);
  }
}
//----------------------------------------------------
export function setStyle($el: HTMLElement, css = {}) {
  // Guard
  if (!$el) return;
  if (_.isEmpty(css)) {
    _.set($el, 'style', '');
    return;
  }
  let cssStyle = CssUtils.renderCssRule(css);
  _.set($el, 'style', cssStyle);
}
//----------------------------------------------------
export function updateStyle($el: HTMLElement, css = {}) {
  // Guard
  if (!$el) return;
  if (_.isEmpty(css)) {
    _.set($el, 'style', '');
    return;
  }
  _.forOwn(css, (val, key) => {
    if (_.isNull(val) || _.isUndefined(val)) return;
    let pnm = _.kebabCase(key);
    // Empty string to remove one propperty
    if ('' === val) {
      $el.style.removeProperty(pnm);
    }
    // Set the property
    else {
      // integer as the px
      let v2 =
        !/^(opacity|z-index)$/.test(pnm) && val !== 0 && _.isNumber(val)
          ? val + 'px'
          : val;
      $el.style.setProperty(pnm, v2);
    }
  });
}
//----------------------------------------------------
export function setAttrs(
  $el: HTMLElement,
  attrs = {} as Vars,
  prefix?: string
) {
  // Guard
  if (!$el || !_.isElement($el)) {
    return;
  }
  // Set attrs
  _.forEach(attrs, (val, key) => {
    let k2 = prefix ? prefix + key : key;
    let k3 = _.kebabCase(k2);

    // Style
    if ('style' == k3) {
      if (_.isNil(val)) {
        $el.removeAttribute('style');
      } else {
        let cssStyle = CssUtils.renderCssRule(val);
        _.set($el, 'style', cssStyle);
      }
    }
    // Other attribute
    else if (_.isUndefined(val)) {
      return;
    }
    // null to remove
    else if (_.isNull(val)) {
      $el.removeAttribute(k3);
    }
    // Save value
    else {
      // format val
      let v2 = val;
      if (_.isArray(val) || _.isPlainObject(val)) {
        v2 = JSON.stringify(val);
      }
      $el.setAttribute(k3, v2);
    }
  });
}
//----------------------------------------------------
export function setClass($el: Element, ...classNames: any[]) {
  let klass = _.flattenDeep(classNames);
  let className = klass.join(' ');
  $el.className = className;
}
//----------------------------------------------------
export function addClass($el: Element, ...classNames: any[]) {
  let klass = _.flattenDeep(classNames);
  let klassMap = {} as Vars;
  _.forEach($el.classList, (myClass) => {
    klassMap[myClass] = true;
  });
  for (let kl of klass) {
    let className = _.trim(kl);
    if (!klassMap[className]) {
      $el.classList.add(className);
    }
  }
}
//----------------------------------------------------
export function is($el: Element, selector: DomSelector) {
  // console.log("before is", $el.tagName, selector)
  if (selector instanceof Element) {
    return $el === selector;
  }
  if ($el.matches) {
    return $el.matches(selector);
  }
  throw 'Slot Element matched';
  // console.warn("slow is!")
  // let doc = $el.ownerDocument
  // let win = doc.defaultView
  // let sheet = doc.styleSheets[doc.styleSheets.length-1];
  // let magic = 918918351;
  // sheet.insertRule(`${selector} {z-index: ${magic} !important;}`, sheet.rules.length)
  // let style = win.getComputedStyle($el)
  // let re = (style.zIndex == magic)
  // sheet.removeRule(sheet.rules.length-1)
  // console.log("after is", $el.tagName, selector)
  // return re
}
//----------------------------------------------------
export function isBody($el: Element) {
  return $el.ownerDocument.body === $el;
}
//----------------------------------------------------
export function isEmpty($el: Element) {
  // Check Selft
  if (/^(IMG|VIDEO|AUDIO)$/.test($el.tagName)) {
    return false;
  }
  if (!Util.isBlank($el.textContent)) {
    // Check  self text
    return false;
  }
  // Check children
  let children = $el.children;
  if (children.length > 0) {
    for (let li of children) {
      if (!isEmpty(li)) {
        return false;
      }
    }
  }
  return true;
}
//----------------------------------------------------
export function removeClass($el: Element, ...classNames: any[]) {
  let klass = _.flattenDeep(classNames);
  for (let kl of klass) {
    let className = _.trim(kl);
    $el.classList.remove(className);
  }
}
//----------------------------------------------------
export function hasClass($el: Element, ...classNames: any[]) {
  if (!_.isElement($el)) {
    return false;
  }
  for (let klass of classNames) {
    if (!$el.classList.contains(klass)) return false;
  }
  return true;
}
//----------------------------------------------------
export function hasOneClass($el: Element, ...classNames: any[]) {
  if (!_.isElement($el)) {
    return false;
  }
  for (let klass of classNames) {
    if ($el.classList.contains(klass)) return true;
  }
  return false;
}
//----------------------------------------------------
export function applyRect(
  $el: HTMLElement,
  rect: Rect,
  keys = 'tlwh',
  viewport?: Size2D
) {
  let $win = $el.ownerDocument.defaultView;
  if (!$win) {
    throw new Error('impossible!');
  }
  _.defaults(viewport, {
    width: $win.innerWidth,
    height: $win.innerHeight,
  });
  let css = rect.toCss(keys, viewport);
  updateStyle($el, css);
}
//----------------------------------------------------
export type DockPosX = 'left' | 'center' | 'right';
export type DockPosY = 'top' | 'center' | 'bottom';
export interface DomDockOptions extends DockOptions {
  posListX?: DockPosX[]; // ["left"| "center"| "right"]
  posListY?: DockPosY[]; // ["top"| "center"| "bottom"]
  coord?: 'win' | 'target';
  position?: 'fixed' | 'absolute';
}

export function dockTo(
  $src: HTMLElement,
  $ta: HTMLElement,
  {
    mode = 'H',
    axis = {},
    posListX, // ["left", "center", "right"]
    posListY, // ["top", "center", "bottom"]
    space,
    coord = 'win', // win | target
    viewportBorder = 4,
    position,
  } = {} as DomDockOptions
) {
  // Guard
  if (!_.isElement($src) || !_.isElement($ta)) {
    return;
  }
  //console.log("dockTo", $src)
  // Force position
  if (position) {
    $src.style.position = position;
  }
  // Compute the real position style
  //console.log(mode, axis, space, position)

  if (!$src.ownerDocument.defaultView) {
    throw new Error('why element window is null');
  }

  // Get the rect
  let rect = {
    src: Rects.createBy($src),
    ta: Rects.createBy($ta),
    win: Rects.createBy($src.ownerDocument.defaultView),
  };
  // console.log("dockSrc",rect.src.width, rect.src+"")
  // console.log("dockTag",rect.ta.width, rect.ta+"")

  // prepare [W, 2W]
  function getAxis<E>(n: number, w: number, list: E[]): E {
    if (n <= w) {
      return list[0];
    }
    if (n > w && n <= 2 * w) {
      return list[1];
    }
    return list[2];
  }

  // Auto axis
  _.defaults(axis, { x: 'auto', y: 'auto' });
  if ('auto' == axis.x) {
    let list =
      posListX ||
      ({
        H: ['left', 'right'],
        V: ['right', 'left'],
      }[mode] as DockPosX[]);
    axis.x = getAxis(rect.ta.x, rect.win.width / list.length, list);
  }
  if ('auto' == axis.y) {
    let list =
      posListY ||
      ({
        H: ['bottom', 'top'],
        V: ['top', 'center', 'bottom'],
      }[mode] as DockPosY[]);
    axis.y = getAxis(rect.ta.y, rect.win.height / list.length, list);
  }

  // Count the max viewport to wrapCut
  // Cut the droplist panel by target positon
  let viewport: Rect = rect.win.clone();
  if ('H' == mode && 'win' == coord) {
    if (axis.y == 'bottom') {
      viewport.top = rect.ta.bottom;
    } else if (axis.y == 'top') {
      viewport.bottom = rect.ta.top;
    }
    viewport.updateBy('tlbr');
  }

  // Dock & Apply
  let dockMode = rect.src.dockTo(rect.ta, {
    mode,
    axis,
    space,
    viewport,
    viewportBorder,
    wrapCut: true,
  });
  //console.log({ dockMode })

  // Translate coord
  if ('target' == coord) {
    rect.src.translate({
      x: rect.ta.left * -1,
      y: rect.ta.top * -1,
    });
  }
  // If absolute, it should considering the window scrollTop
  else {
    let realStyle = window.getComputedStyle($src);
    //console.log(realStyle.position, window.pageYOffset)
    if ('absolute' == realStyle.position && window.pageYOffset > 0) {
      rect.src.top += window.scrollY;
      rect.src.update();
    }
  }

  //console.log("do DockTo", dockedRect+"")
  _.delay(() => {
    applyRect($src, rect.src, dockMode);
  }, 0);

  return {
    axis,
    dockMode,
    srcRect: rect.src,
    targetRect: rect.ta,
    viewport,
  };
}
//----------------------------------------------------
export function getRemBase($doc = document) {
  if (_.isElement($doc) && $doc.ownerDocument) {
    $doc = $doc.ownerDocument;
  }
  let fontSize = $doc.documentElement.style.fontSize || '100px';
  return CssUtils.toAbsPixel(fontSize);
}
//----------------------------------------------------
/*
  Regiest this method to "scroll" event handler
  Each time it be call, it will return a value (0-1), to indicate
  how many percent the more expost in view port

  +---------------------+
  |                     |
  |                     |
  |                     |
  |  +---------------+  |  <- 
  |  |               |  |  Percent
  +---------------------+
     |               |
     +---------------+
  */
export function pendingMoreWhenScrolling(
  { $view, $more } = {} as {
    $view: Element;
    $more: Element;
  }
) {
  if (!_.isElement($view) || !_.isElement($more)) {
    return;
  }
  // Get the more position
  let view = Rects.createBy($view);
  let vwBottom = view.bottom;

  let more = Rects.createBy($more);
  let mrTop = more.top;
  let mrBottom = more.bottom;
  let bottom = Math.min(vwBottom, mrBottom);
  let h = Math.max(bottom - mrTop, 0);
  let rev = h / more.height;
  //console.log(rev, {vwBottom, mrTop, mrBottom})
  return rev;
}
//----------------------------------------------------
export function getFromClipBoard(
  clipboardData: any,
  filter: {
    (it: any, i: number): any;
  }
) {
  let items = clipboardData && clipboardData.items;
  if (_.isEmpty(items)) {
    return;
  }
  for (let i = 0; i < items.length; i++) {
    let it = items[i];
    let re = filter(it, i);
    if (re) {
      return re;
    }
  }
}
//----------------------------------------------------
export function getImageDataFromClipBoard(clipboardData: any) {
  return getFromClipBoard(clipboardData, (it) => {
    if (it && /^image\//.test(it.type)) {
      return it.getAsFile();
    }
  });
}
//----------------------------------------------------
export async function loadImageRawData(
  url: string,
  { asBase64 = true, dataUrlPrefix } = {} as {
    asBase64: boolean;
    dataUrlPrefix?: string;
  },
  $doc = document
) {
  const __make_data = function (img: HTMLImageElement) {
    let canvas = createElement({ tagName: 'canvas' }) as HTMLCanvasElement;
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Fail to create Canvas2D from load Image!!!');
    }
    ctx.drawImage(img, 0, 0, img.width, img.height);
    try {
      if (asBase64) {
        if (!dataUrlPrefix) {
          let suffixName = Util.getSuffixName(url, true);
          dataUrlPrefix = `image/${{ jpg: 'jpeg' }[suffixName] || suffixName}`;
        }
        return {
          width: img.width,
          height: img.height,
          data: canvas.toDataURL(dataUrlPrefix),
        };
      }
      return ctx.getImageData(0, 0, img.width, img.height);
    } finally {
      remove(canvas);
    }
  };
  // Make image object
  let $img = find(`img[src="${url}"]`, $doc);
  if (!$img) {
    let $new_img = createElement({
      tagName: 'img',
      $p: $doc.body,
    }) as HTMLImageElement;
    return new Promise((resolve) => {
      $new_img.addEventListener('load', function (evt) {
        let imgData = __make_data(evt.target as HTMLImageElement);
        resolve(imgData);
      });
      $new_img.src = url;
    });
  }
  // Reuse image
  return __make_data($img as HTMLImageElement);
}
//----------------------------------------------------
/**
 * Retrive Current window scrollbar size
 */
var SCROLL_BAR_SIZE: undefined | Point2D;
export function scrollBarSize() {
  if (!SCROLL_BAR_SIZE) {
    let body = document.body;
    let $out = createElement({
      tagName: 'div',
      style: {
        position: 'fixed',
        top: '-1000px',
        left: 0,
        width: '200px',
        height: '200px',
        overflowY: 'scroll',
        overflowX: 'scroll',
      },
      $p: body,
    });
    let $in = createElement({
      tagName: 'div',
      style: {
        width: '100%',
        height: '100%',
        overflowY: 'scroll',
        overflowX: 'scroll',
      },
      $refer: $out,
    });

    let outRect = $out.getBoundingClientRect();
    let inRect = $in.getBoundingClientRect();
    SCROLL_BAR_SIZE = {
      x: outRect.width - inRect.width,
      y: outRect.height - inRect.height,
    };

    remove($out);
    remove($in);
  }
  return SCROLL_BAR_SIZE;
}
//----------------------------------------------------
export function scrollIntoView(
  $view: HTMLElement,
  $row: HTMLElement,
  {
    to = 'auto', // top | bottom | center | auto
    axis = 'xy', // x | y | xy
  } = {} as {
    to: 'top' | 'bottom' | 'center' | 'auto';
    axis: 'x' | 'y' | 'xy';
  }
) {
  if (!_.isElement($view) || !_.isElement($row)) {
    return;
  }
  let r_view = Rects.createBy($view);
  let r_row = Rects.createBy($row);
  //let scrollTop = $view.scrollTop;

  let testFn = {
    xy: () => r_view.contains(r_row),
    x: () => r_view.containsX(r_row),
    y: () => r_view.containsY(r_row),
  }[axis];

  let toMode: 'top' | 'bottom' | 'center';
  if ('auto' == to) {
    // at bottom
    if (r_row.bottom > r_view.bottom) {
      toMode = 'bottom';
    }
    // at top
    else {
      toMode = 'top';
    }
  } else {
    toMode = to;
  }

  // test it need to scroll or not

  if (!testFn()) {
    // inMiddle
    let offset = {
      center: (): number => {
        return r_row.y - r_view.bottom + r_view.height / 2;
      },
      top: (): number => {
        return r_row.top - r_view.top;
      },
      bottom: (): number => {
        return r_row.bottom - r_view.bottom + r_view.height / 2;
      },
    }[toMode];

    let off = offset();
    $view.scrollTop += off;
  }
}
//----------------------------------------------------
export function getWindowTheme(): WindowTheme {
  if (window.matchMedia) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  return 'light';
}
//----------------------------------------------------
export function getDocumentTheme(doc = document): WindowTheme {
  let rootClass = doc.documentElement.getAttribute('class');
  if ('light' == rootClass || 'dark' == rootClass) {
    return rootClass;
  }
  // 自动跟随系统的设置
  return getWindowTheme();
}

//----------------------------------------------------
export const RootThemeClass = ref<WindowTheme>('light');
const _root_theme_observer = new MutationObserver((mutationsList) => {
  for (var mutation of mutationsList) {
    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
      let html = mutation.target as HTMLElement;
      console.log('<html> 标签的 class 属性发生变化:', html.className);
      RootThemeClass.value = getDocumentTheme(html.ownerDocument);
    }
  }
});
export function watchDocumentTheme(doc = document) {
  _root_theme_observer.observe(doc.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
}
watchDocumentTheme();
//----------------------------------------------------

export * from './web-dom-html';
