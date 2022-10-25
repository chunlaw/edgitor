import { Metadata, Point } from "./data/type";

export const median = (values: number[]) => {
  if (values.length === 0) return 0;

  values.sort(function (a, b) {
    return a - b;
  });

  var half = Math.floor(values.length / 2);

  if (values.length % 2) return values[half];

  return (values[half - 1] + values[half]) / 2.0;
};

export const makeId = (length: number): string => {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const isPWA = (): boolean => {
  return (
    // @ts-ignore
    window.navigator?.standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches
  );
};

export const isMobilOrTablet = (): boolean => {
  return window.matchMedia("(pointer:coarse)").matches;
};

export const isIOS = (): boolean => {
  return (
    [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
};

export const getDistance = (a: Point, b: Point): number => {
  return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
};

export const flatten = (data: any): Metadata => {
  var result = {} as Metadata;
  function recurse(cur: any, prop: string) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for (var i = 0, l = cur.length; i < l; i++)
        recurse(cur[i], prop + "[" + i + "]");
      if (l === 0) result[prop] = [];
    } else {
      var isEmpty = true;
      for (var p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? prop + "." + p : p);
      }
      if (isEmpty && prop) result[prop] = {};
    }
  }
  recurse(data, "");
  return result;
};

export const unflatten = (data: any): Metadata => {
  if (Object(data) !== data || Array.isArray(data)) return data;
  var regex = /\.?([^.[\]]+)|\[(\d+)\]/g,
    resultholder = {} as { [label: string]: any };
  for (var p in data) {
    var cur = resultholder,
      prop = "",
      m;
    for (m = regex.exec(p); m; m = regex.exec(p)) {
      cur = cur[prop] || (cur[prop] = m[2] ? [] : {});
      prop = m[2] || m[1];
    }
    cur[prop] = data[p];
  }
  return resultholder[""] || resultholder;
};
