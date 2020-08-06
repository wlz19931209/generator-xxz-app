<style lang="scss" scoped>
.van-search {
	padding: 15px 15px 0px;
    margin-top: 0;
	.van-search__content {
		background-color: #fff;
    }
    
	.van-search__action {
        padding: 0;
	}
}
</style>
<template>
	<van-search
		show-action
		v-model="currentValue"
		shape="round"
		background="transparent"
		:placeholder="placeholder"
		@search="search"
		@focus="showAction = true"
		@blur="showAction = false"
		@clear="search"
	>
		<template slot="action">
			<transition name="right">
				<div @click="search" v-show="showAction" class="pl10 c-blue">搜索</div>
			</transition>
		</template>
	</van-search>
</template>
<script>
export default {
    data(){
        return {
            showAction: false
        }
    },
    props: {
        value: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: '请输入任务摘要、任务目标'
        }
    },
    computed:{
        currentValue: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
    methods: {
        search() {
            this.$emit('search')
        }
    }
};
</script>
