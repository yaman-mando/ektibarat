import type layoutJson from '~/main/constants/json/layout.json';
import type homeJson from '~/main/constants/json/home.json';
import type conditionJson from '~/main/constants/json/conditions.json';
import type aboutUsJson from '~/main/constants/json/aboutus.json';
import type kudratJson from '~/main/constants/json/kudrat.json';
import type tahselJson from '~/main/constants/json/tahsel.json';
import type contactUsJson from '~/main/constants/json/contact-us.json';
import type localesJson from '~/main/constants/json/locales.json';
import type staticJson from '~/main/constants/json/static.json';
import type partnerShipConditionsJson from '~/main/constants/json/partnership-conditions.json';
import type partnerShipJson from '~/main/constants/json/partnerships.json';

export type LayoutStaticDataModel = typeof layoutJson;
export type HomeJsonDataModel = typeof homeJson;
export type ConditionJsonDataModel = typeof conditionJson;
export type AboutUsJsonDataModel = typeof aboutUsJson;
export type ContactUsJsonDataModel = typeof contactUsJson & {
  [key: string]: string | null;
};
export type KudratJsonDataModel = typeof kudratJson;
export type TahselJsonDataModel = typeof tahselJson & {
  [key: string]: string;
};
export type LocalesJsonDataModel = typeof localesJson;
export type StaticJsonDataModel = typeof staticJson;
export type PartnerShipConditionsJsonDataModel =
  typeof partnerShipConditionsJson;
export type PartnerShipJsonDataModel = typeof partnerShipJson;
