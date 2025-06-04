<template>
<div class="chat-app-service">
    <chat-window
        v-bind="chatProps"
        @fetch-more-rooms="fetchMoreRooms"
        @send-message="sendMessage"
        @edit-message="editMessage"
        @delete-message="deleteMessage"
        @fetch-messages="fetchMessages"
        @open-file="openFile"
        @add-room="addRoom()"
        @search-room="searchRoom($event.detail[0].value)"
      />
</div>
</template>



<script lang="ts">
import {sleepUtil } from '~/main/utils/shared-utils';
import { fileTypes } from '~/main/constants/file-types.enum';
import { buildHub, chatHub } from '~/main/services/useChatHubService';
import { debounceUtil,deepCloneUtil,cloneUtil } from '~/main/utils/lodash.utils';
import { useSetupRoute } from '~/main/services/setup/useSetupRoute';
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';
import { UserRoles } from '~/core/auth/constants/user-roles';
import  ChatWindow  from 'vue-advanced-chat'
import 'vue-advanced-chat/dist/vue-advanced-chat.css'


type ChatMessage = {
  _id: number;
  content: string;
  senderId: number | string;
  username: string;
  date: string;
  timestamp: string;
};

export default {
  
setup() {
    

    return{
      ...useSetupRoute(),
      ...useSetupAuth(),
      ...useToastMessage(),
    }

  },

  components: {
      ChatWindow
    },

  data() {
    return {
      libInstance: null,
      currentUserId: null as any,
      scrollDistance: 100,
      roomId: '',
      roomMessage: '',
       messages: [] as any,
      messagesLoaded: false,
      loadingRooms: false,
      isDevice: false,
      typingMessageCache: '',
      role: UserRoles,
      messageActions: [
        {
          name: 'replyMessage',
          title: 'رد',
        },
        {
          name: 'editMessage',
          title: 'تعديل',
          onlyMe: true,
        },
        {
          name: 'deleteMessage',
          title: 'حذف',
          onlyMe: true,
        },
      ],
      roomActions: [
        { name: 'deleteRoom', title: 'حذف المستخدم' },
        /*{ name: 'removeUser', title: 'Remove User' },*/
        /*{ name: 'inviteUser', title: 'Invite User' },*/
      ],
      menuActions: [
        { name: 'deleteRoom', title: 'حذف المستخدم' },
        /*{ name: 'inviteUser', title: 'Invite User' },*/
        /*{ name: 'removeUser', title: 'Remove User' },*/
      ],
      textMessages: {
        ROOMS_EMPTY: 'المحادثات الفارغة',
        ROOM_EMPTY: 'لا يوجد محادثات',
        NEW_MESSAGES: 'رسالة جديدة',
        MESSAGE_DELETED: 'حذف الرسالة',
        MESSAGES_EMPTY: 'لا يوجد محادثات',
        CONVERSATION_STARTED: 'تم إنشاء المحادثة بتاريخ :',
        TYPE_MESSAGE: 'كتابة رسالة',
        SEARCH: 'بحث',
        IS_ONLINE: 'متصل',
        LAST_SEEN: 'آخر ظهور ',
        IS_TYPING: '...يكتب الآن',
        CANCEL_SELECT_MESSAGE: 'الغاء التحديد',
      },
      messageSelectionActions: [{ name: 'deleteMessages', title: 'حذف' }],
      // eslint-disable-next-line vue/no-unused-properties
      styles: { container: { borderRadius: '4px' }} as any,
      theme: 'light' as any,
      templatesText: [
        {
          tag: 'help',
          text: 'This is the help',
        },
        {
          tag: 'action',
          text: 'This is the action',
        },
        {
          tag: 'action 2',
          text: 'This is the second action',
        },
      ],
      fileTypes,
      isType: false,
      typingTimer: null as any,
      autoScroll: {
        send: {
          new: true, // will scroll down after sending a message
          newAfterScrollUp: false, // will not scroll down after sending a message when scrolled up
        },
        receive: {
          new: true, // will not scroll down when receiving a message
          newAfterScrollUp: true, // will scroll down when receiving a message when scrolled up
        },
      },
      hasSearch: false,
      searchRoomText: null as any,
      oldSearch: null,
    };
  },

  async created() {
    // this.roomsLoaded = true;
  },

  async mounted() {
    this.initialChat();
    this.isDevice = window.innerWidth < 500;
    window.addEventListener('resize', (ev) => {
      if (ev.isTrusted) this.isDevice = window.innerWidth < 500;
    });
  },

  watch: {
    chatHubLoaded: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (newVal) {
          //this.initialChat();
        }
      },
    },
  },

  beforeDestroy() {
    this.userOnline(null);
  },

  methods: {
    async initialChat() {
      await this.fetchRooms();
      if (!chatHub) {
        const token = this.appAuth.strategy.token.get().replace('Bearer ', '');
        await buildHub(token);
      }
      chatHub?.on('ReceiveMessage', (message) => {
        this.manageReceiveMessage(message);
      });
      chatHub?.on('ReceiveTypingUser', (room) => {
        this.receiveTypeUser(room);
      });
      chatHub?.on('SeenMessages', async (isSeen) => {
        if (isSeen) {
          this.messages = this.messages.map((msg) => ({
            ...msg,
        seen: true,
            }));
        }
      });
    },

    async userOnline(roomId) {
      try {
        await this.testConnection();
        let _roomId = null;
        if (roomId) {
          _roomId = roomId.toString();
        }
        //await this.$axios.$post(`/userOnline`, { room: roomId });
      chatHub?.invoke('UserOnLine', _roomId)
          .then((res) => {})
          .catch(function (err) {
            return console.error(err.toString());
          });
      } catch (e) {
        console.log('userOnline', e);
      }
    },

    /*async searchRoom(search) {
      this.hasSearch = true;
      this.searchRoomText = search.value;

      await sleep(3000);
      this.hasSearch = false;
    },*/

    rawSearchRoom(searchVal: string) {
    this.searchRoomText = searchVal;
    this.$store.dispatch('searchChatRooms', {
      pageNum: 1,
      pageSize: 40,
      searchText: searchVal,
      isSearch: true,
    }).then((res: any) => {
      if (res.page.length > 0) {
        this.roomId = this.rooms[0]?.roomId;
      }
    }).catch(() => {});
  },
    //@ts-expect-error access debounce
    searchRoom: debounceUtil(function(searval){this.rawSearchRoom(searval)},500,
  { leading: false, trailing: true }
),

    async fetchRooms(pageNum = 1, pageSize = 40) {
      try {
        this.$store.commit('RESET_CHAT_ROOMS_LIST');
        this.loadingRooms = true;
        await this.$store.dispatch('getChatRooms', {
          pageNum: pageNum,
          pageSize: pageSize,
        });
        this.roomId = this.rooms[0]?.roomId;
        this.loadingRooms = false;
      } catch (e) {
        console.log('fetchRooms: ' + e);
      }
    },

    async fetchMoreRooms() {
      if (!this.searchRoomText) {
        await this.$store.dispatch('getChatRooms', {
          pageNum: this.roomsData.currentPage + 1,
          pageSize: 40,
        });
        //this.roomId = this.rooms[0]?.roomId;
      } else {
        await this.$store.dispatch('searchChatRooms', {
          pageNum: this.roomsData.currentPage + 1,
          pageSize: 40,
          searchText: this.searchRoomText,
        });
      }
    },

    async fetchMessages({ room, options = {} }) {
      if (room.roomId) {
        this.messagesLoaded = false;
        const { data: res } = await this.$axios.get(`/chat/${room.roomId}`);
        this.messages = [...res];
        this.messagesLoaded = true;
        let rooms = deepCloneUtil(this.$store.state.chatRoomsList);
        rooms.map((k) => {
          if (k.roomId == room.roomId) {
            return (k.unreadCount = 0);
          }
        });
        this.$store.commit('SET_CHAT_ROOMS_SEARCH', rooms);
        this.$store.dispatch('getUnreadMessages');
      }
      //this.userOnline(room.roomId);
    },

    addMessages(reset: boolean): ChatMessage[] {
    const messages: ChatMessage[] = [];

    for (let i = 0; i < 30; i++) {
    messages.push({
      _id: reset ? i : this.messages.length + i,
      content: `${reset ? '' : 'paginated '}message ${i + 1}`,
      senderId: this.currentUserId,
      username: 'John Doe',
      date: '13 November', 
      timestamp: '10:20',  
    });
    }

    return messages;
    },

    getFilesObjectUrl(files) {
      let urls = [] as any;
      files.forEach((k) => {
        urls.push(k.name);
      });
      return urls;
    },

    async deleteMedia(messageId, mediaId) {
      try {
        await this.$axios.delete(`chat/${messageId}/deleteMedia/${mediaId}`);
      } catch (e) {
        console.log(e);
      }
    },

    sendeMessage2(val)  {
        console.log(val)
    },

    /*signal R send methods*/
    async sendMessage({ content, roomId, files, replyMessage }) {
      try {
        await this.testConnection();
        const message = {
          _id: this.messages.length,
          content: content,
          senderId: this.currentUserId,
          timestamp: new Date().toString().substring(16, 21),
          date: new Date().toDateString(),
          distributed: true,
          seen: false,
          new: false,
          deleted: false,
          files:null as any,
          replyMessage:null as any,
          /*reactions: { '😁': ['1234'] },*/
        };

        if (files) {
          message.files = this.formattedFiles(files);
        }

        if (replyMessage) {
          message.replyMessage = {
            _id: replyMessage._id,
            content: replyMessage.content,
            sender_id: replyMessage.senderId,
            files: [],
          };

          if (replyMessage.files) {
            message.replyMessage.files = this.getFilesObjectUrl(
              this.formattedFiles(replyMessage.files)
            );
          }
        }

        if (files) {
          if (this.checkFileType(files[0])) {
            for (let index = 0; index < files.length; index++) {
              await this.uploadFile({
                file: files[index],
                messageId: 5,
                roomId,
                message: message,
                index: index,
              });
            }
          } else {
            return;
          }
        }

        //this.messages = [...this.messages, message];

        await chatHub?.invoke('SendMessage', {
            roomId: roomId,
            content: content,
            files: files ? this.getFilesObjectUrl(message.files) : [],
            replyMessage: null,
          })
          .then((res) => {})
          .catch(function (err) {
            return console.error(err.toString());
          });
      } catch (e) {
        console.log(e);
      }
    },

    async editMessage({ messageId, newContent, roomId, files }) {
      await this.testConnection();
      const newMessage = { edited: new Date() } as any;
      const oldMessage =
        this.messages[this.messages.findIndex((k) => k._id == messageId)];
      newMessage.content = newContent;

      if (files) {
        newMessage.files = this.formattedFiles(files);
      }

      if (oldMessage.files) {
        for (let index = 0; index < oldMessage.files.length; index++) {
          if (newMessage.files) {
            if (
              !newMessage.files.some(
                (t) => t.name == oldMessage.files[index].name
              )
            ) {
              await this.deleteMedia(messageId, oldMessage.files[index]._id);
            }
          } else {
            await this.deleteMedia(messageId, oldMessage.files[index]._id);
          }
        }
      }

      if (files) {
        for (let index = 0; index < files.length; index++) {
          if (files[index]?.blob) {
            await this.uploadFile({
              file: files[index],
              messageId,
              roomId,
              message: newMessage,
              index: index,
            });
          }
        }
      }

      const compareFiles = [] as any;
      if (newMessage.files) {
        newMessage.files.forEach((k) => {
          if (!oldMessage.files.some((t) => t.name == k.name)) {
            compareFiles.push(k);
          }
        });
      }

      await chatHub?.invoke('UpdateMessage', {
          roomId: roomId,
          messageId: messageId,
          content: newMessage.content,
          files: compareFiles ? this.getFilesObjectUrl(compareFiles) : [],
        })
        .catch(function (err) {
          return console.error(err.toString());
        });
      //await firestoreService.updateMessage(roomId, messageId, newMessage);

      /*const res = await this.$axios.$put(`chat/updateMessage`, {
        messageId: messageId,
        message: newMessage.content,
        files: compareFiles ? this.getFilesObjectUrl(compareFiles) : [],
      });*/

      /*if (res._id) {
        const _index = this.messages.findIndex((k) => k._id == res._id);
        this.messages.splice(_index, 1, res);
      }*/
    },

    /*async replayMessage({ content, roomId, files, replyMessage }) {
      const message = {
        _id: this.messages.length,
        content: content,
        senderId: this.currentUserId,
        timestamp: new Date().toString().substring(16, 21),
        date: new Date().toDateString(),
        distributed: true,
        seen: false,
        new: false,
        deleted: false,
        /!*reactions: { '😁': ['1234'] },*!/
      };

      if (files) {
        message.files = this.formattedFiles(files);
      }

      if (replyMessage) {
        message.replyMessage = {
          _id: replyMessage._id,
          content: replyMessage.content,
          sender_id: replyMessage.senderId,
          files: replyMessage.files ? replyMessage.files : [],
        };

        if (replyMessage.files) {
          message.replyMessage.files = replyMessage.files;
        }
      }

      if (files) {
        if (this.checkFileType(files[0])) {
          for (let index = 0; index < files.length; index++) {
            await this.uploadFile({
              file: files[index],
              messageId: 5,
              roomId,
              message: message,
              index: index,
            });
          }
        } else {
          return;
        }
      }

      //this.messages = [...this.messages, message];

      //console.log(message)
      await chatHub?
        .invoke('SendMessage', {
          roomId: roomId,
          message: content,
          files: files ? this.getFilesObjectUrl(message.files) : [],
          replyMessage: replyMessage ? message.replyMessage : null,
        })
        .catch(function (err) {
          return console.error(err.toString());
        });

      /!*const res = await this.$axios.$post(`chat/addMessage`, {
        roomId: roomId,
        message: content,
        files: files ? this.getFilesObjectUrl(message.files) : [],
        replyMessage: replyMessage ? message.replyMessage : null,
      });*!/

      /!*if (res._id) {
        message._id = res._id;
        this.messages = [...this.messages, message];
      }*!/
    },*/

    async deleteMessage({ message, roomId }) {
      await this.testConnection();
      await chatHub?.invoke('DeleteMessage', roomId, message._id)
        .catch(function (err) {
          return console.error(err.toString());
        });
    },

    /*signal R receive methods*/
    async manageReceiveMessage(message) {
      await this.testConnection();
      if (message.deleted) {
        this.receiveDelete(message);
      } else if (message.edited) {
        this.receiveEdited(message);
      } else if (message.replyMessage) {
        this.receiveReply(message);
      } else {
        this.receiveAdd(message);
      }
      chatHub?.invoke('ListRooms', this.roomId).catch(function (err) {
        return console.error(err.toString());
      });
    },

    receiveDelete(message) {
      this.messages.splice(
        this.messages.findIndex((k) => k._id == message._id),
        1,
        message
      );
    },

    receiveEdited(message) {
      this.messages.splice(
        this.messages.findIndex((k) => k._id == message._id),
        1,
        message
      );
    },

    receiveReply(message) {
      this.messages = [...this.messages, message];
    },

    receiveAdd(message) {
      this.messages = [...this.messages, message];
    },

    receiveTypeUser(room) {
      try {
        const rooms = deepCloneUtil(this.rooms);
        const index = this.rooms.findIndex((k) => k.roomId == room.roomId);
        if (index !== -1) {
          rooms[index].typingUsers = room.typingUsers;
          this.$store.commit('SET_CHAT_ROOMS', rooms);
        }
      } catch (e) {
        console.log(e);
      }
    },

    /*files method */
    openFile({ file }) {
      window.open(file.file.url, '_blank');
    },

    checkFileType(file) {
      const allowTypes = [
        'pdf',
        'mp4',
        'png',
        'jpg',
        'jpeg',
        'audio/mp3',
        'mp3',
      ];
      let type = file.extension || file.type;
      if (allowTypes.some((t) => t == type)) {
        return true;
      } else {
        this.showError({ summary: 'لم تنجح عملية التسجيل ....' });
        return false;
      }
    },

    getFileType(type) {
      if (type.match('image.*') || type == 'jpg') {
        return this.fileTypes.photo;
      } else if (type.match('video.*') || type === 'mp4') {
        return this.fileTypes.video;
      } else if (type.match('audio.*') || type.includes('mp3')) {
        return this.fileTypes.audio;
      } else if (type.match('application/pdf')) {
        return this.fileTypes.pdf;
      } else {
        return 4;
      }
    },

    async uploadFile({ file, messageId, roomId, message, index }) {
      return new Promise(async (resolve) => {
        let type = file.extension || file.type;
        if (type === 'svg' || type === 'pdf') {
          type = file.type;
        }

        const fileObj = new File([file.blob], file.name, {
          lastModified: new Date().getTime(),
          type: file.type,
        });

        const obj = {
          File: fileObj,
          Type: 23,
          Media: this.getFileType(type),
          duration: file.duration ? file.duration : 0,
        };
        const formData = new FormData();
        Object.keys(obj).forEach((key) => formData.append(key, obj[key]));

        await this.$axios
          .post('media/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          .then(async (res:any) => {
            console.log(res)
            message.files[index].url = res.data.pictureUrl;
            message.files[index].name = res.data.fileName;
          });
        resolve(true);
      });
    },

    updateFileProgress(messageId, fileUrl, progress) {
      const message = this.messages.find(
        (message) => message._id === messageId
      );

      if (!message || !message.files) return;

      message.files.find((file) => file.url === fileUrl).progress = progress;
      this.messages = [...this.messages];
    },

    formattedFiles(files) {
      const formattedFiles = [] as any;

      files.forEach((file) => {
        const messageFile:any = {
          name: file.name,
          size: file.size,
          type: file.type,
          extension: file.extension || file.type,
          url: file.url || file.localUrl,
        };

        if (file.audio) {
          messageFile.audio = true;
          messageFile.duration = file.duration;
        }

        formattedFiles.push(messageFile);
      });

      return formattedFiles;
    },

    addNewMessage() {
      setTimeout(() => {
        this.messages = [
          ...this.messages,
          {
            _id: this.messages.length,
            content: 'NEW MESSAGE',
            senderId: '1234',
            timestamp: new Date().toString().substring(16, 21),
            date: new Date().toDateString(),
          },
        ];
      }, 2000);
    },

    typingMessage({ message, roomId }) {
      try {
        if (roomId) {
          this.typingTimerFun(message, roomId);
          if (message && message.length > 0 && !this.isType) {
            this.isType = true;
            this.typingMessageFun(message, roomId);
          }

          if ((!message || message.length == 0) && this.isType) {
            this.isType = false;
            this.typingMessageFun('', roomId);
          }
        }
      } catch (e) {
        console.log(e);
      }
    },

    typingTimerFun(message, roomId) {
      if (this.typingTimer) {
        clearTimeout(this.typingTimer);
      }
      if (message) {
        this.typingTimer = setTimeout(() => {
          this.isType = false;
          this.typingMessageFun('', roomId);
        }, 3000);
      }
    },

    async typingMessageFun(message, roomId) {
      try {
        await this.testConnection();
        chatHub?.invoke('TypingUsers', roomId, this.currentUserId, message)
          .catch(function (err) {
            return console.error(err.toString());
          });
      } catch (e) {
        console.log(e);
      }
    },

    async addRoom() {
      try {
        localStorage.setItem('isRegisterChat', 'yes');
        await this.$axios.post(`/chat`, { receivedUserId: 1 });
      } catch (e) {
        console.log(e);
      }
    },

    async deleteRoom(roomId) {
      const res = await this.$axios.delete(`/chat/${roomId}`);
    },

    async testConnection() {
      try {
        return new Promise(async (resolve, reject) => {
          if (
            (chatHub && !chatHub.connectionId) ||
            (!chatHub &&  this.appAuth.loggedIn)
          ) {
            const token = this.appAuth.strategy.token
              .get()
              .replace('Bearer ', '');
            await buildHub(token);
            resolve(true);
          } else {
            resolve(true);
          }
        });
      } catch (e) {
        console.log('testConnection:', e);
      }
    },

    getSearchRoom() {
      const search = this.$store.state.chatRoomsList.filter((k) =>
        k.roomName.includes(this.searchRoomText)
      );
      if (search && search.length > 0) {
        this.oldSearch = cloneUtil(search);
        return search;
      }
      return this.oldSearch;
    },
  },

  computed: {
    chatProps() {
    return {
      'current-user-id': this.currentUserId,
      'room-id': this.roomId,
      'position-right':"auto",
      rooms: this.rooms,
      messages: this.messages,
      'loading-rooms': this.loadingRooms,
      'messages-loaded': this.messagesLoaded,
      'message-actions': this.messageActions,
      'message-selection-actions': this.messageSelectionActions,
      'text-messages': this.textMessages,
      'templates-text': this.templatesText,
      'auto-scroll': this.autoScroll,
      'room-info-enabled':false,
      'show-reaction-emojis':false,
      'single-room': !this.isAdmin,
      'show-add-room':false,
    'custom-search-room-enabled':this.isAdmin,
      theme: this.theme,
      styles: this.styles,
      height: this.screenHeight,
      };
  },


    isAdmin() {
      return  this.appAuth.user.role == this.role.admin;
    },

    screenHeight() {
      return this.isDevice ? window.innerHeight + 'px' : '530px';
    },

    rooms():any {
      if (
        this.$store.state.chatRoomsList &&
        this.$store.state.chatRoomsList.length > 0
      ) {
        /*if (this.searchRoomText) {
          return [...this.getSearchRoom()];
        }*/
        return [...this.$store.state.chatRoomsList];
      } else {
        return [];
      }
    },

    roomsData() {
      return this.$store.state.chatRooms;
    },

    roomsLoaded() {
      return this.roomsData.currentPage >= this.roomsData.totalPages;
    },

    chatHubLoaded() {
      return this.$store.state.hasChatHub;
    },
  },
};
</script>


<style lang="scss">
.chat-app-service{
    direction: ltr;
    margin: 30px 0 !important;

    #room-footer{
        padding: 10px 0;
    }
    #roomTextarea{
        text-align: right;
    }
    .vac-room-container{
        column-gap: 10px;
    }
    .vac-info-wrapper{
        column-gap: 10px;
    }
    .vac-box-search{
        padding: 5px;
        .vac-input{
text-align: right;
        }
    }
}
</style>