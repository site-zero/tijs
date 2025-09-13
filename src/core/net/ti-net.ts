const debug = false;

function toAbsoluteURL(url: string) {
  let a = document.createElement("a");
  a.setAttribute("href", url);
  let a2 = a.cloneNode(false) as HTMLAnchorElement;
  return a2.href;
}

export function importESModule(url: string) {
  return new Promise((resolve, reject) => {
    const vector = "$importModule$" + Math.random().toString(32).slice(2);
    const script = document.createElement("script") as any;
    const destructor = () => {
      if (window) {
        delete (window as any)[vector];
      }
      script.onerror = null;
      script.onload = null;
      script.remove();
      URL.revokeObjectURL(script.src);
      script.src = "";
    };
    script.defer = "defer";
    script.type = "module";
    // For QQBrowser: if send /a/load/xxx, it will drop the cookie
    // to cause session losted.
    // add the "crossOrigin" will force send the cookie
    script.crossOrigin = "use-credentials";
    script.onerror = () => {
      reject(new Error(`Failed to import: ${url}`));
      destructor();
    };
    script.onload = () => {
      resolve((window as any)[vector]);
      destructor();
    };
    const absURL = toAbsoluteURL(url);
    const loader = `import * as m from "${absURL}"; window.${vector} = m;`;
    const blob = new Blob([loader], { type: "text/javascript" });
    script.src = URL.createObjectURL(blob);

    document.head.appendChild(script);
  });
}

export async function loadESModule(url: string) {
  // window.mjsII = window.mjsII || []
  // window.mjsII.push(url)
  // TBS browser don't suppor the import() yet by default
  //return import(url).then(m => m.default)
  // use the polyfill method instead
  try {
    // TODO: QQBrowser will drop cookie when import the module js
    // I need auto-dected the browser type to decide in runtime
    // for use the polyfill-dynamic-import or native one
    let UA = window.navigator.userAgent || "";
    if (UA.indexOf("QQBrowser") > 0) {
      //console.log("QQBrowser dynamic importModule:", url)
      return await importESModule(/* @vite-ignore */ url);
    }
    return await import(/* @vite-ignore */ url);
  } catch (E) {
    if (debug) console.log("ti.load.mjs", url, E);
    throw E;
  }
}
