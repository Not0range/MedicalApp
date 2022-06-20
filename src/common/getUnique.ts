export default function GetUnuquie<T>(a: T[]) : T[] {
  const b: T[] = [];
  for (let i of a)
    if (!b.includes(i))
      b.push(i);
  return b;
}