export function getAvatarUrl(picture?: string | null): string | null {
  if (!picture) {
    return null;
  }

  if (picture.startsWith("http")) {
    return picture;
  }

  return `/storage/${picture.replace(/^storage\//, "")}`;
}

