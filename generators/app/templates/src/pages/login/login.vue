<style lang="scss" scoped>
    @import '~@/scss/variables.scss';
    $color:#26a2ff;

    .form-item {

        display: flex;
        align-items: center;
        font-size: 1rem;
        margin-bottom: .7rem;
        position: relative;
        border-bottom: 1px solid rgba(black, .05);

        label {
            white-space: nowrap;
            color: rgba(black, .5);

            &::after {
                content: ':';
            }
        }

        input {
            outline: none;
            font-size: inherit;
            flex: 1;
            padding: 0.5rem;
            background-color: transparent;
            border: none;

            &:focus {
                &+.line {
                    transform: scale3d(1, 1, 1);
                }
            }
        }

        .line {
            height: 1px;
            width: 100%;
            background-color: rgba($color, .6);
            position: absolute;
            bottom: -1px;
            left: 0;
            transition: 1s;
            transform: scale3d(0, 1, 1);
        }
    }

    .bg {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: url('./login-bg.jpg') no-repeat center;
        background-size: cover;
        filter: blur(5px);
    }

    .form {
        width: 80%;
        z-index: 1;
        margin-top: -3rem;
    }

    .login-btn {
        background-color: rgba($color, .6);
        color: #fff;
        border: none;
    }
</style>
<template>
    <ui-main>
        <div class="flex col-center row-center h-100" v-show="!isWeiLogin">
            <!-- <div class="bg" ref="bg"></div>
            <div class="form">
                <div class="form-item">
                    <label>账号</label>
                    <input v-model="form.username" type="text" placeholder="输入用户名">
                    <i class="line"></i>
                </div>
                <div class="form-item">
                    <label>密码</label>
                    <input v-model="form.password" type="password" placeholder="输入登录密码">
                    <i class="line"></i>
                </div>
                <div class="form-item">
                    <van-button @click="login" size="large" type="" class="login-btn">登录</van-button>
                </div>

            </div> -->

            <!-- <van-loading size="24px" vertical>努力加载中...</van-loading> -->
        </div>
    </ui-main>
</template>

