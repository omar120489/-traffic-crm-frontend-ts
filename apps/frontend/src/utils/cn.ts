// Utility for conditional className composition
export const cn = (...args: (string | false | null | undefined)[]): string => 
  args.filter(Boolean).join(" ");

