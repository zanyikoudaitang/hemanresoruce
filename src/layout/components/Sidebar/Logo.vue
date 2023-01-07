<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link key="collapse" class="sidebar-logo-link" to="/">
        <img src="@/assets/common/logo.png" class="sidebar-logo  ">
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: 'Vue Admin Template',
      logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png'
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar-logo-container {  
	&.collapse {
        .sidebar-logo {
          margin-right: 0px;
          width: 32px;
          height: 32px;
        }
      }
      & .sidebar-logo-link {
       & .sidebar-logo {
              width: 140px;
              vertical-align: middle;
              margin-right: 12px;
        }
    }
}
</style>
