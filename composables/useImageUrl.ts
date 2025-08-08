import type { UserInfoDataModel } from '~/core/auth/data-access/models/auth.model';
import {
  ImagesFolderName,
  LIBRARY_TYPE_FOLDER_LIST,
} from '~/main/constants/images-folder-name';

export const useImageUrl = () => {
  const config = useRuntimeConfig();
  const { data } = useAuth();
  const userData = computed(() => data.value as UserInfoDataModel);
  const baseImageUrl = config.public.baseImageUrl;

  const getUrl = (
    imageFolderName: string | null,
    path: string | null,
    size: string | number | null = null,
    ext: string | null = null,
    byGender:boolean = false
  ): string | undefined => {
    if (!imageFolderName) return undefined;
    if (!path) {
      if(byGender){
        if (userData?.value.sex === 0) return '/images/png/person.png'
        return '/images/png/female.png'
      }
      return '/images/place-holder.webp';
    }
      
      

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
