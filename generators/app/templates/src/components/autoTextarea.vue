<style lang="scss" scoped>
    .van-textarea{
        display: block;
        box-sizing: border-box;
        width: 100%;
        min-width: 0;
        margin: 0;
        padding: 0px;
        color: #323233;
        line-height: inherit;
        text-align: left;
        background-color: transparent;
        border: 0;
        resize: none;
        font-size: 14px;
    }
</style>
<template>
	<textarea
		class="van-textarea"
        ref="textarea"
		v-model="currentValue"
		rows="2"
		placeholder="请输入"
		@blur="$emit('blur', $event)"
		@focus="$emit('focus', $event)"
		@click="$emit('click', $event)"
	>
	</textarea>
</template>
<script>
export default {
	props: {
		value: {
			type: String,
			default: "",
        },
        autosize: {
            type: Boolean,
            default: false
        }
    },
	computed: {
		currentValue: {
			get() {
				return this.value;
			},
			set(val) {
				this.$emit("input", val);
			},
		},
	},
	watch: {
		currentValue: {
            deep: true,
            handler(val) {
                if (this.autosize) {
                    this.changeHeight();
                }
            },
			immediate: true
		},
	},
	methods: {
		changeHeight() {
			let _this = this;
			this.$nextTick(() => {
				const { textarea } = this.$refs;
				var scrollHeight = textarea.scrollHeight; // 控件所有的高度，包含滚动的那部分(不可见也会有高度)
				var height = textarea.offsetHeight; // 屏幕上显示的高度
				if (height <= scrollHeight) {
					textarea.style.height = "auto"; // 恢复默认值，这个作用就是根据内容自适应textarea高度
					textarea.style.height = textarea.scrollHeight + "px"; // 拿到最新的高度改变textarea的高度
				}
			});
		},
	},
};
</script>
