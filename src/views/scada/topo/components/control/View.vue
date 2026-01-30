<script>
import { animate } from '@/utils/topo/anime';

export default {
    name: 'View',
    props: {
        editMode: {
            type: Boolean,
            default: false,
        },
        selected: {
            type: Boolean,
            default: false,
        },
        detail: {
            type: Object,
            default: {},
        },
    },
    computed: {
        textAlign: function () {
            if (this.detail.style.textAlign == undefined) {
                return 'center';
            } else {
                return this.detail.style.textAlign;
            }
        },
        lineHeight: function () {
            if (this.detail.style.lineHeight == undefined) {
                return this.detail.style.position.h;
            }
            return this.detail.style.lineHeight;
        },
    },
    data() {
        return {
            animateView: null,
        };
    },
    mounted() {
        if (this.detail.componentShow.indexOf('动画') > -1 && !this.editMode) {
            this.animationInit();
        }
    },
    methods: {
        animationInit() {
            console.log('开始初始化动画');
            let domId = document.getElementById(this.detail.identifier);
            let display = 'block';
            let rotate = [];
            let scale = [];
            let translates = [];
            let duration = 1000;
            let autoplay = false;
            let loop = true;
            if (this.detail.dataAction.duration) {
                duration = this.detail.dataAction.duration * 1000;
            } else if (this.detail.dataAction.rotationSpeed == '快') {
                duration = 500;
            } else if (this.detail.dataAction.rotationSpeed == '中') {
                duration = 1000;
            } else if (this.detail.dataAction.rotationSpeed == '慢') {
                duration = 1500;
            } else {
                duration = 1000;
            }
            if (this.detail.dataBind.xzAction) {
                rotate.push(360); // 旋转判断
            } else {
                rotate.push(0);
            }
            if (this.detail.dataBind.ssAction) {
                //闪烁判断
                scale.push(0.7);
                scale.push(1);
                scale.push(1.3);
                scale.push(1);
            } else {
                scale.push(1);
            }
            if (this.detail.dataBind.hdAction) {
                //滑动判断
                this.detail.dataAction.translateList.forEach((element) => {
                    if (element.direction == '竖直') {
                        translates.push({ translateY: -element.position });
                    } else {
                        translates.push({ translateX: element.position });
                    }
                });
            }
            if (translates.length == 0) {
                translates.push({ translateX: 0 });
            }
            this.animateView = animate(domId, display, rotate, scale, translates, duration, autoplay, loop);
        },
        refreshData(val, sceneName) {},
        onResize() {},
    },
};
</script>
