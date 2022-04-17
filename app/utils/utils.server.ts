import sharp from "sharp";

export const resizeImageFile = async (file: string) => {
  const buf = file.split("base64,").pop() || "";
  var buf2 = Buffer.from(buf, "base64");

  const bufferized = await sharp(buf2).resize(320, 320).toBuffer();

  const resizedThumbnail = `data:image/jpeg;base64,${bufferized.toString(
    "base64"
  )}`;

  return resizedThumbnail;
};
