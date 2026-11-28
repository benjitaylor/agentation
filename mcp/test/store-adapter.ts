// Route tests use a disposable SQLite database, never ~/.agentation/store.db.
import { createSQLiteStore } from "../src/server/sqlite";
if (!process.env.AGENTATION_TEST_DB_PATH) throw new Error("Missing disposable test database path");
const store = createSQLiteStore(process.env.AGENTATION_TEST_DB_PATH);
export const createSession = store.createSession.bind(store);
export const getSession = store.getSession.bind(store);
export const getSessionWithAnnotations = store.getSessionWithAnnotations.bind(store);
export const addAnnotation = store.addAnnotation.bind(store);
export const updateAnnotation = store.updateAnnotation.bind(store);
export const getAnnotation = store.getAnnotation.bind(store);
export const deleteAnnotation = store.deleteAnnotation.bind(store);
export const listSessions = store.listSessions.bind(store);
export const getPendingAnnotations = store.getPendingAnnotations.bind(store);
export const addThreadMessage = store.addThreadMessage.bind(store);
export const getEventsSince = store.getEventsSince.bind(store);
export const getStore = () => store;
export const getStoreKind = () => "sqlite" as const;
