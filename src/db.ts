import { openDB, IDBPDatabase } from "idb";

// IndexedDB persistence for edgitor.
//
// Two object stores:
//   - "graphs": the serialized graph JSON, keyed by the same key that used to
//     be the localStorage key (the `?f=` url, or "edgitor-graph" by default).
//   - "images": uploaded image Blobs, keyed by a uuid. The graph only stores a
//     lightweight `idb://<uuid>` reference (see imageStore.ts); the heavy Blob
//     lives here and is turned into an object URL at runtime.
const DB_NAME = "edgitor";
const DB_VERSION = 1;
const GRAPH_STORE = "graphs";
const IMAGE_STORE = "images";

let dbPromise: Promise<IDBPDatabase> | null = null;

const getDb = (): Promise<IDBPDatabase> => {
  if (dbPromise === null) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(GRAPH_STORE)) {
          db.createObjectStore(GRAPH_STORE);
        }
        if (!db.objectStoreNames.contains(IMAGE_STORE)) {
          db.createObjectStore(IMAGE_STORE);
        }
      },
    });
  }
  return dbPromise;
};

// --- Graphs ---------------------------------------------------------------

export const getGraph = async (key: string): Promise<string | undefined> => {
  return (await getDb()).get(GRAPH_STORE, key);
};

export const putGraph = async (key: string, value: string): Promise<void> => {
  await (await getDb()).put(GRAPH_STORE, value, key);
};

export const removeGraph = async (key: string): Promise<void> => {
  await (await getDb()).delete(GRAPH_STORE, key);
};

// Every stored graph's JSON. Used by image GC to find which image Blobs are
// still referenced by *some* graph before deleting orphans.
export const getAllGraphs = async (): Promise<string[]> => {
  return (await getDb()).getAll(GRAPH_STORE) as Promise<string[]>;
};

// --- Images ---------------------------------------------------------------

export const getImage = async (id: string): Promise<Blob | undefined> => {
  return (await getDb()).get(IMAGE_STORE, id);
};

export const putImage = async (id: string, blob: Blob): Promise<void> => {
  await (await getDb()).put(IMAGE_STORE, blob, id);
};

export const removeImage = async (id: string): Promise<void> => {
  await (await getDb()).delete(IMAGE_STORE, id);
};

export const getAllImageIds = async (): Promise<string[]> => {
  return (await getDb()).getAllKeys(IMAGE_STORE) as Promise<string[]>;
};
