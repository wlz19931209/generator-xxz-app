<template>
    <div id="app" class="h-100 flex-column">
        <div class="h-100 relative">
            <transition :name="transitionName" v-if="!isIos">
                <keep-alive include="keep">
                    <router-view/>
                </keep-alive>
            </transition>
            <keep-alive include="keep" v-else>
                <router-view/>
            </keep-alive>
        </div>
        <!-- <bottombar></bottombar> -->
    </div>
</template>

<script>
    // import bottombar from '@/pages/rootMenu'
    
    export default {
        name: 'App',
        provide() {
            return {
                reload:this.reload,
                isDdEnv: this.isDdEnv
            }
        },
        data(){
            return {
                isRouterAlive:true,
                transitionName: 'van-fade',
                isIos: false
            }
        },
        created(){
            this.checkPlatform()
        },
        methods:{
            reload() {
                this.isRouterAlive = false;
                this.$nextTick(()=>{
                    this.isRouterAlive = true;
                })
            },
             isDdEnv() {
                if (this.dd.env.platform === 'notInDingTalk') {
                    return false;
                }
                return true;
            },
            checkPlatform(){
                if(/(iPhone|iPad|iPod|iOS)/i.test(window.navigator.userAgent)){
                    this.isIos = true
                }

                if(/android/i.test(navigator.userAgent)){
                    this.isIos = false
                }
            },
        },
        watch:{
            '$route' (to, from) {
                const toIndex = to.meta.index
                const fromIndex = from.meta.index
                if (toIndex > fromIndex) {
                    this.transitionName = 'slide-left'
                } else if (toIndex < fromIndex) {
                    this.transitionName = 'slide-right'
                } else {
                    this.transitionName = 'van-fade'
                }
            }
        },
        // components:{
        //     bottombar
        // }
    }
</script>
