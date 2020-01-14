<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.dealerName" :placeholder="$t('table.customer.dealerName')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <!-- <el-select v-model="listQuery.visible" :placeholder="$t('table.menu.visible')" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in visible" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select> -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button> -->
      <el-button class="filter-item" type="primary">
        <svg-icon icon-class="bootOn" />
        {{ $t('table.boot') }}
      </el-button>
      <el-button class="filter-item" type="primary">
        <svg-icon icon-class="bootOff" />
        {{ $t('table.shutdown') }}
      </el-button>
      <el-button class="filter-item" type="primary">
        <svg-icon icon-class="impulse" />
        {{ $t('table.impulse') }}
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      row-key="id"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :tree-props="{children: 'children'}"
    >
      <!-- 序号 -->
      <el-table-column :label="$t('table.id')" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <!-- 经销商名称 -->
      <el-table-column :label="$t('table.customer.dealerName')" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.dealerName }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('table.menu.icon')" align="center" width="80">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column> -->

      <!-- 型号 -->
      <el-table-column :label="$t('table.customer.equipmentId')" align="center" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.equipmentName }}</span>
        </template>
      </el-table-column>

      <!-- 用户名称 -->
      <el-table-column :label="$t('table.customer.name')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <!-- 设备ID -->
      <el-table-column :label="$t('table.customer.equipment')" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.unitId }}</span>
        </template>
      </el-table-column>

      <!-- 电话 -->
      <el-table-column :label="$t('table.customer.phone')" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>

      <!-- 服务站名称 -->
      <el-table-column :label="$t('table.customer.serveStationName')" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.serveStationName }}</span>
        </template>
      </el-table-column>

      <!-- 省份 -->
      <el-table-column :label="$t('table.customer.province')" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}</span>
        </template>
      </el-table-column>

      <!-- 城市 -->
      <el-table-column :label="$t('table.customer.city')" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.city }}</span>
        </template>
      </el-table-column>

      <!-- 县/区 -->
      <el-table-column :label="$t('table.customer.county')" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.county }}</span>
        </template>
      </el-table-column>

      <!-- 安装地址 -->
      <el-table-column :label="$t('table.customer.address')" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>

      <!-- 物联网号 -->
      <el-table-column :label="$t('table.customer.iccid')" align="center" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.iccid }}</span>
        </template>
      </el-table-column>

      <!-- 激活日期 -->
      <el-table-column :label="$t('table.customer.activate')" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.activate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <!-- 计费模式 -->
      <el-table-column :label="$t('table.customer.billName')" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.billName }}</span>
        </template>
      </el-table-column>

      <!-- 剩余时长 -->
      <el-table-column :label="$t('table.customer.remainingTime')" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.remainingTime }}</span>
        </template>
      </el-table-column>

      <!-- 剩余流量 -->
      <el-table-column :label="$t('table.customer.surplusFlow')" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.surplusFlow }}</span>
        </template>
      </el-table-column>

      <!-- 设备状态 -->
      <el-table-column :label="$t('table.customer.status')" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>

      <!-- 网络状态 -->
      <el-table-column :label="$t('table.customer.internetStatus')" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.internetStatus }}</span>
        </template>
      </el-table-column>

      <!-- 滤芯计费模式 -->
      <el-table-column :label="$t('table.customer.fbName')" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.fbName }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="small" type="danger" @click="handleDelete(row.id)">
            {{ $t('table.delete') }}
          </el-button>
          <el-button size="small" type="primary" @click="handleCreate(row.id)">
            {{ $t('table.details') }}
          </el-button>
          <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 查看详情 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <div class="title">
        <h5 style="margin-right:15px">{{ $t('table.customer.number') }}00005721 </h5>
        <span>{{ $t('table.customer.business') }}（10247）依泰山海庄志军</span>
      </div>
      <div class="equipment">
        <p style="font:18px/2 '';font-weight:900;margin-left:10px;margin-top:10px;">设备信息</p>
        <div class="ul">
          <ul class="ul2">
            <el-table
              v-loading="listLoading"
              row-key="id"
              :data="list"
              border
              fit
              highlight-current-row
              style="width: 100%;margin-bottom:20px;"
              :tree-props="{children: 'children'}"
            >
              <!-- 用户名称 -->
              <el-table-column :label="$t('table.customer.name')" prop="id" align="center" width="100" :class-name="getSortClass('id')">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>

              <!-- 型号 -->
              <el-table-column :label="$t('table.customer.equipmentId')" align="center" width="160">
                <template slot-scope="scope">
                  <span>{{ scope.row.equipmentName }}</span>
                </template>
              </el-table-column>

              <!-- 状态 -->
              <el-table-column :label="$t('table.customer.state')" align="center" width="80">
                <template slot-scope="scope">
                  <span>{{ scope.row.status }}</span>
                </template>
              </el-table-column>

              <!-- 原水值 -->
              <el-table-column :label="$t('table.customer.rawvalue')" align="center" width="80">
                <!-- <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template> -->
              </el-table-column>

              <!-- 净水值 -->
              <el-table-column :label="$t('table.customer.purificationvalue')" align="center" width="80">
                <!-- <template slot-scope="scope">
          <span>{{ scope.row.unitId }}</span>
        </template> -->
              </el-table-column>

              <!-- 计费模式 -->
              <el-table-column :label="$t('table.customer.charging')" align="center" width="86">
                <template slot-scope="scope">
                  <span>{{ scope.row.billName }}</span>
                </template>
              </el-table-column>
            </el-table>

            <el-table
              v-loading="listLoading"
              row-key="id"
              :data="list"
              border
              fit
              highlight-current-row
              style="width: 100%;margin-bottom:20px;"
              :tree-props="{children: 'children'}"
            >
              <!-- 剩余流量 -->
              <el-table-column :label="$t('table.customer.flow')" align="center" width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.surplusFlow }}</span>
                </template>
              </el-table-column>

              <!-- 创建时间 -->
              <el-table-column :label="$t('table.customer.establish')" align="center" width="160">
                <template slot-scope="scope">
                  <span>{{ scope.row.activate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
              </el-table-column>

              <!-- 已用天数 -->
              <el-table-column :label="$t('table.customer.used')" align="center" width="80">
                <!-- <template slot-scope="scope">
          <span>{{ scope.row.remainingTime }}</span>
        </template> -->
              </el-table-column>

              <!-- 剩余天数 -->
              <el-table-column :label="$t('table.customer.remaining')" align="center" width="80">
                <template slot-scope="scope">
                  <span>{{ scope.row.remainingTime }}</span>
                </template>
              </el-table-column>

              <!-- 过滤流量 -->
              <el-table-column :label="$t('table.customer.filter')" align="center" width="80">
                <!-- <template slot-scope="scope">
          <span>{{ scope.row.county }}</span>
        </template> -->
              </el-table-column>

              <!-- 水质等级 -->
              <el-table-column :label="$t('table.customer.quality')" align="center" width="86 ">
                <!-- <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template> -->
              </el-table-column>
            </el-table>
            <el-table
              v-loading="listLoading"
              row-key="id"
              :data="list"
              border
              fit
              highlight-current-row
              style="width: 100%;"
              :tree-props="{children: 'children'}"
            >

              <!-- ICCID -->
              <el-table-column :label="$t('table.customer.ICCID')" align="center" width="180">
                <template slot-scope="scope">
                  <span>{{ scope.row.iccid }}</span>
                </template>
              </el-table-column>
            </el-table>

          </ul>
        </div>
      </div>
      <div class="information">
        <div class="left">
          <div class="filter">
            <p style="font:18px/2 '';font-weight:900;margin-left:10px;">{{ $t('table.customer.filter') }}</p>
            <ul>
              <li style="justify-content:normal;padding-left:20px;font-weight:700">{{ $t('table.customer.flow') }}</li>
              <li>
                <span>{{ $t('table.customer.UPPF') }}</span>
                <p style="background:#dd4b39">4993 / 5000</p>
                <button>{{ $t('table.customer.reset') }}</button>
              </li>
              <li>
                <span>{{ $t('table.customer.UDF') }}</span>
                <p style="background:#f39c12">4993 / 5000</p>
                <button>{{ $t('table.customer.reset') }}</button>
              </li>
              <li>
                <span>{{ $t('table.customer.CTO') }}</span>
                <p style="background:#3c8dbc">4993 / 5000</p>
                <button>{{ $t('table.customer.reset') }}</button>
              </li>
              <li>
                <span>{{ $t('table.customer.EOOTARO') }}</span>
                <p style="background:#045686;width:90px;">9993 / 10000</p>
                <button>{{ $t('table.customer.reset') }}</button>
              </li>
              <li style="border-bottom:none">
                <span>{{ $t('table.customer.T33') }}</span>
                <p style="background:#00a65a;width:90px;">9993 / 10000</p>
                <button>{{ $t('table.customer.reset') }}</button>
              </li>
            </ul>
          </div>

        </div>
        <div class="bottom">
          <p style="font:18px/2 '';font-weight:900;margin-left:10px;margin-top:5px;">设备操作</p>
          <ul>
            <el-button class="filter-item" type="primary" style="padding:20px 20px">
              <svg-icon icon-class="bootOn" />
              {{ $t('table.customer.bootOn') }}
            </el-button>
            <el-button class="filter-item" type="primary" style="padding:20px 20px">
              <svg-icon icon-class="bootOff" />
              {{ $t('table.customer.bootOff') }}
            </el-button>
            <el-button class="filter-item" type="primary" style="padding:20px 20px">
              <svg-icon icon-class="impulse" />
              {{ $t('table.customer.impulse') }}
            </el-button>
          </ul>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
// import { list, getAllMenuName, add, queryMenuByid, editMenu, delMenu } from '@/api/menu'
import { list, delCust, queryCustByid, queryCustdown, queryCustup, queryCuststrong } from '@/api/customer'
import Pagination from '@/components/Pagination'
const isMenu = [
  { key: '0', display_name: '是' },
  { key: '1', display_name: '否' }
]

const visible = [
  { key: '0', display_name: '启用' },
  { key: '1', display_name: '隐藏' }
]

export default {
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        dealerName: '',
        equipmentId: '',
        page: 1,
        limit: 20
      },
      visible,
      isMenu,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogFormVisible: false,
      rules: {
        menuName: [{ required: true, message: 'menuName is required', trigger: 'change' },
          { min: 3, max: 5, message: 'The length is between 3 and 5 characters', trigger: 'blur' }],
        code: [{ required: true, message: 'code is required', trigger: 'change' }],
        orderNum: [{ required: true, message: 'num is required', trigger: 'change' }],
        isMenu: [{ required: true, message: 'isMenu is required', trigger: 'change' }],
        url: [{ required: true, message: 'url is required', trigger: 'change' }],
        component: [{ required: true, message: 'component is required', trigger: 'change' }],
        visible: [{ required: true, message: 'visible is required', trigger: 'change' }]
      },
      temp: {
        menuName: '',
        isMenu: '1',
        url: '',
        icon: '',
        orderNum: '',
        code: '',
        perms: '',
        visible: '0',
        component: '',
        pcode: '0',
        remark: ''
      },
      dialogStatus: '',
      treeData: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      list(this.listQuery).then(res => {
        console.log(this.listQuery.rows)
        if (res.code === 200) {
          console.log(res.rows)
          this.list = res.rows
          var time = this.list[0].activate
          console.log(time)

          this.total = res.total
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        }
      })
    },
    // 获取菜单tree
    queryCustByid() {
      queryCustByid().then(res => {
        if (res.code === 200) {
          this.treeData = res.data
        }
      })
    },
    resetTemp() {
      this.temp = {
        menuName: '',
        isMenu: '1',
        url: '',
        icon: '',
        orderNum: '',
        code: '',
        perms: '',
        visible: '0',
        component: '',
        pcode: '0',
        remark: ''
      }
    },

    // 搜索
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
      this.queryCustByid()
    },
    handleCreate(id) {
      // this.queryCustByid()
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        // this.$refs['dataForm'].clearValidate()
      })
      queryCustByid({ 'id': id }).then(res => {
        if (res.code === 200) {
          this.$notify({
            title: '成功',
            message: res.msg,
            type: 'success',
            duration: 2000
          })
          this.getList()
        }
      })
    },
    // 添加确认按钮
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          add(this.temp).then(res => {
            if (res.code === 200) {
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    },
    // 编辑
    handleUpdate(id) {
      queryMenuByid({ 'id': id }).then(res => {
        if (res.code === 200) {
          this.getAllMenuName()
          this.temp = Object.assign({}, res.data) // copy obj
          this.dialogStatus = 'update'
          this.dialogFormVisible = true
          this.$nextTick(() => {
            // this.$refs['dataForm'].clearValidate()
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          editMenu(tempData).then(res => {
            if (res.code === 200) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: res.msg,
                type: 'success',
                duration: 2000
              })
              this.getList()
            }
          })
        }
      })
    },
    handleDelete(id) {
      delCust({ 'id': id }).then(res => {
        if (res.code === 200) {
          this.$notify({
            title: '成功',
            message: res.msg,
            type: 'success',
            duration: 2000
          })
          this.getList()
        }
      })
    },
    handleDetails(id) {
      console.log('点击详情')
      queryCustByid({ 'id': id }).then(res => {
        if (res.code === 200) {
          this.$notify({
            title: '成功',
            message: res.msg,
            type: 'success',
            duration: 2000
          })
          this.getList()
        }
      })
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
    },
    hindleChanged(val) {
      this.temp.pcode = val[0].code
    }
  }
}
</script>

