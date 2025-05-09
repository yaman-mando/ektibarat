<template>
  <lazy-prime-dialog
    id="cropper-modal"
    v-model:visible="isOpenModel"
    :dismissableMask="false"
    class="cropper-modal"
    :showHeader="true"
    @hide="close()"
  >
    <i
      class="fa fa-close close-btn"
      @click="close()"
    ></i>
    <cropper
      ref="cropper"
      class="cropper"
      :stencilProps="{ aspectRatio: ratio ? ratio : null }"
      :src="img"
    />

    <div class="action-btns">
      <i
        v-if="hasDelete"
        class="fa fa-trash"
        @click="onDelete"
      ></i>
      <app-button
        size="sm"
        label="تدوير"
        @click="rotateImage()"
      />
      <app-button
        label="حفظ"
        @click="save()"
      />
    </div>
  </lazy-prime-dialog>
</template>
<script lang="ts">
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

export default {
  components: {
    Cropper,
  },
  props: {
    img: {
      type: String,
      default: '',
    },
    ratio: {
      type: Number,
      default: null,
    },
    openCropper: {
      type: Boolean,
      default: false,
    },
    hasDelete: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:openCropper', 'cropImg', 'onDelete'],
  computed: {
    isOpenModel: {
      get() {
        return this.openCropper;
      },
      set(val) {
        this.$emit('update:openCropper', val);
      },
    },
  },
  methods: {
    async save() {
      if (!this.$refs.cropper) return;

      //@ts-expect-error access cropper result
      const { canvas, image } = this.$refs.cropper.getResult();
      const type = image.src.split(';')[0].split('/')[1];
      //@ts-expect-error access cropper result
      const result = canvas.toDataURL(`${'image' / type}`);

      this.$emit('cropImg', result);
      this.close();
    },

    close() {
      this.isOpenModel = false;
    },
    rotateImage() {
      //@ts-expect-error access cropper result
      this.$refs.cropper.rotate(90);
    },

    onDelete() {
      this.$emit('onDelete');
      this.close();
    },
  },
};
</script>
<style lang="scss">
#cropper-modal___BV_modal_outer_ {
  z-index: 1100 !important;
  .modal-body {
    position: relative;
    .close-btn {
      position: absolute;
      cursor: pointer;
      left: 3px;
      top: 2px;
      font-size: 20px;
      font-weight: bold;
      color: var(--purple-8c);
    }
  }

  .cropper {
    height: 600px;
    max-height: calc(100vh - 175px);
    //width: 600px;
    background: #ddd;
  }
  .action-btns {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    button {
      background: var(--purple-af);
      border-radius: 8px;
      font-size: 14px;
      width: 150px;
      height: 32px;
      margin-inline-end: 10px;
    }
    i {
      font-size: 20px;
      cursor: pointer;
      color: var(--red-63);
      margin-inline-end: 25%;
    }
  }
}
</style>
