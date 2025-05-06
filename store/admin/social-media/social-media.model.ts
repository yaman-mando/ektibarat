type SocialMediaDtoDataModel = {
  triggerTime: string;
  categoryId: number;
  questionId: number | null;
  lawId: number | null;
  banksIds: number[];
  repeatInterval: number;
  isActive: boolean;
  socialTypes: number[];
  mediaTypes: number[] | null; //single value only or null for static;
  staticDescription: string | null; //required media type static
  staticMediaUrl: string | null; //required media type static
  isLawToday: boolean;
};

//detail
type SocialMediaDetailDataModel = { id: number } & SocialMediaDtoDataModel;

//list
type SocialMediaListItemDataModel = SocialMediaDetailDataModel & {
  categoryTitle: string;
  lawTitle: string;
  questionTitle: string;
  questionGuid: string | null;
  lawPicture: string | null;
};

//assign question
type SocialMediaAssignQuestionDTODataModel = {
  planId: number;
  questionId: number;
};

//assign law
type SocialMediaAssignLawDTODataModel = {
  planId: number;
  lawId: number;
};
