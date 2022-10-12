import { DocumentSnapshot, QuerySnapshot, Timestamp } from 'firebase/firestore';
import { DocumentSnapshot as AdminDocumentSnapshot, QuerySnapshot as AdminQuerySnapshot } from 'firebase-admin/firestore';

// date to Firebase Timestamp
export function toFbTimestamp(date: Date) {
  Timestamp.fromDate(date);
}

function parseDocument<T>(document: DocumentSnapshot<T> | AdminDocumentSnapshot<T>) {
  const data: any = { id: document.id, ...document.data() };

  // convert timestamp to Date object
  for (let key of Object.keys(data)) {
    const value = data[key];
    if (value?.toDate) data[key] = value.toDate();
  }

  return data;
}

/**
 * Firebase document to object data with document id
 * @param document - DocumentSnapshot | AdminDocumentSnapshot - can be use with both client document or Admin document
 * @returns DocumentSnapshot
 */
export function docToObj<T>(document: DocumentSnapshot<T> | AdminDocumentSnapshot<T>): T | null {
  if (!document.exists) return null;

  return parseDocument(document);
}

/**
 * Firebase document to object data with document id
 * @param query - QuerySnapshot | AdminQuerySnapshot - can be use with both client document or Admin document
 * @returns T[]
 */
export function queryToObjs<T>(query: QuerySnapshot<T> | AdminQuerySnapshot<T>): T[] {
  if (query.empty) return [];

  return query.docs.map((document) => {
    return parseDocument(document);
  });
}

/**
 * Firebase document to object data with document id
 * @param query - QuerySnapshot | AdminQuerySnapshot - can be use with both client document or Admin document
 * @returns T | null
 */
export function querySingleToObj<T>(query: QuerySnapshot<T> | AdminQuerySnapshot<T>): T | null {
  if (query.empty) return null;

  return { id: query.docs[0]?.id, ...query.docs[0]?.data() };
}
