export class SocialPlanCommon {
  static getFileUrl(fileName) {
    // eslint-disable-next-line no-restricted-properties
    return `${process.env.socialPlansBaseUrl}/${fileName}`;
  }
}
