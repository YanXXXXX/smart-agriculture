<template>
    <div class="topo-properties">
        <div class="nav-bar-wrap">
            <template v-if="configObject != null && isLayer == false">
                <img class="img-wrap" :src="configObject.style.url" v-if="configObject.type == 'image'" />
            </template>
        </div>
        <template v-if="configObject != null && isLayer == false">
            <div class="tabs-wrap">
                <div class="tab-item" @click="changeTab(0)" :class="{ 'tab-item-active': tabIndex == 0 }">组件样式</div>
                <div class="tab-item" @click="changeTab(1)" :class="{ 'tab-item-active': tabIndex == 1 }">数据绑定</div>
                <div class="tab-item" @click="changeTab(2)" :class="{ 'tab-item-active': tabIndex == 2 }">图层</div>
            </div>
            <div class="table-wrap">
                <!-- 组件样式 -->
                <div class="table-item" v-show="tabIndex == 0">
                    <el-collapse class="collapse-wrap" v-model="styleCollapseActive">
                        <el-collapse-item title="位置与尺寸" name="1">
                            <el-form label-width="55px">
                                <el-form-item label="X坐标">
                                    <el-input-number style="width: 100%" controls-position="right" placeholder="请填写X坐标" v-model="configObject.style.position.x" size="small" />
                                </el-form-item>
                                <el-form-item label="Y坐标">
                                    <el-input-number style="width: 100%" controls-position="right" placeholder="请填写Y坐标" v-model="configObject.style.position.y" size="small" />
                                </el-form-item>
                                <el-form-item label="宽度">
                                    <el-input-number style="width: 100%" controls-position="right" placeholder="请填写宽度" v-model="configObject.style.position.w" size="small" />
                                </el-form-item>
                                <el-form-item label="高度">
                                    <el-input-number style="width: 100%" controls-position="right" placeholder="请填写Y坐标" v-model="configObject.style.position.h" size="small" />
                                </el-form-item>
                            </el-form>
                        </el-collapse-item>
                        <el-collapse-item title="基本样式" name="2">
                            <el-form label-width="72px">
                                <el-form-item label="组件名称" v-if="configObject.name !== undefined">
                                    <el-input placeholder="请填写组件名称" v-model="configObject.name" size="small" clearable />
                                </el-form-item>
                                <el-form-item label="最小值" v-if="configObject.dataBind.paramMin !== undefined">
                                    <el-input-number style="width: 100%" controls-position="right" placeholder="请填写最小值" v-model="configObject.dataBind.paramMin" size="small" />
                                </el-form-item>
                                <el-form-item label="最大值" v-if="configObject.dataBind.paramMax !== undefined">
                                    <el-input-number style="width: 100%" controls-position="right" placeholder="请填写最大值" v-model="configObject.dataBind.paramMax" size="small" />
                                </el-form-item>
                                <el-form-item label="刻度间隔" v-if="configObject.dataBind.interval !== undefined">
                                    <el-input-number style="width: 100%" controls-position="right" placeholder="请填写刻度间隔" v-model="configObject.dataBind.interval" size="small" />
                                </el-form-item>
                                <el-form-item label="天气样式" v-if="configObject.style.weatherModel !== undefined">
                                    <el-select v-model="configObject.style.weatherModel" placeholder="请选择天气样式" style="width: 100%" size="small">
                                        <el-option label="完整模式" value="完整模式">
                                            <span style="font-size: 12px">完整模式</span>
                                        </el-option>
                                        <el-option label="简约模式" value="简约模式">
                                            <span style="font-size: 12px">简约模式</span>
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="地图主题" v-if="configObject.style.mapModel !== undefined">
                                    <el-select v-model="configObject.style.mapModel" placeholder="请选择地图主题" style="width: 100%" size="small">
                                        <el-option label="默认主题" value="normal">
                                            <span style="font-size: 12px">默认主题</span>
                                        </el-option>
                                        <el-option label="清新蓝" value="light">
                                            <span style="font-size: 12px">清新蓝</span>
                                        </el-option>
                                        <el-option label="黑夜" value="dark">
                                            <span style="font-size: 12px">黑夜</span>
                                        </el-option>
                                        <el-option label="红色警戒" value="redalert">
                                            <span style="font-size: 12px">红色警戒</span>
                                        </el-option>
                                        <el-option label="精简" value="googlelite">
                                            <span style="font-size: 12px">精简</span>
                                        </el-option>
                                        <el-option label="自然绿" value="grassgreen">
                                            <span style="font-size: 12px">自然绿</span>
                                        </el-option>
                                        <el-option label="午夜蓝" value="midnight">
                                            <span style="font-size: 12px">午夜蓝</span>
                                        </el-option>
                                        <el-option label="浪漫粉" value="pink">
                                            <span style="font-size: 12px">浪漫粉</span>
                                        </el-option>
                                        <el-option label="青春绿" value="darkgreen">
                                            <span style="font-size: 12px">青春绿</span>
                                        </el-option>
                                        <el-option label="清新蓝绿" value="bluish">
                                            <span style="font-size: 12px">清新蓝绿</span>
                                        </el-option>
                                        <el-option label="高端灰风" value="grayscale">
                                            <span style="font-size: 12px">高端灰风</span>
                                        </el-option>
                                        <el-option label="强边界" value="hardedge">
                                            <span style="font-size: 12px">强边界</span>
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="图层高度">
                                    <el-input-number style="width: 100%" controls-position="right" placeholder="请填写图层高度" v-model="configObject.style.zIndex" size="small" />
                                </el-form-item>
                                <el-form-item label="背景颜色" v-if="isLayer === false && configObject.type !== 'map'">
                                    <div style="height: 36px">
                                        <el-color-picker v-model="configObject.style.backColor" show-alpha :predefine="predefineColors" color-format="hex" />
                                    </div>
                                </el-form-item>
                                <template v-if="isLayer === false && configObject.type !== 'flow-bar' && configObject.type !== 'flow-bar-dynamic' && configObject.type !== 'map'">
                                    <el-form-item label="透明度">
                                        <el-input-number style="width: 100%" controls-position="right" placeholder="0.5" v-model="configObject.style.opacity" size="small" />
                                    </el-form-item>
                                    <el-form-item label="边框圆角">
                                        <el-input-number style="width: 100%" controls-position="right" placeholder="10" v-model="configObject.style.borderRadius" size="small" />
                                    </el-form-item>
                                    <el-form-item label="阴影长度">
                                        <el-input-number style="width: 100%" controls-position="right" placeholder="20" v-model="configObject.style.boxShadowWidth" size="small" />
                                    </el-form-item>
                                    <el-form-item label="阴影颜色">
                                        <div style="height: 36px">
                                            <el-color-picker v-model="configObject.style.boxShadowColor" show-alpha :predefine="predefineColors" color-format="hex" />
                                        </div>
                                    </el-form-item>
                                </template>
                                <el-form-item label="统计类型" v-if="configObject.componentShow && configObject.componentShow.indexOf('设备统计') > -1">
                                    <el-select v-model="configObject.style.pieType" placeholder="请选择统计类型" style="width: 100%" size="small">
                                        <el-option label="设备状态" value="设备状态">
                                            <span style="font-size: 12px">设备状态</span>
                                        </el-option>
                                        <el-option label="报警状态" value="报警状态">
                                            <span style="font-size: 12px">报警状态</span>
                                        </el-option>
                                        <!-- <el-option label="工单状态" value="工单状态">
                                            <span style="font-size: 12px">工单状态</span>
                                        </el-option> -->
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="图片选择" v-if="configObject.style.url !== undefined && configObject.style.url !== null">
                                    <el-button size="mini" @click="handleGalleryClick('图片路径')">上传图片</el-button>
                                </el-form-item>
                                <el-form-item label="文字" v-if="configObject.style.text !== undefined">
                                    <el-input placeholder="请填写文字" v-model="configObject.style.text" size="small" clearable />
                                </el-form-item>
                                <el-form-item label="对齐方式" v-if="configObject.style.textAlign !== undefined">
                                    <el-select v-model="configObject.style.textAlign" placeholder="请选择对齐方式" style="width: 100%" size="small">
                                        <el-option label="居左" value="left">
                                            <span style="font-size: 12px">居左</span>
                                        </el-option>
                                        <el-option label="居中" value="center">
                                            <span style="font-size: 12px">居中</span>
                                        </el-option>
                                        <el-option label="居右" value="right">
                                            <span style="font-size: 12px">居右</span>
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="字体类型" v-if="configObject.style.fontFamily !== undefined">
                                    <el-select v-model="configObject.style.fontFamily" placeholder="请选择字体类型" style="width: 100%" size="small">
                                        <el-option :label="item" :value="item" v-for="item in fontFamilyOptions" :key="item">
                                            <span style="font-size: 12px">{{ item }}</span>
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="字体大小" v-if="configObject.style.fontSize !== undefined">
                                    <el-input-number style="width: 100%" controls-position="right" placeholder="请填写字体大小" v-model="configObject.style.fontSize" size="small" />
                                </el-form-item>
                                <el-form-item label="滤镜/阴影" v-if="configObject.componentShow && configObject.componentShow.indexOf('滤镜渲染') > -1">
                                    <el-radio-group v-model="configObject.style.isFilter" size="small">
                                        <el-radio :label="true">滤镜</el-radio>
                                        <el-radio :label="false">阴影</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="组件颜色" v-if="configObject.componentShow && configObject.componentShow.indexOf('组件颜色') > -1">
                                    <div style="height: 36px">
                                        <el-color-picker v-model="configObject.style.foreColor" show-alpha :predefine="predefineColors" color-format="hex" />
                                    </div>
                                </el-form-item>
                                <el-form-item label="组件显隐">
                                    <el-select v-model="configObject.style.visible" placeholder="请选择组件显隐" style="width: 100%" size="small">
                                        <el-option label="显示" :value="true">
                                            <span style="font-size: 12px">显示</span>
                                        </el-option>
                                        <el-option label="隐藏" :value="false">
                                            <span style="font-size: 12px">隐藏</span>
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="代码视图" v-if="configObject.componentShow && configObject.componentShow.indexOf('自定义echarts') > -1">
                                    <el-button type="text" icon="el-icon-edit" size="small" @click="echartClick">编辑</el-button>
                                </el-form-item>
                                <el-form-item label="地图选择" v-if="configObject.componentShow && configObject.componentShow.indexOf('地图文件') > -1">
                                    <el-select v-model="configObject.dataBind.mapAddress" placeholder="请选择地图" filterable style="width: 100%" size="small">
                                        <el-option label="安徽" value="安徽">
                                            <span style="font-size: 12px">安徽</span>
                                        </el-option>
                                        <el-option label="澳门" value="澳门">
                                            <span style="font-size: 12px">澳门</span>
                                        </el-option>
                                        <el-option label="北京" value="北京">
                                            <span style="font-size: 12px">北京</span>
                                        </el-option>
                                        <el-option label="重庆" value="重庆">
                                            <span style="font-size: 12px">重庆</span>
                                        </el-option>
                                        <el-option label="福建" value="福建">
                                            <span style="font-size: 12px">福建</span>
                                        </el-option>
                                        <el-option label="甘肃" value="甘肃">
                                            <span style="font-size: 12px">甘肃</span>
                                        </el-option>
                                        <el-option label="广东" value="广东">
                                            <span style="font-size: 12px">广东</span>
                                        </el-option>
                                        <el-option label="广西" value="广西">
                                            <span style="font-size: 12px">广西</span>
                                        </el-option>
                                        <el-option label="贵州" value="贵州">
                                            <span style="font-size: 12px">贵州</span>
                                        </el-option>
                                        <el-option label="海南" value="海南">
                                            <span style="font-size: 12px">海南</span>
                                        </el-option>
                                        <el-option label="河北" value="河北">
                                            <span style="font-size: 12px">河北</span>
                                        </el-option>
                                        <el-option label="黑龙江" value="黑龙江">
                                            <span style="font-size: 12px">黑龙江</span>
                                        </el-option>
                                        <el-option label="河南" value="河南">
                                            <span style="font-size: 12px">河南</span>
                                        </el-option>
                                        <el-option label="湖北" value="湖北">
                                            <span style="font-size: 12px">湖北</span>
                                        </el-option>
                                        <el-option label="湖南" value="湖南">
                                            <span style="font-size: 12px">湖南</span>
                                        </el-option>
                                        <el-option label="江苏" value="江苏">
                                            <span style="font-size: 12px">江苏</span>
                                        </el-option>
                                        <el-option label="江西" value="江西">
                                            <span style="font-size: 12px">江西</span>
                                        </el-option>
                                        <el-option label="吉林" value="吉林">
                                            <span style="font-size: 12px">吉林</span>
                                        </el-option>
                                        <el-option label="辽宁" value="辽宁">
                                            <span style="font-size: 12px">辽宁</span>
                                        </el-option>
                                        <el-option label="内蒙古" value="内蒙古">
                                            <span style="font-size: 12px">内蒙古</span>
                                        </el-option>
                                        <el-option label="宁夏" value="宁夏">
                                            <span style="font-size: 12px">宁夏</span>
                                        </el-option>
                                        <el-option label="青海" value="青海">
                                            <span style="font-size: 12px">青海</span>
                                        </el-option>
                                        <el-option label="山东" value="山东">
                                            <span style="font-size: 12px">山东</span>
                                        </el-option>
                                        <el-option label="上海" value="上海">
                                            <span style="font-size: 12px">上海</span>
                                        </el-option>
                                        <el-option label="山西" value="山西">
                                            <span style="font-size: 12px">山西</span>
                                        </el-option>
                                        <el-option label="四川" value="四川">
                                            <span style="font-size: 12px">四川</span>
                                        </el-option>
                                        <el-option label="台湾" value="台湾">
                                            <span style="font-size: 12px">台湾</span>
                                        </el-option>
                                        <el-option label="天津" value="天津">
                                            <span style="font-size: 12px">天津</span>
                                        </el-option>
                                        <el-option label="香港" value="香港">
                                            <span style="font-size: 12px">香港</span>
                                        </el-option>
                                        <el-option label="新疆" value="新疆">
                                            <span style="font-size: 12px">新疆</span>
                                        </el-option>
                                        <el-option label="西藏" value="西藏">
                                            <span style="font-size: 12px">西藏</span>
                                        </el-option>
                                        <el-option label="云南" value="云南">
                                            <span style="font-size: 12px">云南</span>
                                        </el-option>
                                        <el-option label="浙江" value="浙江">
                                            <span style="font-size: 12px">浙江</span>
                                        </el-option>
                                        <el-option label="自定义" value="自定义">
                                            <span style="font-size: 12px">自定义</span>
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="地图数据" v-if="configObject.dataBind.mapAddress == '自定义'">
                                    <el-input placeholder="请填写地图数据地址" v-model="configObject.dataBind.mapUrl" size="small" />
                                </el-form-item>
                                <el-form-item label="图表刷新" v-if="configObject.componentShow && (configObject.componentShow.indexOf('自定义echarts') > -1 || configObject.componentShow.indexOf('地图文件') > -1)">
                                    <el-input placeholder="60 (秒)" v-model="configObject.dataBind.echartSecond" size="small" />
                                </el-form-item>
                                <el-form-item label="悬浮提示" v-if="configObject.componentShow && configObject.componentShow.indexOf('悬浮提示') > -1">
                                    <el-radio-group v-model="configObject.style.tipDIs" size="small">
                                        <el-radio :label="true">开启</el-radio>
                                        <el-radio :label="false">关闭</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="悬浮模式" v-if="configObject.componentShow && configObject.componentShow.indexOf('悬浮提示') > -1">
                                    <el-radio-group v-model="configObject.style.tipShow" size="small">
                                        <el-radio :label="true">长显</el-radio>
                                        <el-radio :label="false">短显</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="悬浮位置" v-if="configObject.componentShow && configObject.componentShow.indexOf('悬浮提示') > -1">
                                    <el-select v-model="configObject.style.placement" placeholder="请选择悬浮位置" style="width: 100%" size="small">
                                        <el-option label="上边" value="top">
                                            <span style="font-size: 12px">上边</span>
                                        </el-option>
                                        <el-option label="上左" value="top-start">
                                            <span style="font-size: 12px">上左</span>
                                        </el-option>
                                        <el-option label="上右" value="top-end">
                                            <span style="font-size: 12px">上右</span>
                                        </el-option>
                                        <el-option label="下边" value="bottom">
                                            <span style="font-size: 12px">下边</span>
                                        </el-option>
                                        <el-option label="下左" value="bottom-start">
                                            <span style="font-size: 12px">下左</span>
                                        </el-option>
                                        <el-option label="下右" value="bottom-end">
                                            <span style="font-size: 12px">下右</span>
                                        </el-option>
                                        <el-option label="左边" value="left">
                                            <span style="font-size: 12px">左边</span>
                                        </el-option>
                                        <el-option label="左上" value="left-start">
                                            <span style="font-size: 12px">左上</span>
                                        </el-option>
                                        <el-option label="左下" value="left-end">
                                            <span style="font-size: 12px">左下</span>
                                        </el-option>
                                        <el-option label="右边" value="right">
                                            <span style="font-size: 12px">右边</span>
                                        </el-option>
                                        <el-option label="右上" value="right-start">
                                            <span style="font-size: 12px">右上</span>
                                        </el-option>
                                        <el-option label="右下" value="right-end">
                                            <span style="font-size: 12px">右下</span>
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="悬浮样式" v-if="configObject.componentShow && configObject.componentShow.indexOf('悬浮提示') > -1">
                                    <el-select v-model="configObject.style.effect" placeholder="请选择悬浮样式" style="width: 100%" size="small">
                                        <el-option label="暗黑" value="dark">
                                            <span style="font-size: 12px">暗黑</span>
                                        </el-option>
                                        <el-option label="明亮" value="light">
                                            <span style="font-size: 12px">明亮</span>
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="统计栏目" v-if="configObject.componentShow && configObject.componentShow.indexOf('数统计') > -1">
                                    <el-select v-model="configObject.dataBind.staticType" placeholder="请选择统计栏目" style="width: 100%" size="small">
                                        <el-option v-for="item in paramNameList" :key="item" :label="item" :value="item">
                                            <span style="font-size: 12px">{{ item }}</span>
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="线条宽度" v-if="configObject.style.lineWidth">
                                    <el-input-number style="width: 100%" controls-position="right" placeholder="请填写线条宽度" v-model="configObject.style.lineWidth" size="small" />
                                </el-form-item>
                                <!-- 新版水流样式设置开始 -->
                                <template v-if="configObject.componentShow && configObject.componentShow.indexOf('水流') > -1">
                                    <el-form-item label="线条高度">
                                        <el-input-number style="width: 100%" controls-position="right" placeholder="请填写线条高度" v-model="configObject.style.lineHeight" size="small" />
                                    </el-form-item>
                                    <el-form-item label="线条间隔">
                                        <el-input-number style="width: 100%" controls-position="right" placeholder="请填写线条间隔" v-model="configObject.style.lineInterval" size="small" />
                                    </el-form-item>
                                    <el-form-item label="线条形状">
                                        <el-select v-model="configObject.style.lineType" placeholder="请选择线条形状" style="width: 100%" size="small">
                                            <el-option label="矩形" value="butt">
                                                <span style="font-size: 12px">矩形</span>
                                            </el-option>
                                            <el-option label="椭圆" value="round">
                                                <span style="font-size: 12px">椭圆</span>
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="流动方向">
                                        <el-select v-model="configObject.style.animations" placeholder="请选择流动方向" style="width: 100%" size="small">
                                            <el-option label="正向" value="正向">
                                                <span style="font-size: 12px">正向</span>
                                            </el-option>
                                            <el-option label="反向" value="反向">
                                                <span style="font-size: 12px">反向</span>
                                            </el-option>
                                            <el-option label="静止" value="静止">
                                                <span style="font-size: 12px">静止</span>
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="流动速度">
                                        <el-select v-model="configObject.style.speed" placeholder="请选择流动速度" style="width: 100%" size="small">
                                            <el-option label="快" value="快">
                                                <span style="font-size: 12px">快</span>
                                            </el-option>
                                            <el-option label="中" value="中">
                                                <span style="font-size: 12px">中</span>
                                            </el-option>
                                            <el-option label="慢" value="慢">
                                                <span style="font-size: 12px">慢</span>
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="锚点个数">
                                        <el-input-number style="width: 100%" controls-position="right" placeholder="请填写锚点个数" v-model="configObject.style.anchorPointNum" size="small" />
                                    </el-form-item>
                                </template>
                                <!-- 水流样式设置结束 -->
                                <!-- 水球图样式 -->
                                <el-form-item label="液位形状" v-if="configObject.style.waterShape">
                                    <el-select v-model="configObject.style.waterShape" placeholder="请选择液位形状" style="width: 100%" size="small">
                                        <el-option label="容器" value="container">
                                            <span style="font-size: 12px">容器</span>
                                        </el-option>
                                        <el-option label="圆形" value="circle">
                                            <span style="font-size: 12px">圆形</span>
                                        </el-option>
                                        <el-option label="矩形" value="rect">
                                            <span style="font-size: 12px">矩形</span>
                                        </el-option>
                                        <el-option label="圆角矩形" value="roundRect">
                                            <span style="font-size: 12px">圆角矩形</span>
                                        </el-option>
                                        <el-option label="三角形" value="triangle">
                                            <span style="font-size: 12px">三角形</span>
                                        </el-option>
                                        <el-option label="菱形" value="diamond">
                                            <span style="font-size: 12px">菱形</span>
                                        </el-option>
                                        <el-option label="热气球形" value="pin">
                                            <span style="font-size: 12px">热气球形</span>
                                        </el-option>
                                        <el-option label="倒三角形" value="arrow">
                                            <span style="font-size: 12px">倒三角形</span>
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="波浪颜色" v-if="configObject.style.waterShape">
                                    <div style="height: 36px">
                                        <el-color-picker v-model="configObject.style.waterColor" show-alpha :predefine="predefineColors" />
                                    </div>
                                </el-form-item>
                                <el-form-item label="字体大小" v-if="configObject.style.waterFontSize !== undefined">
                                    <el-input-number style="width: 100%" controls-position="right" placeholder="请填写字体大小" v-model="configObject.style.waterFontSize" size="small" />
                                </el-form-item>
                                <el-form-item label="边框宽度" v-if="configObject.style.waterBorderWidth !== undefined">
                                    <el-input-number style="width: 100%" controls-position="right" placeholder="请填写边框宽度" v-model="configObject.style.waterBorderWidth" size="small" />
                                </el-form-item>
                                <el-form-item label="边框颜色" v-if="configObject.style.waterBorderColor !== undefined">
                                    <div style="height: 36px">
                                        <el-color-picker v-model="configObject.style.waterBorderColor" show-alpha :predefine="predefineColors" color-format="hex" />
                                    </div>
                                </el-form-item>
                                <el-form-item label="边框背景色" v-if="configObject.style.waterBackColor !== undefined">
                                    <div style="height: 36px">
                                        <el-color-picker v-model="configObject.style.waterBackColor" show-alpha :predefine="predefineColors" color-format="hex" />
                                    </div>
                                </el-form-item>
                            </el-form>
                        </el-collapse-item>
                        <!-- 滚动表格开始 -->
                        <el-collapse-item title="表格样式" name="3" v-if="configObject.componentShow && configObject.componentShow.indexOf('轮播表') > -1">
                            <el-form label-width="84px">
                                <el-form-item label="行数">
                                    <el-input-number style="width: 100%" controls-position="right" placeholder="请填写行数" v-model="configObject.style.rowNum" size="small" />
                                </el-form-item>
                                <el-form-item label="字体颜色">
                                    <div style="height: 36px">
                                        <el-color-picker v-model="configObject.style.foreColor" show-alpha :predefine="predefineColors" color-format="hex" />
                                    </div>
                                </el-form-item>
                                <el-form-item label="表头背景色">
                                    <div style="height: 36px">
                                        <el-color-picker v-model="configObject.style.headerBGC" show-alpha :predefine="predefineColors" color-format="hex" />
                                    </div>
                                </el-form-item>
                                <el-form-item label="奇数行背景色">
                                    <div style="height: 36px">
                                        <el-color-picker v-model="configObject.style.oddRowBGC" show-alpha :predefine="predefineColors" color-format="hex" />
                                    </div>
                                </el-form-item>
                                <el-form-item label="偶数行背景色">
                                    <div style="height: 36px">
                                        <el-color-picker v-model="configObject.style.evenRowBGC" show-alpha :predefine="predefineColors" color-format="hex" />
                                    </div>
                                </el-form-item>
                                <el-form-item label="轮播时间间隔">
                                    <el-input-number style="width: 100%" controls-position="right" placeholder="请填写轮播时间间隔" v-model="configObject.style.waitTime" size="small" :min="1000" />
                                </el-form-item>
                                <el-form-item label="表头高度">
                                    <el-input-number style="width: 100%" controls-position="right" placeholder="请填写表头高度" v-model="configObject.style.headerHeight" size="small" />
                                </el-form-item>
                                <el-form-item label="表头宽度">
                                    <el-input-number style="width: 100%" controls-position="right" placeholder="请填写表头宽度" v-model="configObject.style.columnWidth" size="small" />
                                </el-form-item>
                                <el-form-item label="是否显示行号">
                                    <el-radio-group v-model="configObject.style.index" size="small">
                                        <el-radio :label="true">显示</el-radio>
                                        <el-radio :label="false">隐藏</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="轮播方式">
                                    <el-select v-model="configObject.style.carousel" placeholder="请选择轮播方式" style="width: 100%" size="small">
                                        <el-option label="行" value="single">
                                            <span style="font-size: 12px">行</span>
                                        </el-option>
                                        <el-option label="页" value="page">
                                            <span style="font-size: 12px">页</span>
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </el-collapse-item>
                        <!-- 滚动表格结束 -->
                    </el-collapse>
                </div>
                <!-- 数据绑定 -->
                <div class="table-item" v-show="tabIndex == 1">
                    <el-collapse class="collapse-wrap" v-model="dataCollapseActive">
                        <!-- 参数绑定开始 -->
                        <el-collapse-item title="参数绑定" name="1" v-if="configObject.componentShow && configObject.componentShow.indexOf('参数绑定') > -1">
                            <el-form label-width="65px">
                                <el-form-item label="状态类型" v-if="configObject.componentShow && configObject.componentShow.indexOf('设备状态') > -1">
                                    <el-select v-model="configObject.dataBind.activeName" placeholder="请选择状态" style="width: 100%" size="small">
                                        <el-option label="变量状态" value="变量状态">
                                            <span style="font-size: 12px">变量状态</span>
                                        </el-option>
                                        <el-option label="设备状态" value="设备状态">
                                            <span style="font-size: 12px">设备状态</span>
                                        </el-option>
                                    </el-select>
                                </el-form-item>

                                <el-form-item label="设备状态" v-if="configObject.dataBind.activeName == '设备状态'">
                                    <el-select v-model="configObject.dataBind.serialNumber" placeholder="请选择设备" style="width: 100%" size="small" filterable>
                                        <el-option :label="item.deviceName" :value="item.serialNumber" v-for="item in deviceBindList" :key="item.serialNumber">
                                            <span style="font-size: 12px">{{ item.deviceName }}</span>
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="变量状态" v-else>
                                    <el-input placeholder="请选择变量" v-model="configObject.dataBind.modelName" readonly size="small">
                                        <el-button slot="append" size="small" @click="selectVariable('参数绑定')">选择</el-button>
                                    </el-input>
                                </el-form-item>
                            </el-form>
                        </el-collapse-item>
                        <!-- 参数绑定结束 -->
                        <!-- 组态界面开始 -->
                        <el-collapse-item title="数据源" name="2" v-if="configObject && configObject.componentShow.indexOf('组态界面') > -1">
                            <el-form label-width="65px">
                                <el-form-item label="组态界面">
                                    <el-select v-model="configObject.dataBind.ztPageData" placeholder="请选择组态界面" style="width: 100%" size="small">
                                        <el-option v-for="item in ztOption" :key="item.id" :label="item.pageName" :value="item.id + '&' + item.guid">
                                            <span style="font-size: 12px">{{ item.pageName }}</span>
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </el-collapse-item>
                        <!-- 组态界面结束 -->
                        <!-- 萤石云开始 -->
                        <el-collapse-item title="萤石云" name="3" v-if="configObject.componentShow && configObject.componentShow.indexOf('萤石云') > -1">
                            <el-form label-width="72px">
                                <el-form-item label="设备序列号">
                                    <el-input placeholder="萤石云控制台获取" v-model="configObject.dataBind.serialNumber" size="small" clearable />
                                </el-form-item>
                                <el-form-item label="通道号">
                                    <el-input placeholder="萤石云控制台获取" v-model="configObject.dataBind.channelNumber" size="small" clearable />
                                </el-form-item>
                                <el-form-item label="Token">
                                    <el-input placeholder="萤石云控制台获取" v-model="configObject.dataBind.accessToken" size="small" clearable />
                                </el-form-item>
                            </el-form>
                        </el-collapse-item>
                        <!-- 萤石云结束 -->
                        <!-- 直播视频开始 -->
                        <el-collapse-item title="直播视频" name="4" v-if="configObject.componentShow && configObject.componentShow.indexOf('直播视频') > -1">
                            <el-form label-width="72px">
                                <el-form-item label="监控设备">
                                    <el-select placeholder="请选择设备" v-model="configObject.dataBind.deviceId" @change="handleChangeDevice" size="small" clearable>
                                        <el-option v-for="item in liveBroadcastDeviceList"
                                            :key="item.deviceId"
                                            :label="item.deviceName"
                                            :value="item.deviceId">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="视频通道">
                                    <el-select placeholder="请选择通道" v-model="configObject.dataBind.channelSipId" size="small" @change="handleChange" clearable :disabled="!configObject.dataBind.deviceId">
                                        <el-option v-for="item in channelList"
                                            :key="item.channelSipId"
                                            :label="item.channelName"
                                            :value="item.channelSipId">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </el-collapse-item>
                        <!-- 直播视频结束 -->
                        <!-- 通用视频开始 -->
                        <el-collapse-item title="通用视频" name="5" v-if="configObject.componentShow && configObject.componentShow.indexOf('通用视频') > -1">
                            <el-form label-width="65px">
                                <el-form-item label="视频地址">
                                    <el-input placeholder="MP4视频地址" v-model="configObject.videoUrl" size="small" clearable />
                                </el-form-item>
                                <el-form-item label="封面地址">
                                    <el-input placeholder="视频封面地址" v-model="configObject.imageUrl" size="small" clearable />
                                </el-form-item>
                            </el-form>
                        </el-collapse-item>
                        <!-- 通用视频结束 -->
                        <!-- 通用视频开始 -->
                        <el-collapse-item title="三维" name="6" v-if="configObject.componentShow && configObject.componentShow.indexOf('三维') > -1">
                            <el-form label-width="65px">
                                <el-form-item label="三维场景">
                                    <el-select v-model="configObject.imageUrl" placeholder="请联系商务人员获取" @change="selectModelChange" style="width: 100%" size="small">
                                        <el-option :label="item.modelName" :value="item.imageUrl" :key="item.id" v-for="item in ztModelOption">
                                            <span style="font-size: 12px">{{ item.modelName }}</span>
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </el-collapse-item>
                        <!-- 通用视频结束 -->
                        <!-- echarts图表地址开始 -->
                        <el-collapse-item
                            title="自定义echarts/地图文件"
                            name="7"
                            v-if="configObject.componentShow && (configObject.componentShow.indexOf('自定义echarts') > -1 || configObject.componentShow.indexOf('地图文件') > -1)"
                        >
                            <el-form label-width="65px" label-position="top">
                                <el-form-item label="请求配置">
                                    <div>
                                        <el-button type="primary" size="mini" style="width: 100%;" @click="openEchartHttpOption">编辑配置</el-button>
                                    </div>
                                    <div>
                                        <el-button type="success" size="mini" style="width: 100%;" @click="echartHttpClick(configObject.dataBind.httpSetting)">发送请求</el-button>
                                    </div>
                                </el-form-item>
                                <el-form-item label="响应示例">
                                    <json-viewer class="json-view-wrap" :value="configObject.dataBind.echartData" :expand-depth="10" copyable>
                                        <template v-slot:copy>复制</template>
                                    </json-viewer>
                                </el-form-item>
                            </el-form>
                        </el-collapse-item>
                        <!-- echarts图表地址结束 -->
                        <!--事件点击开始 -->
                        <el-collapse-item title="事件" name="8" v-if="configObject.componentShow && configObject.componentShow.indexOf('单击') > -1">
                            <div class="ixd-wrap">
                                <el-checkbox v-model="configObject.dataBind.djAction">单击</el-checkbox>
                                <el-button type="text" icon="el-icon-edit" :disabled="!configObject.dataBind.djAction" @click="configClick('单击')"></el-button>
                            </div>
                        </el-collapse-item>
                        <!-- 事件点击结束 -->
                        <!-- 新版线条流动判断开始 -->
                        <el-collapse-item title="流动" name="9" v-if="configObject.componentShow && configObject.componentShow.indexOf('水流') > -1">
                            <el-form label-width="65px">
                                <el-form-item label="流动条件">
                                    <el-input type="number" controls-position="right" class="input-with-select" placeholder="请输入值" v-model="configObject.dataAction.paramJudgeData" size="small">
                                        <el-select slot="prepend" v-model="configObject.dataAction.paramJudge" placeholder="请选择" size="small">
                                            <el-option label=">" value="大于">
                                                <span style="font-size: 12px">&gt;</span>
                                            </el-option>
                                            <el-option label=">=" value="大于等于">
                                                <span style="font-size: 12px">&gt;=</span>
                                            </el-option>
                                            <el-option label="=" value="等于">
                                                <span style="font-size: 12px">=</span>
                                            </el-option>
                                            <el-option label="<=" value="小于等于">
                                                <span style="font-size: 12px">&lt;=</span>
                                            </el-option>
                                            <el-option label="<" value="小于">
                                                <span style="font-size: 12px">&lt;</span>
                                            </el-option>
                                            <el-option label="!=" value="不等于">
                                                <span style="font-size: 12px">!=</span>
                                            </el-option>
                                        </el-select>
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="流动方向">
                                    <el-radio-group v-model="configObject.dataAction.direction" size="small">
                                        <el-radio label="正向">正向</el-radio>
                                        <el-radio label="反向">反向</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="流动条件">
                                    <el-input type="number" controls-position="right" class="input-with-select" placeholder="请输入值" v-model="configObject.dataAction.paramJudgeData01" size="small">
                                        <el-select slot="prepend" v-model="configObject.dataAction.paramJudge01" placeholder="请选择" size="small">
                                            <el-option label=">" value="大于">
                                                <span style="font-size: 12px">&gt;</span>
                                            </el-option>
                                            <el-option label=">=" value="大于等于">
                                                <span style="font-size: 12px">&gt;=</span>
                                            </el-option>
                                            <el-option label="=" value="等于">
                                                <span style="font-size: 12px">=</span>
                                            </el-option>
                                            <el-option label="<=" value="小于等于">
                                                <span style="font-size: 12px">&lt;=</span>
                                            </el-option>
                                            <el-option label="<" value="小于">
                                                <span style="font-size: 12px">&lt;</span>
                                            </el-option>
                                            <el-option label="!=" value="不等于">
                                                <span style="font-size: 12px">!=</span>
                                            </el-option>
                                        </el-select>
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="流动方向">
                                    <el-radio-group v-model="configObject.dataAction.direction01" size="small">
                                        <el-radio label="正向">正向</el-radio>
                                        <el-radio label="反向">反向</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-form>
                        </el-collapse-item>
                        <!-- 线条流动判断结束 -->
                        <!-- 闪烁、旋转、显隐动画 -->
                        <el-collapse-item title="动画-唯一生效" name="10" v-if="configObject.componentShow && configObject.componentShow.indexOf('动画') > -1">
                            <div class="ixd-wrap">
                                <el-checkbox v-model="configObject.dataBind.xyAction">显隐</el-checkbox>
                                <el-button type="text" icon="el-icon-edit" :disabled="!configObject.dataBind.xyAction" @click="configClick('显隐')"></el-button>
                            </div>
                            <div class="ixd-wrap">
                                <el-checkbox v-model="configObject.dataBind.xzAction">旋转</el-checkbox>
                                <el-button type="text" icon="el-icon-edit" :disabled="!configObject.dataBind.xzAction" @click="configClick('旋转')"></el-button>
                            </div>
                            <div class="ixd-wrap">
                                <el-checkbox v-model="configObject.dataBind.ssAction">闪烁</el-checkbox>
                                <el-button type="text" icon="el-icon-edit" :disabled="!configObject.dataBind.ssAction" @click="configClick('闪烁')"></el-button>
                            </div>
                            <div class="ixd-wrap">
                                <el-checkbox v-model="configObject.dataBind.hdAction">滑动</el-checkbox>
                                <el-button type="text" icon="el-icon-edit" :disabled="!configObject.dataBind.hdAction" @click="configClick('滑动')"></el-button>
                            </div>
                        </el-collapse-item>
                        <!-- 状态开关开始 -->
                        <el-collapse-item title="状态开关" name="11" v-if="configObject.componentShow && configObject.componentShow.indexOf('状态开关') > -1">
                            <template v-if="configObject.dataBind.activeName == '变量状态'">
                                <div class="btn-tools-wrap">
                                    <span class="name">条件</span>
                                    <div>
                                        <el-button type="text" icon="el-icon-plus" size="mini" @click="addSwitch"></el-button>
                                        <el-button type="text" icon="el-icon-delete" style="color: #f56c6c; margin-left: 10px" size="mini" @click="deleteSwitch"></el-button>
                                    </div>
                                </div>
                                <div class="btn-tools-content-wrap" v-for="(item, index) in configObject.dataBind.stateList" :key="index">
                                    <div class="input-wrap">
                                        <el-input type="number" controls-position="right" class="input-with-select" placeholder="请输入值" v-model="item.paramData" size="small">
                                            <el-select slot="prepend" v-model="item.paramCondition" placeholder="请选择" size="small">
                                                <el-option label=">" value="大于">
                                                    <span style="font-size: 12px">&gt;</span>
                                                </el-option>
                                                <el-option label=">=" value="大于等于">
                                                    <span style="font-size: 12px">&gt;=</span>
                                                </el-option>
                                                <el-option label="=" value="等于">
                                                    <span style="font-size: 12px">=</span>
                                                </el-option>
                                                <el-option label="<=" value="小于等于">
                                                    <span style="font-size: 12px">&lt;=</span>
                                                </el-option>
                                                <el-option label="<" value="小于">
                                                    <span style="font-size: 12px">&lt;</span>
                                                </el-option>
                                                <el-option label="!=" value="不等于">
                                                    <span style="font-size: 12px">!=</span>
                                                </el-option>
                                            </el-select>
                                        </el-input>
                                    </div>
                                    <div class="img-wrap">
                                        <el-image style="width: 30px; height: 30px" fit="fit" v-if="item.imageUrl" :src="item.imageUrl" @click="handleGalleryClick('状态开关-' + item.id)" />
                                        <i v-else class="el-icon-plus" @click="handleGalleryClick('状态开关-' + item.id)"></i>
                                    </div>
                                    <div class="color-picker-wrap">
                                        <el-color-picker v-model="item.foreColor" show-alpha :predefine="predefineColors" size="small" color-format="hex" />
                                    </div>
                                </div>
                            </template>
                            <!-- 设备状态判断在线、离线、报警 -->
                            <div style="margin-top: 8px" v-if="configObject.dataBind.activeName == '设备状态'">
                                <div class="form-item-wrap">
                                    <span class="name">设备离线</span>
                                    <div class="content">
                                        <img v-if="this.configObject.dataBind.shutImageUrl" style="width: 30px; height: 30px" :src="configObject.dataBind.shutImageUrl" @click="handleGalleryClick('开关状态(关)')" />
                                        <el-button v-else type="text" icon="el-icon-plus" size="mini" @click="handleGalleryClick('开关状态(关)')"></el-button>
                                    </div>
                                </div>
                                <div class="form-item-wrap">
                                    <span class="name">设备在线</span>
                                    <div class="content">
                                        <img v-if="this.configObject.dataBind.openImageUrl" style="width: 30px; height: 30px" :src="configObject.dataBind.openImageUrl" @click="handleGalleryClick('开关状态(开)')" />
                                        <el-button v-else type="text" icon="el-icon-plus" size="mini" @click="handleGalleryClick('开关状态(开)')"></el-button>
                                    </div>
                                </div>
                                <div class="form-item-wrap">
                                    <span class="name">设备禁用</span>
                                    <div class="content">
                                        <img v-if="this.configObject.dataBind.warnImageUrl" style="width: 30px; height: 30px" :src="configObject.dataBind.warnImageUrl" @click="handleGalleryClick('开关状态(报警)')" />
                                        <el-button v-else type="text" icon="el-icon-plus" size="mini" @click="handleGalleryClick('开关状态(报警)')"></el-button>
                                    </div>
                                </div>
                            </div>
                        </el-collapse-item>
                        <!-- 状态开关结束 -->
                        <!-- 填充颜色开始 -->
                        <el-collapse-item title="填充颜色" name="12" v-if="configObject.componentShow && configObject.componentShow.indexOf('组件填充') > -1">
                            <template>
                                <div class="btn-tools-wrap">
                                    <span class="name">条件</span>
                                    <div>
                                        <el-button type="text" icon="el-icon-plus" size="mini" @click="addSwitch"></el-button>
                                        <el-button type="text" icon="el-icon-delete" style="color: #f56c6c; margin-left: 10px" size="mini" @click="deleteSwitch"></el-button>
                                    </div>
                                </div>
                                <div class="btn-tools-content-wrap" v-for="(item, index) in configObject.dataBind.stateList" :key="index">
                                    <div class="input-wrap">
                                        <el-input type="number" controls-position="right" class="input-with-select" placeholder="请输入值" v-model="item.paramData" size="small">
                                            <el-select slot="prepend" v-model="item.paramCondition" placeholder="请选择" size="small">
                                                <el-option label=">" value="大于">
                                                    <span style="font-size: 12px">&gt;</span>
                                                </el-option>
                                                <el-option label=">=" value="大于等于">
                                                    <span style="font-size: 12px">&gt;=</span>
                                                </el-option>
                                                <el-option label="=" value="等于">
                                                    <span style="font-size: 12px">=</span>
                                                </el-option>
                                                <el-option label="<=" value="小于等于">
                                                    <span style="font-size: 12px">&lt;=</span>
                                                </el-option>
                                                <el-option label="<" value="小于">
                                                    <span style="font-size: 12px">&lt;</span>
                                                </el-option>
                                                <el-option label="!=" value="不等于">
                                                    <span style="font-size: 12px">!=</span>
                                                </el-option>
                                            </el-select>
                                        </el-input>
                                    </div>
                                    <div class="color-picker-wrap">
                                        <el-color-picker v-model="item.foreColor" show-alpha :predefine="predefineColors" size="small" color-format="hex" />
                                    </div>
                                </div>
                            </template>
                        </el-collapse-item>
                        <!-- 填充颜色结束 -->
                        <!-- 天气组件开始 -->
                        <el-collapse-item title="位置" name="13" v-if="configObject.componentShow && configObject.componentShow.indexOf('天气') > -1">
                            <el-form label-width="30px">
                                <el-form-item label="省">
                                    <el-select v-model="configObject.dataBind.provinceCode" placeholder="请选择省" style="width: 100%" size="small" filterable @change="provinceChange">
                                        <el-option v-for="pro in provinceList" :key="pro.code" :label="pro.name" :value="pro.code">
                                            <span style="font-size: 12px">{{ pro.name }}</span>
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="市">
                                    <el-select v-model="configObject.dataBind.cityCode" placeholder="请选择市" style="width: 100%" size="small" filterable @change="cityChange">
                                        <el-option v-for="city in cityList" :key="city.code" :label="city.name" :value="city.code">
                                            <span style="font-size: 12px">{{ city.name }}</span>
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="区">
                                    <el-select v-model="configObject.dataBind.districtCode" placeholder="请选择区" style="width: 100%" size="small" filterable>
                                        <el-option v-for="dis in districtList" :key="dis.code" :label="dis.name" :value="dis.code">
                                            <span style="font-size: 12px">{{ dis.name }}</span>
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                            <el-alert title="温馨提示" type="warning" description="同一组态界面只能存在一个天气组件"></el-alert>
                        </el-collapse-item>
                        <!-- 天气组件结束 -->
                    </el-collapse>
                </div>
                <!-- 图层 -->
                <div class="table-item" v-show="tabIndex == 2">
                    <div v-for="(component,index) in topoData.components" @click="clickItem(component,index)"
                    :class="['layer',index == activeIndex?'layerActive':'']" style="display: flex;align-items: center;">
                        <div class="componentName">
                            {{ component.name }}
                        </div>
                        <div class="componentControl">
                            <el-button :icon="component.isLock?'el-icon-unlock':'el-icon-lock'" style="color:#3388ff"
                            type="text" @click.stop="handleLock(component.isLock?'解锁':'锁定',component)">
                            </el-button>
                            <el-button :icon="component.style.visible?'el-icon-view':'el-icon-minus'" style="color:#3388ff"
                            type="text" @click.stop="handleShow(component.style.visible?'隐藏':'显示',component)">
                            </el-button>
                            <el-button icon="el-icon-edit" type="text" @click.stop="handleEdit(component)" style="color:#3388ff">
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <!-- 界面背景设置 -->
        <template v-if="isLayer">
            <el-form class="bg-set-wrap" label-width="65px">
                <el-form-item label="背景名称">
                    <el-input placeholder="请填写背景名称" v-model="topoData.name" size="small"></el-input>
                </el-form-item>
                <el-form-item label="分辨率">
                    <el-select v-model="resolution" placeholder="请选择" style="width: 100%" size="small">
                        <el-option v-for="dict in dict.type.sys_page_size" :key="dict.value" :label="dict.label" :value="dict.value">
                            <span style="font-size: 12px">{{ dict.label }}</span>
                        </el-option>
                        <el-option key="custom" label="自定义" value="custom">
                            <span style="font-size: 12px">自定义</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分辨率宽" v-if="resolution === 'custom'">
                    <el-input-number style="width: 100%" controls-position="right" placeholder="请填写分辨率宽" v-model="topoData.layer.width" size="small" :min="100" />
                </el-form-item>
                <el-form-item label="分辨率高" v-if="resolution === 'custom'">
                    <el-input-number style="width: 100%" controls-position="right" placeholder="请填写分辨率高" v-model="topoData.layer.height" size="small" :min="100" />
                </el-form-item>
                <el-form-item label="背景颜色">
                    <el-color-picker v-model="topoData.layer.backColor" show-alpha :predefine="predefineColors" color-format="hex" />
                </el-form-item>
                <el-form-item label="背景图片">
                    <div class="bg-img-wrap" @click="handleGalleryClick('背景图片')">
                        <img class="img-wrap" v-if="topoData.layer.backgroundImage" :src="topoData.layer.backgroundImage" />
                        <i v-else class="el-icon-plus ico-wrap"></i>
                        <span class="img-tools" v-if="topoData.layer.backgroundImage" @click.stop>
                            <i class="el-icon-plus" @click.stop="handleGalleryClick('背景图片')"></i>
                            <i class="el-icon-delete" @click.stop="topoData.layer.backgroundImage = ''"></i>
                        </span>
                    </div>
                </el-form-item>
                <el-form-item label="拖拽缩放">
                    <el-checkbox v-model="topoData.layer.dragZoom" size="small">开启</el-checkbox>
                </el-form-item>
            </el-form>
        </template>
        <!-- 图库对话框 -->
        <el-dialog title="图库" :visible.sync="isGalleryDialog" width="1100px" :close-on-click-modal="false">
            <div class="el-divider el-divider--horizontal" style="margin-top: -25px"></div>
            <topo-select-image ref="topoSelectImage" />
            <span slot="footer">
                <el-button @click="isGalleryDialog = false">取 消</el-button>
                <el-button type="primary" @click="selectImageClick">确 定</el-button>
            </span>
        </el-dialog>
        <!--图片动画设置  -->
        <el-dialog v-if="configObject && configObject.componentShow.indexOf('动画') > -1" title="动画设置" :visible.sync="animationDialog" width="550px" :close-on-click-modal="false" v-dialogDrag>
            <div class="el-divider el-divider--horizontal" style="margin-top: -25px"></div>
            <el-form label-width="80px">
                <el-form-item label="变量名称">
                    <el-input placeholder="请选择变量" v-model="configObject.dataAction.modelName" readonly>
                        <el-button slot="append" @click="selectVariable">选择</el-button>
                    </el-input>
                </el-form-item>
                <el-form-item label="判断条件" prop="paramJudge">
                    <el-input type="number" controls-position="right" class="input-with-select" placeholder="请输入值" v-model="configObject.dataAction.paramJudgeData">
                        <el-select slot="prepend" v-model="configObject.dataAction.paramJudge" placeholder="请选择">
                            <el-option label=">" value="大于">
                                <span style="font-size: 12px">&gt;</span>
                            </el-option>
                            <el-option label=">=" value="大于等于">
                                <span style="font-size: 12px">&gt;=</span>
                            </el-option>
                            <el-option label="=" value="等于">
                                <span style="font-size: 12px">=</span>
                            </el-option>
                            <el-option label="<=" value="小于等于">
                                <span style="font-size: 12px">&lt;=</span>
                            </el-option>
                            <el-option label="<" value="小于">
                                <span style="font-size: 12px">&lt;</span>
                            </el-option>
                            <el-option label="!=" value="不等于">
                                <span style="font-size: 12px">!=</span>
                            </el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item v-if="clickText === '旋转'" label="动画效果" prop="rotationSpeed">
                    <el-radio-group v-model="configObject.dataAction.rotationSpeed">
                        <el-radio label="快">快</el-radio>
                        <el-radio label="中">中</el-radio>
                        <el-radio label="慢">慢</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div v-if="clickText === '滑动'">
                    <el-form-item label="滑动配置">
                        <el-button type="primary" icon="el-icon-plus" plain circle @click="addTranslate"></el-button>
                        <el-button type="danger" icon="el-icon-delete" plain circle @click="deleteTranslate"></el-button>
                    </el-form-item>
                    <el-form-item label="滑动周期">
                        <el-input-number style="width: 100%" controls-position="right" v-model="configObject.dataAction.duration" clearable placeholder="请输入滑动周期(秒)"></el-input-number>
                    </el-form-item>
                    <el-form-item label="滑动位置" v-for="(item, index) in configObject.dataAction.translateList" :key="index">
                        <el-input type="number" controls-position="right" class="input-with-select" placeholder="请输入偏移度" v-model="item.position">
                            <el-select slot="prepend" v-model="item.direction" placeholder="请选择">
                                <el-option label="水平" value="水平">
                                    <span style="font-size: 12px">水平</span>
                                </el-option>
                                <el-option label="竖直" value="竖直">
                                    <span style="font-size: 12px">竖直</span>
                                </el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="animationDialog = false">取 消</el-button>
                <el-button type="primary" @click="animationSubmit">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog width="1100px" title="变量选择" :visible.sync="variableDialog" append-to-body :close-on-click-modal="false">
            <div class="el-divider el-divider--horizontal" style="margin-top: -25px"></div>
            <topo-variable ref="topoVariable" :multiple="multiple" :textStatic="textStatic" />
            <span slot="footer" class="dialog-footer">
                <el-button @click="variableDialog = false">取 消</el-button>
                <el-button type="primary" @click="selectVariableClick">确 定</el-button>
            </span>
        </el-dialog>
        <!--事件单击设置  -->
        <el-dialog v-if="configObject && configObject.componentShow.indexOf('单击') > -1" title="单击设置" :visible.sync="singleClickDialog" width="530px">
            <div class="el-divider el-divider--horizontal" style="margin-top: -25px"></div>
            <el-form label-width="80px">
                <el-form-item label="动作">
                    <el-radio-group v-model="configObject.dataBind.action">
                        <el-radio label="操作变量">操作变量</el-radio>
                        <el-radio label="外部链接">外部链接</el-radio>
                        <el-radio label="组态界面">组态界面</el-radio>
                        <el-radio v-if="configObject.type == 'imageSwitch'" label="开关控制">开关控制</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="变量名称" v-if="configObject.dataBind.action == '操作变量' || configObject.dataBind.action == '开关控制'">
                    <el-input placeholder="请选择变量" v-model="configObject.dataBind.modelName" readonly>
                        <el-button slot="append" @click="selectVariable">选择</el-button>
                    </el-input>
                </el-form-item>
                <el-form-item label="写入值" v-if="configObject.dataBind.action == '操作变量'">
                    <el-input v-model="configObject.dataBind.modelValue" placeholder="为空即为可变值" />
                </el-form-item>
                <el-form-item label="提示信息" v-if="configObject.dataBind.action == '操作变量'">
                    <el-input v-model="configObject.dataBind.tipMsg" placeholder="请输入提示信息" clearable />
                </el-form-item>
                <el-form-item label="跳转链接" v-if="configObject.dataBind.action == '外部链接'">
                    <el-input v-model="configObject.dataBind.redirectUrl" placeholder="请填写要跳转的链接" clearable />
                </el-form-item>
                <el-form-item label="开关控制" v-if="configObject.dataBind.action == '开关控制'">
                    <el-radio-group v-model="configObject.dataBind.controValue">
                        <el-radio label="0关1开">0关1开</el-radio>
                        <el-radio label="0开1关">0开1关</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="组态界面" v-if="configObject.dataBind.action == '组态界面'">
                    <el-select v-model="configObject.dataBind.ztPage" clearable placeholder="请选择组态界面" style="width: 100%" @change="selectZtPage">
                        <el-option :label="item.pageName" :value="item.guid" v-for="item in ztOption" :key="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="打开方式" v-if="configObject.dataBind.action == '组态界面'">
                    <el-radio-group v-model="configObject.dataBind.openModel">
                        <el-radio :label="1">当前窗口打开</el-radio>
                        <el-radio :label="2">打开新窗口</el-radio>
                        <el-radio :label="3">弹出小窗口</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="窗口宽度" v-if="configObject.dataBind.action == '组态界面' && configObject.dataBind.openModel === 3">
                    <el-input v-model="configObject.dataBind.windowWidth" placeholder="请填写窗口宽度" clearable />
                </el-form-item>
                <el-form-item label="窗口高度" v-if="configObject.dataBind.action == '组态界面' && configObject.dataBind.openModel === 3">
                    <el-input v-model="configObject.dataBind.windowHeight" placeholder="请填写窗口高度" clearable />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="singleClickDialog = false">取 消</el-button>
                <el-button type="primary" @click="singleClickSubmit">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 代码视图 -->
        <el-dialog class="data-engine-dialog" v-if="configObject" title="数据引擎" :visible.sync="isCodeViewDialog" width="50%" append-to-body :close-on-click-modal="false" v-dialogDrag>
            <div class="el-divider el-divider--horizontal" style="margin-top: -25px"></div>
            <div class="title-wrap">
                <a href="https://www.isqqw.com/" target="_blank">Echarts图表合集-仅支持vue语法糖、数据引擎-echartData</a>
                <i class="el-icon-info" @click="isEchartExplainDialog = true" style="color: #e6a23c; margin-left: 5px"></i>
            </div>
            <el-input :disabled="true" class="action-wrap" type="textarea" :autosize="{ minRows: 3,maxRows:10 }" placeholder="请到接口配置功能配置数据接口" v-model="configObject.dataBind.echartData"></el-input>
            <editor v-model="configObject.dataBind.echartOption" @init="editorInit"  lang="javascript" theme="dawn" width="100%" height="75vh" :options="editorOptions"></editor>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="echartRunClick">运 行</el-button>
                <el-button @click="isCodeViewDialog = false">关 闭</el-button>
            </span>
        </el-dialog>
        <el-dialog title="数据引擎示例" :visible.sync="isEchartExplainDialog" width="40%" append-to-body :close-on-click-modal="false">
            <div class="el-divider el-divider--horizontal" style="margin-top: -25px"></div>
            <div class="box-message" v-html="topoUtil.getEchartExplain()"></div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="isEchartExplainDialog = false">关 闭</el-button>
            </span>
        </el-dialog>
        <el-dialog v-if="configObject && (configObject.componentShow.indexOf('自定义echarts') > -1 || configObject.componentShow.indexOf('地图文件') > -1)"
            title="公共配置" :visible.sync="echartHttpOptionDialog" width="50%" append-to-body :close-on-click-modal="false" v-dialogDrag>
            <el-form label-position="right" label-width="80px">
                <el-form-item label="请求地址">
                    <div style="display: flex;justify-content: space-between;">
                        <el-input v-model="httpSetting.url" placeholder="例：https://127.0.0.1/ 或 /scada/center/list" style="width: 73%;">
                            <el-select v-model="httpSetting.method" slot="prepend" placeholder="请选择" style="width: 100px;">
                                <el-option label="get" value="get"></el-option>
                                <el-option label="post" value="post"></el-option>
                            </el-select>
                        </el-input>
                        <el-input v-model="configObject.dataBind.echartSecond" type="number" style="width: 25%;">
                            <el-select v-model="httpSetting.unit" slot="append" placeholder="请选择" style="width: 100px;">
                                <el-option label="秒" value="s"></el-option>
                                <el-option label="分" value="m"></el-option>
                                <el-option label="时" value="h"></el-option>
                            </el-select>
                        </el-input>
                    </div>
                </el-form-item>
                <el-form-item label="请求方式">
                    <div>普通请求</div>
                    <el-tabs v-model="httpSetting.type">
                        <el-tab-pane label="Params" name="Params">
                            <el-table :data="httpSetting.params" style="width: 100%" :border="false">
                                <el-table-column type="index" width="100"></el-table-column>
                                <el-table-column prop="key" label="Key">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.key"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="value" label="Value">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.value"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="" label="操作">
                                    <template slot-scope="scope">
                                        <el-button type="primary" plain icon="el-icon-plus" @click="addItem('params')"></el-button>
                                        <el-button type="danger" plain icon="el-icon-minus" @click="deleteItem('params',scope.$index)"></el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="Body" name="Body">
                            <el-radio-group v-model="httpSetting.bodyType">
                                <el-radio label="1">none</el-radio>
                                <el-radio label="2">form-data</el-radio>
                            </el-radio-group>
                            <el-table v-if="httpSetting.bodyType == '2'" :data="httpSetting.body" style="width: 100%" :border="false">
                                <el-table-column type="index" width="100"></el-table-column>
                                <el-table-column prop="key" label="Key">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.key"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="value" label="Value">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.value"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="" label="操作">
                                    <template slot-scope="scope">
                                        <el-button type="primary" plain icon="el-icon-plus" @click="addItem('body')"></el-button>
                                        <el-button type="danger" plain icon="el-icon-minus" @click="deleteItem('body',scope.$index)"></el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="Headers" name="Headers">
                            <el-table :data="httpSetting.headers" style="width: 100%" :border="false">
                                <el-table-column type="index" width="100"></el-table-column>
                                <el-table-column prop="key" label="Key">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.key"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="value" label="Value">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.value"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="" label="操作">
                                    <template slot-scope="scope">
                                        <el-button type="primary" plain icon="el-icon-plus" @click="addItem('headers')"></el-button>
                                        <el-button type="danger" plain icon="el-icon-minus" @click="deleteItem('headers',scope.$index)"></el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="echartHttpOptionDialog = false">取 消</el-button>
                <el-button type="primary" @click="saveEchartHttpSetting">保 存</el-button>
            </span>
        </el-dialog>
        <div class="setup-angle-wrap" v-show="configObject" @mouseenter="mouseEnterAngle" @mouseleave="mouseLeaveAngle" :style="angleStyle">
            <setup-angle ref="setupAngle" @angle="onAngle" />
        </div>
        <el-dialog title="请输入组件名称" :visible.sync="isEditName" width="400px">
            <el-input v-model="componentName"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isEditName = false">取 消</el-button>
                <el-button type="primary" @click="saveComponentName">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import JsonViewer from 'vue-json-viewer';

