<template>
  <div class="dashboard-editor-container">
    <github-corner class="github-corner" />

    <panel-group @handleSetLineChartData="handleSetLineChartData" />
    <div style="display:flex">
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;width:708px;height:303px">
        <line-chart :chart-data="lineChartData" />
      </el-row>
      <div style="width:100%;margin-left:16px;height:327px;">
        <span style="display:block;width:100%;background:#fff;font:17px/39px '';text-indent:1em;color:#909399;font-weight:600">水机分布图</span>
        <!-- <div style="background:red;height:85%"></div> -->
        <img src="./map.jpg" alt="" style="height:81%;width:100%">
      </div>
    </div>
    <el-row :gutter="32" style="display:flex">
      <!-- <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col> -->
      <el-table :key="key" :data="tableData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="name" label="姓名" width="180" />
        <el-table-column v-for="fruit in formThead" :key="fruit" :label="fruit">
          <template slot-scope="scope" style="text-align:center">
            {{ scope.row[fruit] }}
          </template>
        </el-table-column>
      </el-table>
      <el-col :xs="24" :sm="24" :lg="8" style="background:#71dbdb;margin:0 16px;border-radius:10px;">
        <span style="font:17px/40px '';color:#fff;font-weight:600;text-indent:1em;">订单统计（元）</span>
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>

    <!-- <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <todo-list />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card />
      </el-col>
    </el-row> -->

  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'
const defaultFormThead = ['手机号', '型号', '地址']
const lineChartData = {
  newVisitis: {
    color: ['#333', '#000', '#c23531', '#2f4554', '#61a0a8', '#f66'],
    expectedData: [1100, 1520, 1061, 1304, 1805, 600, 895],
    actualData: [1120, 802, 901, 540, 640, 640, 300]
  }
  // messages: {
  //   expectedData: [200, 192, 120, 144, 160, 130, 140],
  //   actualData: [180, 160, 151, 106, 145, 150, 130]
  // },
  // purchases: {
  //   expectedData: [80, 100, 121, 104, 105, 90, 100],
  //   actualData: [120, 90, 100, 138, 142, 130, 130]
  // },
  // shoppings: {
  //   expectedData: [130, 140, 141, 142, 145, 150, 160],
  //   actualData: [120, 82, 91, 154, 162, 140, 130]
  // }
}

export default {
  name: 'DashboardAdmin',
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      tableData: [
        {
          name: '姓名',
          手机号: '12345656',
          型号: '1111-10',
          地址: '啊大大奥多'
        },
        {
          name: '姓名',
          手机号: '12345656',
          型号: '1111-10',
          地址: '啊大大奥多'
        },
        {
          name: '姓名',
          手机号: '12345656',
          型号: '1111-10',
          地址: '啊大大奥多'
        }
      ],
      key: 1, // table key
      formTheadOptions: ['apple', 'banana', 'orange'],
      checkboxVal: defaultFormThead, // checkboxVal
      formThead: defaultFormThead // 默认表头 Default header
    }
  },
  watch: {
    checkboxVal(valArr) {
      this.formThead = this.formTheadOptions.filter(i => valArr.indexOf(i) >= 0)
      this.key = this.key + 1// 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #71dbdb;
    padding: 0 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}

</style>