<style>
*{padding:0;margin:0;}

.el-dialog__body {
  background:#ecf0f5
}

.title {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.title h5 {
  padding:0;
  margin:0;
  font-size: 24px;
}

.title span {
  padding:0;
  margin:0;
  height: 16px;
  margin-top:8px;
  font-size: 16px;
  color: #777;
  margin-left: 5px;
}

.card {
  display: flex;
  justify-content: space-between
}

.card div {
  width:180px;
  height:100px;
  color: #fff;
}

.card div h4 {
  font-size:31px;
  margin:0;
  padding:0;
  margin-top:19px;
  margin-left: 15px;
}

.card div p {
  margin-top:10px;
  margin-left: 15px;
}

.information {
  display: flex;
  margin-top:20px;
}

.filter {
  width: 100%;
  height:250px;
  background:#fff;
  border:1px solid #d6dadf;
  border-top:3px solid #d6dadf;
  border-radius: 5px;
}

.filter ul li {
  display: flex;
  list-style: none;
  border-bottom:1px solid #dddddd;
  height: 35px;
  align-items: center;
  font-size: 13px;
  height:35px;
  justify-content: space-around;
  margin:0 10px;
}

.filter ul li span {
  display:block;
  width:90px;
}

.filter ul li p {
  display: block;
  width:84px;
  height:18px;
  border-radius: 10px;
  font: 11px/18px "";
  color:#fff;
  display: flex;
  justify-content: center;
  align-items: center
}

.filter ul li button {
  font-size: 12px;
  width:40px;
  height:21px;
  display: block;
  border:0;
  background:#e0dfdf;
  color:#333;
}

.equipment {
  width: 96%;
  height: 400px;
  background:#fff;
  border:1px solid #d6dadf;
  border-top:3px solid #d6dadf;
  border-radius: 5px;
  margin-left: 2%;
  margin-right: 2%;
  margin-top:20px;
}

.equipment .ul {
  display: flex;
  margin-top:20px;
}
.equipment .ul ul {
  width: 50%;
}
.equipment .ul ul li {
  list-style: none;
  border-bottom:1px solid #e0dfdf;
  height:31px;
  display: flex;
  align-items: center;
}

.equipment .ul ul li span {
  margin-left:5px;
}

.equipment .ul .ul2 {
  width: 96%;
  margin:0 auto
}

.equipment .ul .ul2 li {
  font-weight: 600;
}

.left {
  height:250px;
  width:48%;
}

.bottom {
  height:250px;
  width:50%;
  background:#fff;
  border:1px solid #d6dadf;
  border-top:3px solid #d6dadf;
  border-radius: 5px;
  margin-left: 20px;
}

.bottom ul {
  display: flex;;
  justify-content: space-evenly;
  align-items: center;
  height:200px;
}

.bottom ul li {
  list-style: none;
  width:60px;
  height:60px;
  background:#f4f4f4;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center
}

.gutter {
  display: block !important
}

.el-table__header,.el-table__body {
  width:100% !important
}

.el-dialog {
  margin-top:5vh !important
}

.el-dialog__body {
  padding:20px 20px;
  padding-bottom:30px;
}
/* .el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: hidden !important
} */
</style>
