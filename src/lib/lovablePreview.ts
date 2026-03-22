export const isLovablePreview = () => {
  if (typeof window === "undefined") return false;

  let embeddedPreview = false;

  try {
    embeddedPreview = window.self !== window.top;
  } catch {
    embeddedPreview = true;
  }

  return window.location.hostname.startsWith("id-preview--") || embeddedPreview;
};

export const openAppOutsidePreview = () => {
  if (typeof window === "undefined") return false;

  const newWindow = window.open(window.location.href, "_blank", "noopener,noreferrer");
  return Boolean(newWindow);
};