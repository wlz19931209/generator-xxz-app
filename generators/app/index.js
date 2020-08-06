// Generator 核心入口
// 需要导出一个继承自 yeoman-generator 的类型

const Generator = require("yeoman-generator");

module.exports = class extends Generator {
    // Yeoman 在询问永华环节会自动调用此方法
    // 在此方法中可以调用父类的 prompt() 方法发出对用户的命令行询问
    prompting() {
        return this.prompt([
            {
                type: "input",
                name: "name",
                message: "Your project name",
                default: this.appname, // 项目生成目录名称
            },
        ]).then(answers => {
            this.answers = answers;
        });
    }
    // Yeoman 自动在生成文件阶段调用此方法
    writing() {
        // 通过模版方式写入文件到目标目录
        const tpmlArr = [
            ".env.demo",
            ".gitignore",
            "babel.config.js",
            "ip.zip",
            "package-lock.json",
            "package.json",
            "postcss.config.js",
            "README.md",
            "vue.config.js",
            "public/favicon.ico",
            "public/index.html",
            "src/App.vue",
            "src/main.js",
            "static/.gitkeep",
            "src/assets/axios.js",
            "src/assets/compatibility.js",
            "src/assets/eventHub.js",
            "src/assets/globalMethods.js",
            "src/assets/router.js",
            "src/assets/_requireAll.js",
            "src/components/autoTextarea.vue",
            "src/components/noData.vue",
            "src/components/popupSelect.vue",
            "src/components/topfiltertitle.vue",
            "src/components/uiSearch.vue",
            "src/pages/Global.vue",
            "src/pages/rootMenu.vue",
            "src/scss/base.scss",
            "src/scss/index.scss",
            "src/scss/rewrite.scss",
            "src/scss/style.md",
            "src/scss/ui.scss",
            "src/scss/variables.scss",
            "src/scss/vue-transition.scss",
            "src/pages/login/login-bg.jpg",
            "src/pages/login/router.js",
            "src/pages/login/login.vue",
        ];

        tpmlArr.forEach(item => {
            this.fs.copyTpl(this.templatePath(item), this.destinationPath(item), this.answers);
        });
    }
};
