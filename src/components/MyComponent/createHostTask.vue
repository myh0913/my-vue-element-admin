<template>
  <div class="hostTask">
    <div class="createTaskTemplate">
      <div id="side-bar">
        <div class="side-bar_title">
          <svg-icon icon-class="mag_tv" class="icon" />
          <span>{{ `主机漏洞扫描` }}</span>
        </div>
        <div class="department-list">
          <div
            v-for="(item, index) in sideBarList"
            :key="'sideBarList' + index"
            class="department"
            :class="{ isactive: activeIndex === index }"
            @click="departmentClick(index)"
          >
            <svg-icon
              v-if="activeIndex === 0 && index === 0"
              style="margin-right: 8px"
              icon-class="mag_filters_blue"
              class="icon"
            />
            <svg-icon
              v-if="activeIndex !== 0 && index === 0"
              style="margin-right: 8px"
              icon-class="mag_filters"
              class="icon"
            />
            <svg-icon
              v-if="(activeIndex !== 0) & (activeIndex !== 4) && index === 1"
              style="margin-right: 8px"
              icon-class="mag_setting_blue"
              class="icon"
            />
            <svg-icon
              v-if="(activeIndex === 0) | (activeIndex === 4) && index === 1"
              style="margin-right: 8px"
              icon-class="mag_setting"
              class="icon"
            />
            <svg-icon
              v-if="activeIndex === 4 && index === 4"
              style="margin-right: 8px"
              icon-class="mag_panel_blue"
              class="icon"
            />
            <svg-icon
              v-if="activeIndex !== 4 && index === 4"
              style="margin-right: 8px"
              icon-class="mag_panel"
              class="icon"
            />
            {{ item }}
          </div>
          <div id="sideBar_active_bar" />
        </div>
        <div id="sideBar_gray_bar" />
      </div>
      <div id="createTaskMain" v-loading="mainLoading">
        <div class="header">
          <div class="headerLeft">
            <Subtitle :content="sideBarList[activeIndex]" width="64" />
          </div>
          <div class="headerRight">
            <AppButton
              v-preventReClick
              height="32"
              content="立即执行"
              btn-style="primary"
              :disabled="
                !(
                  ruleForm.task_name &&
                  ((autoDistribute !== 2 && ruleForm.target) ||
                    (autoDistribute === 2 && ruleForm.scanList[0]['target']))
                )
              "
              @click="confirmTemplate()"
            />
            <AppButton
              v-show="activeIndex === 0"
              height="32"
              content="重置"
              btn-style="blue"
              @click="resetTemplate()"
            />
            <AppButton height="32" content="取消" btn-style="blue" @click="cancelTemplate()" />
          </div>
        </div>
        <div v-show="activeIndex === 0" class="mainContainer">
          <el-form ref="ruleForm" :rules="rules" :model="ruleForm" label-width="120px">
            <el-form-item label="任务名称" prop="task_name">
              <el-input v-model="ruleForm.task_name" placeholder="请输入任务名称" />
            </el-form-item>
            <el-form-item label="扫描模式" prop="scanMode">
              <el-radio-group v-model="ruleForm.scanMode">
                <el-radio :label="1">{{ `标准模式` }}</el-radio>
                <el-radio :label="2">{{ `导入模式` }}</el-radio>
                <el-radio v-if="ruleForm.execute_type !== 2 && !isCustom && isGod === 1" :label="3">
                  {{ `分布式模式` }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-show="ruleForm.scanMode === 1" class="staricon" label="扫描目标" prop="type">
              <el-radio-group v-model="ruleForm.type">
                <el-radio :label="1">IPV4</el-radio>
                <el-radio :label="2">IPV6</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="ruleForm.scanMode === 1" ref="target" label="" prop="target">
              <div class="scanAsset">
                <el-input
                  v-model="ruleForm.target"
                  type="textarea"
                  :rows="6"
                  :placeholder="ruleForm.type === 1 ? $t('lang.scanDsc_ip') : $t('lang.scanDsc_ipv6')"
                />
              </div>
            </el-form-item>
            <el-form-item v-if="ruleForm.scanMode === 2" ref="target" label="扫描目标" prop="target">
              <div class="scanAsset">
                <el-input
                  v-model="ruleForm.target"
                  type="textarea"
                  :rows="6"
                  :disabled="true"
                  placeholder="请导入扫描资产"
                />
                <div class="assetInput">
                  <AppButton
                    height="32"
                    icon="mag_check"
                    content="资产库导入"
                    btn-style="primary"
                    @click="assetSelect()"
                  />
                  <el-tooltip placement="top" :open-delay="500" :hide-after="3000">
                    <div slot="content">{{ `用户只可导入不可手填，不可跨2级部门导入。` }}</div>
                    <svg-icon icon-class="mag_question" class="icon" />
                  </el-tooltip>
                </div>
              </div>
            </el-form-item>
            <el-form-item v-if="ruleForm.scanMode === 3">
              <el-radio-group v-model="autoDistribute">
                <el-radio :label="1">{{ `自动化` }}</el-radio>
                <el-radio :label="2">{{ `手动` }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="ruleForm.scanMode === 3 && autoDistribute === 1"
              ref="target"
              label="扫描目标"
              prop="target"
            >
              <div class="scanAsset">
                <el-input v-model="ruleForm.target" type="textarea" :rows="6" :placeholder="$t('lang.scanDsc_ip')" />
                <div class="assetInput">
                  <el-tooltip placement="top" :open-delay="500" :hide-after="3000">
                    <div slot="content">
                      {{ `根据各部门IP范围对输入扫描目标自动归类` }}
                    </div>
                    <svg-icon icon-class="mag_question" class="icon" />
                  </el-tooltip>
                </div>
              </div>
            </el-form-item>
            <div v-if="ruleForm.scanMode === 3 && autoDistribute === 2">
              <div v-for="(x, i) in ruleForm.scanList" :key="i + 'target_list'" class="distribution">
                <div class="targetAssetHeader">
                  <div>
                    <div class="targetNo">{{ i + 1 }}</div>
                    <p>{{ `目标` }}</p>
                  </div>
                  <div class="closeDistribute" @click="deleteTargetAsset(i)">×</div>
                </div>
                <el-form-item label="扫描目标">
                  <div class="scanAsset">
                    <el-input
                      v-model="ruleForm.scanList[i]['target']"
                      type="textarea"
                      :rows="6"
                      :placeholder="$t('lang.scanDsc_ip')"
                    />
                    <div class="assetInput">
                      <el-tooltip placement="top" :open-delay="500" :hide-after="3000">
                        <div slot="content">
                          {{ `用户可以手动添加多个资产，同时增加多个组目标，每个组目标只有一个资产组和集群` }}
                        </div>
                        <svg-icon icon-class="mag_question" class="icon" />
                      </el-tooltip>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item label="所属资产组">
                  <div class="scanAsset">
                    <p class="inputToDiv">{{ $marks(ruleForm.scanList[i]['assetList']) }}</p>
                    <AppButton
                      height="32"
                      icon="mag_check"
                      content="选择资产组"
                      btn-style="primary"
                      @click="selectGroup(i)"
                    />
                  </div>
                </el-form-item>
                <el-form-item label="所属集群">
                  <p class="inputToDiv">{{ $marks(ruleForm.scanList[i]['clusterList']) }}</p>
                </el-form-item>
              </div>
              <div class="addTargetAsset" @click="addTargetAsset">
                <svg-icon icon-class="mag_addTargetAsset" class="icon" />
                <span style="margin-left: 4px">{{ `添加目标` }}</span>
              </div>
            </div>
            <div v-if="!isWeakPW">
              <el-form-item label="弱口令猜测" prop="weak_password_enabled">
                <el-switch v-model="ruleForm.weak_password_enabled" />
              </el-form-item>
              <el-form-item v-if="ruleForm.weak_password_enabled" label="弱口令类型" prop="weak_password">
                <el-checkbox-group v-model="ruleForm.weak_password">
                  <el-checkbox
                    v-for="(item, index) in weakDictList"
                    :key="index + 'weakDictList'"
                    :label="item.service_type"
                  >
                    {{ item.dict_label }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>
            <div v-if="isWeakPW">
              <el-form-item label="弱口令类型" prop="weak_password">
                <el-checkbox-group v-model="ruleForm.weak_password">
                  <el-checkbox
                    v-for="(item, index) in weakDictList"
                    :key="index + 'weakDictList'"
                    :label="item.service_type"
                  >
                    {{ item.dict_label }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="最大并发线程数" prop="weak_max_parallel_count">
                <el-input-number v-model="ruleForm.weak_max_parallel_count" :min="1" :max="10" />
              </el-form-item>
              <el-form-item label="弱口令尝试次数" prop="weak_max_retry_count">
                <el-input-number v-model="ruleForm.weak_max_retry_count" :min="1" :max="10" />
              </el-form-item>
            </div>
            <el-form-item label="优先级" prop="task_priority">
              <el-select v-model="ruleForm.task_priority">
                <el-option
                  v-for="(item, index) in task_prioritys"
                  :key="index + 'task_prioritys'"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="执行方式" prop="execute_type">
              <el-radio-group v-model="ruleForm.execute_type">
                <el-radio :label="0">{{ `立即执行` }}</el-radio>
                <el-radio :label="1">{{ `定时执行` }}</el-radio>
                <el-radio v-if="ruleForm.scanMode !== 3" :label="2">{{ `周期执行` }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="ruleForm.execute_type === 1" prop="start_time">
              <el-date-picker
                v-model="ruleForm.start_time"
                type="datetime"
                placeholder="选择日期"
                value-format="timestamp"
                :picker-options="{
                  disabledDate(time) {
                    const dateTime = new Date()
                    const startDateTime = dateTime.setDate(dateTime.getDate() - 1)
                    return time.getTime() < new Date(startDateTime).getTime()
                  },
                  selectableRange: startTimeRange,
                }"
              />
            </el-form-item>
            <el-form-item v-if="ruleForm.execute_type === 2" prop="circle">
              <el-select v-model="ruleForm.circle" class="circles" @change="ruleForm.day = '00:00'">
                <el-option
                  v-for="(item, index) in circles"
                  :key="index + 'circles'"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-time-select
                v-if="ruleForm.circle === 'day'"
                v-model="ruleForm.day"
                class="secondTimer"
                :picker-options="{
                  start: '00:00',
                  step: '01:00',
                  end: '23:00',
                }"
              />
              <div v-if="ruleForm.circle !== 'day'" class="timerDiv">
                <el-popover placement="bottom" width="460" trigger="click" popper-class="my-popper">
                  <div v-if="ruleForm.circle === 'week'" slot="reference">
                    <span v-if="ruleForm.week">
                      {{ '每周' + $getText('weekCN', ruleForm.week) + ' ' }}
                    </span>
                    <span v-if="ruleForm.day">
                      {{ ruleForm.day }}
                    </span>
                  </div>
                  <div v-if="ruleForm.circle === 'month'" slot="reference">
                    <span v-if="ruleForm.month">
                      {{ '每月' + ruleForm.month + '日' }}
                    </span>
                    <span v-if="ruleForm.day">
                      {{ ruleForm.day }}
                    </span>
                  </div>
                  <div class="customeTimePicker">
                    <el-select v-if="ruleForm.circle === 'week'" v-model="ruleForm.week">
                      <el-option v-for="item in weeks" :key="item.label" :label="item.label" :value="item.value" />
                    </el-select>
                    <el-select v-if="ruleForm.circle === 'month'" v-model="ruleForm.month">
                      <el-option v-for="item in dates" :key="item.label" :label="item.label" :value="item.value" />
                    </el-select>
                    <el-time-select
                      v-model="ruleForm.day"
                      :picker-options="{
                        start: '00:00',
                        step: '01:00',
                        end: '23:00',
                      }"
                    />
                  </div>
                </el-popover>
              </div>
            </el-form-item>
            <el-form-item v-if="ruleForm.execute_type === 2" label="任务结束时间" prop="finish_time">
              <el-date-picker v-model="ruleForm.finish_time" type="datetime" value-format="timestamp" />
            </el-form-item>
            <el-form-item label="免扫" prop="noscan">
              <el-switch v-model="ruleForm.noscan" @change="noScan">{{ `免扫` }}</el-switch>
            </el-form-item>
            <el-form-item label=" " prop="whitelist">
              <div class="noscanFlex">
                <el-input
                  v-if="ruleForm.noscan === true"
                  v-model="ruleForm.whitelist"
                  type="textarea"
                  :rows="6"
                  :placeholder="$t('lang.scanDsc_noscan')"
                />
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="activeIndex === 2" class="mainContainer">
          <div class="scanOptions">
            <el-form ref="ruleForm2" :model="ruleForm" :rules="rules" label-width="120px">
              <el-form-item label="扫描方式" prop="scan_method">
                <div class="assetInput">
                  <el-select v-model="ruleForm.scan_method">
                    <el-option
                      v-for="(item, index) in scanMethods"
                      :key="index + 'scanMethods'"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <el-tooltip placement="top" :open-delay="500" :hide-after="3000">
                    <div slot="content" v-html="$t('lang.scanContent')" />
                    <svg-icon style="margin-left: 12px" icon-class="mag_question" class="icon" />
                  </el-tooltip>
                </div>
              </el-form-item>
              <el-form-item label="请求超时" prop="scan_timeout">
                <el-input-number v-model="ruleForm.scan_timeout" :min="1" />
                {{ `毫秒` }}
              </el-form-item>
              <el-form-item label="失败重连" prop="scan_retry">
                <el-input-number v-model="ruleForm.scan_retry" :min="1" />
                {{ `次` }}
              </el-form-item>
              <el-form-item label="端口范围" prop="scan_port_method">
                <el-radio-group v-model="ruleForm.scan_port_method">
                  <div class="radioGroupCol">
                    <el-radio :label="1">{{ `常用端口` }}</el-radio>
                    <el-tooltip placement="top" :open-delay="500" :hide-after="3000">
                      <div slot="content">{{ $t('lang.dsc_usual_port') }}</div>
                      <svg-icon icon-class="mag_question" class="icon" />
                    </el-tooltip>
                  </div>
                  <div class="radioGroupCol">
                    <el-radio :label="2">{{ `全部端口` }}</el-radio>
                    <el-tooltip placement="top" :open-delay="500" :hide-after="3000">
                      <div slot="content">{{ $t('lang.dsc_all_port') }}</div>
                      <svg-icon icon-class="mag_question" class="icon" />
                    </el-tooltip>
                  </div>
                  <div class="radioGroupCol">
                    <el-radio :label="3">{{ `自定义端口` }}</el-radio>
                  </div>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-show="ruleForm.scan_port_method === 1">
                <div class="normalPort">{{ $t('lang.usual_port') }}</div>
              </el-form-item>
              <el-form-item v-if="ruleForm.scan_port_method === 3" prop="scan_ports">
                <el-input
                  v-model="ruleForm.scan_ports"
                  type="textarea"
                  :rows="4"
                  :placeholder="$t('lang.dsc_custom_port')"
                />
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div v-show="activeIndex === 3" class="mainContainer">
          <div class="dictTableDiv">
            <el-table height="calc(100% - 40px)" :data="dictTableData" highlight-current-row>
              <el-table-column prop="dict_name" label="字典名称" />
              <el-table-column label="服务类型">
                <template #default="scope">
                  <span>{{ $marks(scope.row.service_type) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="字典描述">
                <template #default="scope">
                  <span>{{ $marks(scope.row.dict_describe) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="160">
                <template #default="scope">
                  <Icon v-if="operatePermission" content="编辑" @itemClick="dictEdit(scope.row)">
                    <svg-icon icon-class="mag_edit" class="icon" />
                  </Icon>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              :current-page="dict.current_page"
              :total="dict.total"
              :page-size="dict.page_size"
              :page-sizes="[10, 20, 50, 100, 200]"
              :layout="'total, sizes, prev, pager, next, jumper'"
              @size-change="dictSizeChange"
              @current-change="dictCurrentChange"
            />
          </div>
        </div>
        <div v-show="activeIndex === 4" class="mainContainer">
          <div v-loading="waiting" class="component">
            <div class="componentLeft">
              <div class="selectAllComponent">
                <div>
                  <svg-icon style="margin-right: 8px" icon-class="mag_panel_blue" class="icon" />
                  <span>{{ `组件` }}</span>
                </div>
                <div @click="allComponents">{{ `全选` }}</div>
              </div>
              <el-tree
                ref="componentTree"
                :data="componentTree"
                :props="defaultProps"
                show-checkbox
                node-key="division"
                @node-click="componentTreeClick"
                @check-change="componentTreeCheck"
              >
                <div slot-scope="componentNode" class="componentTreeNode">
                  <el-tooltip
                    effect="dark"
                    :open-delay="500"
                    :hide-after="3000"
                    :content="getTreeNodeTitle(componentNode)"
                    placement="top"
                  >
                    <p class="componentTitle">{{ getTreeNodeTitle(componentNode) }}</p>
                  </el-tooltip>
                  <p class="componentNumber">
                    ({{
                      componentNode.data.mark || componentNode.data.except.length
                        ? componentNode.data.count - componentNode.data.except.length + ' / ' + componentNode.data.count
                        : componentNode.data.selected.length + ' / ' + componentNode.data.count
                    }})
                  </p>
                </div>
              </el-tree>
              <div class="slipDown">
                向下滑动
                <svg-icon icon-class="mag_down" class="icon" />
              </div>
            </div>
            <div class="componentRight">
              <div class="fixedBar" @click="changeWidth">
                <svg-icon v-if="!longWidth" icon-class="mag_sideBar_open_blue" class="fixedBarIcon" />
                <svg-icon v-else icon-class="mag_sideBar_close_blue" class="fixedBarIcon" />
              </div>
              <div class="headerLeftFilter">
                <SearchArea height="32" :search-options="searchOptions" @confirm="handleSearch" />
              </div>
              <el-table
                ref="componentTable"
                v-loading="expandLoading"
                height="calc(100% - 40px)"
                highlight-current-row
                :data="componentTableData"
                :row-key="getRowKeys"
                :expand-row-keys="expands"
                @select="singleSelect"
                @select-all="multiSelect"
                @filter-change="tableFilterChange"
                @expand-change="expandChange"
              >
                <el-table-column :reserve-selection="true" type="selection" width="40" />
                <el-table-column type="expand">
                  <template #default="scope">
                    <div class="demo-table-expand">
                      <div class="detail-container-expand">
                        <span>{{ `组件名称` }}</span>
                        <span>{{ $marks(scope.row.content.cn_name) }}</span>
                      </div>
                      <div class="detail-container-expand">
                        <span>{{ `等级` }}</span>
                        <span :class="$getText('level', scope.row.content.level).class">
                          <svg-icon :icon-class="$getText('level', scope.row.content.level).icon" class="icon" />
                          {{ $getText('level', scope.row.content.level).text }}
                        </span>
                      </div>
                      <div class="detail-container-expand">
                        <span>{{ `影响系统` }}</span>
                        <span>{{ $marks(scope.row.content.major_os) }}</span>
                      </div>
                      <div class="detail-container-expand">
                        <span>{{ `影响产品` }}</span>
                        <span>{{ $marks(scope.row.content.product) }}</span>
                      </div>
                      <div class="detail-container-expand">
                        <span>{{ `危险插件` }}</span>
                        <span>{{ $getText('isTrue', scope.row.content.is_dangerous) }}</span>
                      </div>
                      <div class="detail-container-expand">
                        <span>{{ `原理扫描` }}</span>
                        <span>{{ $getText('isTrue', scope.row.content.is_principle) }}</span>
                      </div>
                      <div class="detail-container-expand">
                        <span>{{ `CVE编号` }}</span>
                        <span>{{ $marks(scope.row.content.cve.join('; ')) }}</span>
                      </div>
                      <div class="detail-container-expand">
                        <span>{{ `CNVD编号` }}</span>
                        <span>{{ $marks(scope.row.content.cnvd.join('; ')) }}</span>
                      </div>
                      <div class="detail-container-expand">
                        <span>{{ `CNNVD编号` }}</span>
                        <span>{{ $marks(scope.row.content.cnnvd.join('; ')) }}</span>
                      </div>
                      <div class="detail-container-expand">
                        <span>{{ `组件描述` }}</span>
                        <span>{{ $marks(scope.row.content.cn_desc) }}</span>
                      </div>
                      <div class="detail-container-expand">
                        <span>{{ `解决方法` }}</span>
                        <span>{{ $marks(scope.row.content.cn_advice) }}</span>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="组件名称" prop="vul_name" min-width="240">
                  <template #default="scope">
                    <el-tooltip
                      effect="dark"
                      :open-delay="500"
                      :hide-after="3000"
                      :content="$marks(scope.row.vul_name)"
                      placement="top"
                    >
                      <span class="tooltipSpan">{{ $marks(scope.row.vul_name) }}</span>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="level"
                  label="等级"
                  :filters="sercurityLevel"
                  :filter-multiple="false"
                  column-key="level"
                >
                  <template #default="scope">
                    <span :class="$getText('level', scope.row.level).class">
                      <svg-icon :icon-class="$getText('level', scope.row.level).icon" class="icon" />
                      {{ $getText('level', scope.row.level).text }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="CVE" prop="cve">
                  <template #default="scope">
                    <el-tooltip
                      effect="dark"
                      :open-delay="500"
                      :hide-after="3000"
                      :content="$marks(scope.row.cve.join('; '))"
                      placement="top"
                    >
                      <span class="tooltipSpan">{{ $marks(scope.row.cve.join('; ')) }}</span>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column label="CNVD" prop="cnvd">
                  <template #default="scope">
                    <el-tooltip
                      effect="dark"
                      :open-delay="500"
                      :hide-after="3000"
                      :content="$marks(scope.row.cnvd.join('; '))"
                      placement="top"
                    >
                      <span class="tooltipSpan">{{ $marks(scope.row.cnvd.join('; ')) }}</span>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column label="CNNVD" prop="cnnvd">
                  <template #default="scope">
                    <el-tooltip
                      effect="dark"
                      :open-delay="500"
                      :hide-after="3000"
                      :content="$marks(scope.row.cnnvd.join('; '))"
                      placement="top"
                    >
                      <span class="tooltipSpan">{{ $marks(scope.row.cnnvd.join('; ')) }}</span>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column
                  label="危险插件"
                  prop="is_dangerous"
                  :filters="makeJudge"
                  :filter-multiple="false"
                  column-key="is_dangerous"
                >
                  <template #default="scope">
                    <span>{{ $getText('isTrue', scope.row.is_dangerous) }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="原理扫描"
                  prop="is_principle"
                  :filters="makeJudge"
                  :filter-multiple="false"
                  column-key="is_principle"
                >
                  <template #default="scope">
                    <span>{{ $getText('isTrue', scope.row.is_principle) }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                :current-page="component.current_page"
                :total="component.total"
                :page-size="component.page_size"
                :page-sizes="[10, 20, 50, 100, 200]"
                :layout="'total, sizes, prev, pager, next, jumper'"
                @size-change="componentSizeChange"
                @current-change="getComponentList"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <LargeDialog
      :dialog-title="`字典详情`"
      :dialog-visible="showDictDetail"
      :show-body-btn="true"
      @top-cancel="showDictDetail = false"
      @save="saveDictDetail"
      @cancel="showDictDetail = false"
    >
      <div class="dictFormMain">
        <el-form ref="editDictForm" :rules="rules" :model="dictForm" label-position="left" label-width="120px">
          <el-form-item label="字典名称" prop="dict_name">
            <div class="dictFormDisabled">{{ $marks(dictForm.dict_name) }}</div>
          </el-form-item>
          <el-form-item label="服务类型" prop="service_type">
            <div class="dictFormDisabled">{{ $marks(dictForm.service_type) }}</div>
          </el-form-item>
          <el-form-item label="字典描述" prop="dict_describe">
            <div class="dictFormDisabled" style="height: 96px">{{ $marks(dictForm.dict_describe) }}</div>
          </el-form-item>
          <el-form-item label="用户名字典" prop="username_content">
            <div class="dictFormDes">
              <el-input v-model="dictForm.username_content" :autosize="{ minRows: 5, maxRows: 10 }" type="textarea" />
              <Icon :content="$t('lang.dsc_username_content')">
                <svg-icon style="margin-left: 24px" icon-class="mag_question" class="icon" />
              </Icon>
            </div>
          </el-form-item>
          <el-form-item label="密码字典" prop="password_content">
            <div class="dictFormDes">
              <el-input v-model="dictForm.password_content" :autosize="{ minRows: 5, maxRows: 10 }" type="textarea" />
              <Icon :content="$t('lang.dsc_username_content')">
                <svg-icon style="margin-left: 24px" icon-class="mag_question" class="icon" />
              </Icon>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </LargeDialog>
    <selectAsset
      v-if="showAssetSelect"
      :department-id="currentPartitionId ? Number(currentPartitionId) : userPartitionId"
      :selected-asset="scanList_id"
      :report-type="ruleForm.task_type"
      :current-cluster-data="true"
      :page-permission="pagePermission"
      :api-permission="apiPermission"
      :operate-permission="operatePermission"
      @getAssetId="getAssetId"
      @closeDialog="closeAssetSelect"
    />
    <el-drawer :with-header="false" :wrapper-closable="false" :visible.sync="drawerVisible" :direction="direction">
      <div class="drawerHeader">
        <div>
          <svg-icon icon-class="mag_paper" class="icon" />
          <span>{{ `资产组列表` }}</span>
        </div>
        <div style="cursor: pointer" @click="cancelGroup">
          <svg-icon icon-class="mag_diaclose" class="close" />
        </div>
      </div>
      <div class="drawerBody">
        <AssetsAside
          class="assetTree"
          :is-show-title="false"
          :is-show-icon="false"
          :is-show-arr="false"
          :is-show-button="false"
          :is-show-check="false"
          :current-cluster-data="ruleForm.scanMode !== 3"
          :is-change-prefix="true"
          :is-show-right-menu="false"
          :get-partition-list="getPartitionList"
          :page-permission="pagePermission"
          :api-permission="apiPermission"
          :operate-permission="operatePermission"
          @department="treeFilter"
        />
      </div>
      <div class="drawerFooter">
        <AppButton v-preventReClick height="32" content="确认" btn-style="primary" @click="confirmGroup()" />
        <AppButton height="32" content="取消" btn-style="gray" @click="cancelGroup()" />
      </div>
    </el-drawer>
  </div>
</template>
<script>
import storage from 'good-storage'
import { isIpSegment, isIp, isIpv6_cidr, isIpv6 } from '@/utils/validate'
import { validatePort } from '@/utils/rules'
import Subtitle from '@/components/title/titleSecond'
import AppButton from '@/components/button/appButton'
import AssetsAside from '@/components/Asset/assetsAside'
import selectAsset from '@/components/Asset/selectAsset'
import SearchArea from '@/components/SearchArea/searchBtn'
import Icon from '@/components/Icon/icon'
import LargeDialog from '@/components/dialog/dialogBig'
import { getTaskTemplateDetail, createTask, getDictList, getDictDetail, editDict } from '@/api/risk-detect'
import { componentList, getComponentTreeList, componentDetail } from '@/api/risk-manage'
export default {
  components: {
    Subtitle,
    AppButton,
    SearchArea,
    Icon,
    LargeDialog,
    AssetsAside,
    selectAsset
  },
  props: {
    // 扫描类型 11-PROBE, 21-SCAN, 22-弱口令扫描类型, 31-PENETRATION, 41-BASELINE
    scanType: {
      type: String,
      default: '21o31'
    },
    // 外部点击，传部门id
    currentPartitionId: {
      type: String,
      default: ''
    },
    // 模板id
    templateId: {
      type: [String, Number],
      default: 0
    },
    // 获取资产页面勾选的资产数据
    getTarget: {
      type: Array,
      default() {
        return []
      }
    },
    // 页面权限 页面权限码
    pagePermission: {
      type: String,
      default: ''
    },
    // 接口权限 权限表
    apiPermission: {
      type: Object,
      default() {
        return {}
      }
    },
    // 操作权限 true&false 显示右键菜单部门增删改查功能键
    operatePermission: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isGod: storage.get('loginInfo').is_god,
      isCustom: this.$route.query.isCustom,
      userPartitionId: storage.get('loginInfo').partition_id,
      mainLoading: false,
      searchOption: {}, // 搜索条件
      searchInput: {},
      searchOptions: [
        { value: 'cn_name', label: '组件名称' },
        { value: 'cve', label: 'CVE' },
        { value: 'cnvd', label: 'CNVD' },
        { value: 'cnnvd', label: 'CNNVD' }
      ],
      sideBarList: this.$getText('hostTaskSideBarList'),
      activeIndex: 0,
      scanOptions: 'first',
      hasTemplateId: '',
      rules: {
        task_name: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
          { max: 20, message: '长度在20个字符以内', trigger: 'blur' }
        ],
        target: [{ required: true, message: '请输入扫描资产', trigger: 'blur' }],
        weak_password: [{ type: 'array', required: true, message: '请至少选择一项', trigger: 'change' }],
        execute_type: [{ required: true, message: '请选择执行方式', trigger: 'change' }],
        scan_ports: [{ required: true, validator: validatePort, trigger: 'blur' }],
        base_linuxV: [{ required: true, message: '请选择操作系统', trigger: 'change' }],
        base_protocol: [{ required: true, message: '请选择协议', trigger: 'change' }]
      },
      // 回显
      ruleForm: {
        task_name: '',
        task_type: 1, // 任务类型：1-主机、2-WEB
        scanMode: 1,
        type: 1,
        target: '',
        assetList: '',
        clusterList: '',
        scanList: [
          {
            target: '',
            assetList: '',
            clusterList: ''
          }
        ],
        task_priority: 1,
        execute_type: 0,
        circle: 'day',
        start_time: '',
        day: '00:00',
        week: 1,
        month: 1,
        finish_time: '',
        noscan: false,
        whitelist: '',
        weak_password_enabled: false,
        weak_password: [],
        weak_max_parallel_count: 1,
        weak_max_retry_count: 0,
        // 高级配置
        scan_method: 'SYN',
        scan_timeout: 1,
        scan_retry: 1,
        scan_port_method: 1,
        scan_ports: ''
      },
      // 传参
      whitelist: [],
      scanList_id: [
        {
          target: [],
          partition_id: '',
          cluster_id: '',
          second_partition_id: ''
        }
      ],
      execute_interval: {
        start_time: '',
        day_of_month: '',
        day_of_week: '',
        hour: ''
      },
      //
      autoDistribute: 1,
      startTimeRange: '',
      scanMethods: this.$getText('scanMethods'),
      circles: this.$getText('circles'),
      weeks: this.$getText('weeks'),
      dates: this.$getText('dates'),
      task_prioritys: this.$getText('task_prioritys'),
      sercurityLevel: this.$getText('sercurityLevel'),
      makeJudge: this.$getText('makeJudge'),
      isWeakPW: false,
      weakDictList: [],
      dictTableData: [],
      dict: {
        current_page: 1,
        page_size: 10,
        total: 0
      },
      showDictDetail: false,
      currentEditId: '',
      dictForm: {
        dict_id: '',
        dict_name: '',
        dict_describe: '',
        username_content: '',
        password_content: ''
      },
      componentTree: [], // 组件树数据
      defaultProps: {
        // 组件树格式
        children: 'children',
        division: 'division',
        count: 'count'
      },
      componentTableData: [],
      treeDataList: [],
      expandLoading: false,
      componentDivision: {},
      componentSelection: [], // 所有的选中项
      componentNodeData: {}, // 点击树，当前的树节点数据
      longWidth: false,
      treeEvent: true,
      component: {
        current_page: 1,
        page_size: 10,
        total: 0
      },
      expands: [],
      waiting: false,
      showAssetSelect: false, // 导入资产，是否显示导入资产弹窗
      direction: 'rtl', // 选择资产组，抽屉展开的方向
      drawerVisible: false, // 选择资产组，是否显示抽屉
      assetIndex: 1, // 选择资产组，第几个目标
      getPartitionList: false, // 显示资产树
      isTopGroup: false, // 选择资产组，是否一级部门
      selectedNode: {}, // 选择资产组，选中的树节点
      originPrefix: '' // 初始前缀
    }
  },
  watch: {
    'ruleForm.scanMode': function(value, oldValue) {
      storage.set('distributeAPI', this.originPrefix)
      if (value !== oldValue) {
        this.$refs.target.clearValidate()
        this.clearParams()
      }
    },
    componentTableData: function(value, oldValue) {
      if (value !== oldValue && this.activeIndex === 4) {
        clearTimeout(temp)
        this.waiting = true
        const temp = setTimeout(() => {
          this.waiting = false
        }, 500)
      }
    },
    'ruleForm.start_time': function(newValue, oldValue) {
      if (newValue) {
        let dateTime = ''
        const yy = new Date().getFullYear()
        const mm = new Date().getMonth() + 1
        const dd = new Date().getDate()
        const hh = new Date().getHours()
        const mz = mm < 10 ? '0' + mm : mm
        const mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
        const ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
        dateTime = yy + '-' + mz + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
        const dt = dateTime.split(' ')
        let st = ''
        if (this.$parseTime(newValue / 1000).split(' ')[0] === dt[0]) {
          st = dt[1]
        } else {
          st = '00:00:00'
        }
        this.startTimeRange = st + ' - 23:59:59'
      }
    }
  },
  created() {
    this.originPrefix = storage.get('distributeAPI')
  },
  mounted() {
    // 组件树的滚动条监听
    document.getElementsByClassName('el-tree')[0].onscroll = function() {
      const tree = document.getElementsByClassName('el-tree')
      const target = document.getElementsByClassName('slipDown')
      if (tree[0].scrollHeight === tree[0].scrollTop + tree[0].clientHeight) {
        target[0].style.display = 'none'
      } else {
        target[0].style.display = 'block'
      }
    }
    // 从资产页面批量创建任务
    if (storage.get('assets')) {
      var temp = JSON.parse(JSON.stringify(storage.get('assets')))
      this.ruleForm.scanMode = 2
      for (let i = 0; i < temp.length; i++) {
        temp[i]['target'] = [temp[i]['ip']]
      }
      this.$nextTick(() => {
        this.getAssetId(temp)
      })
    }
    this.getWeakDictList()
    this.getDictionaryList(1)
    this.getComponentTree()
    this.hasTemplateId = this.$route.query.isDefault
    if (this.hasTemplateId) {
      this.getTemplateDetail(this.hasTemplateId)
    }
  },
  beforeDestroy() {
    storage.remove('assets')
  },
  methods: {
    // 组件树宽度修改
    changeWidth() {
      this.longWidth = !this.longWidth
      const left = document.getElementsByClassName('componentLeft')
      const right = document.getElementsByClassName('componentRight')
      left[0].style.transition = 'all 0.5s'
      right[0].style.transition = 'all 0.5s'
      if (!this.longWidth) {
        left[0].style.width = '208px'
        right[0].style.width = 'calc(100% - 208px)'
      } else {
        left[0].style.width = '300px'
        right[0].style.width = 'calc(100% - 300px)'
      }
    },
    // 获取模板详情
    async getTemplateDetail(id) {
      this.mainLoading = true
      const { data, status, msg } = await getTaskTemplateDetail(
        this.$visit(this.pagePermission, this.apiPermission),
        storage.get('distributeAPI'),
        id
      )
      if (status === 'succeed') {
        this.ruleForm.scan_method = data.config.host_config.scan_method
        this.ruleForm.scan_port_method =
          data.config.host_config.scan_port_method === 'usual_port'
            ? 1
            : data.config.host_config.scan_port_method === 'all_port'
              ? 2
              : 3
        this.ruleForm.scan_ports = data.config.host_config.scan_ports
        this.ruleForm.scan_timeout = data.config.host_config.scan_timeout
        this.ruleForm.scan_retry = data.config.host_config.scan_retry
        if (this.ruleForm.scan_port_method !== 3) this.ruleForm.scan_ports = ''
        if (data.config.weak_password_enabled) {
          this.isWeakPW = true
          this.ruleForm.weak_password_enabled = true
        }
        // 组件树
        setTimeout(() => {
          this.treeDataList = []
          if (data.config.component_policy.config) {
            for (let i = 0; i < this.componentTree.length; i++) {
              const temp = data.config.component_policy.config.division_dict[this.componentTree[i]['division']]
              // 请求组件树的数据和模板详情的并不是完全相同的
              if (temp) {
                if (temp.select_all) {
                  this.treeDataList.push(this.componentTree[i]['division'])
                  this.$refs.componentTree.setCheckedKeys(this.treeDataList) // 设置树组件的勾选
                } else {
                  if (temp.except_id_list.length) {
                    this.componentTree[i]['except'] = temp.except_id_list
                  } else {
                    this.componentTree[i]['selected'] = temp.component_id_list
                  }
                }
              }
            }
          }
          setTimeout(() => {
            if (this.componentTree.length) {
              this.componentTreeClick(this.componentTree[0]) // 点击第一条
              this.$refs.componentTree.setCurrentKey(this.componentTree[0]['division']) // 设置高亮
            }
          }, 100)
        }, 200)
      } else {
        this.$message.error(msg)
      }
      this.mainLoading = false
    },
    // 获取所有字典（弱口令）
    async getWeakDictList() {
      const {
        data: { data },
        status
      } = await getDictList(this.$visit(this.pagePermission, this.apiPermission), storage.get('distributeAPI'))
      if (status === 'succeed') this.weakDictList = data
    },
    // 左侧树切换
    departmentClick(index) {
      if (index === 1) {
        this.activeIndex = 2
      } else {
        this.activeIndex = index
        const bar = document.querySelector('#sideBar_active_bar')
        const offset = index * 40
        bar.style.transform = `translateY(${offset}px)`
      }
      if (index === 4) {
        this.$nextTick(() => {
          const tree = document.getElementsByClassName('el-tree')
          const target = document.getElementsByClassName('slipDown')
          if (tree[0].scrollHeight === tree[0].clientHeight) target[0].style.display = 'none'
        })
      }
    },
    // 清空回显
    clearParams() {
      this.ruleForm.target = '' // 回显
      this.ruleForm.assetList = ''
      this.ruleForm.clusterList = ''
      this.ruleForm.scanList = [
        {
          // 回显
          target: '',
          assetList: '',
          clusterList: ''
        }
      ]
      this.scanList_id = [
        {
          // 传参
          target: [],
          partition_id: '',
          cluster_id: '',
          second_partition_id: ''
        }
      ]
    },
    // 导入资产按钮
    assetSelect() {
      this.ruleForm.target = '' // 回显
      this.ruleForm.assetList = ''
      this.ruleForm.clusterList = ''
      this.ruleForm.scanList = [
        {
          // 回显
          target: '',
          assetList: '',
          clusterList: ''
        }
      ]
      this.showAssetSelect = true
    },
    // 导入了某条资产
    getAssetId(val) {
      this.assetNameList = []
      this.scanList_id = [
        {
          // 传参
          target: [],
          partition_id: '',
          cluster_id: '',
          second_partition_id: ''
        }
      ]
      // 导入模式，扫描目标回显
      val.forEach((item) => {
        this.assetNameList = item.target + ',' + this.assetNameList
      })
      this.ruleForm.target = this.assetNameList.slice(0, -1)
      // 导入模式，资产组回显，不可跨级导入，去重
      var tempArr = Array.from(new Set(val.map((item) => item.partition_name)))
      this.ruleForm.assetList = tempArr.join(', ')
      // 导入模式，集群回显
      this.ruleForm.clusterList = val[0]['cluster_name']
      // 导入模式，传参
      for (let i = 0; i < val.length; i++) {
        if (i === 0) {
          this.scanList_id[0]['cluster_id'] = val[i]['cluster_id']
          this.scanList_id[0]['partition_id'] = val[i]['partition_id']
          this.scanList_id[0]['second_partition_id'] = val[i]['second_partition_id']
          this.scanList_id[0]['target'] = val[i]['target']
        } else {
          for (let k = 0; k < this.scanList_id.length; k++) {
            // 集群相同，部门相同，归类
            if (
              this.scanList_id[k]['cluster_id'] === val[i]['cluster_id'] &&
              this.scanList_id[k]['partition_id'] === val[i]['partition_id']
            ) {
              this.scanList_id[k]['target'] = this.scanList_id[k]['target'].concat(val[i]['target'])
              break
            }
            // 集群相同，部门不同，新建类
            if (k === this.scanList_id.length - 1) {
              this.scanList_id.push({
                cluster_id: val[i]['cluster_id'],
                partition_id: val[i]['partition_id'],
                second_partition_id: val[i]['second_partition_id'],
                target: val[i]['target']
              })
              break
            }
          }
        }
      }
      this.closeAssetSelect()
    },
    // 关闭导入资产
    closeAssetSelect() {
      this.showAssetSelect = false
    },
    // 选择资产组
    selectGroup(i) {
      setTimeout(() => {
        this.getPartitionList = true
      }, 0)
      this.drawerVisible = true
      this.assetIndex = i
    },
    // 选择资产组，点击了一条资产组
    treeFilter(node) {
      if (node.level === 1) {
        this.isTopGroup = true
      } else {
        this.isTopGroup = false
        this.selectedNode = node
      }
    },
    // 选择资产组，确认
    confirmGroup() {
      this.cancelGroup()
      if (Object.keys(this.selectedNode).length) {
        if (this.ruleForm.scanMode !== 3) {
          this.ruleForm['assetList'] = this.selectedNode.partition_name // 回显
          this.ruleForm['clusterList'] = this.selectedNode.cluster_name // 回显
          this.scanList_id[0]['partition_id'] = this.selectedNode.partition_id // 传参
          this.scanList_id[0]['cluster_id'] = this.selectedNode.cluster_id // 传参
          this.scanList_id[0]['second_partition_id'] = this.selectedNode.second_partition_id // 传参
        } else {
          this.ruleForm.scanList[this.assetIndex]['assetList'] = this.selectedNode.partition_name // 回显
          this.ruleForm.scanList[this.assetIndex]['clusterList'] = this.selectedNode.cluster_name // 回显
          this.scanList_id[this.assetIndex]['partition_id'] = this.selectedNode.partition_id // 传参
          this.scanList_id[this.assetIndex]['cluster_id'] = this.selectedNode.cluster_id // 传参
          this.scanList_id[this.assetIndex]['second_partition_id'] = this.selectedNode.second_partition_id // 传参
        }
      }
    },
    // 选择资产组，关闭
    cancelGroup() {
      storage.set('distributeAPI', this.originPrefix)
      this.drawerVisible = false
      this.getPartitionList = false
    },
    // 删除一个目标资产框
    deleteTargetAsset(index) {
      if (index === this.ruleForm.scanList.length - 1 && index !== 0) {
        this.ruleForm.scanList.pop()
        this.scanList_id.pop()
      } else if (index === 0) {
        if (this.ruleForm.scanList.length > 1) {
          this.ruleForm.scanList.shift()
          this.scanList_id.shift()
        } else {
          this.$message.warning('至少一个目标!')
        }
      } else {
        this.ruleForm.scanList.splice(index, 1)
        this.scanList_id.splice(index, 1)
        // this.ruleForm.scanList = this.ruleForm.scanList.slice(0, index).concat(this.ruleForm.scanList.slice(index + 1))
        // this.scanList_id = this.scanList_id.slice(0, index).concat(this.scanList_id.slice(index + 1))
      }
    },
    // 增加一个目标资产框
    addTargetAsset() {
      this.ruleForm.scanList.push({
        target: '',
        assetList: '',
        clusterList: ''
      })
      this.scanList_id.push({
        target: [],
        partition_id: '',
        cluster_id: '',
        second_partition_id: ''
      })
    },
    // 正则
    validDomain(value) {
      if (this.ruleForm.type === 1) {
        if (isIp(value) | isIpSegment(value)) return true
        else return false
      } else if (this.ruleForm.type === 2) {
        if (isIpv6_cidr(value) | isIpv6(value)) return true
        else return false
      }
    },
    // 口令字典
    // 获取字典列表
    async getDictionaryList(page) {
      this.dict.current_page = page
      const query = {
        page: this.dict.current_page,
        page_size: this.dict.page_size
      }
      const {
        data: { data, total },
        status,
        msg
      } = await getDictList(this.$visit(this.pagePermission, this.apiPermission), storage.get('distributeAPI'), query)
      if (status === 'succeed') {
        this.dictTableData = data
        this.dict.total = total
      } else {
        this.$message.error(msg)
      }
    },
    // 字典分页
    dictSizeChange(value) {
      this.dict.page_size = value
      this.getDictionaryList(1)
    },
    dictCurrentChange(value) {
      this.getDictionaryList(value)
    },
    // 编辑字典详情
    async dictEdit(row) {
      this.$nextTick(() => {
        this.$refs.editDictForm.resetFields()
      })
      this.currentEditId = row.dict_id
      this.showDictDetail = true
      const {
        data: { dict_info }
      } = await getDictDetail(
        this.$visit(this.pagePermission, this.apiPermission),
        storage.get('distributeAPI'),
        this.currentEditId
      )
      this.dictForm.dict_name = dict_info.dict_name
      this.dictForm.service_type = dict_info.service_type
      this.dictForm.dict_describe = dict_info.dict_describe
      this.dictForm.password_content = dict_info.password_content.join('\n')
      this.dictForm.username_content = dict_info.username_content.join('\n')
    },
    // 保存字典修改
    async saveDictDetail() {
      const submitForm = {
        dict_name: this.dictForm.dict_name,
        service_type: this.dictForm.service_type,
        dict_describe: this.dictForm.dict_describe,
        username_content: this.dictForm.username_content.split(/[\s\n]/), // 分隔每一行，转化成数组
        password_content: this.dictForm.password_content.split(/[\s\n]/) // 分隔每一行，转化成数组
      }
      // 当编辑字典时，用currentEditId去获取当前行的dict_id，成功编辑后此数据要清空
      const id = this.currentEditId
      // 校验
      if (submitForm.username_content.length > 10 || submitForm.password_content.length > 10) {
        // 先校验字典内容长度
        this.$message.warning(`字典内容不能超过10条`)
        return false
      }
      // 判断内容是否有超过50字符的条目
      const result1 = submitForm.username_content.some((item) => {
        if (item.length > 50) return true
      })
      const result2 = submitForm.password_content.some((item) => {
        if (item.length > 50) return true
      })
      // 超过50个字符就报错
      if (result1 | result2) {
        this.$message.warning('内容中每条长度不能超过50个字符')
        return false
      }
      this.$refs.editDictForm.validate(async(valid) => {
        // 接下来进行表单自带的校验
        if (valid) {
          const { status, msg } = await editDict(
            this.$operate(this.pagePermission, this.apiPermission),
            storage.get('distributeAPI'),
            id,
            submitForm
          )
          if (status === 'succeed') {
            this.$message.success('提交成功')
            // 提交后清空此数据
            this.currentEditId = ''
            this.showDictDetail = false
            this.getDictionaryList(1)
          } else {
            this.$message.error(msg)
          }
        } else {
          this.$message.error(`请填写正确信息`)
        }
      })
    },
    // 组件
    // 组件筛选
    handleSearch(item) {
      this.searchInput = item
      this.getComponentList(1)
    },
    // 全选组件树
    allComponents() {
      this.componentSelection = []
      if (this.treeDataList.length === this.componentTree.length) {
        this.treeDataList = []
      } else {
        this.treeDataList = this.componentTree.map((item) => item.division)
      }
      this.$refs.componentTree.setCheckedKeys(this.treeDataList)
    },
    // 获取组件树
    async getComponentTree() {
      const { data, status, msg } = await getComponentTreeList(
        this.$visit(this.pagePermission, this.apiPermission),
        storage.get('distributeAPI'),
        { l1_division: '主机类' }
      )
      if (status === 'succeed') {
        this.componentTree = data
        this.componentDivision = data && { division: data[0]['division'] }
      } else {
        this.$message.error(msg)
      }
    },
    // 获取组件树title
    getTreeNodeTitle(componentNode) {
      return componentNode.data.division
    },
    // 勾选树组件
    async componentTreeCheck(item) {
      const temp = item
      // 如果当前节点不是点击的节点，刷新右侧列表
      if (this.componentNodeData.division === item.division && this.treeEvent) await this.componentTreeClick(item)
      // this.$nextTick(() => this.$refs.componentTree.setCurrentKey(item.division))
      // 等待列表的动画效果需要时间
      // setTimeout(() => {
      // 判断是全选还是全不选
      if (!item.is_selected_all) {
        if (this.treeEvent) temp.mark = true
        // 改变是否为全选字段，必须放在判断后面，操作table勾选前面
        temp.is_selected_all = true
        // 添加tree勾选回显
        const index = this.treeDataList.indexOf(item.division)
        if (index === -1) this.treeDataList.push(item.division)
        setTimeout(() => {
          if (this.componentNodeData.division === item.division) {
            this.componentTableData.forEach((row) => {
              if (!this.componentSelection.some((x) => row.vul_component_id === x.vul_component_id)) {
                // 当前列表没勾选的都勾上
                this.$refs.componentTable.toggleRowSelection(row, true)
                // 把勾上的项的id加入tree节点的selected和所有勾选项componentSelection
                item.selected.push(row.vul_component_id)
                this.componentSelection.push(row)
              }
            })
          }
          // 全选时，排除项except要先清空
          item.except = []
        }, 200)
      } else {
        if (this.treeEvent) temp.mark = false
        // 改变是否为全选字段，必须放在判断后面，操作table勾选前面
        temp.is_selected_all = false
        // 添加tree勾选回显
        const index = this.treeDataList.indexOf(item.division)
        if (index !== -1) this.treeDataList.splice(index, 1)
        // treeEvent表示为tree的操作
        if (this.treeEvent) {
          setTimeout(() => {
            // 清空当前树节点的selected、except
            item.selected = []
            item.except = []
          }, 200)
        }
      }
      // }, 500)
    },
    // 点击组件树
    componentTreeClick(item) {
      this.componentNodeData = item
      this.componentDivision = { division: item.division }
      this.getComponentList(1)
      // setTimeout(() => {
      // 判断是全选还是全不选
      if (item.is_selected_all) {
        setTimeout(() => {
          this.componentTableData.forEach((row) => {
            if (!this.componentSelection.some((x) => row.vul_component_id === x.vul_component_id)) {
              // 当前列表没勾选的都勾上
              this.$refs.componentTable.toggleRowSelection(row, true)
              // 把勾上的项的id加入tree节点的selected和所有勾选项componentSelection
              item.selected.push(row.vul_component_id)
              this.componentSelection.push(row)
            }
          })
        }, 200)
      } else {
        // treeEvent表示为tree的操作
        if (this.treeEvent) {
          setTimeout(() => {
            item.selected.forEach((x) => {
              // 把当前树节点的selected中的项，在componentSelection中去掉
              var len = this.componentSelection.length
              for (let i = 0; i < len; i++) {
                if (this.componentSelection[i]['vul_component_id'] === x) {
                  this.componentSelection.splice(i, 1)
                  len--
                  break
                }
              }
            })
            // 去掉当前列表勾选
            for (let k = 0; k < this.componentTableData.length; k++) {
              this.$refs.componentTable.toggleRowSelection(this.componentTableData[k], false)
            }
          }, 200)
        }
      }
      // }, 500)
    },
    // 获取列表
    async getComponentList(page) {
      this.component.current_page = page
      const searchOption = {
        page: this.component.current_page,
        page_size: this.component.page_size,
        ...this.componentDivision,
        level: this.searchOption.level,
        is_dangerous: this.searchOption.is_dangerous,
        is_principle: this.searchOption.is_principle
      }
      const option = Object.assign(searchOption, this.searchInput)
      const {
        data: { data, total },
        status
      } = await componentList(
        this.$visit(this.pagePermission, this.apiPermission),
        storage.get('distributeAPI'),
        option
      )
      if (status === 'succeed') {
        this.componentTableData = data
        this.component.total = total
      }
      // 翻页时关联问题
      // 等待列表的动画效果触发，需要时间未知，暂时500ms
      // setTimeout(() => {
      if (this.componentNodeData.is_selected_all || this.componentNodeData.except.length) {
        setTimeout(() => {
          this.componentTableData.forEach((row) => {
            // 既不在所有勾选项中存在，也不在排除项中，则勾上并加入所有勾选项
            const status1 = this.componentSelection.some((x) => row.vul_component_id === x.vul_component_id)
            const status2 = this.componentNodeData.except.some((y) => row.vul_component_id === y)
            if (!status1 && !status2) {
              this.componentSelection.push(row)
              this.componentNodeData.selected.push(row.vul_component_id)
              this.$refs.componentTable.toggleRowSelection(row, true)
            }
          })
        }, 50)
      }
      if (!this.componentNodeData.is_selected_all && !this.componentNodeData.except.length) {
        setTimeout(() => {
          this.componentTableData.forEach((row) => {
            const status = this.componentNodeData.selected.some((item) => item === row.vul_component_id)
            if (!status) {
              this.$refs.componentTable.toggleRowSelection(row, false)
            } else {
              this.$refs.componentTable.toggleRowSelection(row, true)
            }
          })
        }, 50)
      }
      // }, 500)
    },
    // 组件分页
    componentSizeChange(value) {
      this.component.page_size = value
      this.getComponentList(1)
    },
    // 组件列表table多选
    multiSelect(val) {
      const temp = this.componentSelection.map((item) => item.vul_component_id)
      if (val.length > this.componentSelection.length) {
        // 全选
        this.componentTableData.forEach((item) => {
          // 不存在，则推入当前树节点的已选项并且推入至所有勾选项
          if (!this.componentSelection.some((x) => item.vul_component_id === x.vul_component_id)) {
            this.componentNodeData.selected.push(item.vul_component_id)
            this.componentSelection.push(item)
            // 当在tree勾了当前列表全选
            if (this.componentNodeData.except.length) {
              // 排除项except去掉该项
              const index = this.componentNodeData.except.indexOf(item.vul_component_id)
              this.componentNodeData.except.splice(index, 1)
            }
          }
        })
      } else {
        // 全不选
        this.componentTableData.forEach((item) => {
          // 不存在，则删除当前树节点的已选项的所在位置并且删除所有勾选项所在位置
          const i = this.componentNodeData.selected.indexOf(item.vul_component_id)
          this.componentNodeData.selected.splice(i, 1)
          const j = temp.indexOf(item.vul_component_id)
          temp.splice(j, 1)
          this.componentSelection.splice(j, 1)
          // 当在tree勾了当前列表全选
          if (this.componentNodeData.is_selected_all || this.componentNodeData.except.length) {
            // 排除项except增加该项
            this.componentNodeData.except.push(item.vul_component_id)
          }
        })
      }
      // 处理table勾选对tree的影响
      this.handleTreeSelection()
    },
    // 组件列表table单选
    singleSelect(val, row) {
      if (val.some((u) => u.vul_component_id === row.vul_component_id)) {
        // 说明多勾选了一个
        this.componentNodeData.selected.push(row.vul_component_id)
        this.componentSelection.push(row)
        // 当在tree勾了当前列表全选
        if (this.componentNodeData.except.length) {
          // 排除项except去掉该项
          const index = this.componentNodeData.except.indexOf(row.vul_component_id)
          this.componentNodeData.except.splice(index, 1)
        }
      } else {
        // 说明去掉了一个
        const i = this.componentNodeData.selected.indexOf(row.vul_component_id)
        this.componentNodeData.selected.splice(i, 1)
        const temp = this.componentSelection.map((item) => item.vul_component_id)
        const j = temp.indexOf(row.vul_component_id)
        this.componentSelection.splice(j, 1)
        // 当在tree勾了当前列表全选
        if (this.componentNodeData.is_selected_all || this.componentNodeData.except.length) {
          // 排除项except增加该项
          this.componentNodeData.except.push(row.vul_component_id)
        }
      }
      // 处理table勾选对tree的影响
      this.handleTreeSelection()
    },
    // 解决table的勾选对tree组件是否勾选的影响
    handleTreeSelection() {
      //
      if (
        this.componentNodeData.selected.length === this.componentNodeData.count ||
        (this.componentNodeData.mark && !this.componentNodeData.except.length)
      ) {
        this.treeDataList.push(this.componentNodeData.division)
      } else if (this.componentNodeData.selected.length !== this.componentNodeData.count) {
        const index = this.treeDataList.indexOf(this.componentNodeData.division)
        if (index !== -1) this.treeDataList.splice(index, 1)
      }
      this.treeEvent = false // 防止table勾选影响tree勾选
      this.$refs.componentTree.setCheckedKeys(this.treeDataList) // 设置树组件的勾选
      setTimeout(() => {
        this.treeEvent = true
      }, 1000)
    },
    // 组件列表筛选相关函数
    tableFilterChange(filters) {
      for (const key in filters) {
        this.searchOption[key] = filters[key][0]
      }
      this.getComponentList(1)
    },
    // 组件列表每行的唯一标识
    getRowKeys(row) {
      return row.vul_component_id
    },
    // 展开组件详细信息
    async expandChange(row, rowList) {
      if (rowList.length) {
        // 只展开一行//说明展开了
        this.expandLoading = true
        this.expands = []
        // 处理接口数据
        let currentIndex = 0
        this.componentTableData.some((item, index) => {
          if (item.vul_component_id === row.vul_component_id) {
            currentIndex = index
            return true
          }
        })
        const { data, status, msg } = await componentDetail(
          this.$visit(this.pagePermission, this.apiPermission),
          storage.get('distributeAPI'),
          row.vul_component_id
        )
        if (status === 'succeed') {
          // 拓展的数据与外层table使用同一个变量
          this.$set(this.componentTableData[currentIndex], 'content', data)
        } else {
          this.$message.error(msg)
        }
        if (row) {
          this.expands.push(row.vul_component_id) // 只展开当前行id
        }
        this.expandLoading = false
      } else {
        // 说明收起了
        this.expands = []
      }
    },
    //
    noScan() {
      if (!this.ruleForm.noscan) {
        this.ruleForm.whitelist = ''
        this.whitelist = []
      }
    },
    // 提交新建任务
    async confirmTemplate() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          this.$refs.ruleForm2.validate(async(valid1) => {
            if (valid1) {
              // 处理周期任务的时间
              if (this.ruleForm.execute_type === 0) {
                this.execute_interval = {}
              } else if (this.ruleForm.execute_type === 1) {
                if (this.ruleForm.start_time) {
                  this.execute_interval = { start_time: this.ruleForm.start_time.toString().slice(0, -3) }
                } else {
                  this.$message.warning('时间不能为空!')
                  return
                }
              } else if (this.ruleForm.execute_type === 2) {
                this.execute_interval =
                  this.ruleForm.circle === 'month'
                    ? {
                      day_of_month: this.ruleForm.month,
                      hour: Number(this.ruleForm.day.slice(0, 2)),
                      finish_time: this.ruleForm.finish_time / 1000
                    }
                    : this.ruleForm.circle === 'week'
                      ? {
                        day_of_week: this.ruleForm.week,
                        hour: Number(this.ruleForm.day.slice(0, 2)),
                        finish_time: this.ruleForm.finish_time / 1000
                      }
                      : { hour: Number(this.ruleForm.day.slice(0, 2)), finish_time: this.ruleForm.finish_time / 1000 }
              }
              // 处理免扫列表
              if (this.ruleForm.whitelist.length) {
                this.whitelist = this.ruleForm.whitelist.split(/,|\s+/)
              } else {
                this.whitelist = []
              }
              for (let j = 0; j < this.whitelist.length; j++) {
                if (this.ruleForm.noscan && !this.validDomain(this.whitelist[j])) {
                  this.$message.error('免扫格式不正确！')
                  return
                }
              }
              // 处理扫描资产,回车和','分割
              if (this.ruleForm.scanMode === 3 && this.autoDistribute === 2) {
                this.ruleForm.type = 1
                for (let i = 0; i < this.ruleForm.scanList.length; i++) {
                  this.scanList_id[i]['target'] = []
                  this.scanList_id[i]['target'] = this.ruleForm.scanList[i]['target'].split(/,|\s+/)
                  for (let j = 0; j < this.scanList_id[i]['target'].length; j++) {
                    if (!this.validDomain(this.scanList_id[i]['target'][j])) {
                      this.$message.error('扫描资产格式不正确！')
                      return
                    } else {
                      this.scanList_id[i]['target'][j] = this.scanList_id[i]['target'][j].replace(/\"/g, '\\"')
                    }
                  }
                }
              } else if (this.ruleForm.scanMode === 1 || (this.ruleForm.scanMode === 3 && this.autoDistribute === 1)) {
                if (this.ruleForm.scanMode === 3) this.ruleForm.type = 1
                this.scanList_id[0]['target'] = this.ruleForm['target'].split(/,|\s+/)
                this.scanList_id = this.scanList_id.slice(0, 1)
                for (let i = 0; i < this.scanList_id[0]['target'].length; i++) {
                  if (!this.validDomain(this.scanList_id[0]['target'][i])) {
                    this.$message.error('扫描资产格式不正确！')
                    return
                  } else {
                    this.scanList_id[0]['target'][i] = this.scanList_id[0]['target'][i].replace(/\"/g, '\\"')
                  }
                }
              } else {
                var temp = this.ruleForm['target'].split(/,|\s+/)
                for (let i = 0; i < temp.length; i++) {
                  temp[i] = temp[i].replace(/\"/g, '\\"')
                }
              }
              // 处理弱口令字典
              const tempDict = []
              this.ruleForm.weak_password.forEach((item, index) => {
                for (let i = 0; i < this.weakDictList.length; i++) {
                  if (item === this.weakDictList[i]['service_type']) {
                    tempDict[index] = { service_type: item, dict_label: this.weakDictList[i]['dict_label'] }
                    break
                  }
                }
              })
              // 组件处理
              var tempComp = {}
              this.componentTree.forEach((item) => {
                tempComp[item.division] = {
                  component_id_list: item.selected,
                  except_id_list: item.except,
                  selected_count: item.except.length ? item.count - item.except.length : item.selected.length,
                  select_all: item.is_selected_all
                }
              })
              // 传参
              const option = {
                target_type: this.ruleForm.scanMode === 1 ? this.ruleForm.type : undefined,
                task_name: this.ruleForm.task_name,
                task_type: this.ruleForm.task_type,
                task_mode: this.ruleForm.scanMode,
                scan_type: Number(this.scanType), // #todo
                task_priority: this.ruleForm.task_priority,
                scan_template_id: this.templateId,
                execute_type: this.ruleForm.execute_type,
                execute_interval: this.execute_interval,
                whitelist: this.whitelist,
                target_list: this.scanList_id, // #todo 标准模式导入模式只保留target
                is_global: this.ruleForm.scanMode === 3 ? 1 : undefined,
                task_config: {
                  weak_password_enabled: this.ruleForm.weak_password_enabled,
                  weak_max_parallel_count: this.ruleForm.weak_max_parallel_count,
                  weak_max_retry_count: this.ruleForm.weak_max_retry_count,
                  weak_password: tempDict,
                  component_policy: {
                    config: {
                      division_dict: tempComp
                    }
                  },
                  proxy_config: {
                    proxy_enable: false
                  },
                  host_config: {
                    scan_method: this.ruleForm.scan_method ? this.ruleForm.scan_method : undefined,
                    scan_port_method:
                      this.ruleForm.scan_port_method === 1
                        ? 'usual_port'
                        : this.ruleForm.scan_port_method === 2
                          ? 'all_port'
                          : 'custom_port',
                    // scan_ports: this.ruleForm.scan_ports ? this.ruleForm.scan_ports : undefined,
                    scan_ports:
                      this.ruleForm.scan_port_method === 1
                        ? this.$t('lang.usual_port')
                        : this.ruleForm.scan_ports
                          ? this.ruleForm.scan_ports
                          : undefined,
                    scan_timeout: this.ruleForm.scan_timeout ? this.ruleForm.scan_timeout : undefined,
                    scan_retry: this.ruleForm.scan_retry ? this.ruleForm.scan_retry : undefined
                  }
                }
              }
              this.mainLoading = true
              const { status, msg } = await createTask(
                this.$operate(this.pagePermission, this.apiPermission),
                storage.get('distributeAPI'),
                option
              )
              if (status === 'succeed') {
                this.$message.success('新建任务成功!')
                this.cancelTemplate()
              } else {
                this.$message.error(msg)
              }
              this.mainLoading = false
            } else {
              this.activeIndex = 2
            }
          })
        }
      })
    },
    // 取消新建任务
    cancelTemplate() {
      this.getPartitionList = false
      this.treeDataList = []
      storage.set('distributeAPI', this.originPrefix) // 还原api前缀
      this.$router.go(-2)
      this.resetTemplate()
    },
    // 重置新建任务
    resetTemplate() {
      this.$nextTick(() => {
        if (this.activeIndex === 0) {
          this.$refs.ruleForm.resetFields()
        } else if (this.activeIndex === 2) {
          this.$refs.ruleForm2.resetFields()
        }
      })
      this.ruleForm.target = ''
      this.autoDistribute = 1
      // 所有未校验的值，清空
      this.scanList_id = [
        {
          target: [],
          partition_id: '',
          cluster_id: '',
          second_partition_id: ''
        }
      ]
      this.whitelist = []
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variable.scss';
@import '@/styles/mixin.scss';
.icon {
  width: 20px;
  height: 20px;
}
.close {
  width: 24px;
  height: 24px;
}
.addHeaderIcon {
  width: 16px;
  height: 16px;
  cursor: pointer;
}
.distribution {
  width: 752px;
  min-height: 256px;
  margin-bottom: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  .targetAssetHeader {
    @include flex(space-between);
    height: 32px;
    padding: 0 16px;
    margin-bottom: 16px;
    border-bottom: 1px dashed #e4e7ed;
    > div {
      @include flex(flex-start);
      p {
        color: $word;
      }
    }
    .closeDistribute {
      font-size: $font18;
      color: $borderGray;
      cursor: pointer;
    }
    .targetNo {
      width: 16px;
      height: 16px;
      line-height: 16px;
      margin-right: 16px;
      text-align: center;
      font-size: $font12;
      color: $antBlue;
      background-color: #f1f5f9;
      border-radius: 50%;
    }
  }
}
.addTargetAsset {
  width: 100px;
  transform: translate(660px, -10px);
  font-size: $font12;
  color: $antBlue;
  cursor: pointer;
}
.inputToDiv {
  width: 460px;
  min-height: 32px;
  padding: 0 15px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.el-radio-group {
  height: 32px;
  line-height: 32px;
  .el-radio {
    min-width: 128px;
    height: 20px;
    line-height: 32px;
    margin: 0;
  }
}
.radioGroupCol {
  @include flex(flex-start, center, row);
  width: 200px;
  height: 32px;
  line-height: 32px;
  .el-radio {
    @include flex(flex-start, center, row);
    margin-right: 20px;
  }
}
.dictTableDiv {
  .el-table::v-deep {
    @include listAnimation();
  }
  width: 100%;
  height: 100%;
}
.dialog-hint-container::v-deep {
  .bodyBtn {
    padding-left: 232px !important;
  }
}
.dictFormMain::v-deep {
  padding: 0 0 0 112px;
  .el-textarea {
    width: 460px;
    min-height: 96px;
    .el-textarea__inner {
      font-size: $font14;
    }
  }
}
.dictFormDisabled {
  width: 460px;
  height: 32px;
  line-height: 18px;
  padding: 6px 16px;
  overflow-y: auto;
  background: $headerGray;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}
.dictFormDes {
  @include flex(flex-start, center, row);
}
.component {
  @include flex(flex-start, flex-start, row);
  width: 100%;
  height: 100%;
  .componentLeft::v-deep {
    width: 208px;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    border-right: 1px solid #dcdfe6;
    position: relative;
    .slipDown {
      position: absolute;
      width: 100%;
      height: 48px;
      line-height: 48px;
      text-align: center;
      bottom: 0px;
      left: 0;
      color: $antBlue;
      background: linear-gradient(1.08deg, #ffffff 34.73%, rgba(255, 255, 255, 0) 269.89%);
      pointer-events: none;
    }
    .selectAllComponent {
      @include flex(space-between);
      padding-right: 8px;
      width: 100%;
      height: 48px;
      line-height: 48px;
      color: $word;
      font-weight: bold;
      div:nth-last-child(1) {
        color: $antBlue;
        font-weight: 400;
        cursor: pointer;
      }
    }
    .el-tree {
      width: 100%;
      height: calc(100% - 48px);
      overflow-y: auto;
      .el-tree-node__content {
        width: 100%;
        min-height: 48px;
        .el-tree-node__expand-icon {
          display: none;
        }
      }
      .el-tree-node.is-current > .el-tree-node__content {
        width: 100%;
        font-weight: bold;
        background-color: #eff6ff;
        border-right: 2px solid $antBlue;
      }
      .componentTreeNode {
        @include flex(space-between);
        width: 100%;
        .componentTitle {
          padding: 0;
          width: 55%;
        }
        .componentNumber {
          padding-right: 4px;
          width: 45%;
          text-align: right;
        }
        .componentNumber,
        .componentTitle {
          @include ellipsisTxt();
          height: 24px;
          line-height: 24px;
          font-size: $font12;
          color: $word;
        }
      }
    }
  }
  .componentRight::v-deep {
    width: calc(100% - 208px);
    height: 100%;
    padding-left: 32px;
    position: relative;
    .fixedBar {
      position: absolute;
      left: 0px;
      top: calc(50% - 33px);
      z-index: 100;
      width: 12px;
      height: 66px;
      cursor: pointer;
      .fixedBarIcon {
        width: 12px;
        height: 66px;
      }
    }
    .headerLeftFilter {
      @include flex(flex-start);
      position: absolute;
      top: -48px;
      left: 32px;
      .search-container .search__btn {
        margin-left: 0;
      }
    }
    .demo-table-expand {
      width: 100%;
      .detail-container-expand {
        display: flex;
        flex-direction: row;
        min-height: 48px;
        border-bottom: 2px solid $headerGray;
        border-right: 2px solid $headerGray;
        border-left: 2px solid $headerGray;
        &:nth-last-child(1) {
          border-bottom: none;
        }
        span {
          display: inline-block;
          word-wrap: break-word;
          white-space: pre-line;
          font-size: $font14;
          color: $word;
          padding: 16px;
        }
        span:nth-child(1) {
          width: 112px;
          font-weight: 500;
          border-right: 2px solid $headerGray;
        }
        span:nth-child(2) {
          padding: 12px;
          width: calc(100% - 112px);
          line-height: 20px;
        }
      }
    }
    .el-table {
      tbody tr td .cell {
        height: 54px !important;
      }
      .el-table__expanded-cell {
        .detail-container-expand {
          background: $white;
          &:hover {
            background: #eff6ff;
          }
        }
      }
      .el-table__expand-icon {
        .el-icon-arrow-right {
          color: $antBlue;
          font-weight: bold;
        }
      }
      .el-table__expanded-cell {
        margin: 0 0 0 103px;
        padding: 0;
      }
    }
  }
}
.hostTask {
  @include flex(center);
  margin-top: 8px;
  width: 100%;
  height: calc(100% - 8px);
  .createTaskTemplate {
    @include flex(flex-start, flex-start, row);
    width: 1520px;
    height: 100%;
    background: $white;
    border-radius: 8px 8px 0px 0px;
    #side-bar {
      width: 208px;
      height: 100%;
      transition: all 0.5s;
      position: relative;
      #sideBar_gray_bar {
        width: 1px;
        height: 100%;
        background-color: #e4e7ed;
        position: absolute;
        top: 0;
        right: 0;
      }
      .side-bar_title {
        @include flex(flex-start, center, row);
        width: 100%;
        height: 50px;
        padding: 0 0 0 20%;
        span {
          font-size: $font16;
          font-weight: 500;
          color: $word;
          margin-left: 8px;
        }
      }
      .department-list {
        height: calc(100% - 50px);
        width: 100%;
        overflow: auto;
        position: relative;
        transition: all 1s;
        .department {
          height: 40px;
          width: 208px;
          line-height: 40px;
          text-align: left;
          font-size: $font14;
          padding: 0 0 0 20%;
          &:nth-child(3) {
            padding: 0 0 0 40%;
          }
          &:nth-child(4) {
            padding: 0 0 0 40%;
          }
          &:hover {
            //color:$antBlue;
            cursor: pointer;
            background-color: $barBackground;
          }
          &.isactive {
            font-weight: bold;
            background-color: $barBackground;
          }
        }
        #sideBar_active_bar {
          width: 2px;
          height: 40px;
          border: 1px solid $antBlue;
          position: absolute;
          top: 0;
          right: 0px;
          transition: all 0.3s;
        }
      }
    }
    #createTaskMain {
      width: 1312px;
      height: 100%;
      padding: 16px 32px 24px 32px;
      .header {
        @include flex(space-between);
        width: 100%;
        height: 40px;
        .headerLeft::v-deep {
          @include flex(flex-start);
          .pageTitle {
            padding: 0;
          }
        }
        .headerRight {
          @include flex(flex-start);
        }
      }
      .mainContainer {
        width: 100%;
        height: calc(100% - 56px);
        margin-top: 16px;
        .circles::v-deep {
          width: 216px !important;
          .el-input {
            width: 216px !important;
            .el-input__inner {
              width: 216px !important;
            }
          }
        }
        .el-date-editor::v-deep {
          width: 460px;
          .el-input__inner {
            width: 460px;
          }
        }
        .secondTimer::v-deep {
          margin-left: 28px;
          width: 216px !important;
          .el-input__inner {
            width: 216px !important;
          }
        }
        .timerDiv::v-deep {
          margin-left: 28px;
          width: 216px;
          height: 32px;
          padding: 0 15px;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          cursor: pointer;
          .el-popover__reference {
            height: 30px;
          }
        }
        .scanOptions::v-deep {
          height: 100%;
          .el-form {
            height: 100%;
            .el-form-item {
              .el-form-item__label {
                padding-left: 16px;
              }
            }
          }
          .normalPort {
            word-wrap: break-word;
            width: 460px;
            height: 96px;
            line-height: 22px;
            padding: 4px 12px;
            border-radius: 4px;
            border: 1px solid #dcdfe6;
            overflow-y: auto;
          }
          .el-radio-group {
            @include flex(flex-start);
            .radioGroupCol {
              width: 168px;
            }
            .el-radio {
              min-width: 80px;
            }
          }
        }
        .el-form::v-deep {
          width: 100%;
          height: 100%;
          overflow-y: auto;
          .staricon {
            .el-form-item__label {
              position: relative;
              &::before {
                content: '*';
                color: red;
              }
            }
          }
          .el-form-item {
            .el-checkbox-group {
              width: 460px;
              height: auto;
              .el-checkbox {
                width: 115px;
                height: 24px;
                margin: 0;
              }
            }
            .el-input {
              width: 460px;
              height: 32px;
              .el-input__inner {
                width: 460px;
                height: 32px;
              }
            }
            .el-input-number {
              width: 200px;
              margin-right: 16px;
              .el-input-number__decrease,
              .el-input-number__increase {
                height: 30px;
                width: 40px;
                padding-top: 2px;
              }
              .el-input {
                .el-input__inner {
                  width: 200px;
                }
              }
            }
            .el-textarea {
              width: 460px;
              .el-textarea__inner {
                width: 460px;
              }
            }
            .el-form-item__label {
              color: $word;
              font-weight: 500;
              text-align: left;
              padding: 0 0 0 14px;
              position: relative;
            }
            .el-form-item__label::before {
              position: absolute;
              transform: translateX(-6px);
            }
            .el-form-item__content {
              @include flex(flex-start);
              .scanAsset {
                @include flex(flex-start, center);
                .assetInput {
                  @include flex(flex-start, center, row);
                  margin-left: 24px;
                  .el-button {
                    height: 32px;
                    margin: 0 8px 0 0;
                  }
                }
                .el-button {
                  margin-left: 24px;
                }
              }
            }
          }
        }
      }
    }
  }
}
.el-drawer__wrapper::v-deep {
  .el-drawer {
    width: 360px !important;
    height: 100%;
    .el-drawer__body {
      width: 100%;
      height: 100%;
    }
    .drawerHeader {
      @include flex(space-between);
      height: 56px;
      padding: 16px 24px;
      font-size: $font16;
    }
    .drawerBody {
      width: 100%;
      height: calc(100% - 108px);
      padding: 24px;
      overflow-y: auto;
      border-top: 1px solid #f0f0f0;
      border-bottom: 1px solid #f0f0f0;
      .assetTree {
        .el-tree {
          .el-tree-node__content {
            .department {
              margin-left: 24px !important;
            }
            .el-tree-node__expand-icon {
              line-height: 23px !important;
              right: initial;
              color: $antBlue;
            }
            .el-tree-node__expand-icon.is-leaf {
              color: transparent;
            }
            .el-tree-node__expand-icon.expanded {
              transform: rotate(90deg);
            }
            .el-icon-caret-right:before {
              content: '\e6e0';
              font-weight: bold;
            }
          }
        }
      }
    }
    .drawerFooter {
      @include flex(flex-end);
      width: 100%;
      height: 52px;
      padding: 10px 16px;
    }
  }
}
</style>
<style lang="scss">
@import '@/styles/variable.scss';
@import '@/styles/mixin.scss';
.el-tree::-webkit-scrollbar {
  display: none !important;
}
.my-popper {
  width: 326px !important;
  height: 48px;
  padding: 8px 12px;
  .customeTimePicker {
    @include flex(space-around);
  }
  .el-select,
  .el-date-editor {
    width: 145px;
    height: 32px;
    .el-input__suffix {
      display: none;
    }
    .el-input__inner {
      width: 145px;
      height: 32px;
    }
  }
}
.el-select-dropdown {
  max-height: 200px;
  .el-scrollbar__wrap {
    max-height: 200px;
  }
}
</style>
