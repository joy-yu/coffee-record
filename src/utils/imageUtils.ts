/**
 * 将图片文件压缩并转为 base64 字符串
 * 目标：单张 ≤ 300KB
 */
export function compressImageToBase64(file: File, maxWidth = 1200, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);

        const base64 = canvas.toDataURL('image/jpeg', quality);

        // 粗估 base64 大小；若仍超 300KB 则再降质量
        const approxBytes = (base64.length * 3) / 4;
        if (approxBytes > 300 * 1024) {
          resolve(canvas.toDataURL('image/jpeg', 0.5));
        } else {
          resolve(base64);
        }
      };
      img.onerror = reject;
      img.src = e.target!.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