import TopoSelectImage from './topoSelectImage';
import TopoVariable from './topoVariable';
import SetupAngle from './topoAngle';

import { listCenter } from '@/api/scada/center';
import { listModel } from '@/api/scada/model';
import { listDeviceBind } from '@/api/scada/topo';
import { listCamera } from '@/api/iot/device';
import cityDatas from '@/assets/json/citylist.json';
// import topoUtil from './util/topo-util';
import Editor from 'vue2-ace-editor';


export default {
    name: 'TopoProperties',
    dicts: ['sys_page_size'],
    props:['topoMainRef','activeIndex'],
    components: {
        JsonViewer,
        TopoSelectImage,
        TopoVariable,
        SetupAngle,
        Editor
    },
    data() {
        return {
            baseApi: process.env.VUE_APP_BASE_API,
            tabIndex: 0, // tabs
            resolutionTemp: '', // 临时存分辨率
            styleCollapseActive: ['1', '2', '3'],
            dataCollapseActive: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'],
            // 默认色体
            predefineColors: [
                '#ff4500',
                '#ff8c00',
                '#ffd700',
                '#90ee90',
                '#00ced1',
                '#1e90ff',
                '#c71585',
                'rgba(255, 69, 0, 0.68)',
                'rgb(255, 120, 0)',
                'hsv(51, 100, 98)',
                'hsva(120, 40, 94, 0.5)',
                'hsl(181, 100%, 37%)',
                'hsla(209, 100%, 56%, 0.73)',
                '#c7158577',
                '#ffffff',
                '#000',
            ],
            fontFamilyOptions: ['Arial', 'Helvetica', 'sans-serif', '宋体', '黑体', '微软雅黑'], // 字体
            textAlignOptions: ['left', 'right', 'center', 'justify'], // 字体位置
            borderStyleOptions: ['solid', 'dashed', 'dotted'], // 字体类型
            //当前的选择图片
            isGalleryDialog: false, // 图片对话框
            imgProperty: '', // 图片属性
            // 天气组件位置
            provinceList: cityDatas, // 省
            cityList: [], // 市
            districtList: [], // 区
            ztModelOption: [], // 3d模型
            // echart map
            isCodeViewDialog: false, // 代码视图对话框
            isEchartExplainDialog: false, // 数据引擎示例对话框
            // 设备绑定
            deviceBindList: [],

            bindParams: [],
            animationDialog: false,
            animationForm: {},

            // 组态页面集合
            ztOption: [],

            singleClickDialog: false,
            //变量选择
            deviceImei: this.$route.query.deviceImei,

            // 变量选择
            variableDialog: false, // 变量对话框
            multiple: false, // false单选，true多选
            textStatic: '',
            clickText: '', // 点击类型

            paramNameList: [
                '设备总数',
                '设备在线数',
                '设备离线数',
                '设备报警数',
                '在线比率',
                '日报警总数',
                '日报警已处理',
                '日报警未处理',
                '日报警处理比率',
                '周报警总数',
                '周报警已处理',
                '周报警未处理',
                '周报警处理比率',
                '月报警总数',
                '月报警已处理',
                '月报警未处理',
                '月报警处理比率',
                '年报警已处理',
                '年报警未处理',
                '年报警处理比率',
                '日工单总数',
                '日工单已处理',
                '日工单未处理',
                '日工单处理比率',
                '周工单总数',
                '周工单已处理',
                '周工单未处理',
                '周工单处理比率',
                '月工单总数',
                '月工单已处理',
                '月工单未处理',
                '月工单处理比率',
                '年工单总数',
                '年工单已处理',
                '年工单未处理',
                '年工单处理比率',
            ],

            // angle样式
            angleStyle: {
                opacity: 0.1,
            },
            debouncedWatch: null,
            //代码组建参数
            editorOptions: {
                enableBasicAutocompletion: true, // 启用基本自动完成
                enableSnippets: true, // 启用代码段
                enableLiveAutocompletion: true, // 启用实时自动完成
                tabSize: 2, // 标签大小
                fontSize: 14, // 字体大小
                showPrintMargin: false, // 去除编辑器里的竖线
                useWorker: false, // 是否使用后台工作线程
                wrap: true, // 自动换行
            },
            echartHttpOptionDialog:false,
            httpSetting:{
                url:'',
                method:'get',
                unit:'s',
                type:'Params',
                params:[],
                bodyType:'1',
                body:[],
                headers:[]
            },
            // 直播设备列表
            liveBroadcastDeviceList:[],
            channelList:[],

            isEditName:false,
            componentName:null,
            componentItem:null
        };
    },
    computed: {
        ...mapState({
            topoData: (state) => state.topoEditor.topoData,
            selectedComponents: (state) => state.topoEditor.selectedComponents,
            selectedComponentMap: (state) => state.topoEditor.selectedComponentMap,
            isLayer: (state) => state.topoEditor.selectedIsLayer,
            configObject: (state) => state.topoEditor.selectedComponent,
            historyData: (state) => state.topoEditor.historyData,
        }),
        animations() {
            let items = [];
            items =
                this.configObject.direction && this.configObject.direction == 'vertical'
                    ? [
                          { label: '向上', value: 'up' },
                          { label: '向下', value: 'down' },
                      ]
                    : [
                          { label: '向右', value: 'right' },
                          { label: '向左', value: 'left' },
                      ];
            return items;
        },
        // 分辨率
        resolution: {
            get: function (val) {
                if (this.resolutionTemp === 'custom') {
                    return 'custom';
                } else {
                    return this.topoData.layer.width + '×' + this.topoData.layer.height;
                }
            },
            set: function (val) {
                this.resolutionTemp = val;
                if (val !== 'custom') {
                    var wh = val.split('×');
                    this.topoData.layer.width = parseInt(wh[0]);
                    this.topoData.layer.height = parseInt(wh[1]);
                }
                return val;
            },
        },
    },
    mounted() {
        this.getZtPage();
        this.getZtModel();
        this.getBindDeviceList();
        this.getCameraList()
    },
    methods: {
        //变化日志
        changeLog(newVal) {
            // console.log('组件变化了',newVal);
            this.historyData.push(newVal);
        },
        //增加滑动位置
        addTranslate() {
            let id = this.configObject.dataAction.translateList.length;
            console.log(this.configObject.dataAction.translateList);
            let state = {
                id: id + 1,
                direction: '',
                position: 0,
            };
            this.configObject.dataAction.translateList.push(state);
        },
        //删除滑动位置
        deleteTranslate() {
            let id = this.configObject.dataAction.translateList.length;
            this.configObject.dataAction.translateList.some((item, i) => {
                if (item.id == id) {
                    this.configObject.dataAction.translateList.splice(i, 1);
                    return true;
                }
            });
        },
        // echart代码视图
        echartClick() {
            this.isCodeViewDialog = true;
        },
        // echart运行代码视图
        echartRunClick() {
            this.configObject.dataBind.echartRun = new Date().getTime();
            this.isCodeViewDialog = false;
        },
        openEchartHttpOption(){
            this.echartHttpOptionDialog=true
            this.httpSetting = {
                ...this.configObject.dataBind.httpSetting,
                params: Object.keys(this.configObject.dataBind.httpSetting.params).length>0?Object.keys(this.configObject.dataBind.httpSetting.params).map(keyName=>{
                    return {
                        key:keyName,
                        value:this.configObject.dataBind.httpSetting.params[keyName]
                    }
                }):[{key:'',value:''}],
                body: Object.keys(this.configObject.dataBind.httpSetting.body).length>0?Object.keys(this.configObject.dataBind.httpSetting.body).map(keyName=>{
                    return {
                        key:keyName,
                        value:this.configObject.dataBind.httpSetting.body[keyName]
                    }
                }):[{key:'',value:''}],
                headers: Object.keys(this.configObject.dataBind.httpSetting.headers).length>0?Object.keys(this.configObject.dataBind.httpSetting.headers).map(keyName=>{
                    return {
                        key:keyName,
                        value:this.configObject.dataBind.httpSetting.headers[keyName]
                    }
                }):[{key:'',value:''}]
            }
        },
        addItem(type){
            this.httpSetting[type].push({
                key:'',
                value:''
            })
        },
        deleteItem(type,index){
            if (this.httpSetting[type].length>1) {
                this.httpSetting[type].splice(index, 1)
            }
        },
        saveEchartHttpSetting(){
            let params={},body={},headers={}
            this.httpSetting.params.forEach(({key,value}) => {
                if (key!=''&&key!=null) {
                    params[key] = value;
                }
            });
            this.httpSetting.body.forEach(({key,value}) => {
                if (key!=''&&key!=null) {
                    body[key] = value;
                }
            });
            this.httpSetting.headers.forEach(({key,value}) => {
                if (key!=''&&key!=null) {
                    headers[key] = value;
                };
            });
            this.configObject.dataBind.httpSetting={
                ...this.httpSetting,
                params,
                body,
                headers
            }
            this.echartHttpOptionDialog=false;
        },
        // echats数据引擎请求
        echartHttpClick(setting) {
            this.$modal.loading('正在加载，请稍候...');
            this.$axios({
                url: setting.url,
                method: setting.method,
                params:setting.params,
                data:setting.body,
                headers:setting.headers
            })
                .then((res) => {
                    console.log('获取图表数据', res);
                    this.configObject.dataBind.echartData = JSON.stringify(JSON.parse(JSON.stringify(res.data)), null, '\t');
                    this.$modal.closeLoading();
                })
                .catch((err) => {
                    this.$message({
                        message: '请输入正确的url!',
                        type: 'warning',
                    });
                    this.$modal.closeLoading();
                });
        },
        //增加状态开关
        addSwitch() {
            let id = this.configObject.dataBind.stateList.length;
            let state = {
                id: id + 1,
                paramCondition: '',
                paramData: '',
                imageUrl: '',
            };
            this.configObject.dataBind.stateList.push(state);
        },
        deleteSwitch() {
            let id = this.configObject.dataBind.stateList.length;
            this.configObject.dataBind.stateList.some((item, i) => {
                if (item.id == id) {
                    this.configObject.dataBind.stateList.splice(i, 1);
                    return true;
                }
            });
        },
        // 获取绑定设备列表
        getBindDeviceList() {
            const params = {
                pageNum: 1,
                pageSize: 9999,
                scadaGuid: this.$route.query.guid,
            };
            listDeviceBind(params)
                .then((res) => {
                    if (res.code == 200) {
                        this.deviceBindList = res.rows;
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        //查询直播设备
        async getCameraList(){
            const {rows} = await listCamera();
            this.liveBroadcastDeviceList = rows;
        },
        //处理设备选择
        handleChangeDevice(){
            this.configObject.dataBind.channelSipId = null;
            let list = this.liveBroadcastDeviceList.filter(item=>item.deviceId==this.configObject.dataBind.deviceId);
            if(list.length==1){
                this.channelList = list[0].children.filter(item=>item.sipStatus==3);
            }
        },
        //处理摄像头选择
        handleChange(){
            //根据被选中的channel的id，从channel列表中获取deviceSipId和channelSipId
            let channel = this.channelList.filter(item=>item.channelSipId == this.configObject.dataBind.channelSipId);
            if(channel.length=1){
                this.configObject.dataBind.deviceSipId = channel[0].deviceSipId;
            }
        },
        // 省变化获取市
        provinceChange(e) {
            this.cityList = this.provinceList.filter((item) => {
                return item.code === e;
            })[0].children;
            this.configObject.dataBind.cityCode = '';
            this.configObject.dataBind.districtCode = '';
            this.districtList = [];
        },
        // 市变化获取区
        cityChange(e) {
            this.districtList = this.cityList.filter((item) => item.code === e)[0].children;
            this.configObject.dataBind.districtCode = '';
        },
        // 获取3d模型
        getZtModel() {
            const params = {
                pageNum: 1,
                pageSize: 9999,
            };
            listModel(params).then((res) => {
                if (res.code === 200) {
                    this.ztModelOption = res.rows;
                }
            });
        },
        // 选择模型
        selectModelChange() {
            this.ztModelOption.forEach((element) => {
                if (element.imageUrl == this.configObject.imageUrl) {
                    this.configObject.modelUrl = element.modelUrl;
                }
            });
        },
        stack(val) {
            console.log('topoData', this.configObject);
            if (this.configObject) {
                let zIndex = 0;
                if (val == '置顶') {
                    zIndex = this.topoData.zIndexTop == undefined ? 0 : this.topoData.zIndexTop + 1;
                    this.topoData.zIndexTop = zIndex;
                } else if (val == '置底') {
                    zIndex = this.topoData.zIndexBottom == undefined ? 0 : this.topoData.zIndexBottom - 1;
                    this.topoData.zIndexBottom = zIndex;
                } else if (val == '上一层') {
                    zIndex = this.configObject.style.zIndex == undefined ? 1 : this.configObject.style.zIndex + 1;
                } else if (val == '下一层') {
                    zIndex = this.configObject.style.zIndex == undefined ? 1 : this.configObject.style.zIndex - 1;
                }
                for (var key in this.selectedComponentMap) {
                    var component = this.selectedComponentMap[key];
                    component.style.zIndex = zIndex;
                }
            }
        },
        // 获取组态列表
        getZtPage() {
            listCenter().then((res) => {
                this.ztOption = res.rows;
            });
        },
        // 选中组态
        selectZtPage() {
            this.ztOption.forEach((element) => {
                if (element.guid == this.configObject.dataBind.ztPage) {
                    this.configObject.dataBind.ztId = element.id;
                    this.configObject.dataBind.ztPageName = element.pageName;
                }
            });
        },
        createCode() {
            var code = '';
            //设置长度，这里看需求，我这里设置了4
            var codeLength = 4;
            //设置随机字符
            var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
            //循环codeLength 我设置的4就是循环4次
            for (var i = 0; i < codeLength; i++) {
                //设置随机数范围,这设置为0 ~ 36
                var index = Math.floor(Math.random() * 9);

                //字符串拼接 将每次随机的字符 进行拼接
                code += random[index];
            }

            //将拼接好的字符串赋值给展示的code
            return code;
        },
        // 变量选择窗口
        selectVariable(val) {
            if (val == '参数绑定') {
                if (this.configObject.type == 'realData') {
                    this.multiple = true;
                    this.clickText = '多参数绑定';
                    this.textStatic = '';
                } else if (this.configObject.type == 'textStatic') {
                    this.multiple = true;
                    this.clickText = '多参数绑定';
                    this.textStatic = '数统计';
                } else {
                    this.multiple = false;
                    this.clickText = val;
                }
            }
            this.variableDialog = true;
            this.$refs.topoVariable && this.$refs.topoVariable.clearSelection();
        },
        // 变量选择事件
        selectVariableClick() {
            this.variableDialog = false;
            let selectRowData = null;
            if (this.clickText == '多参数绑定') {
                selectRowData = this.$refs.topoVariable.selectRowsDataClick();
                console.log('多参数绑定', selectRowData);
            } else {
                selectRowData = this.$refs.topoVariable.selectRowDataClick();
                console.log('单参数绑定', selectRowData);
            }

            if (this.clickText == '闪烁' || this.clickText == '旋转' || this.clickText == '显隐' || this.clickText == '滑动') {
                this.configObject.dataAction.serialNumber = selectRowData.serialNumber;
                this.configObject.dataAction.identifier = selectRowData.identifier;
                this.configObject.dataAction.modelName = selectRowData.modelName;
            } else if (this.clickText == '参数绑定') {
                this.configObject.dataBind.identifier = selectRowData.identifier;
                this.configObject.dataBind.modelName = selectRowData.modelName;
                if (selectRowData.unit) {
                    this.configObject.dataBind.unit = selectRowData.unit;
                }
                this.configObject.dataBind.serialNumber = selectRowData.serialNumber;
                this.configObject.dataBind.productId = selectRowData.productId;
                this.configObject.dataBind.type = selectRowData.type;
            } else if (this.clickText == '单击') {
                this.configObject.dataBind.identifier = selectRowData.identifier;
                this.configObject.dataBind.modelName = selectRowData.modelName;
                this.configObject.dataBind.serialNumber = selectRowData.serialNumber;
                this.configObject.dataBind.productId = selectRowData.productId;
                this.configObject.dataBind.type = selectRowData.type;
            } else if (this.clickText == '多参数绑定') {
                this.configObject.style.header = selectRowData;
                this.configObject.dataBind.modelName = selectRowData.join(',');
                console.log(selectRowData.join(','));
            }
        },
        configClick(val) {
            if (val == '单击') {
                this.singleClickDialog = true;
            } else {
                this.animationDialog = true;
            }
            this.clickText = val;
        },
        // 点击设置提交
        singleClickSubmit() {
            this.singleClickDialog = false;
        },
        // 动画设置提交
        animationSubmit() {
            this.animationDialog = false;
        },
        // 图库选择
        handleGalleryClick(label) {
            this.imgProperty = label;
            this.isGalleryDialog = true;
        },
        selectImageClick() {
            let imgs = this.$refs.topoSelectImage.handleChoice();
            if (imgs.length === 0) {
                this.$message({
                    message: '请选择图片',
                    type: 'warning',
                });
                return;
            } else {
                let selectImage = imgs[imgs.length - 1];
                if (this.imgProperty == '背景图片') {
                    this.topoData.layer.backgroundImage = this.baseApi + selectImage.resourceUrl;
                } else if (this.imgProperty == '图片路径') {
                    this.configObject.style.url = this.baseApi + selectImage.resourceUrl;
                } else if (this.imgProperty == '开关状态(关)') {
                    this.configObject.dataBind.shutImageUrl = this.baseApi + selectImage.resourceUrl;
                } else if (this.imgProperty == '开关状态(开)') {
                    this.configObject.dataBind.openImageUrl = this.baseApi + selectImage.resourceUrl;
                } else if (this.imgProperty == '开关状态(报警)') {
                    this.configObject.dataBind.warnImageUrl = this.baseApi + selectImage.resourceUrl;
                } else if (this.imgProperty.indexOf('状态开关') > -1) {
                    let id = this.imgProperty.split('-')[1];
                    this.configObject.dataBind.stateList.forEach((element) => {
                        if (element.id == id) {
                            element.imageUrl = this.baseApi + selectImage.resourceUrl;
                        }
                    });
                }
                this.isGalleryDialog = false;
                this.$refs.topoSelectImage.clearChoice(); //选完后清掉
            }
        },
        initPage(configData) {
            this.configData = configData;
        },
        changeTab(tabIndex) {
            this.tabIndex = tabIndex;
        },
        bindData(configObject, index, isLayer) {
            this.configObject = configObject;
            this.isLayer = isLayer;
            if (isLayer === false) {
            }
        },
        generateTargetComponentOptions() {
            var options = [];
            this.topoData.components.forEach((component) => {
                if (this.configObject.identifier != component.identifier) {
                    options.push({
                        label: component.name || component.type,
                        value: component.identifier,
                    });
                }
            });
            return options;
        },
        removeAction(index) {
            this.configObject.action.splice(index, 1);
        },
        addAction() {
            var action = {
                type: 'click',
                action: '开关控制',
                showItems: [],
                hideItems: [],
            };
            this.configObject.action.push(action);
        },
        // 鼠标进入angle变化
        mouseEnterAngle() {
            this.angleStyle = {
                opacity: 0.8,
            };
        },
        mouseLeaveAngle() {
            this.angleStyle = {
                opacity: 0.1,
            };
        },
        // angle旋转角度
        onAngle(angle) {
            // console.log('旋转角度：', angle);
            this.transform('自定义旋转角度', angle);
        },
        // 旋转
        transform(val, value) {
            if (this.configObject) {
                let transform = '';
                let transformType = '';
                if (val == '顺时针旋转') {
                    transform = this.configObject.style.transform + 90;
                    transformType = `rotate(` + transform + `deg)`;
                } else if (val == '逆时针旋转') {
                    transform = this.configObject.style.transform - 90;
                    transformType = `rotate(` + transform + `deg)`;
                } else if (val == '水平镜像') {
                    transform = 0;
                    transformType = `rotateY(180deg)`;
                } else if (val == '垂直镜像') {
                    transform = 0;
                    transformType = `rotateX(180deg)`;
                } else if (val == '自定义角度' && value) {
                    transform = this.configObject.style.transform + parseInt(value);
                    transformType = `rotate(` + transform + `deg)`;
                } else if (val == '自定义旋转角度' && value) {
                    transform = parseInt(value);
                    transformType = `rotate(` + transform + `deg)`;
                }
                for (var key in this.selectedComponentMap) {
                    var component = this.selectedComponentMap[key];
                    component.style.transform = transform;
                    component.style.transformType = transformType;
                }
            }
        },
         /** 代码编辑器初始化 */
        editorInit(editor) {
            // 可以在这里进一步配置编辑器
            require('brace/ext/language_tools'); // 语言扩展
            require('brace/mode/javascript'); // 语言模式
            require('brace/theme/dawn'); // 主题
            require('brace/snippets/javascript'); // 代码片段
            require('brace/ext/searchbox');
        },
        // 锁定/解锁
        handleLock(command,component) {
            if (command == '锁定') {
                component.isLock = true
            } else {
                component.isLock = false
            }
        },
        clickItem(componet,index){
            this.topoMainRef.clickItem(componet,index)
        },
        handleShow(command,component){
            if (command == '隐藏') {
                component.style.visible = false
            } else {
                component.style.visible = true
            }
        },
        handleEdit(val){
            this.isEditName = true
            this.componentName = val.name
            this.componentItem = val
        },
        saveComponentName(){
            this.componentItem.name = this.componentName
            this.isEditName = false
        }
    },
};
</script>

<style lang="scss" scoped>
.topo-properties {
    border: #e6e6e6 solid 1px;
    background-color: #f1f3f4;
    width: 100%;
    height: 100%;

    .nav-bar-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px 10px 0 10px;

        .img-wrap {
            width: 60px;
            height: 60px;
        }
    }

    .tabs-wrap {
        height: 35px;
        display: flex;
        border-bottom: #ccc solid 1px;
        background-color: #f1f3f4;

        .tab-item {
            height: 35px;
            text-align: center;
            line-height: 35px;
            flex: 1;
            color: #666;
            font-size: 14px;
        }

        .tab-item:hover {
            cursor: pointer;
        }

        .tab-item-active {
            color: #3388ff;
            border-bottom: #3388ff solid 2px;
        }
    }

    .table-wrap {
        overflow-x: hidden;
        overflow-y: auto;
        height: calc(100% - 105px);

        .table-item {
            padding: 2px 10px 10px 10px;
            .layer{
                padding: 0 10px;
                box-sizing: border-box;
                cursor: pointer;
                user-select: none;
                &.layerActive{
                    background: #d7e4f6;
                    color: #3388ff;
                    border-radius: 8px;
                }
                .componentName{
                    width: 70%;
                    overflow:hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    font-size: 12px;
                }
                .componentControl{
                    flex: 1;
                    display: flex;
                    justify-content: space-between;
                }
            }

            

            .collapse-wrap {
                border-top: unset;
                border-bottom: unset;
            }

            .ixd-wrap {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                padding: 0 5px;
                font-size: 12px;
            }

            .btn-tools-wrap {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;

                .name {
                    font-size: 12px;
                    color: #606266;
                }
            }

            .btn-tools-content-wrap {
                display: flex;
                flex-direction: row;
                align-items: center;
                margin-top: 10px;

                .img-wrap {
                    width: 39px;
                    height: 32px;
                    line-height: 32px;
                    text-align: center;
                    margin-left: 5px;
                }

                .color-picker-wrap {
                    height: 32px;
                    width: 32px;
                    margin-left: 5px;
                }
            }

            .form-item-wrap {
                display: flex;
                flex-direction: row;
                align-items: center;
                margin-top: 5px;

                .name {
                    font-size: 12px;
                    color: #606266;
                }

                .content {
                    margin-left: 13px;
                    height: 32px;
                    line-height: 32px;
                }
            }
        }
    }

    .bg-set-wrap {
        padding: 10px;

        .bg-img-wrap {
            position: relative;
            background-color: #fbfdff;
            border: 1px dashed #c0ccda;
            border-radius: 6px;
            box-sizing: border-box;
            width: 100%;
            height: 128px;
            cursor: pointer;
            line-height: 126px;
            vertical-align: top;
            text-align: center;

            &:hover {
                border-color: #409eff;

                .img-tools {
                    opacity: 1;
                }
            }

            .ico-wrap {
                font-size: 26px;
                color: #8c939d;
            }

            .img-wrap {
                width: 100%;
                height: 100%;
                padding: 10px;
                background-size: cover;
            }

            .img-tools {
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                cursor: default;
                text-align: center;
                color: #fff;
                font-size: 20px;
                background-color: rgba(0, 0, 0, 0.5);
                transition: opacity 0.3s;
                cursor: pointer;
                opacity: 0;

                i {
                    padding: 0 8px;
                }
            }
        }
    }

    ::v-deep .el-form-item__label {
        font-size: 12px;
        font-weight: normal;
    }

    ::v-deep .el-form--label-top .el-form-item__label {
        padding: 0;
    }

    ::v-deep .el-input {
        font-size: 12px;
    }

    ::v-deep .el-checkbox__label {
        font-size: 12px;
    }

    ::v-deep .el-collapse-item__header {
        background-color: transparent;
        font-size: 12px;
        height: 42px;
        line-height: 42px;
    }

    ::v-deep .el-collapse-item__wrap {
        background-color: transparent;
        border-bottom: unset;
    }

    ::v-deep .el-radio__label {
        font-size: 12px;
    }

    ::v-deep .el-input-group__append {
        padding: 0 10px;
    }

    ::v-deep .el-input-group--prepend .el-input__inner {
        padding: 0 10px;
    }

    .input-with-select ::v-deep .el-input-group__prepend {
        background-color: #fff;
        padding: 0 10px;
        min-width: 75px;

        .el-select {
            margin: -10px;
        }
    }

    .setup-angle-wrap {
        position: fixed;
        top: 100px;
        right: 350px;
        height: 100px;
        width: 100px;
        z-index: 1000;
        background-color: transparent;
    }

    .json-view-wrap {
        border-radius: 4px;
        border: 1px solid #dcdfe6;

        ::v-deep .jv-button {
            font-size: 12px;
            padding: 0;
        }
    }
}

.data-engine-dialog {
    .title-wrap {
        font-size: 16px;
        margin-bottom: 20px;
    }

    .action-wrap {
        margin-bottom: 15px;
    }
}

.box-message {
    padding: 20px;
    border: 1px solid #f4dfb6;
    background: #fffbf4;
    text-align: left;
    height: 400px;
    overflow-y: auto;
}
</style>
