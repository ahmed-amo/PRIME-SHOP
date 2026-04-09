export function getAvatarUrl(picture?: string | null): string | null {
  if (!picture) {
    return null;
  }

  if (picture.startsWith("http")) {
    return picture;
  }

  // Backward-compat: if backend still sends a relative path, fall back to storage route.
  return `/storage/${picture.replace(/^storage\//, "")}`;
}

