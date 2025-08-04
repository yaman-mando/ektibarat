<template>
  <div
    v-if="questionData && !!isLibsReady"
    :recordState="recordState"
    class="web-content-page exam-question question-animate-page"
  >
    <div class="w-container">
      <div
        class="m-content"
        :class="{ isText: questionData.categoryIsText }"
      >
        <div class="w-full aa-q !text-inherit !no-underline">
          <app-exam-part-question-part
            ref="examPartRef"
            class="ex-cd"
            :isTrain="false"
            :counterValue="null"
            :hideCounter="true"
            :mainTitle="questionData.categoryTitle"
            :question="questionData"
            :isSeo="true"
            :isAnimation="true"
            :withBg="true"
          >
            <template #header>
              <span class="br-title">www.ekhtibarat.com</span>
            </template>
            <template #mainContent>
              <app-exam-part-article
                v-if="questionData.categoryIsText"
                :title="questionData.categoryTitle"
                :text="questionData.categoryDescription"
                :noReadMore="true"
              />
            </template>
            <template #default>
              <app-answer-select
                :correctAnswerIdsList="[]"
                :selectedValue="questionData.answerId"
                :correctAnswerId="correctAnswerIdModel"
                :answers="questionData.answers"
                :fetchingApi="$store.state.student.fetching.answer"
                :questionState="questionData.questionState"
                :withBg="true"
                :isDisabled="true"
                :isAnimation="true"
                :showTakfeelat="true"
              />
            </template>
          </app-exam-part-question-part>
        </div>
      </div>
    </div>
    <question-animate-answer-modal
      ref="question_animate_answer_modal_ref"
      :htmlContent="questionData.feedbackInCorrectAnswer"
    />
    <div class="qae-c">
      <span
        class="start-t-1"
        v-html="dataStatic.text1"
      ></span>
      <img
        class="start-t-image"
        src="/images/ek-logo-v.svg"
      />
      <span
        class="start-t-2"
        v-html="dataStatic.text2"
      ></span>
      <div class="qae-c__link">
        <span>www</span>
        <span>.</span>
        <span>ekhtibarat</span>
        <span>.</span>
        <span>com</span>
      </div>
      <div class="qae-c__line"></div>
      <div class="qae-c__end">
        <div class="qae-c__end__text">@ekhtibaratai</div>
        <div class="qae-c__end__icons">
          <i class="fa-brands fa-tiktok"></i>
          <i class="fa-brands fa-telegram"></i>
          <i class="fa-brands fa-instagram"></i>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 512 512"
          >
            <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path
              d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
            />
          </svg>
          <i class="fa-brands fa-facebook"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  hasChildMathTag,
  QUESTION_ANIMATE_DEFAULT_CONFIG,
} from '~/main/utils/question-animate.utils';
import type { QuestionAnimateDataUiModel } from '~/pages/question-animate/[id]/index.vue';
import { useIsAliveRx } from '~/main/shared/rx/useIsAliveRx';
import { useMathJaxClientService } from '~/main/shared/math-jax/useMathJaxClientService';
import { useGsapClientHook } from '~/main/shared/gsap/useGsapClientHook';
import { interval, takeWhile, tap } from 'rxjs';
import { differenceInSeconds } from 'date-fns';
import type { QuestionAnimateAnswerModal } from '#components';
import Tween = gsap.core.Tween;

const RECORD_STATE = {
  initial: 'initial',
  active: 'active',
  inactive: 'inactive',
};

