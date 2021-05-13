<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute fullscreen">
      <div class="q-py-lg q-px-md row q-col-gutter-md items-end">
        <div class="col">
          <q-input
            autogrow
            bottom-slots
            v-model="newQweetContent"
            placeholder="What's Happening"
            counter
            maxlength="280"
            class="newQweet"
          >
            <template v-slot:before>
              <q-avatar size="xl">
                <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
              </q-avatar>
            </template>
          </q-input>
        </div>
        <div class="col col-shrink">
          <q-btn
            @click="addQweet"
            :disable="!newQweetContent"
            unelevated
            rounded
            color="primary"
            label="Qweet"
            class="q-mb-lg"
            no-caps
          />
        </div>
      </div>

      <q-list separator>
        <transition-group
          appear
          enter-active-class="animated fadeIn slow"
          leave-active-class="animated fadeOut slow"
        >
          <q-item class="q-py-md" v-for="qweet in qweets" :key="qweet.id">
            <q-item-section avatar top>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>
                <strong>Janet</strong>
                <span class="text-grey-7 q-ml-xs">
                  @janet.com
                  <br class="lt-md" />
                  &bull; {{ qweet.date | relativeDate }}
                </span>
              </q-item-label>
              <q-item-label class="qweet-content">
                {{ qweet.content }}
              </q-item-label>
              <div class="qweet-icons row justify-between q-mt-sm">
                <q-btn
                  flat
                  size="sm"
                  round
                  color="grey"
                  icon="far fa-comment"
                />
                <q-btn flat size="sm" round color="grey" icon="fa fa-retweet" />
                <q-btn
                  @click="toggleLike(qweet)"
                  flat
                  size="sm"
                  round
                  :color="qweet.liked ? 'pink' : 'grey'"
                  :icon="qweet.liked ? 'fas fa-heart' : 'far fa-heart'"
                />
                <q-btn
                  @click="deleteQweet(qweet)"
                  flat
                  size="sm"
                  round
                  color="grey"
                  icon="fas fa-trash"
                />
              </div>
            </q-item-section>
          </q-item>
        </transition-group>
      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script>
import db from "../boot/firebase";
import { formatDistance } from "date-fns";

export default {
  name: "PageHome",
  data() {
    return {
      newQweetContent: "",
      qweets: [
        // {
        //   id: 1,
        //   content:
        //     "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has ",
        //   date: 1620134960068,
        //   liked: false
        // },
        // {
        //   id: 2,
        //   content:
        //     "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has ",
        //   date: 1620134960068,
        //   liked: false
        // },
        // {
        //   id: 3,
        //   content:
        //     "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has ",
        //   date: 1620134960068,
        //   liked: false
        // },
        // {
        //   id: 4,
        //   content:
        //     "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has ",
        //   date: 1620134960068,
        //   liked: true
        // },
      ],
    };
  },
  filters: {
    relativeDate(value) {
      return formatDistance(value, new Date(), { addSuffix: true });
    },
  },
  methods: {
    addQweet() {
      let newQweet = {
        content: this.newQweetContent,
        date: Date.now(),
        liked: false,
      };
      db.collection("qweets")
        .add(newQweet)
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
      this.newQweetContent = "";
    },
    deleteQweet(qweet) {
      db.collection("qweets")
        .doc(qweet.id)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    },
    toggleLike(qweet) {
      db.collection('qweets').doc(qweet.id)
        .update({
          liked: !qweet.liked,
        })
        .then(() => {
          console.log("Document successfully updated!")
        })
        .catch((error) => {
          console.error("Error updating document: ", error)
        })
    },
  },
  mounted() {
    db.collection("qweets")
      .orderBy("date")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          let qweetChange = change.doc.data();
          qweetChange.id = change.doc.id;
          if (change.type === "added") {
            console.log("New qweet: ", qweetChange);
            this.qweets.unshift(qweetChange);
          }
          if (change.type === "modified") {
            console.log("Modified qweet: ", qweetChange);
            let index = this.qweets.findIndex(
              (qweet) => qweet.id === qweetChange.id
            );
            Object.assign(this.qweets[index], qweetChange);
          }
          if (change.type === "removed") {
            console.log("Removed qweet: ", qweetChange);
            let index = this.qweets.findIndex(
              (qweet) => qweet.id === qweetChange.id
            );
            this.qweets.splice(index, 1);
          }
        });
      });
  },
};
</script>

<style>
.newQweet textarea {
  font-size: 19px;
  line-height: 1.4 !important;
}

.qweet-icons {
  margin-left: -5px;
}
</style>
