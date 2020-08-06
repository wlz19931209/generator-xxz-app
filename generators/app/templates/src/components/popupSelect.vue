<style lang="scss" scoped>
.ui-picker {
    width: 100vw;
}

.toolbar {
    display: flex;
    justify-content: space-between;
    height: 44px;
    line-height: 44px;

    .van-picker__cancel,
    .van-picker__confirm {
        padding: 0 16px;
        color: #576b95;
        font-size: 14px;
        background-color: transparent;
        border: none;
        cursor: pointer;
    }

    .van-picker__title {
        max-width: 50%;
        font-weight: 500;
        font-size: 16px;
        text-align: center;
        line-height: inherit;
    }
}

.text-tip {
    font-size: 14px;
    color: rgba(black, 0.3);
    text-align: center;
}

.search-text {
    display: flex;
    align-items: center;
    justify-content: center;

    & > .text {
        margin-left: 5px;
    }
}

.checked-box {
    max-height: 45vh;
    overflow-y: auto;
    &::-webkit-scrollbar {
        width: 1px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #1989fa;
    }
}
</style>
<template>
    <van-field
        v-model="fullText"
        rows="1"
        autosize
        type="textarea"
        :label="label"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        readonly
        @focus="open()"
    >
        <template v-slot:button>
            <van-popup
                class="ui-picker"
                v-model="popupVisible"
                position="bottom"
                get-container="body"
                @click-overlay="reset"
                close-on-popstate
            >
                <!-- 头部操作栏 -->
                <div class="toolbar">
                    <button type="button" class="van-picker__cancel" @click="reset">取消</button>
                    <div class="van-ellipsis van-picker__title">{{ label }}</div>
                    <button type="button" class="van-picker__confirm" @click="confirm">确认</button>
                </div>
                <!-- 搜索控件 -->
                <van-search
                    class="pr12"
                    v-if="$listeners.search"
                    show-action
                    v-model="searchVal"
                    :disabled="isSearching"
                    :placeholder="searchPlaceholder"
                    @search="search"
                    @clear="clear"
                >
                    <template slot="action">
                        <div @click="search(searchVal)" class="c-blue">搜索</div>
                    </template>
                </van-search>
                <!-- 文本提示区 -->
                <div class="text-tip">
                    <p v-show="!isSearching && optionsAll.length === 0">暂无数据</p>

                    <p v-show="isSearching" class="search-text">
                        <van-loading type="spinner" size="16px" />
                        <span class="text">正在搜索数据...</span>
                    </p>
                </div>
                <!-- 操作列表区 -->
                <!-- <div v-if="optionsAll.length>0" class="checked-box" ref="checkedBox"> -->
                <van-list
                    v-show="optionsAll.length > 0"
                    :offset="10"
                    class="checked-box"
                    ref="checkedBox"
                    v-model="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="onLoad"
                >
                    <!-- 多选 -->
                    <van-checkbox-group v-if="multiple" v-model="selected" :max="max">
                        <van-cell-group>
                            <van-cell
                                v-for="(item, index) in optionsAll"
                                :title="item[valueKey]"
                                :key="item.id"
                                @click="toggleCheckbox(index)"
                            >
                                <van-checkbox :name="item.id" ref="checkboxes" shape="square" slot="right-icon" />
                            </van-cell>
                        </van-cell-group>
                    </van-checkbox-group>
                    <!-- 单选 -->
                    <van-radio-group v-else v-model="selected">
                        <van-cell-group>
                            <van-cell
                                v-for="item in optionsAll"
                                :key="item.id"
                                :title="item[valueKey]"
                                clickable
                                @click="selected = item.id"
                            >
                                <van-radio :name="item.id" slot="right-icon" />
                            </van-cell>
                        </van-cell-group>
                    </van-radio-group>
                </van-list>
            </van-popup>
        </template>
    </van-field>
