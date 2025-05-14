import {
  ImagesFolderName,
  LIBRARY_TYPE_FOLDER_LIST,
} from '~/main/constants/images-folder-name';

export const useImageUrl = () => {
  const config = useRuntimeConfig();
  const baseImageUrl = config.public.baseImageUrl;

  const getUrl = (
    imageFolderName: string | null,
    path: string | null,
    size: string | number | null = null,
    ext: string | null = null
  ): string | null => {
    if (!imageFolderName) return null;
    if (!path) return '/images/place-holder.webp';

    const folder = ImagesFolderName[imageFolderName];

    if (size && ext) {
      return `${baseImageUrl}/${folder}/${path}-${size}.${ext}`;
    } else {
      return `${baseImageUrl}/${folder}/${path}`;
    }
  };

  const staticImageUrl = (fileName: string) => {
    return `${baseImageUrl}/staticContent/image/${fileName}`;
  };

  const getImageUrl = (path, imageFolderName, size, type = 'jpg') => {
    if (type && size !== undefined) {
      if (LIBRARY_TYPE_FOLDER_LIST.some((val) => val == imageFolderName)) {
        return `${baseImageUrl}/${ImagesFolderName[imageFolderName]}/${path}`;
      }
      return `${baseImageUrl}/${ImagesFolderName[imageFolderName]}/${path}-${size}.${type}`;
    }
    if (LIBRARY_TYPE_FOLDER_LIST.some((val) => val == imageFolderName)) {
      return `${baseImageUrl}/${ImagesFolderName[imageFolderName]}/${path}`;
    }
    return `${baseImageUrl}/${ImagesFolderName[imageFolderName]}/${path}.${type}`;
  };

  return {
    getUrl,
    staticImageUrl,
    getImageUrl,
  };
};
