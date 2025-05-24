<template>
  <client-only>
    <div
      v-if="file1Static && !!appAuth.user"
      class="relative"
    >
      <app-overlay
        v-if="analyticsLoading"
        msg="جاري تحميل البيانات ..."
      />
      <lazy-vee-validate-provider>
        <template v-if="isSubsPage">
          <lazy-web-subs-ad />
        </template>
        <div
          v-if="ads && ads.length > 0 && !hideAds"
          class="rw-ads"
        >
          <template
            v-for="ad of ads"
            :key="ad"
          >
            <img
              v-if="ad"
              :alt="ad"
              :src="getFileUrl(pictureTypes.jsonFiles, fileTypes.photo, ad)"
            />
          </template>
          <app-button
            size="sm"
            label="إخفاء"
            @click="hideAds = true"
          />
        </div>
        <div
          v-if="failPayment && activeList === userPanelItems.subscriptionList"
          class="fail-payment"
        >
          <span class="c-title">
            <i class="fa fa-info-circle"></i>
            <span>فشلت عملية الدفع</span>
          </span>
          <span class="c-msg">
            .حدثت مشكلة في عملية الدفع ولم تكتمل بنجاح، تأكد من معلومات البطاقة
            وأعد المحاولة مرة أخرى
          </span>
        </div>
        <client-only>
          <div
            v-if="!isHideSocialPart && windowSize.isMobileSize"
            class="!my-5 !px-4"
          >
            <lazy-web-social-box />
          </div>
        </client-only>
        <div
          class="user-panel"
          :class="{
            isExam: [userPanelItems.exams, userPanelItems.trainings].includes(
              activeList
            ),
          }"
        >
          <div class="rw-user-panel">
            <div
              v-if="!windowSize.isMobileSize"
              class="rw-panel hide-to-tablet"
            >
              <div class="img-group relative">
                <app-overlay v-if="isUpload" />
                <img
                  :src="
                    imageUrlService.getUrl(
                      ImagesFolderName.Users,
                      profileInfo.pictureUrl,
                      ImageSize.original,
                      ImageExt.jpg
                    )
                  "
                  alt=""
                  @click="
                    profileInfo.pictureUrl ? openCropEdit() : fileRef?.click()
                  "
                />
                <div
                  v-if="!isUpload"
                  class="c-btn"
                >
                  <input
                    ref="file_ref"
                    hidden
                    type="file"
                    accept="image/*"
                    @input="uploadPhoto"
                  />
                  <div
                    class="change-image"
                    @click="fileRef?.click()"
                  >
                    <i class="fa fa-camera"></i>
                    <span v-if="profileInfo.pictureUrl">تغيير الصورة</span>
                    <span v-else>تعيين صورة</span>
                  </div>
                </div>
              </div>
              <span class="full-name">
                {{
                  getText(appAuth.user.firstName) +
                  ' ' +
                  getText(appAuth.user.lastName)
                }}
              </span>
              <span class="user-name">{{ appAuth.user.userName }}</span>

              <div class="pt-3 type-switch">
                <custom-switch
                  v-model:active="selectedGlobalType"
                  :rightLabel="'قدرات'"
                  :leftLabel="'تحصيلي'"
                />
              </div>

              <div class="exams-btn">
                <training-button :buttonStyle="TrainingButtonType.normal" />
              </div>

              <div class="action-list">
                <template
                  v-for="item in listItemModel"
                  :key="item.id"
                >
                  <div
                    v-if="allowShowItem(item)"
                    class="list-item"
                    :class="[
                      { active: activeList === item.id },
                      {
                        'is-red':
                          item.id === userPanelItems.teachers ||
                          item.id === userPanelItems.teacherPanel,
                      },
                    ]"
                    @click="activeList = item.id"
                  >
                    <div class="r-part">
                      <img
                        width="16"
                        :src="`/images/icons/menu/${item.icon}.svg`"
                        :alt="item.icon"
                      />
                      <span class="label">{{ item.label }}</span>
                      <span
                        v-if="item.badgeLabel"
                        class="r-part__badge"
                      >
                        {{ item.badgeLabel }}
                      </span>
                    </div>
                    <div
                      v-if="item.id == 7 && notificationCount > 0"
                      class="c-notification"
                    >
                      <span>{{ notificationCount }}</span>
                    </div>
                    <i class="fa fa-chevron-left"></i>
                  </div>
                </template>
              </div>
            </div>
            <client-only>
              <web-social-box
                v-if="!windowSize.isMobileSize"
                class="!mt-5"
              />
            </client-only>
            <div
              v-if="!!news && news.length > 0"
              class="rw-news"
            >
              <div
                v-for="(item, index) of news"
                :key="item.title"
                class="cl-news"
              >
                <span class="c-title">{{ item.title }}</span>
                <span
                  class="c-short-desc"
                  :class="{ all: readMore.includes(index) }"
                >
                  <text-slice
                    :text="item.description"
                    :length="150"
                  />
                </span>
                <a
                  class="readMore"
                  :href="item.link"
                >
                  اقرأ المزيد
                </a>
              </div>
            </div>
          </div>
          <div v-if="activeList === userPanelItems.learningPanel">
            <lazy-learning-panel />
          </div>
          <div
            v-else
            class="rw-info"
            :class="[
              { isAnalytics: activeList === userPanelItems.analytics },
              {
                isTeachers:
                  activeList === userPanelItems.teachers ||
                  activeList === userPanelItems.teacherPanel,
              },
            ]"
          >
            <template v-if="activeList === userPanelItems.profile">
              <div
                v-if="windowSize.isMobileSize"
                class="user-group hide-from-tablet"
              >
                <div class="img-group">
                  <app-overlay v-if="isUpload" />
                  <img
                    :src="
                      imageUrlService.getUrl(
                        ImagesFolderName.Users,
                        profileInfo.pictureUrl,
                        ImageSize.original,
                        ImageExt.jpg
                      )
                    "
                    alt=""
                    @click="profileInfo.pictureUrl ? openCropEdit() : ''"
                  />
                  <div
                    v-if="!isUpload"
                    class="c-btn"
                  >
                    <input
                      ref="file_ref"
                      hidden
                      type="file"
                      accept="image/*"
                      @input="uploadPhoto"
                    />
                    <div
                      class="change-image"
                      @click="fileRef?.click()"
                    >
                      <i class="fa fa-camera"></i>
                      <span v-if="profileInfo.pictureUrl">تغيير الصورة</span>
                      <span v-else>تعيين صورة</span>
                    </div>
                  </div>
                </div>

                <span class="full-name">
                  <template
                    v-if="appAuth.user.firstName || appAuth.user.lastName"
                  >
                    {{
                      getText(appAuth.user.firstName) +
                      ' ' +
                      getText(appAuth.user.lastName)
                    }}
                  </template>
                  <template v-else>لا يوجد اسم</template>
                </span>
                <span class="user-name">{{ appAuth.user.userName }}</span>
              </div>

              <div class="u-wrapper">
                <!--                        name-->
                <template v-if="activeSection === editSections.name">
                  <vee-form
                    v-slot="{ handleSubmit }"
                    class="ac-wrapper name"
                  >
                    <div class="ac-control-wrapper">
                      <form-input
                        v-model:inputValue="profileInfo.firstName"
                        inputId="FirstName"
                        rules="required|no_special"
                        label="الاسم الأول"
                      />

                      <form-input
                        v-model:inputValue="profileInfo.lastName"
                        inputId="secondname"
                        rules="required|no_special"
                        label="اسم العائلة"
                      />
                    </div>
                    <div class="m-note">
                      <span>
                        يرجى إدخال اسمك الصحيح باللغة العربية أو الإنجليزية.
                      </span>
                      <span>لا يسمح باستخدام الرموز.</span>
                    </div>
                    <div class="ac-action">
                      <button
                        class="btn save"
                        @click.prevent="handleSubmit(sendForm)"
                      >
                        <span>حفظ</span>
                      </button>
                      <button
                        type="button"
                        class="btn cancel"
                        @click="closeSection"
                      >
                        <span>إلغاء</span>
                      </button>
                    </div>
                  </vee-form>
                </template>
                <template v-else>
                  <div class="r-wrapper">
                    <div class="r-element">
                      <div class="r-1">
                        <span class="r-label">الاسم</span>
                        <span
                          v-if="appAuth.user.firstName || appAuth.user.lastName"
                          class="r-val"
                        >
                          {{
                            getText(appAuth.user.firstName) +
                            ' ' +
                            getText(appAuth.user.lastName)
                          }}
                        </span>
                        <span
                          v-else
                          class="r-val"
                        >
                          لا يوجد
                        </span>
                      </div>
                      <div
                        class="r-action"
                        @click="setActiveSection(editSections.name)"
                      >
                        <span
                          v-if="appAuth.user.firstName || appAuth.user.lastName"
                          class="edit"
                        >
                          تعديل
                        </span>
                        <span
                          v-else
                          class="add"
                        >
                          إضافة
                        </span>
                      </div>
                    </div>
                  </div>
                </template>
                <!--                        end name-->
                <!--                        password-->
                <template v-if="activeSection === editSections.password">
                  <vee-form
                    ref="reset_password_ref"
                    v-slot="{ handleSubmit }"
                    as="div"
                    class="w-full"
                  >
                    <form
                      class="ac-wrapper password"
                      @submit.prevent="handleSubmit(changePassword)"
                    >
                      <span class="ac-title">كلمة المرور</span>
                      <div class="ac-control-wrapper">
                        <form-input
                          ref="old_password_field_ref"
                          v-model:inputValue="password.oldPassword"
                          inputId="old-password"
                          rules="required"
                          label="الكلمة الحالية"
                          inputType="password"
                        />

                        <form-input
                          v-model:inputValue="password.newPassword"
                          inputId="new-password"
                          label="الكلمة الجديدة"
                          :inputType="password2Type"
                          rules="required|verify_password|min:8"
                        />

                        <form-input
                          v-model:inputValue="password.newPasswordConfirm"
                          inputId="confirmNewPassword"
                          label="تأكيد الكلمة الجديدة"
                          :inputType="password3Type"
                          rules="required|confirmed:@new-password"
                        />
                      </div>
                      <div class="m-note">
                        <span>
                          لا تقل كلمة المرور عن 8 خانات وتحتوي حرف ورقم على
                          الأقل
                        </span>
                        <span>
                          يسمح بالحروف والأرقام الإنجليزية والرموز فقط
                        </span>
                      </div>
                      <div class="ac-action">
                        <button
                          type="submit"
                          class="btn save"
                        >
                          <span>حفظ</span>
                        </button>
                        <button
                          type="button"
                          class="btn cancel"
                          @click="closeSection"
                        >
                          <span>إلغاء</span>
                        </button>
                      </div>
                    </form>
                  </vee-form>
                </template>
                <template v-else>
                  <div class="r-wrapper">
                    <div class="r-element">
                      <div class="r-1">
                        <span class="r-label">كلمة المرور</span>
                        <div class="r-val password">
                          <span
                            v-for="item in Array(9)"
                            :key="item"
                          >
                            &#8226;
                          </span>
                        </div>
                      </div>
                      <div
                        class="r-action"
                        @click="setActiveSection(editSections.password)"
                      >
                        <span class="edit">تعديل</span>
                      </div>
                    </div>
                  </div>
                </template>
                <!--                        end password-->

                <!--                      email-->
                <template v-if="activeSection === editSections.email">
                  <vee-form
                    v-slot="{ handleSubmit, meta: formMeta }"
                    as="div"
                    class="w-full"
                  >
                    <form
                      class="ac-wrapper email"
                      @submit.prevent="handleSubmit(sendMail)"
                    >
                      <span class="ac-title">البريد الإلكتروني</span>
                      <div class="ac-control-wrapper">
                        <form-input
                          v-model:inputValue="profileInfo.email"
                          inputId="email"
                          label="البريد الألكتروني"
                          :rules="{ required: true, email: true }"
                          inputType="email"
                        />
                      </div>
                      <div class="m-note">
                        <span>
                          سيتم إرسال كود التحقق إلى بريدك الإلكتروني المدخل
                        </span>
                        <span>
                          لن يتم تغيير البريد الإلكتروني إلا بعد إدخال كود
                          التحقق
                        </span>
                      </div>
                      <div class="ac-action relative">
                        <app-overlay v-if="processing" />
                        <button
                          type="submit"
                          :disabled="
                            !formMeta.valid ||
                            isMailConfirmed() ||
                            profileInfo.email == null
                          "
                          class="btn save"
                        >
                          <span>تأكيد</span>
                        </button>
                        <button
                          type="button"
                          class="btn cancel"
                          @click="closeSection"
                        >
                          <span>إلغاء</span>
                        </button>
                      </div>
                    </form>
                  </vee-form>
                </template>
                <template v-else>
                  <div class="r-wrapper">
                    <div class="r-element">
                      <div class="r-1">
                        <span class="r-label">البريد الإلكتروني</span>
                        <span
                          v-if="appAuth.user.email"
                          class="r-val"
                        >
                          {{ appAuth.user.email }}
                        </span>
                        <span
                          v-else
                          class="r-val"
                        >
                          لا يوجد
                        </span>
                      </div>
                      <div
                        class="r-action"
                        @click="setActiveSection(editSections.email)"
                      >
                        <span
                          v-if="appAuth.user.email"
                          class="edit"
                        >
                          تعديل
                        </span>
                        <span
                          v-else
                          class="add"
                        >
                          إضافة
                        </span>
                      </div>
                    </div>
                  </div>
                </template>
                <!--                      end email-->

                <!--                      phone-->
                <template v-if="activeSection === editSections.phone">
                  <vee-form
                    v-slot="{ handleSubmit, meta }"
                    as="div"
                    class="w-full"
                  >
                    <form
                      class="ac-wrapper phone"
                      @submit.prevent="handleSubmit(callApiChangePhone)"
                    >
                      <span class="ac-title">رقم واتساب</span>
                      <div class="ac-control-wrapper">
                        <div class="ac-control">
                          <label for="telephone">رقم واتساب</label>
                          <phone-input
                            :isEdit="true"
                            :phoneNumber="profileInfo.phoneNumber"
                            @onInputPhone="
                              (val) => (profileInfo.phoneNumber = val)
                            "
                          />
                          <!--                      <mx-g-phone
                            :isRequired="false"
                            :placeholder="'5XXXXXXXXX'"
                            v-model="profileInfo.phoneNumber"
                            :dataError="checkPhoneError"
                            :messageError="'رقم الجوال مسجل لدينا سابقاً'"
                            :keyup="(isbuttonDisablePhone = false)"
                          ></mx-g-phone>-->
                        </div>
                      </div>
                      <!--                  <div class="m-note">
                        <span>سيتم إرسال رمز التحقق إلى رقم الجوال المدخل</span>
                        <span>
                          لن يتم تغيير رقم الجوال إلا بعد إدخال رمز التحقق
                        </span>
                      </div>-->
                      <div class="ac-action relative">
                        <app-overlay v-if="processing" />
                        <button
                          type="submit"
                          :disabled="
                            !meta.valid ||
                            isPhoneConfirmed() ||
                            profileInfo.phoneNumber == null
                          "
                          class="btn save"
                        >
                          <span>تأكيد</span>
                        </button>
                        <button
                          type="button"
                          class="btn cancel"
                          @click="closeSection"
                        >
                          <span>إلغاء</span>
                        </button>
                      </div>
                    </form>
                  </vee-form>
                </template>
                <template v-else>
                  <div class="r-wrapper">
                    <div class="r-element">
                      <div class="r-1">
                        <span class="r-label">رقم واتساب</span>
                        <span
                          v-if="appAuth.user.phoneNumber"
                          style="direction: ltr"
                          class="r-val direction-ltr"
                        >
                          +{{ appAuth.user.phoneNumber }}
                        </span>
                        <span
                          v-else
                          class="r-val"
                        >
                          لا يوجد
                        </span>
                      </div>
                      <div
                        class="r-action"
                        @click="setActiveSection(editSections.phone)"
                      >
                        <span
                          v-if="appAuth.user.phoneNumber"
                          class="edit"
                        >
                          تعديل
                        </span>
                        <span
                          v-else
                          class="add"
                        >
                          إضافة
                        </span>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </template>
            <template
              v-if="
                allowShowItem({ roles: [roles.student] }) &&
                activeList === userPanelItems.studentTraining
              "
            >
              <!--            <mx-panel-student-training />-->
            </template>
            <template v-if="activeList === userPanelItems.analytics">
              <!--            <mx-panel-analytics />-->
            </template>
            <template v-if="activeList === userPanelItems.exams">
              <!--            <mx-panel-exams />-->
            </template>
            <template v-if="activeList === userPanelItems.reviews">
              <!--            <mx-panel-reviews />-->
            </template>
            <template v-if="activeList === userPanelItems.trainings">
              <!--            <mx-panel-exams />-->
            </template>
            <template v-if="activeList === userPanelItems.subscriptionList">
              <!--            <mx-panel-subscribes />-->
            </template>
            <template v-if="activeList === userPanelItems.chat">
              <!--            <mx-panel-chat />-->
            </template>
            <template v-if="activeList === userPanelItems['passed-training']">
              <!--            <passed-training />-->
            </template>
            <template
              v-if="
                allowShowItem({ roles: [roles.student] }) &&
                activeList === userPanelItems.teachers
              "
            >
              <!--            <mx-panel-teachers />-->
            </template>
            <template
              v-if="
                allowShowItem({ roles: [roles.teacher] }) &&
                activeList === userPanelItems.teacherPanel
              "
            >
              <!--            <mx-panel-teacher-panel />-->
            </template>
          </div>

          <client-only>
            <app-image-cropper
              v-model:openCropper="openCropper"
              :img="img"
              :ratio="1"
              :hasDelete="true"
              @cropImg="cropImg"
              @onDelete="deleteImg"
            />
          </client-only>

          <lazy-prime-dialog
            id="modal-edit-mail"
            v-model:visible="openMailModal"
            header="تعديل البريد الالكتروني"
            :showHeader="false"
            :closable="true"
            :modal="true"
            :closeOnEscape="true"
            :dismissableMask="false"
            @afterHide="closeMailModal()"
          >
            <i
              class="fa fa-close"
              @click="closeMailModal()"
            ></i>
            <div
              class="code-part"
              :class="{ 'wrong-code': wrongCode }"
            >
              <p class="t-1">تغيير البريد الإلكتروني</p>

              <span class="t-2">
                أدخل رمز التحقق المرسل إلى بريدك الإلكتروني
              </span>
              <span class="t-3">{{ profileInfo.email }}</span>
              <div class="w-full relative">
                <app-overlay v-if="processing" />
                <code-input
                  class="t-code-input"
                  :fields="4"
                  :fieldWidth="45"
                  :fieldHeight="45"
                  :radius="8"
                  :required="true"
                  style="direction: ltr"
                  @complete="sendCode"
                />
              </div>

              <p
                v-if="wrongCode"
                class="wrong-code"
              >
                الكود غير صحيح يرجي التحقق
              </p>

              <span class="note-spam">
                تحقق من البريد العشوائي في حال لم تجد الرسالة
              </span>

              <timer-active
                v-if="
                  requestData &&
                  requestData.countRegisterTries <= 3 &&
                  isWaiting
                "
                v-model:isActive="isWaiting"
              />

              <template v-if="requestData">
                <span
                  v-if="requestData && requestData.countRegisterTries > 3"
                  class="tries-limit"
                >
                  بإمكانك إعادة إرسال الرسالة بعد 8 ساعات
                </span>

                <span
                  :class="{
                    disable:
                      (requestData && requestData.countRegisterTries > 3) ||
                      isWaiting,
                  }"
                  class="re-send"
                  @click="
                    requestData.countRegisterTries <= 3 && !isWaiting
                      ? sendMail()
                      : {}
                  "
                >
                  إعادة إرسال
                </span>
              </template>
            </div>
          </lazy-prime-dialog>

          <lazy-prime-dialog
            id="modal-edit-phone"
            v-model:visible="openPhoneModal"
            header="تعديل رقم الهاتف"
            :showHeader="false"
            :closeOnEscape="true"
            :closable="false"
            :dismissableMask="false"
            :modal="true"
            @afterHide="closePhoneModal()"
          >
            <i
              class="fa fa-close"
              @click="closePhoneModal()"
            ></i>
            <div
              class="code-part"
              :class="{ 'wrong-code': wrongCode }"
            >
              <p class="t-1">تغيير رقم الواتساب</p>

              <span class="t-2">أدخل رمز التحقق المرسل إلى رقمك في واتساب</span>
              <span class="t-3">{{ profileInfo.phoneNumber }}+</span>
              <div class="w-full relative">
                <app-overlay v-if="processing" />
                <code-input
                  class="t-code-input"
                  :fields="4"
                  :fieldWidth="45"
                  :fieldHeight="45"
                  :radius="8"
                  :required="true"
                  style="direction: ltr"
                  @complete="sendCode"
                />
              </div>
              <p
                v-if="wrongCode"
                class="wrong-code"
              >
                الكود غير صحيح يرجي التحقق
              </p>
              <template v-if="requestDataPhone">
                <span
                  v-if="requestDataPhone.countRegisterTries > 3"
                  class="tries-limit"
                >
                  بإمكانك إعادة إرسال الرسالة بعد 8 ساعات
                </span>
                <timer-active
                  v-if="requestDataPhone.countRegisterTries <= 3 && isWaiting"
                  v-model:isActive="isWaiting"
                />

                <span
                  :class="{
                    disable:
                      requestDataPhone.countRegisterTries > 3 || isWaiting,
                  }"
                  class="re-send"
                  @click="
                    requestDataPhone.countRegisterTries <= 3 && !isWaiting
                      ? callApiChangePhone()
                      : {}
                  "
                >
                  إعادة إرسال
                </span>
              </template>
            </div>
          </lazy-prime-dialog>
        </div>
      </lazy-vee-validate-provider>
    </div>
  </client-only>
