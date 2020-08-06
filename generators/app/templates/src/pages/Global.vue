<script>
    const preServerSrc = 'http://47.111.158.177:8088/m-web'; //预生产环境
    const devServer = 'http://168.168.168.10:8088/m-web';
    const fontServer = 'http://192.200.204.8:9000';
    const corpId = 'ding27f81ecd766155a0';
    const deptId = '12876240';
    const userId = '05125733518124';
    const WEI_NAME = 'ddWeiName';
    // const dWeiNameIM = 'dd_mobile_im';  //注意：重大任务正式：dd_mobile_im， 本地统一测试地址：dd_mobile_im_test
    // const dWeiNameGD = 'dd_mobile_documentary';  //注意：跟单管理：dd_mobile_documentary

    const SAVE_TYPE = ['image/png'];//'image/jpeg', 'image/svg+xml'

    const checkSaveType = type => SAVE_TYPE.includes(type);

    const ROUTE_MAPPING = {
        "home" : "dd_mobile_im",
        "documentary" : "dd_mobile_documentary",
        "trace" : "dd_mobile_task_trace"
    }
    const ROUTE_DEP = {
        "im_manage" : '12876235',
        "im_interior" : '12869202',
        "im_interiormarket" : '12876237',
        "im_integration" : '12869203',
        "im_develop" : '12876240',
        "im_unconfirmed" : '12876240'
    }

    const DEFAULT_OPTIONS = {
        dotSize: (0.5 + 2.5) / 2,
        minWidth: 2,    //移动端1。
        maxWidth: 2.5,
        throttle: 16,
        minDistance: 5,
        backgroundColor: 'rgba(255,255,255,0)',   //rgba(246,246,246,100)
        penColor: 'rgb(66, 133, 244)',
        velocityFilterWeight: 0.7,
        onBegin: () => {console.log('=== Begin ===');},
        onEnd: () => {console.log('=== End ===');}
    };
    

    const convert2NonReactive = observerValue =>
        JSON.parse(JSON.stringify(observerValue));

    const TRANSPARENT_PNG = {
        src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
        x: 0,
        y: 0
    };
    export default {
        SAVE_TYPE,
        DEFAULT_OPTIONS,
        convert2NonReactive,
        TRANSPARENT_PNG,
        checkSaveType,
        preServerSrc,
        devServer,
        fontServer,
        corpId,
        deptId,
        userId,
        ROUTE_MAPPING,
        WEI_NAME,
        ROUTE_DEP
    }
</script>