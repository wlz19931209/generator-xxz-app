<style lang="scss" scoped>
    .topfiltertitle {
        display: flex;
        position: relative;
        background-color: #3296fa;
        overflow-y: hidden;
        overflow-x: auto;
        height: 44px;
        padding: 5px 0;

        &::-webkit-scrollbar {
            display: block;
            height: 5px;
        }

        .title-item {
            position: relative;
            // flex: 0 0 32%;
            flex: 1;
            display: flex;
            margin-top: 5px;
            height: 24px;
            line-height: 24px;
            font-size: 14px;
            min-width: 0;
            box-sizing: border-box;
            padding: 0 5px;
            cursor: pointer;
            color: #fff;
            overflow: hidden;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: center;
            .title-text{
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            &:not(:last-child) {
                border-right: 1px solid rgba(255,255,255,.3)
            }

            & .van-icon {
                font-size: 14px;
                transform: rotate(0deg);
                transition: transform .3s ease-in-out;
            }

            // & .rotate {
            //     transform: rotate(-180deg);
            // }
        }

        .title-line {
            position: absolute;
            bottom: 0px;
            left: 0;
            z-index: 1;
            height: 3px;
            background-color: #ee0a24;
            border-radius: 3px;
            transition-duration: 0.3s;
        }
    }

    .tab-scrollable {
        .title-item {
            -webkit-box-flex: 0;
            -webkit-flex: 0 0 32%;
            flex: 0 0 32%;
        }
    }
</style>
<template>
    <div :class="['topfiltertitle', value.length > 2 && 'tab-scrollable']" ref="topfiltertitle">
        <template v-for="(item, index) of value">
            <div class="title-item" @click="toggle(item, index)">
                <span class="title-text">{{item[valueKey]}}</span>
                <van-icon :class="item.checked && 'rotate'" name="arrow-down" />
            </div>
        </template>
    </div>
</template>
<script>
    export default {
        name: 'topfiltertitle',
        props: {
            value: {
                type: Array,
                default: () => []
            },
            valueKey: {
                type: String,
                default: 'title'
            }
        },
        data() {
            return {

            }
        },
        methods: {
            // 计算下划线宽度和位置 及 父容器卷入距离
            toggle(item, index) {
                item.checked = !item.checked
                this.$emit('toggle', item, index)
            }
        },
    }
</script>