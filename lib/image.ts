export async function readImageAsDataUrl(
  file: File,
  maxSize = 1200
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("请上传图片文件");
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("图片请小于 8MB");
  }

  const raw = await file.arrayBuffer();
  const blob = new Blob([raw], { type: file.type });
  const bitmap = await createImageBitmap(blob);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("无法处理图片");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.78);
}