</template>
<script>
export default {
    props: {
        label: "", //当前页标题
        multiple: {
            type: Boolean,
            default: false,
        },
        value: {}, //回显值
        max: {
            type: Number,
        },
        options: {
            type: Array,
            default: function() {
                return [];
            },
        },
        required: Boolean,
        disabled: {
            type: Boolean,
            default: false,
        },
        placeholder: String,
        searchPlaceholder: {
            type: String,
            default: "请选择",
        },
        valueKey: {
            type: String,
            default: "text",
        },
        remoteMethod: {
            type: Function,
        },
    },
    data() {
        return {
            popupVisible: false,
            isSearching: false,
            searchVal: "", // 搜索值
            fullId: "", // 选中值的id
            optionsAll: this.options.length ? this.options : [], // 数据源
            selected: this.multiple ? [] : "", //当前列表选中项,它不包括被搜索过滤掉的列表选中项
            loading: false,
            finished: false,
            fullText: '',
            first: false,
        };
    },
    methods: {
        open() {
            //开启当前组件
            if (this.disabled) return;
            this.popupVisible = true;
            this.searchVal = "";
            this.clear();
        },
        reset() {
            // 重置并关闭当前组件
            // if (this.options.length && this.value) {
            //     this.selected = this.value;
            // } else {
            //     this.selected = this.multiple ? [] : "";
            // }
            this.popupVisible = false;
        },
        clear() {
            this.$emit("search", null);
        },
        confirm() {
            // 确定并关闭当前组件
            this.popupVisible = false;
            // this.search(null);
            this.$nextTick(() => {
                this.initFullText()
            })
            this.$emit("confirm", this.selected);
            this.$emit("input", this.selected);
        },
        search(v) {
            this.searchVal = v;
            this.$refs.checkedBox.$el.scrollTop = 0; // 重置滚动条位置
            this.finished = false; // 重置列表加载状态
            this.isSearching = Boolean(this.isSearching);
            // 返回检索关键字和tab
            if (this.$listeners.search) {
                this.$emit("search", this.searchVal);
                this.isSearching = true;
            }
        },
        
        toggleCheckbox(index) {
            //多选单元格点击时触发多选框勾选
            const current = this.$refs.checkboxes[index];
            if (current.checked === false && this.selected.length >= this.max) {
                this.$toast("最多选择" + this.max + "项");
            } else {
                this.$refs.checkboxes[index].toggle();
            }
        },
        updateSelected() {
            // 构建回显默认选中的
            this.selected = this.value;
            this.initFullText()
        },
        initFullText() {
            // 选中值的text
            let text = "";
            if (this.multiple) {
                this.options.forEach(item => {
                    this.selected.forEach(currSelected => {
                        if (item.id === currSelected) {
                            text += item[this.valueKey] + ",";
                            this.fullId += item.id + ",";
                        }
                    });
                });
                this.fullId = this.fullId.replace(/,$/, "");
                text = text.replace(/,$/, "");
            } else {
                this.options.forEach(item => {
                    if (item.id === this.selected) {
                        text = item[this.valueKey];
                    }
                });
            }
            this.fullText = text
        },
        // getSelectedArray() {
        //     // 构建历史已选项
        //     let selectedArr = [];

        //     this.updateSelected();

        //     // 构建之前选过的
        //     const currentOpt = this.optionsAll.length === 0 && this.value ? this.options : this.optionsAll;
        //     console.log(currentOpt);
        //     currentOpt.forEach(item => {
        //         if (this.multiple) {
        //             this.selected.forEach(sv => {
        //                 if (item.id === sv) {
        //                     selectedArr.push(item);
        //                 }
        //             });
        //         } else {
        //             // 单选
        //             if (item.id === this.selected) {
        //                 selectedArr.push(item);
        //             }
        //         }
        //     });
        //     return selectedArr;
        // },
        onLoad() {
            if (!this.remoteMethod) {
                this.loading = false;
                this.finished = true;
            }
            this.remoteMethod &&
                this.remoteMethod().then(res => {
                    this.loading = false;
                    this.finished = res;
                });
        },
    },
    watch: {
        value(v) {
            //根据v-model选中
            if (this.options.length && v && this.popupVisible === false) {
                this.selected = v;
            }
        },
        options(v) {
            if (v.length > 0 && !this.first) {
                this.updateSelected();
                this.first = true
            }
            //外层数据源变动
            // this.historySelected = this.getSelectedArray()
            // 构建新数据源, 剔除历史已选项
            let newOption = [...v];
            // selectedArr.forEach((sitem) => {
            //     newOption.forEach((item, i) => {
            //         if (sitem.id === item.id) {
            //             newOption.splice(i, 1)
            //         }
            //     })
            // })
            // 生成新数据源
            this.optionsAll = Array.from(new Set([...newOption]));
            this.isSearching = false;
        },
    },
};
</script>