export default {
  props: {
    data: {
      type: Object as PropType<QuestionAnimateDataUiModel>,
    },
  },
  setup() {
    const isAliveRxService = useIsAliveRx();
    const mathJaxClientService = useMathJaxClientService();
    const gsapClientHook = useGsapClientHook();
    const questionAnimateAnswerModalRef = useTemplateRef<
      InstanceType<typeof QuestionAnimateAnswerModal>
    >('question_animate_answer_modal_ref');

    const questionAnimateConfig = inject(
      'questionAnimateConfig',
      QUESTION_ANIMATE_DEFAULT_CONFIG
    );

    onMounted(() => {
      mathJaxClientService.initMathJaxMixin();
    });

    return {
      questionAnimateConfig,
      isAliveRxService,
      mathJaxClientService,
      gsapClientHook,
      questionAnimateAnswerModalRef,
    };
  },
  data() {
    return {
      startDate: null as Date | null,
      recordState: RECORD_STATE.initial,
      answers: null,
      isViewRendered: false,
    };
  },
  computed: {
    dataStatic() {
      return this.data as QuestionAnimateDataUiModel;
    },
    correctAnswerIdModel() {
      return this.questionData.answers.filter((k) => k.isCorrect).length > 0
        ? this.questionData.answers.filter((k) => k.isCorrect)[0].id
        : 0;
    },
    /**
     * @type {ExamQuestionModel}
     * */
    questionData() {
      return this.$store.state.examQuestion;
    },
    isReadyContent() {
      return !!this.isViewRendered && !!this.questionData && !!this.isLibsReady;
    },
    isLibsReady() {
      return !!this.gsapClientHook.state.gsapLib;
    },
  },
  watch: {
    isReadyContent: {
      deep: true,
      handler(val, oldVal) {
        if (!!val && val !== oldVal) {
          this.initProcess();
        }
      },
    },
  },
  mounted() {
    this.checkViewIsRendered();
  },
  beforeUnmount() {},
  methods: {
    durationsValues() {
      return {
        titleText: this.getAnimationDuration(1),
        answerModalText: this.getAnimationDuration(0.5),
      };
    },
    getAnimationDuration(duration) {
      return duration / this.dataStatic.speedAnimationBy;
    },
    checkViewIsRendered() {
      if (import.meta.client) {
        interval(100)
          .pipe(
            tap(() => {
              if (this.getElements().header) {
                this.isViewRendered = true;
                this.isAliveRxService.isAliveRx.value = false;
              }
            }),
            takeWhile(() => this.isAliveRxService.isAliveRx.value)
          )
          .subscribe();
      }
    },
    stopTimeCut() {
      if (window[QUESTION_ANIMATE_DEFAULT_CONFIG.stopFunctionName]) {
        window[QUESTION_ANIMATE_DEFAULT_CONFIG.stopFunctionName]();
      }
    },
    listenToPage() {
      interval(300)
        .pipe(
          tap(() => {
            this.addConditionClasses();
          }),
          takeWhile(() => this.isAliveRxService.isAliveRx.value)
        )
        .subscribe();
    },
    addConditionClasses() {
      const parent = this.getElements().page as Element;

      if (this.getElements().compareWrapper) {
        parent.classList.add('has-aq-compare-wrapper');
      }
      if (parent.querySelector('.aq-content')) {
        parent.classList.add('title-with-media');
      }
      if (
        parent.querySelector('.s-compare-c') &&
        !parent.querySelector('.aq-compare-wrapper__media')
      ) {
        parent.classList.add('compare-table-only');
      }
      if (parent.querySelector('.aq-compare-wrapper__media')) {
        parent.classList.add('compare-with-media');
      }
    },
    initProcess() {
      try {
        if (!this.gsapClientHook.state.gsapLib) {
          throw new Error('no-gsap');
        }
        this.recordState = RECORD_STATE.active;
        this.listenToPage();
        this.startAnimate();
      } catch (e) {
        this.recordState = RECORD_STATE.inactive;
        this.stopTimeCut();
        console.error(e);
      }
    },
    startAnimate() {
      this.startDate = new Date();
      //view the page
      this.gsapClientHook.state.gsapLib?.set(this.getElements().page, {
        opacity: 1,
      });
      this.animateHeader();
    },
    animateArticle() {
      this.animateFadeInBottom(this.getElements().article, () => {
        this.gsapClientHook.state.gsapLib?.delayedCall(
          this.getAnimationDuration(1),
          () => {
            this.animateFadeOutTop(this.getElements().article, () => {
              this.gsapClientHook.state.gsapLib?.set(
                this.getElements().article,
                { display: 'none' }
              );
              this.animateHeroPart();
            });
          }
        );
      });
    },
    animateFadeInBottom(
      el,
      onCompleteCallback = () => {},
      onStartCallback = () => {},
      duration?: number
    ): Tween {
      if (!duration) {
        duration = this.getAnimationDuration(1);
      }
      return this.gsapClientHook.state.gsapLib!.fromTo(
        el,
        {
          opacity: 0,
          y: -20,
        },
        {
          y: 0,
          duration,
          opacity: 1,
          onComplete: onCompleteCallback,
          onStart: onStartCallback,
        }
      );
    },
    animateFadeOutTop(
      el,
      onCompleteCallback = () => {},
      onStartCallback = () => {},
      duration?: number
    ) {
      if (!duration) {
        duration = this.getAnimationDuration(1);
      }
      return this.gsapClientHook.state.gsapLib?.fromTo(
        el,
        {
          opacity: 1,
          y: 0,
        },
        {
          y: -20,
          duration,
          opacity: 0,
          onComplete: onCompleteCallback,
          onStart: onStartCallback,
        }
      );
    },
    animateHeader() {
      this.gsapClientHook.state.gsapLib?.set(
        this.getElements().examQuestionWrapper,
        {
          opacity: 1,
        }
      );
      this.gsapClientHook.state.gsapLib?.from(this.getElements().header, {
        opacity: 0,
        y: -20,
        duration: this.getAnimationDuration(1),
        onComplete: () => {
          if (this.getElements().article) {
            this.animateArticle();
          } else {
            this.animateHeroPart();
          }
        },
      });
    },
    animateHeroPart() {
      let heroType = 'title-only';
      if (this.getElements().compareWrapper) {
        heroType = 'compare-only';
      }

      console.log(heroType);
      const record = {
        'title-only': () => {
          const questionTitle = this.getElements().questionTitle as HTMLElement;
          const initialHeight = (questionTitle.lastChild as HTMLElement)
            ?.clientHeight;
          const onComplete = () => {
            if (this.getElements().questionContent) {
              this.animateFadeInBottom(
                this.getElements().questionContent,
                this.animateAnswers
              );
            } else {
              this.animateAnswers();
            }
          };

          if (hasChildMathTag(questionTitle)) {
            this.animateFadeInBottom(questionTitle, onComplete);
          } else {
            this.gsapClientHook.state.gsapLib?.fromTo(
              questionTitle.lastChild,
              {
                text: '',
                height: initialHeight,
              },
              {
                duration: this.durationsValues().titleText,
                text: questionTitle.innerText,
                ease: 'power2',
                onStart: () => {
                  this.gsapClientHook.state.gsapLib?.set(questionTitle, {
                    opacity: 1,
                    height: questionTitle.clientHeight,
                  });
                },
                onComplete,
              }
            );
          }
        },
        'compare-only': () => {
          const onComplete = () => {
            if (this.getElements().compareWrapperWithMedia) {
              this.animateFadeInBottom(
                this.getElements().compareWrapperWithMedia,
                this.animateCompareTable
              );
            } else {
              this.animateCompareTable();
            }
          };

          const questionTitle = this.getElements()
            .questionTitleCompare as HTMLElement;
          const initialHeight = (questionTitle.firstChild as HTMLElement)
            .clientHeight;

          if (hasChildMathTag(questionTitle)) {
            this.animateFadeInBottom(questionTitle, onComplete);
          } else {
            this.gsapClientHook.state.gsapLib?.fromTo(
              questionTitle.firstChild,
              { text: '', height: initialHeight, opacity: 1 },
              {
                duration: this.durationsValues().titleText,
                text: questionTitle.innerText,
                ease: 'power2',
                onComplete,
              }
            );
          }
        },
      };

      record[heroType]();
    },
    animateCompareTable() {
      this.animateFadeInBottom(
        this.getElements().compareTable,
        this.animateAnswers
      );
    },
    animateAnswers() {
      const items = this.getElements().answerItems;
      const timeline = this.gsapClientHook.state.gsapLib?.timeline({
        onStart: () => {
          console.log(
            differenceInSeconds(new Date(), this.startDate!),
            'answers start'
          );
        },
        onComplete: this.animateClockImage,
      });

      items.forEach((item, index) => {
        const fromX = index === 0 || index === 2 ? -100 : 100;
        timeline!.fromTo(
          item,
          {
            opacity: 0,
            x: fromX,
            scale: 0.8,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: this.getAnimationDuration(0.5),
          },
          `+=${this.getAnimationDuration(0.5).toString()}`
        );
      });
    },
    animateClockImage() {
      const clockAnimation = this.gsapClientHook.state.gsapLib?.fromTo(
        this.getElements().clockImage,
        {
          opacity: 0,
          x: -20,
          scale: 0.5,
        },
        {
          scale: 1,
          opacity: 1,
          x: 0,
          duration: this.getAnimationDuration(1),
          onReverseComplete: () => {
            console.log(
              differenceInSeconds(new Date(), this.startDate!),
              'clock end'
            );
            this.animateCorrectAnswer();
          },
          onStart: () => {
            console.log(
              differenceInSeconds(new Date(), this.startDate!),
              'clock start'
            );
          },
        }
      );
      this.gsapClientHook.state.gsapLib?.delayedCall(
        this.getAnimationDuration(5),
        () => {
          clockAnimation!.reverse();
        }
      );
    },
    animateCorrectAnswer() {
      const correctAnswerItem = this.getElements().correctAnswer;
      const rectEl = this.getElements().answerRect as Element;

      const boxWidth = correctAnswerItem!.clientWidth;
      const boxHeight = correctAnswerItem!.clientHeight;
      const strokeWidth = 2;
      const cornerRadius = 10;

      const adjustedWidth = boxWidth - strokeWidth;
      const adjustedHeight = boxHeight - strokeWidth;

      rectEl.setAttribute('x', String(strokeWidth / 2));
      rectEl.setAttribute('y', String(strokeWidth / 2));
      rectEl.setAttribute('width', String(adjustedWidth));
      rectEl.setAttribute('height', String(adjustedHeight));
      rectEl.setAttribute('rx', String(cornerRadius));
      rectEl.setAttribute('ry', String(cornerRadius));

      const perimeter =
        2 * (adjustedWidth + adjustedHeight - 4 * cornerRadius) +
        2 * Math.PI * cornerRadius;

      this.gsapClientHook.state.gsapLib?.fromTo(
        rectEl,
        {
          strokeDasharray: perimeter,
          strokeDashoffset: perimeter,
        },
        {
          strokeDashoffset: 0,
          duration: this.getAnimationDuration(3),
          ease: 'power1.inOut',
          onStart: () => {
            console.log(
              differenceInSeconds(new Date(), this.startDate!),
              'correct answers start'
            );
            this.gsapClientHook.state.gsapLib?.set(
              this.getElements().answerRect,
              { opacity: 1 }
            );
          },
          onComplete: () => {
            console.log(
              differenceInSeconds(new Date(), this.startDate!),
              'correct answers end'
            );
            this.animateModal();
          },
        }
      );
    },
    animateModal() {
      this.questionAnimateAnswerModalRef?.showModal();

      this.gsapClientHook.state.gsapLib?.delayedCall(
        this.getAnimationDuration(2),
        () => {
          this.gsapClientHook.state.gsapLib?.to(this.getElements().modalOuter, {
            ease: 'power1.inOut',
            duration: this.getAnimationDuration(0.25),
            opacity: 1,
            onStart: () => {
              console.log(
                differenceInSeconds(new Date(), this.startDate!),
                'answer modal start'
              );
            },
            onComplete: () => {
              this.gsapClientHook.state.gsapLib?.fromTo(
                this.getElements().modal,
                {
                  opacity: 0,
                  y: -20,
                },
                {
                  opacity: 1,
                  y: 0,
                  duration: this.getAnimationDuration(0.25),
                  ease: 'power1.inOut',
                  onComplete: () => {
                    this.gsapClientHook.state.gsapLib?.fromTo(
                      this.getElements().modalTitle,
                      {
                        opacity: 0,
                        y: -20,
                      },
                      {
                        opacity: 1,
                        y: 0,
                        duration: this.getAnimationDuration(0.5),
                        onComplete: this.animateModalContentText,
                      }
                    );
                  },
                }
              );
            },
          });
        }
      );
    },
    animateModalContentText() {
      const modalContentText = this.getElements()
        .modalContentText as HTMLElement;
      const elements = Array.from(
        (modalContentText.firstChild as HTMLElement).childNodes
      ).filter((item) => item.nodeName !== '#text') as HTMLElement[];

      //set height so the content does not shift
      modalContentText.style.minHeight = modalContentText.clientHeight + 'px';

      const timeline = this.gsapClientHook.state.gsapLib?.timeline({
        onComplete: () => {
          this.gsapClientHook.state.gsapLib?.delayedCall(
            this.getAnimationDuration(2),
            this.animateModalOut
          );
        },
      });

      elements.forEach((el, index) => {
        if (el) {
          this.gsapClientHook.state.gsapLib?.set(el, { opacity: 1 });
          const initialHeight = el.clientHeight;
          timeline!.add(
            this.animateFadeInBottom(
              el,
              () => {},
              () => {
                this.gsapClientHook.state.gsapLib?.set(el, { opacity: 1 });
              },
              this.getAnimationDuration(2) / elements.length
            )!
          );
          // if (hasChildMathTag(el)) {
          //   timeline.add(
          //     this.animateFadeInBottom(
          //       el,
          //       () => {},
          //       () => {
          //         this.gsapClientHook.state.gsapLib?.set(el, { opacity: 1 });
          //       }
          //     ),
          //     `+=0.5`
          //   );
          // } else {
          //   timeline.fromTo(
          //     el,
          //     {
          //       text: '', // keep from start empty to allow animate work
          //       height: initialHeight,
          //     },
          //     {
          //       duration: DURATIONS.answerModalText,
          //       text: el.innerText,
          //       ease: 'power2',
          //       onStart: () => {
          //         this.gsapClientHook.state.gsapLib?.set(el, { opacity: 1 });
          //       },
          //     },
          //     `+=0.3`
          //   );
          // }
        }
      });
    },
    animateModalOut() {
      console.log(
        differenceInSeconds(new Date(), this.startDate!),
        'answer modal end'
      );
      this.animateFadeOutTop(
        this.getElements().modal,
        () => {},
        this.animateModalOuterOut,
        this.getAnimationDuration(0.5)
      );
    },
    animateModalOuterOut() {
      this.animateFadeOutTop(
        this.getElements().modalOuter,
        () => {},
        this.animateBlurView,
        this.getAnimationDuration(0.5)
      );
    },
    animateBlurView() {
      return this.gsapClientHook.state.gsapLib?.to(
        this.getElements().wContainer,
        {
          filter: 'blur(20px)',
          duration: this.getAnimationDuration(0.5),
          onComplete: this.animateLastView,
        }
      );
    },
    animateLastView() {
      const timeline = this.gsapClientHook.state.gsapLib!.timeline({
        onStart: () => {
          console.log(
            differenceInSeconds(new Date(), this.startDate!),
            'view start'
          );
        },
        onComplete: this.onFinish,
      });
      timeline.add(
        this.animateFadeInBottom(
          this.getElements().start1,
          undefined,
          undefined,
          this.getAnimationDuration(0.5)
        )
      );
      timeline.add(
        this.animateFadeInBottom(
          this.getElements().startTImage,
          undefined,
          undefined,
          this.getAnimationDuration(0.5)
        )
      );
      timeline.add(
        this.animateFadeInBottom(
          this.getElements().start2,
          undefined,
          undefined,
          this.getAnimationDuration(0.5)
        )
      );
      timeline.add(
        this.animateFadeInBottom(
          this.getElements().endLink,
          undefined,
          undefined,
          this.getAnimationDuration(0.5)
        )
      );
      timeline.add(
        this.animateFadeInBottom(
          this.getElements().endLine,
          undefined,
          undefined,
          this.getAnimationDuration(0.5)
        )
      );
      timeline.add(
        this.animateFadeInBottom(
          this.getElements().endSocial,
          undefined,
          undefined,
          this.getAnimationDuration(0.5)
        )
      );
    },
    // animateSocials() {
    //   const items = this.getElements().socialItems;
    //   let timeline = this.gsapClientHook.state.gsapLib?.timeline({
    //     onStart: () => {
    //       console.log(
    //         differenceInSeconds(new Date(), this.startDate),
    //         'social start'
    //       );
    //     },
    //     onComplete: this.onFinish,
    //   });
    //
    //   Array.from(items)
    //     .reverse()
    //     .forEach((item, index) => {
    //       timeline.fromTo(
    //         item,
    //         {
    //           opacity: 0,
    //           y: -50,
    //           scale: 1.3,
    //         },
    //         {
    //           opacity: 1,
    //           y: 0,
    //           scale: 1,
    //           duration: this.getAnimationDuration(0.5),
    //         },
    //         `+=${this.getAnimationDuration(0.5).toString()}`
    //       );
    //     });
    // },
    onFinish() {
      this.recordState = RECORD_STATE.inactive;
      this.stopTimeCut();
      console.log(differenceInSeconds(new Date(), this.startDate!), 'final');
    },
    /**@return {{
     * page :HTMLElement ,
     * article:HTMLElement,
     * examQuestionWrapper:HTMLElement,
     * header:HTMLElement,
     * questionTitle:HTMLElement,
     * questionTitleCompare:HTMLElement,
     * compareWrapper:HTMLElement,
     * compareWrapperWithMedia:HTMLElement,
     * compareTable:HTMLElement,
     * answerItems:HTMLElement[],
     * questionContent:HTMLElement
     * clockImage:HTMLElement
     * correctAnswer:HTMLElement
     * answerRect:HTMLElement
     * modalOuter:HTMLElement
     * modal:HTMLElement
     * modalTitle:HTMLElement
     * modalContentText:HTMLElement
     * wContainer:HTMLElement
     * wContainer:HTMLElement
     * start1:HTMLElement
     * startTImage:HTMLElement
     * start2:HTMLElement
     * endLink:HTMLElement
     * endLine:HTMLElement
     * endSocial:HTMLElement
     * }}
     * */
    getElements() {
      return {
        page: document.querySelector('.question-animate-page'),
        article: document.querySelector('.exam-part-article'),
        examQuestionWrapper: document.querySelector('.exam-question-wrapper'),
        header: document.querySelector('.exq-i'),
        questionTitle: document.querySelector('.asd-wrap .s-title'),
        questionDesc: document.querySelector('.asd-wrap .s-desc'),
        questionTitleCompare: document.querySelector(
          '.asd-wrap .aq-compare-wrapper__hero'
        ),
        compareWrapper: document.querySelector('.asd-wrap .aq-compare-wrapper'),
        compareWrapperWithMedia: document.querySelector(
          '.asd-wrap .aq-compare-wrapper__media'
        ),
        compareTable: document.querySelector('.s-compare-c'),
        questionContent: document.querySelector('.aq-content'),
        answerItems: Array.from(document.querySelectorAll('.a-select-item')),
        clockImage: document.querySelector('.clock-image'),
        correctAnswer: document.querySelector('.a-select-item.correct-answer'),
        answerRect: document.querySelector(
          `.${this.questionAnimateConfig.classes.answerRect} rect`
        ),
        modalOuter: document.querySelector('.p-dialog-mask'),
        modal: document.querySelector('#question-animate-answer-modal'),
        modalTitle: document.querySelector(
          '#question-animate-answer-modal .qn-title-wrapper'
        ),
        modalContentText: document.querySelector(
          '#question-animate-answer-modal .math-text'
        ),
        wContainer: document.querySelector('.w-container'),
        start1: document.querySelector('.start-t-1'),
        startTImage: document.querySelector('.start-t-image'),
        start2: document.querySelector('.start-t-2'),
        endLink: document.querySelector('.qae-c__link'),
        endLine: document.querySelector('.qae-c__line'),
        endSocial: document.querySelector('.qae-c__end'),
      };
    },
  },
};
</script>
<style lang="scss">
@use '@/assets/scss/mixin' as *;