<script>
    import pubJs from '@/pages/mixins/publicQuery'
    import {
        Promise
    } from 'q';
    export default {
        mixins: [
            pubJs
        ],
        inject: [
            'reload'
        ],
        data() {
            return {
                isDev: process.env.NODE_ENV === 'development', //开发模式
                isWeiLogin: false,
                form: {
                    username: '',
                    password: ''
                },
                outClickRoute: null,
                isDdLink: false
            }
        },

        mounted() {

            //开发模式我帮你把密码写了
            this.$nextTick(() => {
                if (this.isDev) {
                    this.form.username = 'administrator'
                    this.form.password = '000000'
                }
                console.log(this.dd);
                if (this.dd.env.platform === 'notInDingTalk') {
                    this.submitForm('210', "ok", 'dd');
                    return
                }
                this.getRoute();
                
            })
            this.$$initDdEvent();
        },

        methods: {
            
            getRoute() {
                let url = window.location.href;
                console.log("window.location.href=", url);
                //只有工作通知才有，并且intentFlag=ddlink
                let ddHost = "www.dingtalk.com";    
                let routeFlag = "routeStr=";
                let weiName = "";
                let posRoute = url.indexOf(routeFlag);
                let flagValue = "intentFlag=";
                 //链接都没有设置对，老实回去吧。
                if(posRoute == -1) {
                    console.log(url);
                    this.$toast("url设置错误！" + url);
                }
                let flagPos = url.indexOf(flagValue);
                if(flagPos != -1) {
                    this.isDdLink = true;
                }
                
                let pos = url.indexOf("#");
               
                if (url.indexOf(ddHost) != -1) {    //工作通知跳转。url.indexOf("intentFlag")
                    let weiRoute = url.substring(flagPos + flagValue.length, this.find(url, '&', 1));
                    url = url.substring(posRoute + routeFlag.length, pos);
                    pos = url.indexOf(ddHost);
                    this.outClickRoute = url.substring(0, pos);
                    weiName = this.GLOBAL.ROUTE_MAPPING[weiRoute];
                } else {
                    this.outClickRoute = url.substring(posRoute + routeFlag.length, pos);
                    weiName = this.GLOBAL.ROUTE_MAPPING[this.outClickRoute];
                }
                console.log(this.outClickRoute, weiName);
                if(this.$isBlank(this.outClickRoute) || this.$isBlank(weiName)) {
                    this.$toast("路径不符合规范，请联系管理员解决。", this.outClickRoute, weiName);
                }
                
                localStorage.setItem(this.GLOBAL.WEI_NAME, weiName)
                this.login();
               
                
            },

            //查找第二个&出现的位置
            find(str,cha,num){
                var x=str.indexOf(cha);
                for(var i=0;i<num;i++){
                    x=str.indexOf(cha,x+1);
                }
                return x;
            },
            //获取钉钉授权码
            login() {
                this.$loading.open();
                //获取authCOde先
                this.$$getAuthCode().then((result) => {
                    this.isWeiLogin = true;
                    console.log("authCode=", result.code);
                    //查询登陆用户信息
                    this.$$queryContacts(result.code).then(data => {
                        let currentUser = data.result;
                        this.$userSave(currentUser);
                        this.submitForm(currentUser.jobnumber, "ok", 'dd');
                        console.log(JSON.stringify(data));
                    }).catch(err => {
                        this.$loading.close();
                        this.$toast('抱歉:获取当前钉钉登陆人员信息失败');
                    });
                }).catch((e) => {
                    this.$loading.close();
                    this.isWeiLogin = false;
                });
            },

            // querySign() {
            //     this.$$querySign().then((data) => {
            //         console.log('one', data);
            //         if (this.$isBlank(data)) {
            //             this.$toast("签名校验失败");
            //             return;
            //         }
            //         let configObj = JSON.parse(data);
            //         let cacheTime = new Date().getTime();
            //         localStorage.setItem('cacheTime', cacheTime);
            //         this.ddConfig(configObj);
            //     })
            // },

            // ddConfig(_config) {
            //     let jsApiList = [
            //         'runtime.info',
            //         'device.notification.prompt',
            //         'biz.chat.pickConversation',
            //         'device.notification.confirm',
            //         'device.notification.alert',
            //         'device.notification.prompt',
            //         'biz.chat.open',
            //         'biz.util.open',
            //         'biz.user.get',
            //         'biz.contact.choose',
            //         'biz.telephone.call',
            //         'biz.util.uploadImage',
            //         'biz.ding.post',
            //         'biz.contact.complexPicker'
            //     ];

            //     this.$$jsapiAuth(_config, jsApiList).then((data) => {
            //         console.log('签名成功', _config, data);
            //         this.$loading.close();
            //         this.full();
            //     }).catch((err) => {
            //         this.$loading.close();
            //     })
            // },

            full() {
                
                let routURL = "";
                if(this.isDdLink) {
                    routURL = this.outClickRoute + '?dd_nav_bgcolor=FF5E97F6&showmenu=false&flag=ddlink'
                } else {
                    routURL = this.outClickRoute + "?dd_nav_bgcolor=FF5E97F6&showmenu=false"
                }
          
                console.log(this.$route.query.redirect);
                if (this.$route.query.redirect) {
                    routURL = this.$route.query.redirect
                }
                if(this.$isBlank(this.outClickRoute)) {
                    routURL = '/home?dd_nav_bgcolor=FF5E97F6&showmenu=false';
                }
                this.$router.replace({
                    path: routURL, // 新的页面链接
                });
            },

            getUserInfo(ddWeiName) {
                let vm = this;
                this.$$getUserInfo(ddWeiName).then((data) => {
                    this.$customInfoSave(data.customerInfo);
                    this.$customPermission(data.permissionList);
                    this.full();
                }).catch((err) => {
                    this.$loading.close();
                })
            },

            // 用户登录
            submitForm(name, pwd, loginType) {

                this.$$userLogin(name, pwd, loginType).then((result) => {
                    
                    this.getUserInfo(localStorage.getItem(this.GLOBAL.WEI_NAME));

                }).catch(err => {
                    this.$toast(err);
                });
            },

        },
    }
</script>