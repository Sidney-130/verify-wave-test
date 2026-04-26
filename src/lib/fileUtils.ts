export const IMAGE_TYPES = ["image/jpeg", "image/png"];
export const VIDEO_TYPES = ["video/mp4", "video/quicktime"];
export const ACCEPTED = [...IMAGE_TYPES, ...VIDEO_TYPES];

export function validate(f: File): string | null {
  if (!ACCEPTED.includes(f.type)) return "Unsupported format. Use MP4, MOV, JPG or PNG.";
  if (IMAGE_TYPES.includes(f.type) && f.size > 5 * 1024 * 1024) return "Images must be under 5MB.";
  if (VIDEO_TYPES.includes(f.type) && f.size > 20 * 1024 * 1024) return "Videos must be under 20MB.";
  return null;
}

export function generateThumbnail(file: File): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 80;
    canvas.height = 80;
    const ctx = canvas.getContext("2d")!;
    const url = URL.createObjectURL(file);

    if (file.type.startsWith("image/")) {
      const img = new Image();
      img.onload = () => {
        const size = Math.min(img.width, img.height);
        ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, 80, 80);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(""); };
      img.src = url;
    } else {
      const video = document.createElement("video");
      video.onloadeddata = () => { video.currentTime = 0; };
      video.onseeked = () => {
        const size = Math.min(video.videoWidth, video.videoHeight);
        ctx.drawImage(video, (video.videoWidth - size) / 2, (video.videoHeight - size) / 2, size, size, 0, 0, 80, 80);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      video.onerror = () => { URL.revokeObjectURL(url); resolve(""); };
      video.src = url;
      video.load();
    }
  });
}
