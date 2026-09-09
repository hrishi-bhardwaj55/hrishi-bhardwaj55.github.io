export type SqlValue = number | null;
export function compareAntiJoins(values: number[], excluded: SqlValue[]) {
  const notIn = values.filter(value => !excluded.includes(value) && !excluded.includes(null));
  const notExists = values.filter(value => !excluded.some(other => other !== null && value === other));
  return { notIn, notExists, matches: JSON.stringify(notIn) === JSON.stringify(notExists) };
}
