import { ImagesFolderName } from '~/shared/constants/images-folder-name';

export const useImageUrl = () => {
  const config = useRuntimeConfig();

  const getUrl = (
    imageFolderName: string | null,
    path: string | null,
    size: string | number | null = null,
    ext: string | null = null
  ): string | null => {
    if (!imageFolderName) return null;
    if (!path) return '/images/place-holder.webp';

    const folder = ImagesFolderName[imageFolderName];
    const base = config.public.baseImageUrl;

    if (size && ext) {
      return `${base}/${folder}/${path}-${size}.${ext}`;
    } else {
      return `${base}/${folder}/${path}`;
    }
  };

  const staticImageUrl = (fileName: string) => {
    return `${config.public.baseImageUrl}/staticContent/image/${fileName}`;
  };

  return {
    getUrl,
    staticImageUrl,
  };
};
