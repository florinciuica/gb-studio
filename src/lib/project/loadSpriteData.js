import glob from "glob";
import { promisify } from "util";
import uuidv4 from "uuid/v4";
import sizeOf from "image-size";
import { spriteTypeFromNumFrames } from "../helpers/gbstudio";

const FRAME_SIZE = 16;

const globAsync = promisify(glob);
const sizeOfAsync = promisify(sizeOf);

const loadSpriteData = async filename => {
  const size = await sizeOfAsync(filename);
  const numFrames = size.width / FRAME_SIZE;
  const relativePath = filename.replace(/.*assets\/sprites\//, "");
  return {
    id: uuidv4(),
    name: relativePath.replace(".png", ""),
    numFrames,
    type: spriteTypeFromNumFrames(numFrames),
    filename: relativePath,
    _v: Date.now()
  };
};

const loadAllSpriteData = async projectRoot => {
  const spritePaths = await globAsync(`${projectRoot}/assets/sprites/**/*.png`);
  const spriteData = await Promise.all(spritePaths.map(loadSpriteData));
  return spriteData;
};

export default loadAllSpriteData;
export { loadSpriteData };
