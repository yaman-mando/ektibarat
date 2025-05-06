export class SocialPlanCommon {
  static getFileUrl(fileName) {
    return `${process.env.socialPlansBaseUrl}/${fileName}`;
  }
}
