const configuredBase = import.meta.env.BASE_URL.replace(/\/+$/, '');

export function withBase(path: string): string {
  if (!path || path.startsWith('#') || path.startsWith('//') || /^[a-z][a-z\d+.-]*:/i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (!configuredBase) return normalizedPath;
  if (normalizedPath === configuredBase || normalizedPath.startsWith(`${configuredBase}/`)) {
    return normalizedPath;
  }

  return `${configuredBase}${normalizedPath}`;
}
