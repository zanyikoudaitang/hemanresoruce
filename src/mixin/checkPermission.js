export default {
    methods: {
        checkPermission(value){
            return this.$store.state.user.userInfo.roles.points.includes(value)
          }
    },
}