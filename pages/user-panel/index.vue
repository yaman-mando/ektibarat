<template>
  <div class="relative">
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
        .حدثت مشكلة في عملية الدفع ولم تكتمل بنجاح، تأكد من معلومات البطاقة وأعد
        المحاولة مرة أخرى
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
                profileInfo.pictureUrl ? openCropEdit() : $refs.file?.click()
              "
            />
            <div
              v-if="!isUpload"
              class="c-btn"
            >
              <input
                ref="file"
                hidden
                type="file"
                accept="image/*"
                @input="uploadPhoto"
              />
              <div
                class="change-image"
                @click="$refs.file?.click()"
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
            <div
              v-for="item in listItemModel"
              :key="item.id"
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
              <template v-if="allowShowItem(item)">
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
              </template>
            </div>
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
        <mx-panel-learning />
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
                  ref="file"
                  hidden
                  type="file"
                  accept="image/*"
                  @input="uploadPhoto"
                />
                <div
                  class="change-image"
                  @click="$refs.file.click()"
                >
                  <i class="fa fa-camera"></i>
                  <span v-if="profileInfo.pictureUrl">تغيير الصورة</span>
                  <span v-else>تعيين صورة</span>
                </div>
              </div>
            </div>

            <span class="full-name">
              <template v-if="appAuth.user.firstName || appAuth.user.lastName">
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
              <validation-observer
                v-slot="{ handleSubmit }"
                slim
              >
                <form
                  class="ac-wrapper name"
                  @submit.prevent="handleSubmit(sendForm)"
                >
                  <span class="ac-title">الاسم</span>
                  <div class="ac-control-wrapper">
                    <validation-provider
                      v-slot="{ errors, invalid }"
                      name="FirstName"
                      slim
                      rules="required|no_special"
                    >
                      <div
                        class="ac-control"
                        :class="[{ invalid: invalid }]"
                      >
                        <label for="firstname">الاسم الأول</label>
                        <input
                          id="firstname"
                          v-model="profileInfo.firstName"
                          type="text"
                          class="form-control"
                          aria-describedby="firstnameHelp"
                        />
                      </div>
                    </validation-provider>
                    <validation-provider
                      v-slot="{ errors, invalid }"
                      slim
                      name="LastName"
                      rules="required|no_special"
                    >
                      <div
                        class="ac-control"
                        :class="[{ invalid: invalid }]"
                      >
                        <label for="secondname">اسم العائلة</label>
                        <input
                          id="secondname"
                          v-model="profileInfo.lastName"
                          type="text"
                          class="form-control"
                          aria-describedby="secondnameHelp"
                        />
                      </div>
                    </validation-provider>
                  </div>
                  <div class="m-note">
                    <span>
                      يرجى إدخال اسمك الصحيح باللغة العربية أو الإنجليزية.
                    </span>
                    <span>لا يسمح باستخدام الرموز.</span>
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
              </validation-observer>
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
              <validation-observer
                ref="resetPassword"
                v-slot="{ handleSubmit }"
                slim
              >
                <form
                  class="ac-wrapper password"
                  @submit.prevent="handleSubmit(changePassword)"
                >
                  <span class="ac-title">كلمة المرور</span>
                  <div class="ac-control-wrapper">
                    <validation-provider
                      ref="oldPasswordProvider"
                      v-slot="{ errors, invalid, dirty }"
                      slim
                      name="oldPassword"
                      rules="required"
                    >
                      <div
                        class="ac-control"
                        :class="[{ invalid: invalid }]"
                      >
                        <label for="old-password">الكلمة الحالية</label>
                        <input
                          id="old-password"
                          v-model="password.oldPassword"
                          :type="password1Type"
                          class="form-control"
                          aria-describedby="oldpasswordHelp"
                        />
                        <span
                          class="input-group-prepend show-pass position-absolute"
                          @click.prevent="togglePassword1"
                        >
                          <i
                            :class="
                              password1Type === 'text'
                                ? 'fa fa-eye'
                                : 'fa fa-eye-slash'
                            "
                            aria-hidden="true"
                            class="show-pass-icon"
                          ></i>
                        </span>
                      </div>
                    </validation-provider>
                    <validation-provider
                      v-slot="{ errors, invalid }"
                      slim
                      name="newPassword"
                      rules="required|verify_password|min:8"
                      vid="checkPassword"
                    >
                      <div
                        class="ac-control"
                        :class="[{ invalid: invalid }]"
                      >
                        <label for="new-password">الكلمة الجديدة</label>
                        <input
                          id="new-password"
                          v-model="password.newPassword"
                          :type="password2Type"
                          class="form-control"
                          aria-describedby="newpasswordHelp"
                        />
                        <span
                          class="input-group-prepend show-pass position-absolute"
                          @click.prevent="togglePassword2"
                        >
                          <i
                            :class="
                              password2Type === 'text'
                                ? 'fa fa-eye'
                                : 'fa fa-eye-slash'
                            "
                            aria-hidden="true"
                            class="show-pass-icon"
                          ></i>
                        </span>
                      </div>
                    </validation-provider>
                    <validation-provider
                      v-slot="{ errors, invalid }"
                      slim
                      name="confirmNewPassword"
                      rules="required|confirmed:checkPassword"
                    >
                      <div
                        class="ac-control"
                        :class="[{ invalid: invalid }]"
                      >
                        <label for="rnewpassword">تأكيد الكلمة الجديدة</label>
                        <input
                          id="rnewpassword"
                          v-model="password.newPasswordConfirm"
                          :type="password3Type"
                          class="form-control"
                          aria-describedby="rnewpasswordHelp"
                        />
                        <span
                          class="input-group-prepend show-pass position-absolute"
                          @click.prevent="togglePassword3"
                        >
                          <i
                            :class="
                              password3Type === 'text'
                                ? 'fa fa-eye'
                                : 'fa fa-eye-slash'
                            "
                            aria-hidden="true"
                            class="show-pass-icon"
                          ></i>
                        </span>
                        <!--                                <div class="validation-message">-->
                        <!--                                  <small-->
                        <!--                                    id="rnewpasswordHelp"-->
                        <!--                                    class="form-text text-muted error"-->
                        <!--                                  >{{ errors[0] }}</small>-->
                        <!--                                </div>-->
                      </div>
                    </validation-provider>
                  </div>
                  <div class="m-note">
                    <span>
                      لا تقل كلمة المرور عن 8 خانات وتحتوي حرف ورقم على الأقل
                    </span>
                    <span>يسمح بالحروف والأرقام الإنجليزية والرموز فقط</span>
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
              </validation-observer>
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
              <validation-observer
                v-slot="{ valid, validate, handleSubmit, invalid }"
                slim
              >
                <form
                  class="ac-wrapper email"
                  @submit.prevent="handleSubmit(sendMail)"
                >
                  <span class="ac-title">البريد الإلكتروني</span>
                  <div class="ac-control-wrapper">
                    <validation-provider
                      v-slot="{ errors, invalid }"
                      name="FirstName"
                      slim
                      :rules="{ required: true, email: true }"
                    >
                      <div
                        class="ac-control"
                        :class="[{ invalid: invalid }]"
                      >
                        <label for="email">البريد الألكتروني</label>
                        <input
                          id="email"
                          v-model="profileInfo.email"
                          type="text"
                          class="form-control"
                          aria-describedby="emailHelp"
                        />
                        <!--                    <div class="validation-message">
                      <small
                        id="emailHelp"
                        class="form-text text-muted error"
                        v-show="!emailCheck()"
                      >
                        صيغة الايميل خاطئة
                      </small>
                      <small
                        class="form-text text-muted error"
                        v-if="checkEmailError"
                      >
                        هذا البريد الإلكتروني مسجل لدينا
                      </small>
                    </div>-->
                      </div>
                    </validation-provider>
                  </div>
                  <div class="m-note">
                    <span>
                      سيتم إرسال كود التحقق إلى بريدك الإلكتروني المدخل
                    </span>
                    <span>
                      لن يتم تغيير البريد الإلكتروني إلا بعد إدخال كود التحقق
                    </span>
                  </div>
                  <div class="ac-action relative">
                    <app-overlay v-if="processing" />
                    <button
                      type="submit"
                      :disabled="
                        invalid ||
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
              </validation-observer>
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
              <validation-observer
                v-slot="{ handleSubmit, valid }"
                slim
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
                        @onInputPhone="(val) => (profileInfo.phoneNumber = val)"
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
                        !valid ||
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
              </validation-observer>
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
            <!--                      end phone-->

            <!--          <template v-if="activeSection === editSections.whatsapp">
            <validation-observer
              slim
              v-slot="{ handleSubmit }"
            >
              <form
                class="ac-wrapper whatsapp"
                @submit.prevent="handleSubmit(callApiChangeWhatsApp)"
              >
                <span class="ac-title">رقم واتساب</span>
                <div class="ac-control-wrapper">
                  <div class="ac-control">
                    <label>رقم واتساب</label>
                    <mx-g-phone
                      :isRequired="false"
                      :placeholder="'5XXXXXXXXX'"
                      v-model="profileInfo.whatsAppNumber"
                      :dataError="checkWhatsAppError"
                      :messageError="'رقم الواتس اب مسجل لدينا سابقاً'"
                      :keyup="(isbuttonDisableWhatsApp = false)"
                    ></mx-g-phone>
                  </div>
                </div>
                <div class="m-note">
                  <span>سيتم تحويلك إلى واتساب لإرسال رسالة التحقق</span>
                  <span>يمكن أن يكون رقم واتساب مختلفاً عن رقم الجوال</span>
                </div>
                <div class="ac-action">
                  <button
                    type="submit"
                    :disabled="
                      isbuttonDisableWhatsApp ||
                      isWhatsAppConfirmed() ||
                      !whatsAppCheck() ||
                      profileInfo.whatsAppNumber == null
                    "
                    class="btn save"
                  >
                    <span>{{ isWhatsAppConfirmed() ? 'محقق' : 'التحقق' }}</span>
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
            </validation-observer>
          </template>
          <template v-else>
            <div class="r-wrapper">
              <div class="r-element">
                <div class="r-1">
                  <span class="r-label">رقم واتساب</span>
                  <span
                    style="direction: ltr"
                    class="r-val"
                    v-if="appAuth.user.whatsAppNumber"
                  >
                    +966 {{ appAuth.user.whatsAppNumber }}
                  </span>
                  <span
                    class="r-val"
                    v-else
                  >
                    لا يوجد
                  </span>
                </div>
                <div
                  class="r-action"
                  @click="setActiveSection(editSections.whatsapp)"
                >
                  <span
                    class="edit"
                    v-if="appAuth.user.whatsAppNumber"
                  >
                    تعديل
                  </span>
                  <span
                    class="add"
                    v-else
                  >
                    إضافة
                  </span>
                </div>
              </div>
            </div>
          </template>-->
          </div>
        </template>
        <template
          v-if="
            allowShowItem({ roles: [roles.student] }) &&
            activeList === userPanelItems.studentTraining
          "
        >
          <mx-panel-student-training />
        </template>
        <template v-if="activeList === userPanelItems.analytics">
          <mx-panel-analytics />
        </template>
        <template v-if="activeList === userPanelItems.exams">
          <mx-panel-exams />
        </template>
        <template v-if="activeList === userPanelItems.reviews">
          <mx-panel-reviews />
        </template>
        <template v-if="activeList === userPanelItems.trainings">
          <mx-panel-exams />
        </template>
        <template v-if="activeList === userPanelItems.subscriptionList">
          <mx-panel-subscribes />
        </template>
        <template v-if="activeList === userPanelItems.chat">
          <mx-panel-chat />
        </template>
        <template v-if="activeList === userPanelItems['passed-training']">
          <passed-training />
        </template>
        <template
          v-if="
            allowShowItem({ roles: [roles.student] }) &&
            activeList === userPanelItems.teachers
          "
        >
          <mx-panel-teachers />
        </template>
        <template
          v-if="
            allowShowItem({ roles: [roles.teacher] }) &&
            activeList === userPanelItems.teacherPanel
          "
        >
          <mx-panel-teacher-panel />
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

      <b-modal
        id="modal-edit-mail"
        :visible="openMailModal"
        centered
        title="تعديل البريد الالكتروني"
        hideFooter
        hideHeader
        @hidden="closeMailModal()"
      >
        <!--        <i
          @click="closeMailModal()"
          class="fa fa-close"
        ></i>
        <template>
          <div
            class="code-part"
            :class="{ 'wrong-code': wrongCode }"
          >
            <p class="code-title">يرجى إدخال كود التأكيد</p>
            <code-input
              @complete="sendCode"
              :fields="4"
              :fieldWidth="45"
              :fieldHeight="45"
              :radius="8"
              :required="true"
              style="direction: ltr"
            />
            <p
              v-if="wrongCode"
              class="wrong-code"
            >
              الكود غير صحيح يرجي التحقق
            </p>
          </div>
        </template>-->

        <i
          class="fa fa-close"
          @click="closeMailModal()"
        ></i>
        <div
          class="code-part"
          :class="{ 'wrong-code': wrongCode }"
        >
          <p class="t-1">تغيير البريد الإلكتروني</p>

          <span class="t-2">أدخل رمز التحقق المرسل إلى بريدك الإلكتروني</span>
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
              requestData && requestData.countRegisterTries <= 3 && isWaiting
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
      </b-modal>

      <b-modal
        id="modal-edit-phone"
        :visible="openPhoneModal"
        centered
        title="تعديل رقم الهاتف"
        hideFooter
        hideHeader
        @hidden="closePhoneModal()"
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
                disable: requestDataPhone.countRegisterTries > 3 || isWaiting,
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
      </b-modal>

      <mx-g-modal-phone
        ref="confirmModalPhone3"
        method="confirmChangePhone"
        action="P"
        :phone="profileInfo.phoneNumber"
        @call-parent="callApiChangePhone"
        @onSuccessChange="onProfileUpdate"
      />
    </div>
    <app-overlay
      v-if="analyticsLoading"
      msg="جاري تحميل البيانات ..."
    />
  </div>
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
import { sleepUtil } from '~/main/utils/shared-utils';
import { ImagesFolderName } from '~/main/constants/images-folder-name';
import { ImageSize } from '~/main/constants/image-size';
import { ImageExt } from '~/main/constants/image-ext';
import { TrainingButtonType } from '~/main/constants/training-button-type';
import { deepCloneUtil } from '~/main/utils/lodash.utils';

