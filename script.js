new Vue({
  el: "#app",
  vuetify: new Vuetify(),
  data: {
    login: "",
    password: "",
    log: "",
    alert: false,
    validUser: "hussein", // Hardcoded valid username
    validPassword: "2913819", // Hardcoded valid password
  },
  methods: {
    sub: function () {
      if (this.login === "" || this.password === "") {
        this.alert = true;
        this.log = "User and Password are required.";
      } else if (this.login === this.validUser && this.password === this.validPassword) {
        // Redirect to Google URL if valid
        window.location.href = "UP2SMART/index.html";
      } else {
        this.alert = true;
        this.log = "Invalid Username or Password.";
      }
    },
  },
});
