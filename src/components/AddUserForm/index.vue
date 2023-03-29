<template>
  <div>
    <div class="formContent">
      <h2>{{ AddOrEditTitle }}</h2>
      <span> firstName <input v-model="firstName" /> </span>
      <span> lastName <input v-model="lastName" /> </span>
      <span> email <input v-model="email" /> </span>
      <span> phoneNumber <input v-model="phoneNumber" /> </span>

      <button @click="onAdd">{{ buttonTitle }}</button>
      <button @click="JumpToHelloWorld">Go to the HelloWorld</button>
    </div>
  </div>
</template>

<script>
import Datepicker from "vuejs-datepicker";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "AddUserForm",
  components: {
    Datepicker,
  },
  computed: {
    ...mapGetters(["getUserById", "getUsersListData", "getUserEvents"]),
    userId() {
      if (this.$route.params.user_id === "new") return null;
      else return this.$route.params.user_id;
    },
    buttonTitle() {
      if (this.userId) return "save edition";
      else return "add new user";
    },
    AddOrEditTitle() {
      if (this.userId) return "Edit user";
      else return "Add user";
    },
    UsersEvents() {
      return this.getUserEvents(this.$route.params.user_id);
    },
  },
  data() {
    return {
      firstName: null,
      lastName: null,
      email: null,
      phoneNumber: null,
    };
  },
  methods: {
    ...mapActions(["addUserAction", "updateUserAction"]),

    onAdd() {
      if (!this.userId) {
        this.addUserAction({
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          phoneNumber: this.phoneNumber,
        });
      } else {
        this.updateUserAction({
          _id: this.userId,
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          phoneNumber: this.phoneNumber,

          events: this.UsersEvents,
        });
      }
    },
    JumpToHelloWorld() {
      this.$router.push({
        name: "HelloWorld",
      });
    },
  },
  mounted() {
    if (this.userId) {
      var user = this.getUserById(this.userId);
      (this.firstName = user.firstName),
        (this.lastName = user.lastName),
        (this.email = user.email),
        (this.phoneNumber = user.phoneNumber);
    } else {
      console.log("no userId");
    }
  },
};
</script>

<style lang="css" scoped>
.eventForm {
  padding: 10px;
  width: 50%;
  margin: 10px;
}
</style>