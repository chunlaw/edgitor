// Helpers for the image reference scheme used inside a graph.
//
// A graph never stores raw base64 or an ephemeral `blob:` object URL (those
// die when the tab closes). Instead it stores a stable, durable reference of
// the form `idb://<uuid>`. The actual Blob lives in IndexedDB (see db.ts),
// and AppContext turns each reference into a live object URL at runtime.

const PREFIX = "idb://";

export const isImageRef = (value?: string | null): value is string =>
  typeof value === "string" && value.startsWith(PREFIX);

export const refToId = (ref: string): string => ref.slice(PREFIX.length);

export const idToRef = (id: string): string => `${PREFIX}${id}`;

export const newImageRef = (): { id: string; ref: string } => {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return { id, ref: idToRef(id) };
};

// A value we can persist directly as an <image href> / CSS url(): an external
// URL (http/https), or a legacy base64 data URL. `idb://` refs are NOT this —
// they must be resolved to an object URL first.
export const isRenderableUrl = (value?: string | null): boolean =>
  typeof value === "string" && value.length > 0 && !isImageRef(value);

// --- Blob <-> data URL (used for portable export / import) ----------------

export const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

export const dataUrlToBlob = (dataUrl: string): Blob => {
  const [header, base64] = dataUrl.split(",");
  const mimeMatch = header.match(/data:([^;]+)/);
  const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
};

export const isDataUrl = (value?: string | null): value is string =>
  typeof value === "string" && value.startsWith("data:");
