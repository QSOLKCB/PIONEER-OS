// SPDX-License-Identifier: Apache-2.0
// A deterministic, deliberately self-referential citation graph for satire.
// This audits graph structure only; it cannot verify truth or real independence.

const MIN_SOURCES = 1;
const MAX_SOURCES = 8;
export function normalizeSourceCount(value: number): number {
  if (!Number.isFinite(value)) return MIN_SOURCES;
  return Math.min(MAX_SOURCES, Math.max(MIN_SOURCES, Math.trunc(value)));
}

export function citationTarget(source: number, count: number): number {
  const total=normalizeSourceCount(count);
  if (!Number.isInteger(source) || source<1 || source>total) {
    throw new RangeError('Citation source outside current graph');
  }
  return source===total?1:source+1;
}

/** The path includes its first repeated vertex only once, at the end. */
export function isCitationLoopClosed(path: readonly number[]): boolean {
  const seen=new Set<number>();
  for(let i=0;i<path.length;i++){
    if(seen.has(path[i])) return i===path.length-1;
    seen.add(path[i]);
  }
  return false;
}

export function advanceCitation(path: readonly number[], count: number): number[] {
  const total=normalizeSourceCount(count);
  if (path.length===0) throw new RangeError('Cannot trace an empty path');
  if (path.length>total+1) throw new RangeError('Path exceeds graph bound');
  const seen=new Set<number>();
  for (let i=0;i<path.length;i++){
    citationTarget(path[i],total); // validate each source
    if(i>0 && citationTarget(path[i-1],total)!==path[i])
      throw new RangeError('Path contains a non-citation hop');
    if(seen.has(path[i]) && i!==path.length-1)
      throw new RangeError('Cycle continued after the first repeated source');
    seen.add(path[i]);
  }
  if(isCitationLoopClosed(path)) return [...path];
  if(path.length>=total+1) throw new RangeError('Path exceeds graph bound');
  return [...path,citationTarget(path[path.length-1],total)];
}

export function auditCitationLoop(start: number, count: number): number[] {
  const total=normalizeSourceCount(count);
  citationTarget(start,total);
  let path=[start];
  for(let hops=0;hops<total;hops++){
    path=advanceCitation(path,total);
    if(isCitationLoopClosed(path)) return path;
  }
  throw new Error('Citation graph did not close within its size bound');
}