class PasswordFrom {
  constructor() {
    this.oldPassword = null;
    this.newPassword = null;
    this.newPasswordConfirm = null;
  }
}

extend('verify_password', {
  validate: (value) => {
    const strongRegex = new RegExp('^(?=.*[a-z,A-Z])(?=.*[0-9])');
    return strongRegex.test(value);
  },
});

extend('no_special', {
  validate: noSpecialCharValidation,
});

export default {
  setup() {
    definePageMeta({
      layout: 'website-layout',
      middleware: 'user-services-middleware',
    });
    return {
      windowSize: useWindowSize(),
      imageUrlService: useImageUrl(),
      ...useSetupRoute(),
      ...useSetupAuth(),
    };
  },
  async asyncData({ redirect, appAuth, store, $axios, query, app: { i18n } }) {
    let activeList = 1;
    if (query && query.page) {
      activeList = userPanelItems[query.page];
    }
    await store.dispatch('getFile1Static');
    return {
      activeList,
    };
  },

  data() {
    return {
      isUpload: false,
      openCropper: false,
      img: '',
      profileInfo: new profileForm(),
      profileInfoDefault: new profileForm(),
      activeList: 1 as any,
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
      password2Type: 'password',
      password3Type: 'password',
      newMail: null,
      newPhone: null,
      openMailModal: false,
      openPhoneModal: false,
      processing: false,
      wrongCode: false,
      step: 1,
      requestData: null,
      requestDataPhone: null,
      oldPhone: '',
      checkPhoneError: false,
      isbuttonDisablePhone: false,
      checkWhatsAppError: false,
      oldwhatsAppNumber: '',
      isbuttonDisableWhatsApp: false,
      readMore: [] as any[],
      hideAds: false,
      failPayment: false,
      isWaiting: true,
      globalList: globalTypesList,
      selectedGlobalType:
        this.$store.state.globalTypeUser == GlobalTypes.tahsele,
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
          badgeLabel: this.$store.state.userCurrentSub.title,
        },
        { id: 7, label: 'الدعم الفني', icon: 'subscribe' },
        {
          id: 9,
          label: 'المدربون',
          icon: 'chalkboard-user-red',
          roles: [roles.student],
        },
        {
          id: 10,
          label: 'لوحة المدرب',
          icon: 'chalkboard-user-red',
          roles: [roles.teacher],
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
        case this.userPanelItems.passedTraining: {
          if (this.$store.state.subscriptionsStatic) {
            return this.createListNews(this.$store.state.subscriptionsStatic);
          }
          break;
        }
        default: {
          return null;
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
      return this.$store.state.file1PanelStatic;
    },
    isHideSocialPart() {
      return (
        this.file1Static?.isHideSocial == 'true' ||
        (this.appAuth.user.joinedWhatsappGroup &&
          this.appAuth.user.joinedTelegramGroup)
      );
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
          (newVal && this.$store.state.globalTypeUser == GlobalTypes.kudrat) ||
          (!newVal && this.$store.state.globalTypeUser == GlobalTypes.tahsele)
        ) {
          this.$store.commit(
            'SET_GLOBAL_TYPE_USER',
            newVal ? GlobalTypes.tahsele : GlobalTypes.kudrat
          );
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
    '$store.state.globalTypeUser': {
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
      this.appRouter.currentRoute.value.query['failPayment'] == 1
    ) {
      this.failPayment = true;
    }
  },

  methods: {
    async sendForm() {
      try {
        const res = await this.$axios.$put(`/profile`, this.profileInfo);
        if (res) {
          await this.onProfileUpdate();
        } else {
          showToastError(this.$bvToast);
        }
      } catch (e) {
        console.error(e);
        showToastError(this.$bvToast);
      }
    },

    async uploadPhoto(event) {
      const file = event.target.files[0];
      this.img = await toBase64(file);
      this.openCropper = true;
      //@ts-expect-error access $refs
      this.$refs.file!.value = null;
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

        const res = await this.$axios.$post('media/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res) {
          //this.form.pictureUrl = res.pictureUrl
          this.isUpload = false;
          await this.appAuth.fetchUser();
          await updateChatPicture(this.appAuth).catch(() => {});
          Object.keys(this.profileInfo).forEach((res) => {
            this.profileInfo[res] = this.appAuth.user[res];
          });
        }
      } catch (e) {
        console.error(e);
        this.isUpload = false;
        showToastError(this.$bvToast);
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
            this.$refs.resetPassword.reset();
            await this.onProfileUpdate();
          } else {
            this.$refs.oldPasswordProvider.setErrors([
              'كلمة المرور القديمة غير صحيحة',
            ]);
            makeToast(
              'كلمة المرور القديمة غير صحيحة',
              {
                title: 'خطأ',
                autoHideDelay: 3000,
                variant: 'danger',
                toaster: 'b-toaster-top-right',
              },
              this.$bvToast
            );
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    async onProfileUpdate() {
      try {
        await this.appAuth.fetchUser();
        showToastSuccess(this.$bvToast, {
          msg: 'تمت عملية التعديل بنجاح',
          autoHideDelay: 3000,
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
        .$post(`/identity/requestChangeEmail`, {
          email: this.profileInfo.email,
        })
        .then((response) => {
          this.processing = false;
          if (response.success) {
            this.requestData = response;
            this.editMail();
          } else {
            if (response.countRegisterTries > 3) {
              showToastError(
                this.$bvToast,
                {},
                'لقد تجاوزت عدد المحاولات المسموح به ... يرجى المحاولة لاحقاً'
              );
            }
          }
        })
        .catch((error) => {
          this.processing = false;
          if (error.response?.status == 400) {
            showToastError(
              this.$bvToast,
              {
                title: 'فشل العملية',
                autoHideDelay: 3000,
                variant: 'danger',
              },
              error.response.data.errors['Email']
            );
          } else {
            showToastError(this.$bvToast);
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
              showToastError(
                this.$bvToast,
                {},
                'لقد تجاوزت عدد المحاولات المسموح به ... يرجى المحاولة لاحقاً'
              );
            }
          }
        })
        .catch((error) => {
          this.processing = false;
          if (error.response?.status == 400 || error.response?.status == 403) {
            this.checkPhoneError = true;
            this.$bvToast.toast('هذا الرقم موجود سابقاً أرجو إدخال رقم آخر.', {
              title: 'رسالة فشل',
              variant: 'danger',
              solid: true,
              toaster: 'b-toaster-bottom-right',
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
        const res = await this.$axios
          .$post(`/identity/requestChangePhone`, { phone: this.newPhone })
          .then((response) => {
            if (response.success) {
              this.requestDataPhone = response;
              this.step = 2;
              this.processing = false;
            }
          })
          .catch((error) => {
            console.error(error);
            if (error.response?.status == 400) {
              makeToast(
                'رقم الهاتف مسجل سابقاً',
                {
                  title: 'فشل العملية',
                  autoHideDelay: 3000,
                  variant: 'danger',
                },
                this.$bvToast
              );
            } else {
              showToastError(this.$bvToast);
            }
          });
      }
    },

    async sendCode(code) {
      try {
        this.process = true;
        const codeForm = {
          method: this.openMailModal
            ? this.requestData.method
            : this.requestDataPhone.method,
          code: code,
          userId: this.openMailModal
            ? this.requestData.id
            : this.requestDataPhone.id,
        };
        let res;
        if (this.openMailModal) {
          res = await this.$axios.$post(
            `/identity/confirmChangeEmail`,
            codeForm
          );
        } else {
          res = await this.$axios.$post(
            `/identity/confirmChangePhone`,
            codeForm
          );
        }
        if (res.data || res.isConfirmed) {
          this.process = false;
          await this.appAuth.fetchUser();
          this.profileInfo.phoneNumber = this.appAuth.user.phoneNumber;
          this.profileInfo.email = this.appAuth.user.email;
          this.profileInfo.phoneNumberConfirmed = true;
          this.profileInfo.emailConfirmed = true;
          this.openPhoneModal = false;
          this.openMailModal = false;
          showToastSuccess(this.$bvToast, {
            title: 'تمت عملية التعديل بنجاح',
            autoHideDelay: 3000,
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
      const list = [];
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
        process.env.baseImageUrl +
        '/' +
        this.$t(`pictureTypes.${type}`) +
        '/' +
        this.$t(`mediaTypeListLink.${fileType}`) +
        '/' +
        url
      );
    },

    createListAds(jsonData) {
      const keys = Object.keys(jsonData);
      const count = keys.filter((k) => k.includes('ad')).length;
      const data = jsonData;
      const list = [];
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
          page: UserPanelItemsRecord[userPanelItems.trainings],
        },
      });
    },

    goExam() {
      this.appRouter.push({
        path: '/user-panel',
        query: {
          page: UserPanelItemsRecord[userPanelItems.exams],
        },
      });
    },

    checkNotification() {
      if (this.activeList == this.userPanelItems.chat) {
        this.$store.commit('SET_LAST_MESSAGES', []);
      }
    },

    allowShowItem(item) {
      if (item.hasOwnProperty('roles')) {
        return item.roles.some((role) => role == this.appAuth.user.role);
      }
      return true;
    },
  },
};
</script>
<style lang="scss" src="./user-panel-page.scss" scoped></style>
