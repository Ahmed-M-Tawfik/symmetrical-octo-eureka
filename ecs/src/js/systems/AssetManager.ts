// AssetManager: Centralized loading and management of image (and optionally sound) assets

export type AssetDescriptor = { id: string; src: string };

export class AssetManager {
  private static images: Map<string, HTMLImageElement> = new Map();
  // Optionally, add sound support in the future
  // private static sounds: Map<string, HTMLAudioElement> = new Map();

  /**
   * Preload all images. Returns a promise that resolves when all are loaded.
   */
  static async preloadImages(imageList: AssetDescriptor[]): Promise<void> {
    const promises = imageList.map(({ id, src }) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          AssetManager.images.set(id, img);
          resolve();
        };
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
      });
    });
    await Promise.all(promises);
  }

  /**
   * Retrieve a preloaded image by id. Throws if not found.
   */
  static getImage(id: string): HTMLImageElement {
    const img = AssetManager.images.get(id);
    if (!img) throw new Error(`Image asset '${id}' not loaded`);
    return img;
  }

  /**
   * Optionally, add similar methods for sounds in the future.
   */
}