</template>
<script lang="ts">
import { profileForm } from '~/main/shared/models/profile-form';
import {
  UserPanelItems,
  UserPanelItemsRecord,
} from '~/main/constants/user-panel-items';
import { UserRoles } from '~/core/auth/constants/user-roles';
import { GlobalTypes, globalTypesList } from '~/main/constants/global-types';
import { RouteHelper } from '~/main/utils/route-helper';
import { useSetupRoute } from '~/main/services/setup/useSetupRoute';
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';
import {
  dataURLtoFile,
  processText,
  sleepUtil,
  toBase64,
} from '~/main/utils/shared-utils';
import { ImagesFolderName } from '~/main/constants/images-folder-name';
import { ImageSize } from '~/main/constants/image-size';
import { ImageExt } from '~/main/constants/image-ext';
import { TrainingButtonType } from '~/main/constants/training-button-type';
import { deepCloneUtil } from '~/main/utils/lodash.utils';
import {
  pictureTypes,
  pictureTypesRecord,
} from '~/main/constants/picture-types';
import { mediaTypeListLinkRecord } from '~/main/constants/media-type-list-link.enum';
import type { AxiosResponse } from 'axios';
import { defineRule, Form as VeeForm } from 'vee-validate';
import { useGlobalStore } from '~/main/useGlobalStore';
import { fileTypes } from '~/main/constants/file-types.enum';
import { useSubscriptionsStore } from '~/main/modules/subscriptions/services/useSubscriptionsStore';
import type { FormInput } from '#components';