@mixin clock-image-style() {
  .clock-image {
    display: block;
    position: absolute;
    //this position for title only case
    top: auto;
    bottom: 0;
    left: 5px;
    width: 50px;
    height: 50px;
    opacity: 0;
  }

  @at-root {
    //title with media
    .title-with-media .clock-image {
      top: 50%;
      width: 60px;
      height: 60px;
    }
    //compare table only
    .compare-table-only .clock-image {
      top: 15%;
    }
    //compare with media
    .compare-with-media .clock-image {
      width: 60px;
      height: 60px;
      top: 30%;
    }
  }
}
@mixin responsive-style() {
  .exam-question .exam-question-wrapper {
    opacity: 0;
    .s-desc {
      display: none;
    }

    .exq-i {
      display: grid;
      grid-auto-flow: column;
      .br-title {
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        justify-self: flex-end;
        grid-column: 3;
      }
    }
  }
  .exam-question .aq-compare-wrapper__hero {
    grid-template-columns: 1fr !important;
  }

  .answer-select-wrapper {
    grid-template-columns: 1fr !important;
  }

  .asd-w {
    grid-template-columns: 1fr !important;
  }

  .exam-part-article {
    margin: 0 !important;
    opacity: 0;
    .exam-part-article-iw {
      padding-top: 0 !important;
      .ep-title {
        display: none !important;
      }
    }
    .ep-ren {
      * {
        font-size: 18px !important;
      }
    }
  }
}
//page
.question-animate-page {
  opacity: 0;
  $width: 696px;
  $height: 1230px;
  width: $width;
  max-width: $width;
  height: $height;
  max-height: $height;
  .w-container {
    padding: 120px 90px 210px !important;
    height: 100%;
    .m-content {
      height: 100%;
      .aa-q {
        height: 100%;
      }
    }
  }

  @include clock-image-style();

  .asd-wrap .s-title {
    opacity: 0;
  }

  //case compare with medial
  &.has-aq-compare-wrapper .asd-wrap {
    .s-title {
      opacity: 1;
    }
    .aq-compare-wrapper__hero {
      > :first-child {
        opacity: 0;
      }
    }
    .aq-compare-wrapper__media,
    .s-compare-c {
      opacity: 0;
    }
  }

  .aq-content {
    opacity: 0;
  }

  .a-select-item {
    opacity: 0;
    border: none;
    &.correct-answer {
    }

    .answer-rect-class {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      rect {
        opacity: 0;
      }
    }
  }

  .qae-c {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 115px;
    z-index: 11111111;
    left: 50%;
    transform: translate(-50%, 0);
    flex-direction: column;
    p {
      margin: 0 !important;
    }
    h1,
    h2,
    h3 {
      text-align: center !important;
    }
    .start-t-1,
    .start-t-2 {
      text-align: center;
      opacity: 0;
      white-space: nowrap;
      span {
        font-size: 60px;
      }
      strong {
        color: var(--purple-8c);
        font-size: 80px;
      }
    }
    .start-t-image {
      margin: 15px auto;
      opacity: 0;
      width: 500px;
    }

    &__line {
      opacity: 0;
      display: flex;
      height: 1px;
      background-color: #000;
      width: 100%;
      margin: 2px auto;
    }

    &__link {
      opacity: 0;
      display: flex;
      margin-top: 30px;
      justify-content: center;
      align-items: center;
      font-size: 50px !important;
      direction: ltr;
      span:nth-child(3) {
        font-weight: bold;
        color: var(--purple-8c);
        font-size: 80px !important;
      }
    }

    &__end {
      opacity: 0;
      margin-top: 15px;
      display: flex;
      align-items: baseline;
      //gap: 20px;
      justify-content: center;
      &__icons {
        display: flex;
        align-items: center;
        //gap: 10px;
        svg {
          fill: #000;
          height: 40px;
          width: 40px;
        }
        i {
          font-size: 40px;
          margin-inline-end: 10px;
          &:nth-child(2) {
            color: #0088cc;
          }
          &:nth-child(5) {
            color: #1877f2;
          }
        }
      }
      &__text {
        display: block;
        font-size: 60px;
        direction: ltr;
        margin-inline-end: 20px;
      }
    }
  }

  @include responsive-style();
}
</style>
