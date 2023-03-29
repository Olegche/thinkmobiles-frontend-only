<template>
  <div>
    <div class="content">
      <button @click="JumpToHelloWorld">Go to the HelloWorld</button>
      <div style="font-size: 24px">
        <div>first Name: {{ firstName }}</div>

        <div>last Name: {{ lastName }}</div>

        <div>email: {{ email }}</div>
        <div>phoneNumber: {{ phoneNumber }}</div>
      </div>

      <div v-if="events.length > 0">
        <div v-if="validationMessage"></div>
        <div style="color: orange">
          {{ firstName }} has {{ events.length }} events
        </div>
        <button @click="sortByEarlyStartDate">sort By Early Start Date</button>
        <button @click="sortByLateStartDate">sort By Late Start Date</button>

        <table class="users-table">
          <thead>
            <tr>
              <th>Event Number</th>
              <th>Event Title</th>
              <th>Event Description</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(event, index) in events" :key="event._id">
              <td>{{ index + 1 }}</td>
              <td>{{ event.eventTitle }}</td>
              <td>{{ event.eventDescription }}</td>
              <td>{{ event.startDate }}</td>
              <td>{{ event.endDate }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="eventForm">
      <h2>Add event</h2>
      <b-field label="Title" horizontal>
        <b-input v-model="eventTitle"></b-input>
      </b-field>
      <b-field label="Description" horizontal>
        <b-input v-model="eventDescription"></b-input>
      </b-field>

      <datepicker
        v-model="startDate"
        placeholder="Select start date"
        :disabled-dates="disabledDates"
      ></datepicker>
      <datepicker
        v-model="endDate"
        placeholder="Select end date"
        :disabled-dates="disabledDates"
      ></datepicker>

      <b-button @click="addEvent">Add</b-button>
    </div>
  </div>
</template>

<script>
import Datepicker from "vuejs-datepicker";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "CurrentUser",
  components: {
    Datepicker,
  },
  computed: {
    ...mapGetters(["getUserById", "getUserEvents"]),
    disabledDates() {
      return {
        to: this.startDate ? new Date(this.startDate) : null,
      };
    },
    events() {
      return this.getUserEvents(this.$route.params.user_id);
    },
  },

  data() {
    return {
      id: this.$route.params.user_id,
      firstName: null,
      lastName: null,
      email: null,
      phoneNumber: null,
      hasEvent: false,
      startDate: null,
      endDate: null,
      eventTitle: null,
      eventDescription: null,
      validationMessage: null,
    };
  },

  methods: {
    ...mapActions(["addEventToUserAction"]),

    ErrorMessageEvent() {
      this.$buefy.toast.open({
        duration: 3000,
        message: this.validationMessage,
        position: "is-bottom",
        type: "is-danger",
      });
    },

    sortByEarlyStartDate() {
      this.events.sort((a, b) => a.startDate - b.startDate);
    },
    sortByLateStartDate() {
      this.events.sort((a, b) => b.startDate - a.startDate);
    },
    addEvent() {
      const events = this.getUserEvents(this.id);
      const conflictingEvents = events.filter((event) => {
        const eventStart = new Date(event.startDate).getDate();
        const eventEnd = new Date(event.endDate).getDate();
        const start = new Date(this.startDate).getDate();
        const end = new Date(this.endDate).getDate();
        return start <= eventEnd && end >= eventStart;
      });
      if (conflictingEvents.length > 0) {
        this.validationMessage = "You can't create event for this day";
        this.ErrorMessageEvent();
      } else {
        this.addEventToUserAction({
          userId: this.id,
          event: {
            hasEvent: true,
            eventTitle: this.eventTitle,
            eventDescription: this.eventDescription,
            startDate: this.startDate,
            endDate: this.endDate,
          },
        });
      }
    },

    JumpToHelloWorld() {
      this.$router.push({
        name: "HelloWorld",
      });
    },

    CurrentUser() {
      let user = this.getUserById(this.id);
      if (user) {
        ({
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          phoneNumber: this.phoneNumber,
        } = user);
        console.log("user find");
        console.log(user.phoneNumber, user.eventTitle);
      } else {
        this.JumpToHelloWorld();
        console.log("to the HelloWorld");
      }
    },
  },

  mounted() {
    this.CurrentUser();
  },
};
</script>

<style lang="css" scoped>
.users-table {
  width: 100%;
}

.users-table td,
tr {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
}

.users-table th {
  text-align: center !important;
  background-color: #aeaeae;
  border: 1px solid black;
  color: #ffffff;
}

.eventForm {
  margin: 10px;
  padding: 30px;
  display: inline-block;
  justify-content: center;
}
h2 {
  font-size: 30px;
}
</style>