class PasswordFrom {
  oldPassword = null;
  newPassword = null;
  newPasswordConfirm = null;
}

defineRule('verify_password', (value) => {
  const strongRegex = new RegExp('^(?=.*[a-z,A-Z])(?=.*[0-9])');
  return strongRegex.test(value);
});

defineRule('no_special', (value) => {
  const specialChar = /[`!@#$%^&*()+=[\]{};':"\\|,.<>/?~]/;
  return !specialChar.test(value);
});

export default {
  components: { VeeForm },
  setup() {
    const runtimeConfig = useRuntimeConfig();
    const route = useRoute();
    const globalStore = useGlobalStore();
    const subscriptionsStore = useSubscriptionsStore();

    const resetPasswordRef =
      useTemplateRef<InstanceType<typeof VeeForm>>('reset_password_ref');
    const oldPasswordFieldRef = useTemplateRef<InstanceType<typeof FormInput>>(
      'old_password_field_ref'
    );
    const fileRef = useTemplateRef<HTMLInputElement>('file_ref');

    const selectedGlobalType = ref(
      globalStore.state.globalTypeUserValue == GlobalTypes.tahsele
    );

    globalStore.getFile1JsonStatic();

    const activeList = ref<any>(1);
    if (route.query && route.query?.page) {
      activeList.value = UserPanelItems[route.query.page as string];
    }

    definePageMeta({
      layout: 'website-layout',
      middleware: 'user-services-middleware',
    });
    return {
      activeList,
      globalStore,
      subscriptionsStore,
      windowSize: useWindowSize(),
      imageUrlService: useImageUrl(),
      ...useSetupRoute(),
      ...useSetupAuth(),
      ...useToastMessage(),
      runtimeConfig,
      resetPasswordRef,
      oldPasswordFieldRef,
      fileRef,
      selectedGlobalType,
    };
  },

  data() {
    return {
      process: false,
      isUpload: false,
      openCropper: false,
      img: '',
      profileInfo: new profileForm(),
      profileInfoDefault: new profileForm(),
      userPanelItemsEnum: UserPanelItemsRecord,
      userPanelItems: UserPanelItems,
      roles: UserRoles,
      editSections: {
        name: 'name',
        password: 'password',
        phone: 'phone',
        whatsapp: 'whatsapp',
        email: 'email',
      },
      activeSection: null,
      password: new PasswordFrom(),
      password1Type: 'password',
      password2Type: 'password' as any,
      password3Type: 'password' as any,
      newMail: null,
      newPhone: null,
      openMailModal: false,
      openPhoneModal: false,
      processing: false,
      wrongCode: false,
      step: 1,
      requestData: null as null | any,
      requestDataPhone: null as null | any,
      oldPhone: '',
      checkPhoneError: false,
      isbuttonDisablePhone: false,
      checkWhatsAppError: false,
      oldwhatsAppNumber: '' as string | null,
      isbuttonDisableWhatsApp: false,
      readMore: [] as any[],
      hideAds: false,
      failPayment: false,
      isWaiting: true,
      globalList: globalTypesList,
      analyticsLoading: false,
    };
  },

  computed: {
    TrainingButtonType() {
      return TrainingButtonType;
    },
    ImageExt() {
      return ImageExt;
    },
    ImageSize() {
      return ImageSize;
    },
    ImagesFolderName() {
      return ImagesFolderName;
    },
    listItemModel() {
      return [
        { id: 1, label: 'معلوماتي', icon: 'info' },
        {
          id: 11,
          label: 'سجل التدريب',
          icon: 'exams',
          roles: [UserRoles.student],
        },
        { id: 3, label: 'التحليلات', icon: 'analytics' },
        { id: 2, label: 'محاكي الاختبار', icon: 'exams' },
        {
          id: 5,
          label: 'الاشتراكات',
          icon: 'subscribe',
          badgeLabel: this.subscriptionsStore.state.userCurrentSubVal?.title,
        },
        { id: 7, label: 'الدعم الفني', icon: 'subscribe' },
        {
          id: 9,
          label: 'المدربون',
          icon: 'chalkboard-user-red',
          roles: [UserRoles.student],
        },
        {
          id: 10,
          label: 'لوحة المدرب',
          icon: 'chalkboard-user-red',
          roles: [UserRoles.teacher],
        },
      ];
    },
    isSubsPage() {
      return this.appRoute.fullPath.includes(
        RouteHelper.userPanelSubscriptions()
      );
    },
    news(): any[] {
      switch (this.activeList) {
        case this.userPanelItems.exams: {
          if (this.$store.state.examsPanelStatic) {
            return this.createListNews(this.$store.state.examsPanelStatic);
          }
          break;
        }
        case this.userPanelItems.trainings: {
          if (this.$store.state.trainingsPanelStatic) {
            return this.createListNews(this.$store.state.trainingsPanelStatic);
          }
          break;
        }
        case this.userPanelItems.learningPanel: {
          if (this.$store.state.learningPanelStatic) {
            return this.createListNews(this.$store.state.learningPanelStatic);
          }
          break;
        }
        case this.userPanelItems.subscriptionList: {
          if (this.$store.state.subscriptionsStatic) {
            return this.createListNews(this.$store.state.subscriptionsStatic);
          }
          break;
        }
        case this.userPanelItems['passed-training']: {
          if (this.$store.state.subscriptionsStatic) {
            return this.createListNews(this.$store.state.subscriptionsStatic);
          }
          break;
        }
        default: {
          return [];
        }
      }
      return [];
    },

    ads() {
      switch (this.activeList) {
        case this.userPanelItems.subscriptionList: {
          if (this.$store.state.subscriptionsStatic) {
            return this.createListAds(this.$store.state.subscriptionsStatic);
          }
          break;
        }
        default: {
          return null;
        }
      }
      return null;
    },

    fileTypes() {
      return fileTypes;
    },
    pictureTypes() {
      return pictureTypes;
    },

    notificationCount() {
      return this.$store.state.unreadMessage;
    },
    file1Static() {
      return this.globalStore.staticState.file1Json;
    },
    isHideSocialPart() {
      return (
        this.file1Static?.isHideSocial == 'true' ||
        (this.appAuth.user.joinedWhatsappGroup &&
          this.appAuth.user.joinedTelegramGroup)
      );
    },
    globalTypeUserVal() {
      return this.globalStore.state.globalTypeUserValue;
    },
  },

  watch: {
    activeList: {
      deep: true,
      handler(newVal, oldVal) {
        this.appRouter.push({
          name: this.appRoute.name,
          query: {
            ...this.appRoute.query,
            page: UserPanelItemsRecord[newVal],
          },
        });
        this.checkNotification();
      },
    },
    'appRoute.query.page': {
      handler(newVal, oldVal) {
        this.activeList = this.userPanelItems[newVal];
        this.checkNotification();
      },
    },
    'appRoute.query.failPayment': {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal == undefined) {
          this.failPayment = false;
        } else {
          if (newVal == 1) {
            this.failPayment = true;
          }
        }
      },
    },
    selectedGlobalType: {
      async handler(newVal, oldVal) {
        if (
          (newVal && this.globalTypeUserVal == GlobalTypes.kudrat) ||
          (!newVal && this.globalTypeUserVal == GlobalTypes.tahsele)
        ) {
          this.globalStore.patchState({
            globalTypeUserValue: newVal
              ? GlobalTypes.tahsele
              : GlobalTypes.kudrat,
          });
          await sleepUtil(1000);
          this.appRouter.push({
            name: this.appRoute.name,
            query: {
              ...this.appRoute.query,
              globalTypeUser: newVal ? GlobalTypes.tahsele : GlobalTypes.kudrat,
            },
          });
        }
      },
    },
    globalTypeUserVal: {
      deep: true,
      handler(newVal) {
        if (
          (newVal == GlobalTypes.tahsele && !this.selectedGlobalType) ||
          (newVal == GlobalTypes.kudrat && this.selectedGlobalType)
        ) {
          this.selectedGlobalType = newVal == GlobalTypes.tahsele;
        }
      },
    },
  },

  created() {
    Object.keys(this.profileInfo).forEach((res) => {
      this.profileInfo[res] = this.appAuth.user[res];
    });
    this.profileInfoDefault = deepCloneUtil(this.profileInfo);
  },

  async mounted() {
    if (
      this.appRouter.currentRoute.value.query['failPayment'] &&
      this.appRouter.currentRoute.value.query['failPayment'] == '1'
    ) {
      this.failPayment = true;
    }
  },

  methods: {
    async sendForm() {
      try {
        const { data: res } = await this.$axios.put(
          `/profile`,
          this.profileInfo
        );
        if (res) {
          await this.onProfileUpdate();
        } else {
          this.showError();
        }
      } catch (e) {
        console.error(e);
        this.showError();
      }
    },

    async uploadPhoto(event) {
      const file = event.target.files[0];
      this.img = (await toBase64(file)) as string;
      this.openCropper = true;
      this.fileRef!.value = null as unknown as string;
    },

    openCropEdit() {
      this.img =
        this.imageUrlService.getUrl(
          this.ImagesFolderName.Users,
          this.profileInfo.pictureUrl,
          this.ImageSize.original,
          this.ImageExt.jpg
        ) ?? '';
      this.openCropper = true;
    },

    async cropImg(img) {
      const file = await dataURLtoFile(img, 'uploaded-img');
      this.uploadAction(file);
    },

    async uploadAction(file) {
      try {
        this.isUpload = true;
        const obj = {
          File: file,
          Type: this.pictureTypes.Users,
        };

        const formData = new FormData();

        Object.keys(obj).forEach((key) => formData.append(key, obj[key]));

        const { data: res } = await this.$axios.post('media/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res) {
          //this.form.pictureUrl = res.pictureUrl
          this.isUpload = false;
          await this.appAuth.fetchUser();
          //TODO-z firestore
          // await updateChatPicture(this.appAuth).catch(() => {});
          Object.keys(this.profileInfo).forEach((res) => {
            this.profileInfo[res] = this.appAuth.user[res];
          });
        }
      } catch (e) {
        console.error(e);
        this.isUpload = false;
        this.showError();
      }
    },

    deleteImg() {
      this.openCropper = false;
      this.profileInfo.pictureUrl = '';
      this.sendForm();
    },

    setActiveSection(section) {
      this.activeSection = section;
    },
    closeSection() {
      this.activeSection = null;
      this.profileInfo.email = this.appAuth.user.email;
      this.profileInfo.phoneNumber = this.appAuth.user.phoneNumber;
    },

    changePassword() {
      this.$axios
        .post(`/identity/changePassword`, this.password)
        .then(async (response) => {
          if (response.data.isChanged) {
            await this.appAuth.fetchUser();
            this.password = new PasswordFrom();
            this.resetPasswordRef!.resetForm();
            await this.onProfileUpdate();
          } else {
            this.oldPasswordFieldRef!.fieldRef?.setErrors([
              'كلمة المرور القديمة غير صحيحة',
            ]);
            this.showError({
              life: 3000,
              summary: 'كلمة المرور القديمة غير صحيحة',
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    async onProfileUpdate() {
      try {
        await this.appAuth.fetchUser();
        this.showSuccess({
          life: 3000,
          summary: 'تمت عملية التعديل بنجاح',
        });
        this.closeSection();
      } catch (e) {
        console.log(e);
      }
    },

    editPhone() {
      this.openPhoneModal = true;
    },

    editMail() {
      this.openMailModal = true;
    },

    closeMailModal() {
      this.openMailModal = false;
      this.wrongCode = false;
    },

    closePhoneModal() {
      this.openPhoneModal = false;
      this.wrongCode = false;
    },

    async sendMail() {
      this.processing = true;
      this.isWaiting = true;
      await this.$axios
        .post(`/identity/requestChangeEmail`, {
          email: this.profileInfo.email,
        })
        .then(({ data: response }) => {
          this.processing = false;
          if (response.success) {
            this.requestData = response;
            this.editMail();
          } else {
            if (response.countRegisterTries > 3) {
              this.showError({
                summary:
                  'لقد تجاوزت عدد المحاولات المسموح به ... يرجى المحاولة لاحقاً',
              });
            }
          }
        })
        .catch((error) => {
          this.processing = false;
          if (error.response?.status == 400) {
            this.showError({
              life: 3000,
              summary: 'فشل العملية',
              detail: error.response.data.errors['Email'],
            });
          } else {
            this.showError();
          }
        });
    },

    callApiChangePhone() {
      this.processing = true;
      this.isbuttonDisablePhone = true;
      this.isWaiting = true;
      this.$axios
        .post(`/identity/requestChangePhone`, {
          phone: this.profileInfo.phoneNumber,
        })
        .then(async (response) => {
          this.requestDataPhone = response.data;
          this.processing = false;
          if (this.requestDataPhone.success) {
            this.editPhone();
            this.checkPhoneError = false;
          } else {
            if (this.requestDataPhone.countRegisterTries > 3) {
              this.showError({
                summary:
                  'لقد تجاوزت عدد المحاولات المسموح به ... يرجى المحاولة لاحقاً',
              });
            }
          }
        })
        .catch((error) => {
          this.processing = false;
          if (error.response?.status == 400 || error.response?.status == 403) {
            this.checkPhoneError = true;
            this.showError({
              summary: 'رسالة فشل',
              detail: 'هذا الرقم موجود سابقاً أرجو إدخال رقم آخر.',
            });
          }
        });
    },

    callApiChangeWhatsApp() {
      this.isbuttonDisableWhatsApp = true;
      const phoneNum = '570441000';
      const userName = this.profileInfo.userName;
      const whats_message = `مرحبا أنا المستخدم ( ${userName} )أوافق على تلقي الاشعارات و التنبيهات عبر واتساب من موقعكم على هذا الرقم`;

      const payload = {
        whatsAppNumber: this.profileInfo.whatsAppNumber,
      };

      this.$axios
        .post(`/identity/requestChangeWhatsApp`, payload)
        .then(async (response) => {
          const result = response.data;
          // success phone
          if (result == true) {
            this.checkWhatsAppError = false;
            await this.appAuth.fetchUser();
            this.profileInfo.whatsAppNumber = this.oldwhatsAppNumber =
              this.appAuth.user.whatsAppNumber;
            const windowSize =
              'width=' + window.innerWidth + ',height=' + window.innerHeight;
            window.open(
              `https://api.whatsapp.com/send?phone=966${phoneNum}&text=${whats_message}`,
              '_blank',
              windowSize
            );

            return;
          }
        })
        .catch((error) => {
          if (error.response?.status == 400) {
            this.checkWhatsAppError = true;
          }
        });
    },

    async sendPhone() {
      const isValid = true;
      if (isValid) {
        this.processing = true;
        await this.$axios
          .post(`/identity/requestChangePhone`, { phone: this.newPhone })
          .then(({ data: response }) => {
            if (response.success) {
              this.requestDataPhone = response;
              this.step = 2;
              this.processing = false;
            }
          })
          .catch((error) => {
            console.error(error);
            if (error.response?.status == 400) {
              this.showError({
                life: 3000,
                summary: 'فشل العملية',
                detail: 'رقم الهاتف مسجل سابقاً',
              });
            } else {
              this.showError();
            }
          });
      }
    },

    async sendCode(code) {
      try {
        this.process = true;
        const codeForm = {
          method: this.openMailModal
            ? this.requestData?.method
            : this.requestDataPhone.method,
          code: code,
          userId: this.openMailModal
            ? this.requestData?.id
            : this.requestDataPhone.id,
        };
        let res: AxiosResponse;
        if (this.openMailModal) {
          res = await this.$axios.post(
            `/identity/confirmChangeEmail`,
            codeForm
          );
        } else {
          res = await this.$axios.post(
            `/identity/confirmChangePhone`,
            codeForm
          );
        }
        if (res.data || res.data.isConfirmed) {
          this.process = false;
          await this.appAuth.fetchUser();
          this.profileInfo.phoneNumber = this.appAuth.user.phoneNumber;
          this.profileInfo.email = this.appAuth.user.email;
          this.profileInfo.phoneNumberConfirmed = true;
          this.profileInfo.emailConfirmed = true;
          this.openPhoneModal = false;
          this.openMailModal = false;
          this.showSuccess({
            life: 3000,
            summary: 'تمت عملية التعديل بنجاح',
          });
        } else {
          this.process = false;
          this.wrongCode = true;
        }
      } catch (e) {
        console.log(e);
        this.process = false;
        this.wrongCode = true;
      }
    },

    isPhoneConfirmed() {
      return (
        this.profileInfo.phoneNumberConfirmed &&
        this.profileInfo.phoneNumber == this.appAuth.user.phoneNumber
      );
    },

    phoneCheck() {
      if (this.profileInfo.phoneNumber != null)
        return this.profileInfo.phoneNumber.toString().length == 9;
      return true;
    },

    isWhatsAppConfirmed() {
      return (
        this.profileInfo.whatsAppConfirm ||
        this.profileInfo.whatsAppNumber == this.oldwhatsAppNumber
      );
    },

    whatsAppCheck() {
      if (this.profileInfo.whatsAppNumber != null)
        return this.profileInfo.whatsAppNumber.toString().length == 9;
      return true;
    },

    isMailConfirmed() {
      return (
        this.profileInfo.emailConfirmed &&
        this.profileInfo.email === this.appAuth.user.email
      );
    },

    togglePassword1() {
      this.password1Type =
        this.password1Type === 'password' ? 'text' : 'password';
    },
    togglePassword2() {
      this.password2Type =
        this.password2Type === 'password' ? 'text' : 'password';
    },
    togglePassword3() {
      this.password3Type =
        this.password3Type === 'password' ? 'text' : 'password';
    },

    getText(text) {
      return processText(text);
    },

    openReadMore(index) {
      if (this.readMore.includes(index)) {
        this.readMore.splice(
          this.readMore.findIndex((k) => k === index),
          1
        );
      } else {
        this.readMore = [...this.readMore, index];
      }
    },

    createListNews(jsonData) {
      const keys = Object.keys(jsonData);
      const count = keys.filter((k) => k.includes('newsTitle')).length;
      const data = jsonData;
      const list: any[] = [];
      for (let i = 1; i <= count; i++) {
        list.push({
          title: data[`newsTitle_${i}`],
          link: data[`newsLink_${i}`],
          description: data[`newsText_${i}`],
        });
      }
      return list;
    },

    getFileUrl(type, fileType, url) {
      return (
        this.runtimeConfig.public.baseImageUrl +
        '/' +
        pictureTypesRecord[type] +
        '/' +
        mediaTypeListLinkRecord[fileType] +
        '/' +
        url
      );
    },

    createListAds(jsonData) {
      const keys = Object.keys(jsonData);
      const count = keys.filter((k) => k.includes('ad')).length;
      const data = jsonData;
      const list: any[] = [];
      for (let i = 1; i <= count; i++) {
        if (data[`ad_${i}`].length > 0 && data[`ad_${i}`].length != null) {
          list.push(data[`ad_${i}`]);
        }
      }
      return list;
    },

    goTraining() {
      this.appRouter.push({
        path: '/user-panel',
        query: {
          page: UserPanelItemsRecord[UserPanelItems.trainings],
        },
      });
    },

    goExam() {
      this.appRouter.push({
        path: '/user-panel',
        query: {
          page: UserPanelItemsRecord[UserPanelItems.exams],
        },
      });
    },

    checkNotification() {
      if (this.activeList == this.userPanelItems.chat) {
        this.$store.commit('SET_LAST_MESSAGES', []);
      }
    },

    allowShowItem(item: any) {
      if (item?.roles) {
        return item.roles.some((role) => role == this.appAuth.user.role);
      }
      return true;
    },
  },
};
</script>
<style lang="scss" src="./user-panel-page.scss" scoped></style>
